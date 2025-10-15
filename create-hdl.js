#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const templates = {
  verilog: {
    ext: "v",
    moduleTemplate: name => `module ${name}(); endmodule\n`,
    tbTemplate: name => `module ${name}_tb; ${name} dut(); endmodule\n`
  },
  vhdl: {
    ext: "vhd",
    moduleTemplate: name => `entity ${name} is end; architecture rtl of ${name} is begin end rtl;\n`,
    tbTemplate: name => `entity ${name}_tb is end; architecture sim of ${name}_tb is begin uut: entity work.${name}; end sim;\n`
  }
};

async function main() {
  console.log("⚡ Create HDL Project ⚡\n");
  const { projectName, language } = await inquirer.prompt([
    { type: "input", name: "projectName", message: "Project name:", default: "hdl_project" },
    { type: "list", name: "language", message: "HDL language:", choices: ["Verilog", "VHDL"] }
  ]);

  const root = path.join(process.cwd(), projectName);
  if (fs.existsSync(root)) {
    console.error("❌ Folder exists");
    return;
  }
  fs.mkdirSync(root);
  const dirs = ["netlist", "scripts", "sim/generated", "src", "tb", ".vscode"];
  dirs.forEach(d => fs.mkdirSync(path.join(root, d), { recursive: true }));

  const langKey = language.toLowerCase();
  const ext = templates[langKey].ext;
  fs.writeFileSync(path.join(root, "src", `top_module.${ext}`), templates[langKey].moduleTemplate("top_module"));
  fs.writeFileSync(path.join(root, "tb", `top_module_tb.${ext}`), templates[langKey].tbTemplate("top_module"));

  const netlistHeader = `// Netlist generated on ${new Date().toLocaleString()}\n`;
  fs.writeFileSync(path.join(root, "netlist", "README.txt"), netlistHeader + "Place synthesized netlists here.");

  console.log(`✅ ${language} project created in ${projectName}/`);
}

main();
