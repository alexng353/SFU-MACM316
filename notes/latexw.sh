#!/bin/bash

if ! command -v entr &> /dev/null
then
    echo "Error: 'entr' is not installed."
    echo "You can install it with:"
    echo ""
    echo "  # Debian/Ubuntu"
    echo "  sudo apt install entr"
    echo ""
    echo "  # macOS (with Homebrew)"
    echo "  brew install entr"
    echo ""
    echo "  # Arch Linux"
    echo "  sudo pacman -S entr"
    echo ""
    exit 1
fi

if [[ -z "$1" ]]
then
  echo "Usage: watch_latex <filename>"
  return 1
fi

# ls -G "$1" | entr -r latexmk -quiet -pdf "$1"

WATCH_FILES=$(ls -1 cleaned/*.tex "$1" 2>/dev/null)
echo "$WATCH_FILES" | entr -r latexmk -quiet -pdf "$1"
