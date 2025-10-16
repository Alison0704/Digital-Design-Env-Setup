// lib/copyTemplates.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

/**
 * Copies the correct HDL template (Verilog or VHD)
 * from /templates/<language> into the target project directory.
 */

export async function copyTemplates(language, projectDir) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.join(__dirname, "..", "templates", language);

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template for language '${language}' not found at ${templateDir}`);
  }

  // Check if project folder exists already
  if (fs.existsSync(projectDir)) {
    console.log(chalk.yellow(`⚠️  Directory '${projectDir}' already exists. Files may be overwritten.`));
  } else {
    await fs.mkdirp(projectDir);
  }

  // Copy recursively
  console.log(chalk.gray(`→ Copying template files for ${language.toUpperCase()}...`));
  await fs.copy(templateDir, projectDir, {
    overwrite: true,
    filter: (src) => !src.endsWith(".DS_Store"),
  });

  // Make shell scripts executable
  console.log(chalk.gray(`→ Making scripts executable...`));
  const scriptsDir = path.join(projectDir, "scripts");
  if (await fs.pathExists(scriptsDir)) {
    const scriptFiles = await fs.readdir(scriptsDir);
    for (const file of scriptFiles) {
      if (file.endsWith(".sh")) {
        const scriptPath = path.join(scriptsDir, file);
        await fs.chmod(scriptPath, 0o755);
      }
    }
  }

  console.log(chalk.green(`✅ Template copied successfully to ${projectDir}`));
}
