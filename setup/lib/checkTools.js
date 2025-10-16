// lib/checkTools.js
import { execSync } from "child_process";
import chalk from "chalk";

export async function checkTools() {
  const tools = [
    { name: "iverilog", description: "Icarus Verilog" },
    { name: "ghdl", description: "GHDL (VHDL Simulator)" },
    { name: "gtkwave", description: "GTKWave Viewer" }
  ];

  for (const tool of tools) {
    try {
      execSync(`${tool.name} --version`, { stdio: "ignore" });
      console.log(chalk.green(`✅ ${tool.description} (${tool.name}) found`));
    } catch {
      console.log(chalk.yellow(`⚠️  ${tool.description} (${tool.name}) not found`));
    }
  }
}
