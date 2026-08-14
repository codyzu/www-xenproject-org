// Base class for a provider
class Provider {
  constructor(name, key, baseURL) {
    this.name = name;
    this.key = key;
    this.baseURL = baseURL;
    this.includeFiles = false;
  }

  async getVersions() {
    throw new Error("This method should be implemented by subclasses");
  }

  async getFilesAndFolders(version) {
    throw new Error("This method should be implemented by subclasses");
  }
}

export default Provider;
