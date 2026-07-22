const REQUIRED_SELECTORS = Object.freeze([
    '#sheld',
    '#chat',
    '#send_form',
    '#send_textarea',
]);

const OPTIONAL_SELECTORS = Object.freeze([
    '#top-bar',
    '#form_sheld',
    '#extensions_settings2',
]);

/**
 * Checks only the stable surfaces needed by the scaffold.
 * A missing welcome panel is not an error because it only exists in the welcome state.
 */
export function probeCompatibility(root = document) {
    const missingRequired = REQUIRED_SELECTORS.filter((selector) => !root.querySelector(selector));
    const missingOptional = OPTIONAL_SELECTORS.filter((selector) => !root.querySelector(selector));

    return Object.freeze({
        core: missingRequired.length === 0,
        missingRequired,
        missingOptional,
    });
}
