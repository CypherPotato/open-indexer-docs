# reset modified files
bun ".\clean-translations.js";

# translate missing files
.\translate-all.ps1;

# build css
cascadium build;

# build
docfx build