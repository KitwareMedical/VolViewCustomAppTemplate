/* eslint-disable import/no-extraneous-dependencies */
import Arborist from '@npmcli/arborist';
import CustomizeConfig from '../custom-app.config.cjs';
import * as fs from 'fs';

function readPackageJson(file) {
  return JSON.parse(fs.readFileSync(file));
}

function packageInDeps(name, pkgJson) {
  return name in pkgJson.dependencies || name in pkgJson.devDependencies;
}

function depMapToPkgSpec(map, filterFn = () => true) {
  return Object.entries(map)
    .filter(filterFn)
    .reduce((add, [dep, version]) => [...add, `${dep}@${version}`], []);
}

async function getDependenciesToInstall(pkgName) {
  const arborist = new Arborist();
  const tree = await arborist.loadActual({
    forceActual: true,
  });
  const pkgs = await tree.querySelectorAll(`#${pkgName}`, {
    packageLock: true,
  });

  if (pkgs.length !== 1) {
    throw new Error('Should only find 1 package!');
  }

  const [pkg] = pkgs;
  const PackageJson = readPackageJson('package.json');
  const filterFn = ([name]) => !packageInDeps(name, PackageJson);
  return {
    dependencies: depMapToPkgSpec(pkg.target.package.dependencies, filterFn),
    devDependencies: depMapToPkgSpec(
      pkg.target.package.devDependencies,
      filterFn
    ),
  };
}

async function installPackages(packages, saveType = null) {
  const opts = {
    auditLevel: null,
    add: packages,
    saveType,
    save: false,
  };

  await new Arborist(opts).reify(opts);
}

async function installDependencies() {
  const { targetDependency: targetPkg } = CustomizeConfig;

  let { dependencies, devDependencies } = await getDependenciesToInstall(
    targetPkg
  );

  console.info(`Installing dependencies from ${targetPkg}...`);

  await installPackages(dependencies, 'prod');
  await installPackages(devDependencies, 'dev');
}

async function main() {
  await installDependencies();
}
main();
