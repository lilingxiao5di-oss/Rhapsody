import { SETTINGS_KEY } from './constants.js';

export const DEFAULT_SETTINGS = Object.freeze({
    schemaVersion: 1,
    enabled: true,
    theme: 'nocturne',
    nativeThemeBridge: true,
    layoutMode: 'native',
    overture: Object.freeze({
        enabled: true,
        oncePerSession: true,
    }),
    environment: Object.freeze({
        enabled: true,
        parallax: true,
    }),
    motion: Object.freeze({
        preference: 'system',
    }),
});

const ALLOWED_THEMES = new Set(['nocturne', 'aubade']);
const ALLOWED_MOTION = new Set(['system', 'full', 'reduced', 'off']);

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeDefaults(defaults, stored) {
    const result = isRecord(stored) ? structuredClone(stored) : {};

    for (const [key, defaultValue] of Object.entries(defaults)) {
        const storedValue = result[key];

        if (isRecord(defaultValue)) {
            result[key] = mergeDefaults(defaultValue, storedValue);
            continue;
        }

        if (storedValue === undefined || typeof storedValue !== typeof defaultValue) {
            result[key] = structuredClone(defaultValue);
        }
    }

    return result;
}

function normalizeSettings(settings) {
    settings.schemaVersion = DEFAULT_SETTINGS.schemaVersion;
    settings.layoutMode = 'native';

    if (!ALLOWED_THEMES.has(settings.theme)) {
        settings.theme = DEFAULT_SETTINGS.theme;
    }

    if (!ALLOWED_MOTION.has(settings.motion.preference)) {
        settings.motion.preference = DEFAULT_SETTINGS.motion.preference;
    }

    return settings;
}

/** Loads the persistent object owned by Rhapsody and fills new defaults safely. */
export function loadSettings(context) {
    const stored = context.extensionSettings[SETTINGS_KEY];
    const before = JSON.stringify(stored ?? null);
    const settings = normalizeSettings(mergeDefaults(DEFAULT_SETTINGS, stored));

    context.extensionSettings[SETTINGS_KEY] = settings;

    if (before !== JSON.stringify(settings)) {
        context.saveSettingsDebounced();
    }

    return settings;
}

export function resolveMotionPreference(preference, mediaQuery) {
    if (preference === 'system') {
        return mediaQuery.matches ? 'reduced' : 'full';
    }

    return preference;
}
