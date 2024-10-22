import fs, { constants } from "fs/promises";
import path from "path";


export const fileExists = (path: string) => {
  return new Promise((resolve) => {
    fs.access(path, constants.F_OK).then(() => {
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  });
};


export const fileExistsCaseSensitive = async (filePath: string): Promise<boolean> => {
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


export const findExecutable = async (exe: string): Promise<string | null> => {
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

  async function checkFileExists(filePath: string): Promise<string> {
    if ((await fs.stat(filePath)).isFile()) {
      return filePath;
    }

    throw new Error("Not a file");
  }
}
