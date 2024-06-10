/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'node:path';
import * as glob from 'glob';
import { PluginOption, normalizePath } from 'vite';
import {
  OverrideDir,
  ProjectRoot,
  VolViewNodeModulesDir,
  isInOverrideDir,
  isInVolViewNodeModules,
} from '../common.mjs';

function generateOverrideLookup() {
  return new Set(
    glob
      .sync(path.posix.resolve(ProjectRoot, `${OverrideDir}/**/*`), {
        withFileTypes: true,
      })
      .filter((file) => file.isFile())
      .map((file) => normalizePath(path.relative(OverrideDir, file.fullpath())))
  );
}

const overrideLookup = generateOverrideLookup();

export const OverrideResolverPlugin: PluginOption = {
  name: 'override-resolver',
  resolveId: {
    order: 'pre',
    async handler(source, importer, options) {
      const resolution = await this.resolve(source, importer, {
        skipSelf: true,
        ...options,
      });

      if (!resolution || resolution.external) return resolution;

      // if importer is from the override folder, then stop.
      if (isInOverrideDir(importer)) return resolution;
      // if (importer?.startsWith(OverrideDirPrefix)) return resolution;

      // if not importing from the core dir, then stop.
      if (!isInVolViewNodeModules(resolution.id)) return resolution;
      // if (!resolution.id.startsWith(CoreDirPrefix)) return resolution;

      const relPath = normalizePath(
        path.relative(VolViewNodeModulesDir, resolution.id)
      );
      if (!overrideLookup.has(relPath)) return resolution;

      resolution.id = normalizePath(path.join(OverrideDir, relPath));
      return resolution;
    },
  },
};
