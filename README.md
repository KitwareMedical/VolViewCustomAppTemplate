# Custom VolView Template

This custom app template uses file overrides to customize a webapp built using Vite.

## Getting Started

1. Edit `package.json` to configure the version of "volview" that you want to customize.
2. Run `npm install`.

Once everything has been installed, you can look inside `app/` for a sample file override, which updates some configuration keys.

All vite commands are supported:
- `npm run dev`: run the dev server
- `npm run build`: build the app
- `npm run preview`: preview a production-build of the app

## Override Behavior

File overriding is the primary customization behavior of this template. Files inside the override directory must match the relative file path in the core repository in order to be overridden.

Imports can be classified into 3 types: override-to-override, override-to-core, and core-to-core.
- override-to-override: an override file imports from another override file. No change in behavior.
- override-to-core: override files can import core files, even if there is an override file for that core file. This allows override files to extend core files merely by importing.
- core-to-core: core files importing other core files works as-is, unless an override file is present in the override directory.

## Targeting a different project name + repo

This repo by default customizes the "volview" project pointed to in `package.json`, with an override folder called `app/`.
If you are interested in renaming the customization target or the override folder, here's what you need to change.
- Edit the package name "volview" in `package.json`.
- Edit `customizeUtils/custom-app.config.cjs` with the new package name and/or override folder.
- Edit `tsconfig.json` to change instances of "volview" if you've changed the package name, and "app" if you've changed the override folder.
- Edit `patches/vite*.patch` to change instances of "volview" if you've changed the package name.