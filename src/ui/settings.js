import { EXTENSION_ID, SETTINGS_ROOT_ID, VERSION } from '../adapter/constants.js';

function setControlValue(control, settings) {
    const key = control.dataset.rhapsodySetting;

    switch (key) {
        case 'enabled':
            control.checked = settings.enabled;
            break;
        case 'theme':
            control.value = settings.theme;
            break;
        case 'nativeThemeBridge':
            control.checked = settings.nativeThemeBridge;
            break;
        case 'motion.preference':
            control.value = settings.motion.preference;
            break;
        case 'environment.enabled':
            control.checked = settings.environment.enabled;
            break;
        case 'environment.parallax':
            control.checked = settings.environment.parallax;
            break;
        case 'overture.enabled':
            control.checked = settings.overture.enabled;
            break;
    }
}

function updateSetting(control, settings) {
    const key = control.dataset.rhapsodySetting;

    switch (key) {
        case 'enabled':
            settings.enabled = control.checked;
            break;
        case 'theme':
            settings.theme = control.value;
            break;
        case 'nativeThemeBridge':
            settings.nativeThemeBridge = control.checked;
            break;
        case 'motion.preference':
            settings.motion.preference = control.value;
            break;
        case 'environment.enabled':
            settings.environment.enabled = control.checked;
            break;
        case 'environment.parallax':
            settings.environment.parallax = control.checked;
            break;
        case 'overture.enabled':
            settings.overture.enabled = control.checked;
            break;
    }
}

export function syncSettingsUI(root, settings, compatibility) {
    root.querySelectorAll('[data-rhapsody-setting]').forEach((control) => {
        setControlValue(control, settings);
    });

    const coreStatus = root.querySelector('[data-rhapsody-status="core"]');
    if (coreStatus) {
        coreStatus.textContent = compatibility.core ? 'SillyTavern 1.18 接入点正常' : '兼容降级';
        coreStatus.dataset.state = compatibility.core ? 'ok' : 'warning';
    }

    const details = root.querySelector('[data-rhapsody-status="details"]');
    if (details) {
        const missing = [...compatibility.missingRequired, ...compatibility.missingOptional];
        details.textContent = missing.length > 0
            ? `未找到：${missing.join('、')}`
            : '基础选择器完整；视觉模块等待后续实现。';
    }

    const version = root.querySelector('[data-rhapsody-status="version"]');
    if (version) {
        version.textContent = VERSION;
    }
}

/** Mounts the only DOM tree owned by the scaffold. */
export async function mountSettings(context, settings, compatibility, onChange, signal) {
    const host = document.querySelector('#extensions_settings2');
    if (!host) {
        return null;
    }

    document.getElementById(SETTINGS_ROOT_ID)?.remove();

    const html = await context.renderExtensionTemplateAsync(
        EXTENSION_ID,
        'templates/settings',
        {},
    );

    host.insertAdjacentHTML('beforeend', html);

    const root = document.getElementById(SETTINGS_ROOT_ID);
    if (!root) {
        throw new Error('Rhapsody settings template did not create its root element.');
    }

    syncSettingsUI(root, settings, compatibility);

    root.addEventListener('change', (event) => {
        const control = event.target instanceof Element
            ? event.target.closest('[data-rhapsody-setting]')
            : null;

        if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement)) {
            return;
        }

        updateSetting(control, settings);
        onChange();
        syncSettingsUI(root, settings, compatibility);
    }, { signal });

    return root;
}
