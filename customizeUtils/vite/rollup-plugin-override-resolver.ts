import * as path from "node:path";
import * as glob from "glob";
import { PluginOption } from "vite";
import {
  OverrideDirPath,
  OverrideDirPrefix,
  CoreDirPath,
  CoreDirPrefix,
  ProjectRoot,
} from "../common";

function generateOverrideLookup() {
  return new Set(
    glob
      .sync(path.resolve(ProjectRoot, `${OverrideDirPath}/**/*`), {
        withFileTypes: true,
      })
      .filter((file) => file.isFile())
      .map((file) => path.relative(OverrideDirPath, file.fullpathPosix()))
  );
}

const overrideLookup = generateOverrideLookup();

export const OverrideResolverPlugin: PluginOption = {
  name: "override-resolver",
  resolveId: {
    order: "pre",
    async handler(source, importer, options) {
      const resolution = await this.resolve(source, importer, {
        skipSelf: true,
        ...options,
      });

      if (!resolution || resolution.external) return resolution;

      // if importer is from the override folder, then stop.
      if (importer?.startsWith(OverrideDirPrefix)) return resolution;

      // if not importing from the core dir, then stop.
      if (!resolution.id.startsWith(CoreDirPrefix)) return resolution;

      const relPath = path.relative(CoreDirPath, resolution.id);
      if (!overrideLookup.has(relPath)) return resolution;

      resolution.id = path.join(OverrideDirPath, relPath);
      return resolution;
    },
  },
};
