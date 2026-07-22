import {
    EXTENSION_ID,
    ROOT_CLASSES,
    ROOT_DATA_ATTRIBUTES,
    SETTINGS_KEY,
    SETTINGS_ROOT_ID,
    STORAGE_PREFIX,
} from './constants.js';
import { probeCompatibility } from './selectors.js';
import { loadSettings, resolveMotionPreference } from './settings.js';
import { mountSettings } from '../ui/settings.js';

const state = {
    initialized: false,
    appReady: false,
    context: null,
    settings: null,
    compatibility: null,
    motionQuery: null,
    abortController: null,
    disposers: [],
};

function getContext() {
    const context = globalThis.SillyTavern?.getContext?.();
    if (!context) {
        throw new Error('SillyTavern.getContext() is not available.');
    }

    return context;
}

function clearRootState() {
    const body = document.body;
    if (!body) {
        return;
    }

    body.classList.remove(...ROOT_CLASSES);
    for (const attribute of ROOT_DATA_ATTRIBUTES) {
        delete body.dataset[attribute];
    }
}

function applyRootState() {
    const { settings, compatibility, motionQuery } = state;
    const body = document.body;

    if (!body || !settings || !compatibility || !motionQuery) {
        return;
    }

    if (!settings.enabled) {
        clearRootState();
        return;
    }

    const motion = resolveMotionPreference(settings.motion.preference, motionQuery);
    const environment = !settings.environment.enabled || motion === 'off'
        ? 'off'
        : motion === 'reduced'
            ? 'fallback'
            : compatibility.core
                ? 'on'
                : 'fallback';

    body.classList.add('rhapsody-enabled');
    body.classList.toggle('rhapsody-ready', state.appReady);
    body.classList.toggle('rhapsody-compat-degraded', !compatibility.core);
    body.dataset.rhapsodyTheme = settings.theme;
    body.dataset.rhapsodyMotion = motion;
    body.dataset.rhapsodyEnvironment = environment;
    body.dataset.rhapsodyNativeBridge = settings.nativeThemeBridge ? 'on' : 'off';
    body.dataset.rhapsodyCompat = compatibility.core ? 'ok' : 'degraded';
}

function subscribeEvent(eventSource, event, handler) {
    if (!event) {
        return;
    }

    eventSource.on(event, handler);
    state.disposers.push(() => eventSource.removeListener(event, handler));
}

/** Registers cleanup owned by a future feature module. Async disposers are supported. */
export function registerRhapsodyDisposer(dispose) {
    if (typeof dispose !== 'function') {
        throw new TypeError('Rhapsody disposer must be a function.');
    }

    state.disposers.push(dispose);
}

function subscribeNativeEvents() {
    const { eventSource, eventTypes } = state.context;

    subscribeEvent(eventSource, eventTypes.APP_READY, () => {
        state.appReady = true;
        applyRootState();
    });

    subscribeEvent(eventSource, eventTypes.SETTINGS_UPDATED, applyRootState);

    const onMotionPreferenceChange = () => applyRootState();
    state.motionQuery.addEventListener('change', onMotionPreferenceChange);
    state.disposers.push(() => {
        state.motionQuery?.removeEventListener('change', onMotionPreferenceChange);
    });
}

function saveAndApply() {
    applyRootState();
    state.context.saveSettingsDebounced();
}

/** Initializes only the stable adapter shell. Feature controllers are added after this layer. */
export async function initRhapsody() {
    if (state.initialized) {
        return;
    }

    state.initialized = true;

    try {
        state.context = getContext();
        state.settings = loadSettings(state.context);
        state.compatibility = probeCompatibility();
        state.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        state.abortController = new AbortController();

        applyRootState();
        subscribeNativeEvents();

        try {
            await mountSettings(
                state.context,
                state.settings,
                state.compatibility,
                saveAndApply,
                state.abortController.signal,
            );
        } catch (error) {
            console.error('[Rhapsody] Settings UI could not be mounted.', error);
        }

        if (!state.compatibility.core) {
            console.warn('[Rhapsody] Compatibility degraded.', {
                missingRequired: state.compatibility.missingRequired,
                missingOptional: state.compatibility.missingOptional,
            });
        }
    } catch (error) {
        console.error('[Rhapsody] Initialization failed safely.', error);
        await disableRhapsody();
    }
}

/** Removes every resource currently owned by the scaffold. */
export async function disableRhapsody() {
    state.abortController?.abort();

    for (const dispose of state.disposers.splice(0).reverse()) {
        try {
            await dispose();
        } catch (error) {
            console.warn('[Rhapsody] A disposer failed.', error);
        }
    }

    document.getElementById(SETTINGS_ROOT_ID)?.remove();
    document.querySelector('.rhapsody-overture')?.remove();
    document.querySelector('.rhapsody-environment')?.remove();
    clearRootState();

    state.initialized = false;
    state.appReady = false;
    state.context = null;
    state.settings = null;
    state.compatibility = null;
    state.motionQuery = null;
    state.abortController = null;
}

function clearPrefixedStorage(storage) {
    if (!storage) {
        return;
    }

    const keys = [];
    for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key?.startsWith(STORAGE_PREFIX)) {
            keys.push(key);
        }
    }

    for (const key of keys) {
        storage.removeItem(key);
    }
}

function clearBrowserStorage() {
    for (const storageName of ['localStorage', 'sessionStorage']) {
        try {
            clearPrefixedStorage(globalThis[storageName]);
        } catch (error) {
            console.warn(`[Rhapsody] Could not clean ${storageName}.`, error);
        }
    }
}

/**
 * Destructive cleanup used only by SillyTavern's confirmed clean/delete hooks.
 * Disabling the extension intentionally does not call this function.
 */
export async function cleanRhapsodyData() {
    const context = state.context ?? globalThis.SillyTavern?.getContext?.() ?? null;

    await disableRhapsody();

    if (context?.extensionSettings) {
        delete context.extensionSettings[SETTINGS_KEY];
        context.saveSettingsDebounced?.();
    }

    clearBrowserStorage();
}

/** Removes persistent data plus SillyTavern's disabled-extension registration on delete. */
export async function uninstallRhapsody() {
    const context = state.context ?? globalThis.SillyTavern?.getContext?.() ?? null;

    await cleanRhapsodyData();

    const disabledExtensions = context?.extensionSettings?.disabledExtensions;
    if (Array.isArray(disabledExtensions)) {
        context.extensionSettings.disabledExtensions = disabledExtensions.filter((name) => name !== EXTENSION_ID);
        context.saveSettingsDebounced?.();
    }
}
