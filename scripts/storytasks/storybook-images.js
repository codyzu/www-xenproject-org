import fs from "fs";
import path from "path";
import storyScriptConfig from "../storyscripts.config.js";

const { storyDestJsonFolder } = storyScriptConfig;
const rootDir = "static/img";
const imageGroupsFilePath = "images.json";
const fileExportPath = `${storyDestJsonFolder}/${imageGroupsFilePath}`;
const filesExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"];
function getImagesFromDirectory(dir) {
  let results = {};
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = {
        ...results,
        ...getImagesFromDirectory(filePath),
      };
    } else if (filesExtensions.includes(path.extname(file).toLowerCase())) {
      const relativePath = path.relative(rootDir, filePath);
      if (!results[path.dirname(relativePath)]) {
        results[path.dirname(relativePath)] = [];
      }
      results[path.dirname(relativePath)].push({
        name: file,
        path: "/" + relativePath.replace(/\\/g, "/"),
      });
    }
  });

  return results;
}

const imageGroups = getImagesFromDirectory(rootDir);
fs.writeFileSync(fileExportPath, JSON.stringify(imageGroups, null, 2));
console.log("JSON file has been saved.");
