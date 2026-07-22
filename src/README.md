# Rhapsody implementation handoff

This directory is the build-free SillyTavern extension base. Keep `index.js` as a small manifest entry point and add features behind the lifecycle adapter.

Read [`KIMI.md`](../KIMI.md) first for creative authority, local references, licensing boundaries and the complete install/uninstall contract.

## Stable foundation

- `adapter/lifecycle.js`: idempotent activation, native events, root state and cleanup.
- `adapter/settings.js`: versioned settings defaults and migration.
- `adapter/selectors.js`: SillyTavern 1.18 compatibility probe.
- `ui/settings.js`: the only plugin-owned settings mount.
- `styles/tokens.css`: approved Nocturne / Aubade tokens.
- `styles/native-bridge.css`: optional SmartTheme variable bridge.

## Next implementation order

1. Add scoped workspace, message, composer and popup CSS files.
2. Add one shared animation / RAF scheduler.
3. Add the OGL environment controller and static fallback.
4. Add the optional overture controller.
5. Run the desktop test matrix before adding experimental layout changes.

Run `npm test` after changing lifecycle or persistence behavior.

## Invariants

- Do not move, clone or replace SillyTavern core DOM.
- Do not add a second permanent RAF for Dot Field or Flowmap.
- Do not make React responsible for native messages or settings.
- Every feature must expose cleanup and fail without blocking SillyTavern.
- Register feature cleanup with `registerRhapsodyDisposer()`; clean/delete must remove persistent Rhapsody data.
- Core runtime assets remain local and offline-capable.

Read the specifications in `docs/` before changing tokens, selectors, motion or performance behavior.
