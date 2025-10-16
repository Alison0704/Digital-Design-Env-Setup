#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { checkTools } from "../lib/checkTools.js";
import { copyTemplates } from "../lib/copyTemplates.js";
import { createVSCodeTasks } from "../lib/createVSCodeTasks.js";
import { installExtensions } from "../lib/installExtensions.js";
import { log } from "../lib/utils.js";

// Support __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.clear();
  log.step("HDL Project Setup Wizard");

  // 1️⃣ Ask for project name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) => input.trim() !== "" || "Project name cannot be empty.",
    },
  ]);

  const projectDir = path.resolve(process.cwd(), projectName);

  // 2️⃣ Ask for HDL type
  const { language } = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Is this a Verilog or VHDL project?",
      choices: ["Verilog", "VHDL"],
    },
  ]);

  const lang = language.toLowerCase();

  // 3️⃣ Create project directory
  if (fs.existsSync(projectDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `Directory "${projectName}" already exists. Overwrite?`,
        default: false,
      },
    ]);
    if (!overwrite) {
      log.warn("❌ Setup cancelled.");
      return;
    }
    await fs.remove(projectDir);
  }

  await fs.mkdirp(projectDir);

  // 4️⃣ Run setup steps
  log.step(`Setting up ${language} project in ${projectName}/`);
  await checkTools(lang);
  await copyTemplates(lang, projectDir);
  await createVSCodeTasks(lang, projectDir);
  await installExtensions(projectDir);

  // 5️⃣ Done
  log.success(`✅ ${language} project "${projectName}" created successfully!`);
  log.info(`Next steps:
  cd ${projectName}
  code .
  `);
}

main().catch((err) => {
  console.error("❌ Setup failed:", err);
});
