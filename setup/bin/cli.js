#!/usr/bin/env node
import inquirer from "inquirer";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { copyTemplates } from "../lib/copyTemplates.js";
import { createVSCodeTasks } from "../lib/createVSCodeTasks.js";
import { installExtensions } from "../lib/installExtensions.js";
import { checkTools } from "../lib/checkTools.js";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log(chalk.cyan.bold("\n⚙️  HDL Project Setup Tool\n"));

  // Step 1: Ask for project type and name
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Which HDL would you like to use?",
      choices: ["verilog", "vhdl"]
    },
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) => input ? true : "Project name cannot be empty."
    }
  ]);

  const { language, projectName } = answers;
  const projectDir = path.resolve(process.cwd(), projectName);

  console.log(chalk.gray(`\n📁 Creating ${language.toUpperCase()} project at:`));
  console.log(chalk.white(`${projectDir}\n`));

  // Step 2: Check for HDL tools
  await checkTools(language);

  // Step 3: Copy the correct template
  const templateDir = path.join(__dirname, "..", "templates", language);
  await copyTemplates(language, projectDir, templateDir);

  // Step 4: Create VS Code tasks.json
  await createVSCodeTasks(projectDir);

  // Step 5: Install recommended VS Code extensions
  await installExtensions(projectDir);

  // Step 6: Initialize Git repo (optional but
