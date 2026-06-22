import Provider from "./Provider.class.js";
import { fetchText } from "./fetch.js";
import * as cheerio from "cheerio";

class XenProvider extends Provider {
  constructor() {
    super("Xen", "xen", "https://downloads.xenproject.org/release/xen/");
    this.versionPattern = /^\d+\.\d+\.\d+(-rc\d+)?(-\d+)?$/;
  }

  async getVersions() {
    const data = await fetchText(this.baseURL);
    const $ = cheerio.load(data);

    return $("a")
      .map((_, element) => ({
        name: $(element).text().trim().replace(/\//g, ""),
        link: new URL($(element).attr("href"), this.baseURL).href,
      }))
      .get()
      .filter((item) => this.versionPattern.test(item.name));
  }

  async getFilesAndFolders(version) {
    const url = `${this.baseURL}${version}`;
    console.log("Xen : retrieve files and folders for version", version);
    const data = await fetchText(url);
    const $ = cheerio.load(data);

    const items = [];
    let parentDirReached = false;

    $("a").each((_, element) => {
      const text = $(element).text().trim();
      if (text === "Parent Directory") {
        parentDirReached = true;
      } else if (parentDirReached) {
        items.push({ name: text, url: `${url}/${text.replace(/^\//, "")}` });
      }
    });

    return items;
  }
}

export default XenProvider;
