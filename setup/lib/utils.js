// setup/lib/utils.js
import chalk from "chalk";
import { exec } from "child_process";

/**
 * Run a shell command asynchronously.
 * Returns { success: boolean, stdout: string, stderr: string }
 */
export function runCommand(command, options = {}) {
  return new Promise((resolve) => {
    exec(command, { ...options, encoding: "utf8" }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, stdout, stderr });
      } else {
        resolve({ success: true, stdout, stderr });
      }
    });
  });
}

/**
 * Print standardized log messages with icons and colors.
 */
export const log = {
  info: (msg) => console.log(chalk.cyan(`ℹ️  ${msg}`)),
  success: (msg) => console.log(chalk.green(`✅ ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`⚠️  ${msg}`)),
  error: (msg) => console.log(chalk.red(`❌ ${msg}`)),
  step: (msg) => console.log(chalk.gray(`→ ${msg}`))
};

/**
 * Check if a command exists in PATH.
 */
export async function commandExists(cmd) {
  const { success } = await runCommand(`which ${cmd}`);
  return success;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Add timestamp comment at top of a file (for netlist or reports).
 */
export async function addTimestampComment(filePath, commentStyle = "//") {
  const fs = await import("fs-extra");
  const date = new Date().toLocaleString();
  const header = `${commentStyle} Generated on ${date}\n`;

  if (await fs.pathExists(filePath)) {
    const content = await fs.readFile(filePath, "utf8");
    await fs.writeFile(filePath, header + content, "utf8");
  }
}
