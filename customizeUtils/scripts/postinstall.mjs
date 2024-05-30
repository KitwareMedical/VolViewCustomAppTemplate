/* eslint-disable import/no-extraneous-dependencies */
import Arborist from '@npmcli/arborist';
import CustomizeConfig from '../custom-app.config.cjs';

function depMapToPkgSpec(map) {
  return Object.entries(map).reduce(
    (add, [dep, version]) => [...add, `${dep}@${version}`],
    []
  );
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
  return {
    dependencies: depMapToPkgSpec(pkg.target.package.dependencies),
    devDependencies: depMapToPkgSpec(pkg.target.package.devDependencies),
  };
}

async function installPackages(packages, saveType = null) {
  const opts = {
    auditLevel: null,
    add: packages,
    saveType,
    save: true,
  };

  await new Arborist(opts).reify(opts);
}

async function installDependencies() {
  const { targetDependency: targetPkg } = CustomizeConfig;

  const { dependencies, devDependencies } = await getDependenciesToInstall(
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
