# AIVAX Documentation

This repository contains the source code for the AIVAX documentation website.

## Building

Use the project scripts when possible:

1. Run `comp.ps1` for a fast rebuild of Cascadium styles and DocFX.
2. Run `build.ps1` only when the translation pipeline is intentionally needed.
3. Run `docfx serve` after a build to preview the generated site.

> [!WARNING]
> 
> Please, **do not** use the docfx version **2.78.0** or later. This version has a bug that changes the documentation navigation layout. See the [tracking issue](https://github.com/dotnet/docfx/issues/10424).
> 
> Prefer the version **2.76.0**:
> 
> ```
> dotnet tool install -g docfx --version 2.76.0
> ```

Then you're ready to go and you'll have the static website files at `/_site`.

## Contributing

Contributions are always welcome. Contribute with spelling corrections, fixing broken links and more.

Edit the Portuguese source files under `docs/`. Do not edit generated output under `_site/`, generated API artifacts under `ref/`, or translated files under `docs/en/` unless the translation pipeline is being intentionally updated.

> [!NOTE]
> Please do not edit API specification files. These files are generated. If you want to edit API documentation, update it in the repository where the API code is hosted.
