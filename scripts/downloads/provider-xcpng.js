import * as cheerio from "cheerio";
import Provider from "./Provider.class.js";
import { fetchText } from "./fetch.js";

const SOURCE_BASE_URL = "https://updates.xcp-ng.org/isos/";
const DOWNLOAD_BASE_URL = "https://mirrors.xcp-ng.org/isos/";
const VERSION_PATTERN = /^\d+\.\d+$/;
const ISO_PATTERN = /^xcp-ng-.+\.iso$/i;
const PRERELEASE_PATTERN = /(?:beta|alpha|rc)\d*/i;

export const parseDirectoryLinks = (html) => {
  const $ = cheerio.load(html);
  return $("a")
    .map((_, element) => ({
      href: $(element).attr("href") ?? "",
      name: $(element).text().trim().replace(/\/$/, ""),
    }))
    .get();
};

const compareVersionsDescending = (a, b) =>
  b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" });

const installerRank = (name) => {
  const match = name.match(/-(?<date>\d{8})(?:\.(?<refresh>\d+))?\.iso$/i);
  return match
    ? [Number(match.groups.date), Number(match.groups.refresh ?? 0)]
    : [0, 0];
};

export const newestInstaller = (names, { netinstall = false } = {}) =>
  names
    .filter((name) => ISO_PATTERN.test(name))
    .filter((name) => !PRERELEASE_PATTERN.test(name))
    .filter((name) => name.toLowerCase().includes("netinstall") === netinstall)
    .toSorted((a, b) => {
      const [aDate, aRefresh] = installerRank(a);
      const [bDate, bRefresh] = installerRank(b);
      return bDate - aDate || bRefresh - aRefresh || compareVersionsDescending(a, b);
    })[0];

export const selectXcpNgArtifacts = (html) => {
  const names = parseDirectoryLinks(html).map(({ name }) => name);
  const standardInstaller = newestInstaller(names);
  const netinstallInstaller = newestInstaller(names, { netinstall: true });

  if (!standardInstaller || !netinstallInstaller) {
    return [];
  }

  const required = [standardInstaller, netinstallInstaller, "SHA256SUMS", "SHA256SUMS.asc"];
  return required.filter((name) => names.includes(name));
};

class XcpNgProvider extends Provider {
  constructor({ fetchPage = fetchText } = {}) {
    super("XCP-ng", "xcpng", SOURCE_BASE_URL);
    this.fetchPage = fetchPage;
    this.directoryCache = new Map();
    this.includeFiles = true;
  }

  async getDirectory(version) {
    if (!this.directoryCache.has(version)) {
      this.directoryCache.set(version, await this.fetchPage(new URL(`${version}/`, this.baseURL).href));
    }

    return this.directoryCache.get(version);
  }

  async getVersions() {
    const index = await this.fetchPage(this.baseURL);
    const versions = parseDirectoryLinks(index)
      .map(({ name }) => name)
      .filter((name) => VERSION_PATTERN.test(name))
      .toSorted(compareVersionsDescending);

    for (const version of versions) {
      const directory = await this.getDirectory(version);
      if (selectXcpNgArtifacts(directory).length === 4) {
        return [{
          name: version,
          link: `${DOWNLOAD_BASE_URL}${version}/?https=1`,
        }];
      }
    }

    return [];
  }

  async getFilesAndFolders(version) {
    const directory = await this.getDirectory(version);
    return selectXcpNgArtifacts(directory).map((name) => ({
      name,
      url: `${DOWNLOAD_BASE_URL}${version}/${name}?https=1`,
    }));
  }
}

export default XcpNgProvider;
