// lib/createVSCodeTasks.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

/**
 * Creates a .vscode/tasks.json file inside the new project.
 * Adds tasks for simulation, netlist generation, and waveform viewing.
 */
export async function createVSCodeTasks(projectDir) {
  const vscodeDir = path.join(projectDir, ".vscode");
  const tasksFile = path.join(vscodeDir, "tasks.json");

  await fs.mkdirp(vscodeDir);

  const tasks = {
    version: "2.0.0",
    tasks: [
      {
        label: "Run Simulation",
        type: "shell",
        command: "./scripts/run_sim.sh",
        group: {
          kind: "build",
          isDefault: true
        },
        problemMatcher: []
      },
      {
        label: "Generate Netlist",
        type: "shell",
        command: "./scripts/generate_netlist.tcl",
        problemMatcher: []
      },
      {
        label: "Open Waveform Viewer",
        type: "shell",
        command: "./scripts/gen_wave.sh",
        problemMatcher: []
      }
    ]
  };

  await fs.writeJson(tasksFile, tasks, { spaces: 2 });
  console.log(chalk.green(`✅ VS Code tasks.json created at ${tasksFile}`));
}
