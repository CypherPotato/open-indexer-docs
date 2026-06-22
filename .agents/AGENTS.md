# Project Guidelines

## Code Style
- Keep changes focused and minimal; avoid broad reformatting.
- Follow existing naming and structure in docs and templates.
- Prefer editing source inputs over generated outputs.

## Architecture
- `docs/` contains source documentation pages and section folders.
- `docs/toc.yml` and root `toc.yml` define navigation.
- `docfx.json` controls site generation and templates.
- `template/modern/` contains custom DocFX template assets.
- `template/style/src/*.xcss` contains Cascadium style sources.
- `template/style/public/main.css` is generated from Cascadium sources.
- `_site/` is generated output and should not be manually edited.

## Build and Test
- Full build (includes translation pipeline): run `build.sh`.
- Fast rebuild (CSS + DocFX only): run `comp.ps1`.
- Manual equivalents:
  - `cascadium build`
  - `docfx build`
  - `docfx serve` (after build)
- Translation scripts call external AI APIs and may incur cost. Do not run translation unless explicitly requested.

## Conventions
- Produce and edit documentation only in English source files under `docs/`.
- Never create, edit, move, or delete anything under `docs/pt-br/`.
- Do not edit generated API artifacts/binaries under `ref/`.
- Do not edit generated site files under `_site/`.
- Do not run translation generation for `docs/pt-br/` unless explicitly requested by the user.
- If changing styles, edit `template/style/src/*.xcss` and rebuild; do not hand-edit compiled CSS.
- When referencing an AIVAX API endpoint in documentation, use the embedded API reference script instead of a `curl` example. Look up the correct endpoint name in `https://inference.aivax.net/apidocs/llms.txt`, then embed it as `<script src="https://inference.aivax.net/apidocs?embed-target=ENDPOINT%20NAME&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>`.

## Key References
- `readme.md` for setup constraints and contribution notes.
- `build.sh` and `comp.ps1` for canonical build workflows.
- `translate.js` and `clean-translations.js` for translation behavior.
- `cascadium.json5` for CSS build output mapping.
