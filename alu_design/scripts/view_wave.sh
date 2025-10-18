#!/usr/bin/env bash
# ==============================================
# Open VCD Waveform Viewer
# Usage: ./view_wave.sh
# ==============================================

WAVE_FILE="${1:-sim/wave.vcd}"

if [ ! -f "$WAVE_FILE" ]; then
  echo "❌ Error: Waveform file not found: $WAVE_FILE"
  echo "ℹ️  Run './scripts/run_sim.sh' first to generate the waveform"
  exit 1
fi

echo "🌊 Opening waveform: $WAVE_FILE"

if command -v surfer &> /dev/null; then
  echo "✅ Launching Surfer..."
  nohup surfer "$WAVE_FILE" > /dev/null 2>&1 &
  sleep 1
  echo "✅ Surfer opened (PID: $!)"
elif command -v gtkwave &> /dev/null; then
  echo "✅ Launching GTKWave..."
  nohup gtkwave "$WAVE_FILE" > /dev/null 2>&1 &
  sleep 1
  echo "✅ GTKWave opened (PID: $!)"
else
  echo "❌ No waveform viewer found"
  echo "ℹ️  Install with: brew install surfer"
  exit 1
fi
