import * as fs from "node:fs";
/**
 * Load a file.
 * @param filePath - Path to the file to be loaded.
 * @returns File content as a string.
 */
const loadFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
};
export { loadFile };
