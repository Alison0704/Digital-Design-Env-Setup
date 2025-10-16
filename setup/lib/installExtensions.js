// lib/installExtensions.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { log } from "./utils.js";

/**
 * Reads .vscode/extensions.json and installs each listed extension.
 * If VS Code CLI (`code`) is not available, it shows a friendly message instead.
 */
export async function installExtensions(projectDir) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const extensionsFile = path.join(projectDir, ".vscode", "extensions.json");

  if (!fs.existsSync(extensionsFile)) {
    log.warn(`No extensions.json found at ${extensionsFile}`);
    return;
  }

  const { recommendations = [] } = await fs.readJson(extensionsFile);

  if (recommendations.length === 0) {
    log.warn("No extensions listed in extensions.json");
    return;
  }

  log.info("Checking for VS Code CLI (`code`)...");

  // Try running the VS Code CLI to see if it's installed
  exec("code --version", async (error) => {
    if (error) {
      log.warn("VS Code CLI not found. Skipping auto-install.");
      log.step("You can manually install them by searching in the VS Code marketplace.");
      log.info(`Recommended extensions:\n${recommendations.join("\n")}`);
      return;
    }

    log.success("VS Code CLI detected.");
    log.info("Installing recommended extensions...");

    for (const ext of recommendations) {
      await new Promise((resolve) => {
        exec(`code --install-extension ${ext} --force`, (err, stdout, stderr) => {
          if (err) {
            log.error(`❌ Failed to install ${ext}: ${stderr.trim()}`);
          } else {
            log.success(`Installed ${ext}`);
          }
          resolve();
        });
      });
    }
    log.success("All extensions installed successfully!");
  });
}
