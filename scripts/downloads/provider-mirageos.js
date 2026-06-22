import Provider from "./Provider.class.js";
import axios from "axios";
import dotenv from "dotenv";

class MirageOSProvider extends Provider {
  constructor() {
    super("Mirage OS", "mirageos", "https://api.github.com/repos/mirage/mirage/releases");
    this.versionPattern = /^v?\d+\.\d+\.\d+(_beta\d+)?(-rc\d+)?(-\d+)?$/;
    dotenv.config();
    this.token = process.env.GITHUB_TOKEN;
  }

  async getVersions() {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const { data } = await axios.get(this.baseURL, {
      headers,
    });
    return data.map(({ tag_name, html_url }) => ({
      name: tag_name.replace(/^v/, ""),
      link: html_url,
    }));
  }

  isValidVersion(text) {
    return this.versionPattern.test(text);
  }

  async getFilesAndFolders(version) {
    console.log("MirageOS : retrieve files and folders for version", version);
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const { data } = await axios.get(`${this.baseURL}/tags/v${version}`, {
      headers,
    });
    const tarballUrl = data.tarball_url;
    return [{ name: `mirage-${version}.tar.gz`, url: tarballUrl }];
  }
}

export default MirageOSProvider;
