#!/bin/bash
# Copy source images to public/photos/ for the static export
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SRC="$PROJECT_DIR/images/raw"
DEST="$PROJECT_DIR/public/photos"

echo "Preparing images..."
echo "  Source: $SRC"
echo "  Destination: $DEST"

mkdir -p "$DEST"

count=$(ls -1 "$SRC"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "  Found $count images"

cp "$SRC"/*.jpg "$DEST/"

echo "  Copied $count images to public/photos/"
echo "Done."
