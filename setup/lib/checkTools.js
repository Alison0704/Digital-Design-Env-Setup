import { log, commandExists } from "./utils.js";

export async function checkTools(language) {
  log.step("Checking required HDL tools...");

  if (language === "verilog") {
    if (!(await commandExists("iverilog"))) {
      log.warn("Icarus Verilog not found. Please install it before running simulations.");
    } else {
      log.success("Icarus Verilog found.");
    }
  } else if (language === "vhdl") {
    if (!(await commandExists("ghdl"))) {
      log.warn("GHDL not found. Please install it before running simulations.");
    } else {
      log.success("GHDL found.");
    }
  }
  // Check for Surfer waveform viewer
  if (!(await commandExists("surfer"))) {
    log.warn("Surfer not found. Please install it to view waveforms.");
  } else {
    log.success("Surfer found.");
  }
}
