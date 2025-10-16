// setup/lib/createVSCodeTasks.js
import fs from "fs-extra";
import path from "path";
import { log } from "./utils.js";

export async function createVSCodeTasks(language, projectDir) {
  log.step("Setting up VSCode tasks...");

  const vscodeDir = path.join(projectDir, ".vscode");
  await fs.mkdirp(vscodeDir);

}

