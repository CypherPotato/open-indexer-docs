#!/bin/bash
set -e

# reset modified files
bun ./clean-translations.js
bun ./translate.js

# build css
cascadium build

# build
docfx build

# pack JSONL
bun ./pack-jsonl.js
