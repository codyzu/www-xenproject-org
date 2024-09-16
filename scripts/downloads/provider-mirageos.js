import Provider from "./Provider.class.js";
import axios from "axios";

class MirageOSProvider extends Provider {
  constructor() {
    super("Mirage OS", "mirageos", "https://api.github.com/repos/mirage/mirage/releases");
    this.versionPattern = /^v?\d+\.\d+\.\d+(_beta\d+)?(-rc\d+)?(-\d+)?$/;
    this.token = "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";
  }

  async getVersions() {
    const { data } = await axios.get(this.baseURL, {
      headers: {
        Authorization: `token ${this.token}`,
      },
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
    const { data } = await axios.get(`${this.baseURL}/tags/v${version}`, {
      headers: {
        Authorization: `token ${this.token}`,
      },
    });
    const tarballUrl = data.tarball_url;
    const { data: tarballData } = await axios.get(tarballUrl, {
      headers: {
        Authorization: `token ${this.token}`,
      },
      responseType: "arraybuffer",
    });

    // Process the tarball data to extract files and folders
    // This part depends on how you want to handle the tarball content
    // For now, we'll return a placeholder object
    return [{ name: `mirage-${version}.tar.gz`, url: tarballUrl }];
  }
}

export default MirageOSProvider;
