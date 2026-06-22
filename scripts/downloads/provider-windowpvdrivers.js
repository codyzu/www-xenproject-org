import Provider from "./Provider.class.js";
import { fetchText } from "./fetch.js";

class WindowsPVDrivers extends Provider {
  constructor() {
    super("Windows PV Drivers", "windowspvdrivers", "https://xenbits.xenproject.org/pvdrivers/win/");
  }

  async getVersions() {
    return null;
  }

  async getFilesAndFolders() {
    const data = await fetchText(this.baseURL);
    const cheerio = await import("cheerio");
    const $ = cheerio.load(data);

    const items = [];
    $("a").each((_, element) => {
      const text = $(element).text().trim();
      if (text === "Parent Directory") {
        items.length = 0;
      } else if (items.length > 0 || text !== "Parent Directory") {
        items.push({
          name: text,
          url: `${this.baseURL}${text}`,
        });
      }
    });

    return items;
  }
}

export default WindowsPVDrivers;
