import { execFileSync } from "node:child_process";
import { CoreDirPath, ProjectRoot } from "../common.js";

/**
 * Runs npm install path/to/app/
 */
function main() {
  process.chdir(ProjectRoot);
  try {
    process.stdout.write(execFileSync("npm", ["install", `${CoreDirPath}/`]));
  } catch (err) {
    process.stderr.write(String(err));
    process.exit(1);
  }
}

main();
