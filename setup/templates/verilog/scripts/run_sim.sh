#!/usr/bin/env bash
TOP=${1:-top_module}
mkdir -p sim/generated

# Icarus Verilog (verilog)
iverilog -o sim/${TOP}_sim src/${TOP}.v tb/${TOP}_tb.v || { echo "iverilog failed"; exit 1; }
vvp sim/${TOP}_sim
echo "Waveform: sim/waves.vcd"
