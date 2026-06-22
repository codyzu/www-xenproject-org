import XenProvider from "./provider-xen.js";
import WindowPVDrivers from "./provider-windowpvdrivers.js";
import MirageOSProvider from "./provider-mirageos.js";
import process from "node:process";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
const params = { logErrors: true };
axios.defaults.timeout = 15000;
const providers = [new XenProvider(), new WindowPVDrivers(), new MirageOSProvider()];
const OUTPUT_FILE = "assets/data/downloads.json";
const OUTPUT_FILE_STATIC = "static/data/downloads.json";
const LATEST_OUTPUT_FILE = "assets/data/downloads-latest.json";

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

function createLatestVersionsData(providerData) {
  const downloadLatest = [];

  providerData.forEach((provider) => {
    const defaultVersion = provider.versions.find((version) => version.name === "default");
    let latestVersions = [];

    if (defaultVersion) {
      latestVersions = [defaultVersion];
    } else {
      const versionGroups = {};

      provider.versions.forEach((version) => {
        if (!version.name.includes("beta") && !version.name.includes("rc")) {
          const [major, minor] = version.name.split(".");
          const groupKey = `${major}.${minor}`;

          if (!versionGroups[groupKey]) {
            versionGroups[groupKey] = {
              name: groupKey,
              subversions: [],
            };
          }
          versionGroups[groupKey].subversions.push(version);
        }
      });

      const sortedGroups = Object.keys(versionGroups).sort((a, b) =>
        b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }),
      );
      const latestTwoGroups = sortedGroups.slice(0, 2);

      latestVersions = latestTwoGroups.map((group) => ({
        name: versionGroups[group].name,
        subversions: versionGroups[group].subversions.sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: "base" }),
        ),
      }));
    }

    downloadLatest.push({
      name: provider.name,
      key: provider.key,
      versions: latestVersions,
    });
  });

  return downloadLatest;
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

  const latest_json = JSON.stringify(createLatestVersionsData(output), null, 2) + "\n";
  await fs.writeFile(LATEST_OUTPUT_FILE, latest_json);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
