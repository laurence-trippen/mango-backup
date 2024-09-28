import fs, { constants } from "fs/promises";
import path from "path";

/**
 * 
 * @param {string} path 
 * @returns 
 */
export const fileExists = (path) => {
  return new Promise((resolve) => {
    fs.access(path, constants.F_OK).then(() => {
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  });
};

/**
 * 
 * @param {string} filePath
 * @returns {boolean} File exists
 */
export const fileExistsCaseSensitive = async (filePath) => {
  if (!filePath)
    throw new Error("File path not set!");

  if (!(typeof filePath === "string"))
    throw new Error("filePath must be a string!");

  const exists = await fileExists(filePath);

  if (!exists) return false;

  // Get Parent Directory of file
  const parentDirectory = path.dirname(filePath);
  const fileName = path.basename(filePath);

  try {
    const caseSensitiveFileNames = await fs.readdir(parentDirectory);

    return caseSensitiveFileNames.includes(fileName);
  } catch (e) {
    console.error("fs.readdir inside fileExistsCaseSensitiv() failed!");
    console.error(e);

    return false;
  }
};

/**
 * @param {string} exe executable name (without extension if on Windows)
 * @return {Promise<string|null>} executable path if found
 * */
export const findExecutable = async (exe) => {
  const envPath = process.env.PATH || "";
  const envExt = process.env.PATHEXT || "";

  const pathDirs = envPath
      .replace(/["]+/g, "")
      .split(path.delimiter)
      .filter(Boolean);

  const extensions = envExt.split(";");
  const candidates = pathDirs.flatMap((d) =>
      extensions.map((ext) => path.join(d, exe + ext))
  );

  try {
      return await Promise.any(candidates.map(checkFileExists));
  } catch (e) {
      return null;
  }

  async function checkFileExists(filePath) {
    if ((await fs.stat(filePath)).isFile()) {
        return filePath;
    }
    
    throw new Error("Not a file");
  }
}
