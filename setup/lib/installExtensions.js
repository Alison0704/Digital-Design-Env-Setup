// lib/installExtensions.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { exec } from "child_process";
import { fileURLToPath } from "url";

/**
 * Reads .vscode/extensions.json and installs each listed extension.
 * If VS Code CLI (`code`) is not available, it shows a friendly message instead.
 */
export async function installExtensions(projectDir) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const extensionsFile = path.join(projectDir, ".vscode", "extensions.json");

  if (!fs.existsSync(extensionsFile)) {
    console.log(chalk.yellow(`⚠️  No extensions.json found at ${extensionsFile}`));
    return;
  }

  const { recommendations = [] } = await fs.readJson(extensionsFile);

  if (recommendations.length === 0) {
    console.log(chalk.yellow("⚠️  No extensions listed in extensions.json"));
    return;
  }

  console.log(chalk.cyan("🔧 Checking for VS Code CLI (`code`)..."));

  // Try running the VS Code CLI to see if it's installed
  exec("code --version", async (error) => {
    if (error) {
      console.log(chalk.yellow("⚠️  VS Code CLI not found. Skipping auto-install."));
      console.log(chalk.gray("→ You can manually install them by searching in the VS Code marketplace."));
      console.log(chalk.white(`Recommended extensions:\n${recommendations.join("\n")}`));
      return;
    }

    console.log(chalk.green("✅ VS Code CLI detected."));
    console.log(chalk.cyan("📦 Installing recommended extensions..."));

    for (const ext of recommendations) {
      await new Promise((resolve) => {
        exec(`code --install-extension ${ext} --force`, (err, stdout, stderr) => {
          if (err) {
            console.log(chalk.red(`❌ Failed to install ${ext}: ${stderr.trim()}`));
          } else {
            console.log(chalk.green(`✅ Installed ${ext}`));
          }
          resolve();
        });
      });
    }

    console.log(chalk.green("🎉 All extensions installed successfully!"));
  });
}
