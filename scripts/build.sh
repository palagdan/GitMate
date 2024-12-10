#!/bin/bash

# Build the project using NCC
ncc build src/index.ts -o dist

# Copy the template file from src/assets to dist/assets
cp src/assets/* dist/promptTemplate.txt

echo "Build completed and template copied."
