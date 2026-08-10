import assert from "node:assert/strict";
import test from "node:test";
import { generateDownloads } from "../../scripts/downloads/getLinks.js";
import XenProvider from "../../scripts/downloads/provider-xen.js";
import XcpNgProvider, {
  newestInstaller,
  selectXcpNgArtifacts,
} from "../../scripts/downloads/provider-xcpng.js";

const directory = (links) => `<html><body><pre>${links.map((link) => `<a href="${link}">${link}</a>`).join("\n")}</pre></body></html>`;

const xcp83Files = [
  "old/",
  "SHA256SUMS",
  "SHA256SUMS.asc",
  "xcp-ng-8.3.0-20250606-netinstall.iso",
  "xcp-ng-8.3.0-20250606.2.iso",
  "xcp-ng-8.3.0-20250606.iso",
];

test("selects the newest refreshed XCP-ng installer and verification set", () => {
  assert.equal(newestInstaller(xcp83Files), "xcp-ng-8.3.0-20250606.2.iso");
  assert.deepEqual(selectXcpNgArtifacts(directory(xcp83Files)), [
    "xcp-ng-8.3.0-20250606.2.iso",
    "xcp-ng-8.3.0-20250606-netinstall.iso",
    "SHA256SUMS",
    "SHA256SUMS.asc",
  ]);
});

test("discovers the newest stable XCP-ng directory and ignores prerelease-only releases", async () => {
  const pages = new Map([
    ["https://updates.xcp-ng.org/isos/", directory(["old/", "drivers/", "8.3/", "9.0/"])],
    ["https://updates.xcp-ng.org/isos/9.0/", directory([
      "SHA256SUMS",
      "SHA256SUMS.asc",
      "xcp-ng-9.0.0-rc1.iso",
      "xcp-ng-9.0.0-rc1-netinstall.iso",
    ])],
    ["https://updates.xcp-ng.org/isos/8.3/", directory(xcp83Files)],
  ]);
  const provider = new XcpNgProvider({ fetchPage: async (url) => pages.get(url) });

  assert.deepEqual(await provider.getVersions(), [{
    name: "8.3",
    link: "https://mirrors.xcp-ng.org/isos/8.3/?https=1",
  }]);
  assert.deepEqual(await provider.getFilesAndFolders("8.3"), [
    {
      name: "xcp-ng-8.3.0-20250606.2.iso",
      url: "https://mirrors.xcp-ng.org/isos/8.3/xcp-ng-8.3.0-20250606.2.iso?https=1",
    },
    {
      name: "xcp-ng-8.3.0-20250606-netinstall.iso",
      url: "https://mirrors.xcp-ng.org/isos/8.3/xcp-ng-8.3.0-20250606-netinstall.iso?https=1",
    },
    {
      name: "SHA256SUMS",
      url: "https://mirrors.xcp-ng.org/isos/8.3/SHA256SUMS?https=1",
    },
    {
      name: "SHA256SUMS.asc",
      url: "https://mirrors.xcp-ng.org/isos/8.3/SHA256SUMS.asc?https=1",
    },
  ]);
});

test("selective refresh preserves unselected data and removes unregistered providers", async () => {
  const existingXen = { name: "Xen", key: "xen", versions: [{ name: "4.21.1", link: "https://example.com/xen", files: [] }] };
  const existingWindows = { name: "Windows PV Drivers", key: "windowspvdrivers", versions: [] };
  const xcpng = {
    name: "XCP-ng",
    key: "xcpng",
    async getVersions() {
      return [{ name: "8.3", link: "https://example.com/xcpng" }];
    },
    async getFilesAndFolders() {
      return [{ name: "installer.iso", url: "https://example.com/installer.iso" }];
    },
  };

  const output = await generateDownloads({
    registeredProviders: [{ name: "Xen", key: "xen" }, xcpng],
    existingData: [existingXen, existingWindows],
    selectedKeys: ["xcpng"],
  });

  assert.equal(output[0], existingXen);
  assert.deepEqual(output.map(({ key }) => key), ["xen", "xcpng"]);
  assert.equal(output[1].versions[0].name, "8.3");
});

test("provider failure retains existing releases", async () => {
  const existing = [{ name: "8.3", link: "https://example.com/xcpng", files: [] }];
  const provider = {
    name: "XCP-ng",
    key: "xcpng",
    async getVersions() {
      throw new Error("offline");
    },
  };

  const [group] = await generateDownloads({
    registeredProviders: [provider],
    existingData: [{ name: "XCP-ng", key: "xcpng", versions: existing }],
  });
  assert.deepEqual(group.versions, existing);
});

test("XCP-ng refresh replaces artifacts within the current release", async () => {
  const provider = {
    name: "XCP-ng",
    key: "xcpng",
    refreshExistingVersions: true,
    async getVersions() {
      return [{ name: "8.3", link: "https://example.com/8.3" }];
    },
    async getFilesAndFolders() {
      return [{ name: "refreshed.iso", url: "https://example.com/refreshed.iso" }];
    },
  };
  const oldRelease = { name: "8.3", link: "https://example.com/8.3", files: [{ name: "old.iso", url: "https://example.com/old.iso" }] };

  const [group] = await generateDownloads({
    registeredProviders: [provider],
    existingData: [{ name: "XCP-ng", key: "xcpng", versions: [oldRelease] }],
  });
  assert.equal(group.versions.length, 1);
  assert.equal(group.versions[0].files[0].name, "refreshed.iso");
});

test("Xen provider keeps stable and release-candidate parsing behavior", async () => {
  const provider = new XenProvider({
    fetchPage: async () => directory(["../", "4.21.1/", "4.22.0-rc2/", "latest/", "README"]),
  });
  assert.deepEqual(await provider.getVersions(), [
    { name: "4.21.1", link: "https://downloads.xenproject.org/release/xen/4.21.1/" },
    { name: "4.22.0-rc2", link: "https://downloads.xenproject.org/release/xen/4.22.0-rc2/" },
  ]);
});
