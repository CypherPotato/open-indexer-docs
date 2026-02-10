# reset modified files
bun ".\clean-translations.js";
bun translate.js "English" "en"

# build css
cascadium build;

# build
docfx build