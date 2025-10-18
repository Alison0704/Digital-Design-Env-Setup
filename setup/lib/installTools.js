// lib/installTools.js
import os from "os";
import { log, runCommand, commandExists } from "./utils.js";
import inquirer from "inquirer";

/**
 * Detect the current operating system
 * @returns {'macos'|'linux'|'windows'}
 */
function detectOS() {
  const platform = os.platform();
  if (platform === "darwin") return "macos";
  if (platform === "win32") return "windows";
  return "linux";
}

/**
 * Check if package manager is available
 */
async function getPackageManager() {
  const currentOS = detectOS();
 
  if (currentOS === "macos") {
    if (await commandExists("brew")) return "brew";
    return null;
  } else if (currentOS === "linux") {
    if (await commandExists("apt-get")) return "apt";
    if (await commandExists("dnf")) return "dnf";
    if (await commandExists("pacman")) return "pacman";
    if (await commandExists("zypper")) return "zypper";
    return null;
  } else if (currentOS === "windows") {
    if (await commandExists("choco")) return "choco";
    if (await commandExists("scoop")) return "scoop";
    return null;
  }
  
  return null;
}

/**
 * Install Icarus Verilog based on the OS
 */
async function installIcarusVerilog() {
  const currentOS = detectOS();
  const pkgManager = await getPackageManager();
  
  log.step("Installing Icarus Verilog...");
  
  if (currentOS === "macos") {
    if (pkgManager === "brew") {
      const { success } = await runCommand("brew install icarus-verilog");
      return success;
    } else {
      log.error("Homebrew not found. Please install Homebrew first: https://brew.sh");
      return false;
    }
  } else if (currentOS === "linux") {
    if (pkgManager === "apt") {
      const { success } = await runCommand("sudo apt-get update && sudo apt-get install -y iverilog");
      return success;
    } else if (pkgManager === "dnf") {
      const { success } = await runCommand("sudo dnf install -y iverilog");
      return success;
    } else if (pkgManager === "pacman") {
      const { success } = await runCommand("sudo pacman -S --noconfirm iverilog");
      return success;
    } else {
      log.error("No supported package manager found. Please install manually.");
      return false;
    }
  } else if (currentOS === "windows") {
    if (pkgManager === "choco") {
      const { success } = await runCommand("choco install -y iverilog");
      return success;
    } else if (pkgManager === "scoop") {
      const { success } = await runCommand("scoop install iverilog");
      return success;
    } else {
      log.error("No package manager found. Please install Chocolatey or Scoop.");
      log.info("Chocolatey: https://chocolatey.org/install");
      log.info("Scoop: https://scoop.sh");
      return false;
    }
  }
  
  return false;
}

/**
 * Install GHDL based on the OS
 */
async function installGHDL() {
  const currentOS = detectOS();
  const pkgManager = await getPackageManager();
  
  log.step("Installing GHDL...");
  
  if (currentOS === "macos") {
    if (pkgManager === "brew") {
      const { success } = await runCommand("brew install ghdl");
      return success;
    } else {
      log.error("Homebrew not found. Please install Homebrew first: https://brew.sh");
      return false;
    }
  } else if (currentOS === "linux") {
    if (pkgManager === "apt") {
      const { success } = await runCommand("sudo apt-get update && sudo apt-get install -y ghdl");
      return success;
    } else if (pkgManager === "dnf") {
      const { success } = await runCommand("sudo dnf install -y ghdl");
      return success;
    } else if (pkgManager === "pacman") {
      const { success } = await runCommand("sudo pacman -S --noconfirm ghdl");
      return success;
    } else {
      log.error("No supported package manager found. Please install manually.");
      return false;
    }
  } else if (currentOS === "windows") {
    if (pkgManager === "choco") {
      const { success } = await runCommand("choco install -y ghdl");
      return success;
    } else if (pkgManager === "scoop") {
      log.warn("GHDL not available in Scoop. Please install manually from: https://github.com/ghdl/ghdl/releases");
      return false;
    } else {
      log.error("No package manager found. Please install Chocolatey or Scoop.");
      log.info("Chocolatey: https://chocolatey.org/install");
      return false;
    }
  }
  
  return false;
}

/**
 * Install Surfer waveform viewer (Rust-based tool)
 */
async function installSurfer() {
  log.step("Installing Surfer...");
  
  // Check if Cargo (Rust) is installed
  if (!(await commandExists("cargo"))) {
    log.error("Cargo (Rust) not found. Surfer requires Rust to install.");
    log.info("Install Rust from: https://rustup.rs");
    return false;
  }
  
  const { success } = await runCommand("cargo install surfer");
  return success;
}

/**
 * Main function to check and offer to install missing tools
 */
export async function checkAndInstallTools(language) {
  log.step("Checking required HDL tools...");
  
  const missingTools = [];
  
  // Check Verilog tools
  if (language === "verilog") {
    if (!(await commandExists("iverilog"))) {
      missingTools.push({ name: "Icarus Verilog", command: "iverilog", installer: installIcarusVerilog });
    } else {
      log.success("Icarus Verilog found.");
    }
  }
  
  // Check VHDL tools
  if (language === "vhdl") {
    if (!(await commandExists("ghdl"))) {
      missingTools.push({ name: "GHDL", command: "ghdl", installer: installGHDL });
    } else {
      log.success("GHDL found.");
    }
  }
  
  // Check Surfer (waveform viewer)
  if (!(await commandExists("surfer"))) {
    missingTools.push({ name: "Surfer", command: "surfer", installer: installSurfer });
  } else {
    log.success("Surfer found.");
  }
  
  // If tools are missing, offer to install
  if (missingTools.length > 0) {
    log.warn(`Missing tools: ${missingTools.map(t => t.name).join(", ")}`);
    
    const { shouldInstall } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldInstall",
        message: "Would you like to automatically install the missing tools?",
        default: true,
      },
    ]);
    
    if (shouldInstall) {
      for (const tool of missingTools) {
        const success = await tool.installer();
        if (success) {
          log.success(`${tool.name} installed successfully!`);
        } else {
          log.error(`Failed to install ${tool.name}. Please install manually.`);
        }
      }
    } else {
      log.info("You can install the tools manually later.");
    }
  } else {
    log.success("All required tools are installed!");
  }
}
