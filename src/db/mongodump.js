import { exec, spawn } from "child_process";

import { findExecutable } from "../utils/fileUtil.js";


const getVersion = () => {
  return new Promise((resolve, reject) => {
    exec("mongodump --version", (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }

      if (stderr) {
        console.log("stderr: mongodump --version");
        console.log(stderr);
      }
  
      resolve(stdout);
    });
  });
};

const runDump = (database, outputPath) => {
  // TODO: Validate database and outputpath inputs

  const child = spawn("ls", ["-l", "node_modules"]);

  child.stdout.on("data", (data) => {
    console.log(data.toString("utf8"));
  });
};

const mongoDumpModule = {
  getVersion,
  runDump,
};

/**
 * 
 */
export const getMongoDump = async () => {
  const mongoDumpPath = await findExecutable("mongodump");

  if (!mongoDumpPath) {
    throw new Error("Couldn't find mongodump!");
  }

  return {
    mongoDumpModule,
    mongoDumpPath,
  };
};
