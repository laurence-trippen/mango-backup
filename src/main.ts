// import cron from "node-cron";


import { readConfig } from "./config/config.js";
import { getMongoDump } from "./db/mongodump.js";

async function main() {
  readConfig();

  try {
    const { mongoDumpModule: mongoDump, mongoDumpPath } = await getMongoDump();

    const version = await mongoDump.getVersion();

    console.log(`Found MongoDump: ${mongoDumpPath}`);
    console.log(version);

    // mongoDump.runDump("", "");
  } catch (e) {
    console.log("Error with mongodump:");
    console.log(e);
  }

  console.log("END");
};

main().catch(e => console.error(e));
