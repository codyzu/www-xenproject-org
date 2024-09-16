import fs from "fs";
import * as sass from "sass";
import storyScriptConfig from "../storyscripts.config.js";


const main = async () => {
  const { colorVariablesFilePath, storyDestJsonFolder } = storyScriptConfig;
  const filePath = colorVariablesFilePath;
  const fileExportPath = `${storyDestJsonFolder}/colors.json`;

  const result = await sass.compile(filePath);
  const css = result.css.toString();

  // get all

  const json = getColors(css);
  try {
    fs.mkdirSync(storyDestJsonFolder, { recursive: true });
  } catch (e) {
    console.error(e);
  }
  fs.writeFileSync(fileExportPath, JSON.stringify(json, null, 2));
};

const groups = ["action", "brand"];

const getColors = (css) => {
  const regex = /--color-(.+?)\s*:\s*(#.+);/g;
  let match;
  const colors = [];

  while ((match = regex.exec(css)) !== null) {
    const [, colorName, value] = match;
    const variableName = match[0].split(":")[0].trim();
    const split = colorName.split("-");
    let group;
    if (groups.includes(split[0])) {
      group = split[0];
      split.splice(0, 1);
    } else {
      group = "default";
    }

    colors.push({
      group,
      name: colorName,
      variableName,
      value,
    });
  }

  // sort colors by group
  const colorGroups = {};
  colors.forEach((color) => {
    if (!colorGroups[color.group]) colorGroups[color.group] = [];
    colorGroups[color.group].push(color);
  });

  const groupsAsArray = Object.keys(colorGroups).map((key) => ({
    name: key,
    colors: colorGroups[key],
  }));

  // sort groups by name, default first

  groupsAsArray.sort((a, b) => {
    if (a.name === "default") return -1;
    if (b.name === "default") return 1;
    return a.name.localeCompare(b.name);
  });

  return groupsAsArray;
};
main();
