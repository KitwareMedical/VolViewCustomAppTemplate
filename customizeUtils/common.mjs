/* eslint-disable import/no-extraneous-dependencies */
import * as url from 'node:url';
import * as path from 'node:path';
import { normalizePath } from 'vite';
import CustomizeConfig from './custom-app.config.cjs';

function getDirname() {
  return url.fileURLToPath(new URL('.', import.meta.url));
}

export { CustomizeConfig };
export const ProjectRoot = normalizePath(path.resolve(getDirname(), '..'));
export const OverrideDir = normalizePath(
  path.resolve(ProjectRoot, CustomizeConfig.overrideDir)
);

const NodeModulesDir = normalizePath(path.resolve(ProjectRoot, 'node_modules'));
export const VolViewNodeModulesDir = path.resolve(NodeModulesDir, 'volview');

export const isInOverrideDir = (absolutePath) => {
  return absolutePath?.startsWith(`${OverrideDir}/`) ?? false;
};

export const isInVolViewNodeModules = (absolutePath) => {
  return absolutePath?.startsWith(`${NodeModulesDir}/`) ?? false;
};
