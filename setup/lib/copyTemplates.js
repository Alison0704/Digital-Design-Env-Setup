// lib/copyTemplates.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

/**
 * Copies the correct HDL template (Verilog or VHDL)
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

  console.log(chalk.green(`✅ Template copied successfully to ${projectDir}`));
}
