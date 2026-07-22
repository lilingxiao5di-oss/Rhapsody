import {
    cleanRhapsodyData,
    disableRhapsody,
    initRhapsody,
    uninstallRhapsody,
} from './src/adapter/lifecycle.js';

/**
 * SillyTavern manifest hook.
 * Keep the public entry point deliberately small; feature modules belong under src/.
 */
export async function init() {
    await initRhapsody();
}

/** SillyTavern manifest hook used before the extension is disabled. */
export async function disable() {
    await disableRhapsody();
}

/** SillyTavern clean hook. Removes persistent Rhapsody data after confirmation. */
export async function clean() {
    await cleanRhapsodyData();
}

/** SillyTavern delete hook. Deleting the extension must never leave Rhapsody data behind. */
export async function uninstall() {
    await uninstallRhapsody();
}
