# VolView Custom Application Template

This repository provides a template for starting the development of custom VolView applications.

[VolView](https://kitware.github.io/VolView/#what-is-volview) is an open source radiological viewer
developed for clinical professionals.

This template utilizes Vite and file overrides to enable easy customization.

> [!WARNING]
> This project is provided "as-is" and is actively being developed. Backward compatibility is
> not guaranteed, and the API or functionality may change without prior notice between versions.

## Getting Started

1. Clone the repository: `git clone https://github.com/KitwareMedical/VolViewCustomAppTemplate.git`
1. Edit `package.json` to configure the version of "volview" that you want to customize.
1. Run `npm install`.

After installation, check the `app/` directory for a sample file override that modifies some configuration keys.

All vite commands are supported:
- `npm run dev`: start the development server
- `npm run build`: build the application
- `npm run preview`: preview a production build of the application

## Override Behavior

File overriding is the primary customization behavior of this template. Files inside the override directory must match the relative file path in the core repository in order to be overridden.

Imports can be classified into 3 types:
- **override-to-override**: an override file imports from another override file. No change in behavior.
- **override-to-core**: override files can import core files, even if there is an override file for that core file. This allows override files to extend core files merely by importing.
- **core-to-core**: core files importing other core files works as-is, unless an override file is present in the override directory.

## Targeting a different project name + repo

This repo by default customizes the "volview" project as specified in `package.json`, with an override folder called `app/`.
To rename the customization target or the override folder, follow these steps:
- Edit the package name "volview" in `package.json`.
- Edit `customizeUtils/custom-app.config.cjs` with the new package name and/or override folder.
- Edit `tsconfig.json` to change instances of "volview" if you've changed the package name, and "app" if you've changed the override folder.
- Edit `patches/vite*.patch` to change instances of "volview" if you've changed the package name.

## Contributing

We welcome contributions through Pull Requests.

> [!TIP]
> Due to limited continuous integration infrastructure, we recommend that developers carefully
> describe their changes and ensure thorough testing before submitting.

## License

It is covered by the Apache License, Version 2.0.

The license file was added on 2024-09-25, but you may consider that the license applies to all prior revisions as well.
