#!/usr/bin/env bash
# Create browser-friendly MP3 files beside every WAV master.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

command -v ffmpeg >/dev/null || {
  echo "ffmpeg is required to create MP3 files."
  exit 1
}

find music -type f -name '*.wav' -print0 | while IFS= read -r -d '' source; do
  target="${source%.wav}.mp3"
  if [[ ! -f "$target" || "$source" -nt "$target" ]]; then
    echo "Encoding $(basename "$source")"
    ffmpeg -nostdin -loglevel error -y -i "$source" -vn -codec:a libmp3lame -b:a 192k "$target"
  fi
done

echo "MP3 preparation complete."
