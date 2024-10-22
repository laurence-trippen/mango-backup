import fs from "fs/promises";

import yaml from "yaml";

import { fileExists } from "../utils/fileUtil.js";

const CONFIG_BASE_NAME = "mango.config";

const CONFIG_NAME_YML = `${CONFIG_BASE_NAME}.yml`;
const CONFIG_NAME_YAML = `${CONFIG_BASE_NAME}.yaml`;

export const readConfig = async () => {
  const [existsYML, existsYAML] = await Promise.all([
    fileExists(CONFIG_NAME_YML),
    fileExists(CONFIG_NAME_YAML),
  ]);

  console.log(existsYML, existsYAML);

  if (!existsYML && !existsYAML) throw new Error("Couldn't find mango.config.yml!");

  const configFileName = existsYML ? CONFIG_NAME_YML : CONFIG_NAME_YAML;

  const contents = await fs.readFile(configFileName, 'utf-8');

  const ymlResult = yaml.parse(contents);

  console.log(ymlResult);
}

export const validateConfig = (config) => {
  if (!config) return false;

  

  return false;
}
