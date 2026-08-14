import Provider from "./Provider.class.js";
import { fetchJson } from "./fetch.js";
import dotenv from "dotenv";

class MirageOSProvider extends Provider {
  constructor({ fetchData = fetchJson } = {}) {
    super("Mirage OS", "mirageos", "https://api.github.com/repos/mirage/mirage/releases");
    this.versionPattern = /^v?\d+\.\d+\.\d+(_beta\d+)?(-rc\d+)?(-\d+)?$/;
    this.fetchData = fetchData;
    dotenv.config();
    this.token = process.env.GITHUB_TOKEN;
  }

  async getVersions() {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const data = [];
    for (let page = 1; ; page += 1) {
      const url = new URL(this.baseURL);
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", page.toString());
      const releases = await this.fetchData(url.href, headers);
      data.push(...releases);
      if (releases.length < 100) break;
    }
    return data
      .map(({ tag_name, html_url }) => ({
        name: tag_name.replace(/^v/, ""),
        link: html_url,
      }))
      .filter(({ name }) => this.isValidVersion(name));
  }

  isValidVersion(text) {
    return this.versionPattern.test(text);
  }

  async getFilesAndFolders(version) {
    console.log("MirageOS : retrieve files and folders for version", version);
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const data = await this.fetchData(`${this.baseURL}/tags/v${version}`, headers);
    const tarballUrl = data.tarball_url;
    return [{ name: `mirage-${version}.tar.gz`, url: tarballUrl }];
  }
}

export default MirageOSProvider;
