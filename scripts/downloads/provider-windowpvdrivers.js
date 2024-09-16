import Provider from "./Provider.class.js";
import axios from "axios";

class WindowsPVDrivers extends Provider {
  constructor() {
    super("Windows PV Drivers", "windowspvdrivers", "https://xenbits.xenproject.org/pvdrivers/win/");
  }

  async getVersions() {
    return null;
  }

  async getFilesAndFolders() {
    const response = await axios.get(this.baseURL);
    const cheerio = await import("cheerio");
    const $ = cheerio.load(response.data);

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
