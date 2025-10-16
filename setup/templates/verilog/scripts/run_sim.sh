#!/usr/bin/env bash
# ==============================================
# HDL Simulation Script
# Supports: Verilog (Icarus Verilog)
# ==============================================

set -e  # Exit on first error

WAVE_FILE="sim/wave.vcd"
mkdir -p sim

echo "🔧 Running verilog simulation..."
echo "----------------------------------------------"

# ==============================================
# Verilog (Icarus Verilog)
# ==============================================
OUTPUT="sim/wave.out"

iverilog -o "$OUTPUT" src/*.v tb/*.v
vvp "$OUTPUT"

if [ -f "$WAVE_FILE" ]; then
  echo "✅ Simulation complete. Waveform generated: $WAVE_FILE"
else
  echo "⚠️  No VCD waveform found. Did your testbench dump signals?"
fi

echo "----------------------------------------------"
echo "Done ✅"
