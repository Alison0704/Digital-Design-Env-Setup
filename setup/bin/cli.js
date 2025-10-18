#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { checkAndInstallTools } from "../lib/installTools.js";
import { copyTemplates } from "../lib/copyTemplates.js";
import { createVSCodeTasks } from "../lib/createVSCodeTasks.js";
import { installExtensions } from "../lib/installExtensions.js";
import { log, runCommand } from "../lib/utils.js";

// Support __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);

async function main() {
  console.clear();
  log.step("HDL Project Setup Wizard");

  // Ask for project name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) => input.trim() !== "" || "Project name cannot be empty.",
    },
  ]);

  const projectDir = path.resolve(process.cwd(), projectName);

  // Ask for HDL type
  const { language } = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Is this a Verilog or VHDL project?",
      choices: ["Verilog", "VHDL"],
    },
  ]);

  const lang = language.toLowerCase();

  // Create project directory
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

  // Run setup steps
  log.step(`Setting up ${language} project in ${projectName}/`);
  await checkAndInstallTools(lang);
  await copyTemplates(lang, projectDir);
  await createVSCodeTasks(lang, projectDir);
  await installExtensions(projectDir);

  // Done
  log.success(`✅ ${language} project "${projectName}" created successfully!`);
  
  // Ask if user wants to open in VS Code
  const { openInVSCode } = await inquirer.prompt([
    {
      type: "confirm",
      name: "openInVSCode",
      message: "Open project in VS Code now?",
      default: true,
    },
  ]);
 
  // Open in VS Code if requested
  if(openInVSCode){
    log.step("Opening project in VS Code...");
    const { success } = await runCommand(`code "${projectDir}"`, { cwd: process.cwd() });
    if (success){
      log.success("Project opened in VS Code!");
    }
    else{
      log.warn("Could not open VS Code automatically. Please run: code " + projectName);
    }
  } //Instructions if not opening automatically
  else {
    log.info(
      `Next steps:
      cd ${projectName}
      code .`
    );
  }
}

main().catch((err) => {
  console.error("❌ Setup failed:", err);
});
