import * as fs from "node:fs";

/**
 * Load a file.
 * @param filePath - Path to the file to be loaded.
 * @returns File content as a string.
 */
export const loadFile = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf-8');
};

