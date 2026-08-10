import XenProvider from "./provider-xen.js";
import XcpNgProvider from "./provider-xcpng.js";
import MirageOSProvider from "./provider-mirageos.js";
import process from "node:process";
import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "node:url";
const params = { logErrors: true };
export const providers = [new XenProvider(), new XcpNgProvider(), new MirageOSProvider()];
const OUTPUT_FILE = "assets/data/downloads.json";
const OUTPUT_FILE_PUBLIC = "public/data/downloads.json";

async function getVersions(provider) {
  try {
    const versions = await provider.getVersions();
    return versions || [{ link: "", name: "default" }];
  } catch (e) {
    console.error(`Error getting versions for ${provider.name}. Using existing versions.`);
    if (params.logErrors) console.error(e);
    return undefined;
  }
}

async function getDrivers(provider, version, existingVersionMap) {
  if (!existingVersionMap.has(version.name) || provider.refreshExistingVersions) {
    try {
      const files = await provider.getFilesAndFolders(version.name);
      return { ...version, files };
    } catch (e) {
      console.error(`Error getting files for ${provider.name} version ${version.name}. Skipping.`);
      if (params.logErrors) console.error(e);
    }
  }
  return null;
}

export async function getProviderData(provider, existingVersions = []) {
  const existingVersionMap = new Map(existingVersions.map((v) => [v.name, v]));
  const versionsArrayOfObjects = await getVersions(provider);

  if (!versionsArrayOfObjects) {
    return { name: provider.name, key: provider.key, versions: existingVersions };
  }

  const newVersions = await Promise.all(
    versionsArrayOfObjects.map(async (version) => getDrivers(provider, version, existingVersionMap)),
  );

  const refreshedVersions = newVersions.filter(Boolean);
  const refreshedNames = new Set(refreshedVersions.map((version) => version.name));
  const allVersions = [
    ...existingVersions.filter((version) => !refreshedNames.has(version.name)),
    ...refreshedVersions,
  ];
  allVersions.sort((a, b) => {
    const compareVersions = (v1, v2) => v1.localeCompare(v2, undefined, { numeric: true, sensitivity: "base" });
    return compareVersions(a.name.split("-")[0], b.name.split("-")[0]);
  });

  return { name: provider.name, key: provider.key, versions: allVersions };
}

export async function generateDownloads({
  registeredProviders = providers,
  existingData = [],
  selectedKeys = registeredProviders.map((provider) => provider.key),
} = {}) {
  const selected = new Set(selectedKeys);
  const knownKeys = new Set(registeredProviders.map((provider) => provider.key));
  const unknownKeys = [...selected].filter((key) => !knownKeys.has(key));

  if (unknownKeys.length > 0) {
    throw new Error(`Unknown download provider${unknownKeys.length === 1 ? "" : "s"}: ${unknownKeys.join(", ")}`);
  }

  return Promise.all(
    registeredProviders.map(async (provider) => {
      const existingProviderData = existingData.find((data) => data.key === provider.key);

      if (!selected.has(provider.key) && existingProviderData) {
        return existingProviderData;
      }

      console.log(`Processing provider ${provider.name}`);
      const newProviderData = await getProviderData(provider, existingProviderData?.versions);
      console.log(`Provider ${provider.name} done`);
      return newProviderData;
    }),
  );
}

export async function main(selectedKeys = process.argv.slice(2)) {
  let existingData = [];
  try {
    existingData = JSON.parse(await fs.readFile(OUTPUT_FILE, "utf8"));
  } catch (error) {
    console.log("No existing data or invalid JSON format. Starting fresh.");
  }

  const output = await generateDownloads({
    existingData,
    selectedKeys: selectedKeys.length > 0 ? selectedKeys : undefined,
  });

  const output_json = JSON.stringify(output, null, 2) + "\n";
  await fs.writeFile(OUTPUT_FILE, output_json);
  await fs.mkdir(path.dirname(OUTPUT_FILE_PUBLIC), { recursive: true });
  await fs.writeFile(OUTPUT_FILE_PUBLIC, output_json);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
