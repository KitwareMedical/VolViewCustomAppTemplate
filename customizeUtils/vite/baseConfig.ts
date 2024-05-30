/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'node:path';
import {
  type UserConfig,
  defineConfig,
  loadConfigFromFile,
  mergeConfig,
  normalizePath,
} from 'vite';
import { OverrideResolverPlugin } from './rollup-plugin-override-resolver';
import { ProjectRoot, VolViewNodeModulesDir } from '../common.mjs';

/**
 * Gets manualChunks from a config rollupOptions, if any.
 *
 * If the output property is an array, returns undefined.
 * @param config
 */
function getManualChunks(config: UserConfig) {
  const output = config.build?.rollupOptions?.output;
  if (!output || Array.isArray(output)) return undefined;
  if (output.manualChunks instanceof Function) return output.manualChunks;
  return (id: string) => {
    return output.manualChunks?.[id];
  };
}

export default defineConfig(async (configEnv) => {
  const loadResult = await loadConfigFromFile(
    configEnv,
    path.resolve(VolViewNodeModulesDir, 'vite.config.ts')
  );

  if (!loadResult) throw new Error('Failed to load vite.config.ts from core.');
  const baseConfig = loadResult.config;

  const baseManualChunks = getManualChunks(baseConfig);

  const viteConfig = mergeConfig(baseConfig, {
    root: ProjectRoot,
    envDir: ProjectRoot,
    build: {
      outDir: 'dist',
      commonjsOptions: {
        include: [/volview/, /node_modules/],
      },
      rollupOptions: {
        output: {
          manualChunks(id: string, meta) {
            if (id.startsWith(normalizePath(VolViewNodeModulesDir)))
              return undefined;
            return baseManualChunks?.(id, meta);
          },
        },
      },
    },
    plugins: [],
  });

  viteConfig.plugins.unshift(OverrideResolverPlugin);

  return viteConfig;
});
