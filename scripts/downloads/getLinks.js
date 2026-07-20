import XenProvider from "./provider-xen.js";
import WindowPVDrivers from "./provider-windowpvdrivers.js";
import MirageOSProvider from "./provider-mirageos.js";
import process from "node:process";
import fs from "fs/promises";
import path from "path";
const params = { logErrors: true };
const providers = [new XenProvider(), new WindowPVDrivers(), new MirageOSProvider()];
const OUTPUT_FILE = "assets/data/downloads.json";
const OUTPUT_FILE_STATIC = "static/data/downloads.json";

async function getVersions(provider, existingVersionMap) {
  try {
    const versions = await provider.getVersions();
    return versions || [{ link: "", name: "default" }];
  } catch (e) {
    console.error(`Error getting versions for ${provider.name}. Using existing versions.`);
    return Array.from(existingVersionMap.values());
  }
}

async function getDrivers(provider, version, existingVersionMap) {
  if (!existingVersionMap.has(version.name)) {
    try {
      const files = await provider.getFilesAndFolders(version.name);
      return { ...version, files };
    } catch (e) {
      console.error(`Error getting files for ${provider.name} version ${version}. Skipping.`);
      if (params.logErrors) console.error(e);
    }
  }
  return null;
}

async function getProviderData(provider, existingVersions = []) {
  const existingVersionMap = new Map(existingVersions.map((v) => [v.name, v]));
  const versionsArrayOfObjects = await getVersions(provider, existingVersionMap);

  const newVersions = await Promise.all(
    versionsArrayOfObjects.map(async (version) => getDrivers(provider, version, existingVersionMap)),
  );

  const allVersions = [...existingVersions, ...newVersions.filter(Boolean)];
  allVersions.sort((a, b) => {
    const compareVersions = (v1, v2) => v1.localeCompare(v2, undefined, { numeric: true, sensitivity: "base" });
    return compareVersions(a.name.split("-")[0], b.name.split("-")[0]);
  });

  return { name: provider.name, key: provider.key, versions: allVersions };
}

async function main() {
  let existingData = [];
  try {
    existingData = JSON.parse(await fs.readFile(OUTPUT_FILE, "utf8"));
  } catch (error) {
    console.log("No existing data or invalid JSON format. Starting fresh.");
  }

  const output = await Promise.all(
    providers.map(async (provider) => {
      console.log(`Processing provider ${provider.name}`);
      const existingProviderData = existingData.find((data) => data.key === provider.key) || {};
      const newProviderData = await getProviderData(provider, existingProviderData.versions);
      console.log(`Provider ${provider.name} done`);
      return newProviderData;
    }),
  );

  const output_json = JSON.stringify(output, null, 2) + "\n";
  await fs.writeFile(OUTPUT_FILE, output_json);
  await fs.mkdir(path.dirname(OUTPUT_FILE_STATIC), { recursive: true });
  await fs.writeFile(OUTPUT_FILE_STATIC, output_json);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
