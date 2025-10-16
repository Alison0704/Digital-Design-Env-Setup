#!/usr/bin/env bash
# ==============================================
# HDL Simulation Script
# Supports: VHDL (GHDL)
# Generates VCD waveform in sim/directory
# ==============================================

set -e  # Exit on first error

SRC_DIR="src"
TB_DIR="tb"
SIM_DIR="sim"
WAVE_FILE="sim/wave.vcd"

mkdir -p "sim"

echo "🔧 Running VHDL simulation..."
echo "----------------------------------------------"

# ==============================================
# VHDL (GHDL)
# ==============================================

# Analyze VHDL files
ghdl -a --workdir="$SIM_DIR" src/*.vhdl tb/*.vhdl

# Elaborate the testbench
ghdl -e --workdir="$SIM_DIR" tb_top_module

# Run simulation and generate VCD
ghdl -r --workdir="$SIM_DIR" tb_top_module --vcd="$WAVE_FILE"

# Move executable to sim directory
mv tb_top_module "$SIM_DIR/" 2>/dev/null || true
mv tb_top_module.o "$SIM_DIR/" 2>/dev/null || true
mv tb_top_module.cf "$SIM_DIR/" 2>/dev/null || true

# Cleanup intermediate files
rm -f "$SIM_DIR/"*.o "$SIM_DIR/"*.cf
# ==============================================

if [ -f "$WAVE_FILE" ]; then
  echo "✅ Simulation complete. Waveform generated: $WAVE_FILE"
else
  echo "⚠️  No VCD waveform found. Check your testbench process."
fi

echo "----------------------------------------------"
echo "Done ✅"
