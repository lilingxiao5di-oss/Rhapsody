import assert from 'node:assert/strict';
import test from 'node:test';

import {
    disableRhapsody,
    initRhapsody,
    uninstallRhapsody,
} from '../src/adapter/lifecycle.js';

class MockClassList {
    values = new Set();

    add(...names) {
        names.forEach((name) => this.values.add(name));
    }

    remove(...names) {
        names.forEach((name) => this.values.delete(name));
    }

    toggle(name, force) {
        if (force) {
            this.values.add(name);
        } else {
            this.values.delete(name);
        }
    }

    contains(name) {
        return this.values.has(name);
    }
}

class MockStorage {
    values = new Map();

    get length() {
        return this.values.size;
    }

    key(index) {
        return [...this.values.keys()][index] ?? null;
    }

    setItem(key, value) {
        this.values.set(key, String(value));
    }

    getItem(key) {
        return this.values.get(key) ?? null;
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

function createEventSource() {
    const listeners = new Map();

    return {
        listeners,
        on(event, listener) {
            const eventListeners = listeners.get(event) ?? [];
            eventListeners.push(listener);
            listeners.set(event, eventListeners);
        },
        removeListener(event, listener) {
            const eventListeners = listeners.get(event) ?? [];
            listeners.set(event, eventListeners.filter((candidate) => candidate !== listener));
        },
    };
}

function installBrowserMocks(context) {
    const stableSelectors = new Set([
        '#sheld',
        '#chat',
        '#send_form',
        '#send_textarea',
        '#top-bar',
        '#form_sheld',
    ]);
    const body = { classList: new MockClassList(), dataset: {} };
    const motionListeners = new Set();

    globalThis.document = {
        body,
        querySelector(selector) {
            return stableSelectors.has(selector) ? {} : null;
        },
        getElementById() {
            return null;
        },
    };
    globalThis.window = {
        matchMedia() {
            return {
                matches: false,
                addEventListener(_event, listener) {
                    motionListeners.add(listener);
                },
                removeEventListener(_event, listener) {
                    motionListeners.delete(listener);
                },
            };
        },
    };
    globalThis.localStorage = new MockStorage();
    globalThis.sessionStorage = new MockStorage();
    globalThis.SillyTavern = { getContext: () => context };

    return { body, motionListeners };
}

test('disable preserves settings and uninstall removes every owned persistent registration', async () => {
    const eventSource = createEventSource();
    let saveCount = 0;
    const context = {
        extensionSettings: {
            disabledExtensions: ['third-party/Rhapsody', 'third-party/Other'],
        },
        eventSource,
        eventTypes: {
            APP_READY: 'app_ready',
            SETTINGS_UPDATED: 'settings_updated',
        },
        saveSettingsDebounced() {
            saveCount += 1;
        },
        async renderExtensionTemplateAsync() {
            return '';
        },
    };
    const { body, motionListeners } = installBrowserMocks(context);

    await initRhapsody();
    assert.equal(body.classList.contains('rhapsody-enabled'), true);
    assert.ok(context.extensionSettings.rhapsody);

    await disableRhapsody();
    assert.equal(body.classList.contains('rhapsody-enabled'), false);
    assert.ok(context.extensionSettings.rhapsody, 'disable must preserve user settings');
    assert.equal(motionListeners.size, 0);

    await initRhapsody();
    globalThis.localStorage.setItem('rhapsody:debug', '1');
    globalThis.localStorage.setItem('unrelated', 'keep');
    globalThis.sessionStorage.setItem('rhapsody:overture:seen:v1', 'true');

    await uninstallRhapsody();

    assert.equal(context.extensionSettings.rhapsody, undefined);
    assert.deepEqual(context.extensionSettings.disabledExtensions, ['third-party/Other']);
    assert.equal(globalThis.localStorage.getItem('rhapsody:debug'), null);
    assert.equal(globalThis.localStorage.getItem('unrelated'), 'keep');
    assert.equal(globalThis.sessionStorage.getItem('rhapsody:overture:seen:v1'), null);
    assert.deepEqual(body.dataset, {});
    assert.equal(body.classList.values.size, 0);
    assert.equal(motionListeners.size, 0);
    assert.ok(saveCount >= 2);

    delete globalThis.document;
    delete globalThis.window;
    delete globalThis.localStorage;
    delete globalThis.sessionStorage;
    delete globalThis.SillyTavern;
});
