const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const _7z = require("7zip-min");

const imageFolder = "backstop_data/bitmaps_reference";
const reportFolder = "report";

if (!fs.existsSync(reportFolder)) {
  fs.mkdirSync(reportFolder);
}

function processAndConvertFile(fileName) {
  const fullPath = path.join(imageFolder, fileName);
  const ext = path.extname(fileName);

  if (ext.toLowerCase() === ".png") {
    let newName = path
      .basename(fileName, ext)
      .replace("_0_document_0_desktop", "_desktop")
      .replace("_0__0_desktop", "_desktop")
      .replace("_0_document_0_phone", "_phone")
      .replace("_0__0_phone", "_phone")
      .replace(/_/g, " ");

    newName += ".webp";

    const newPath = path.join(reportFolder, newName);

    return sharp(fullPath)
      .webp({
        quality: 70,
        lossless: false,
        nearLossless: false,
        reductionEffort: 10,
        smartSubsample: true,
      })
      .toFile(newPath)
      .then(() => {
        console.log(`${fileName} converted to WebP: ${newPath}`);
        return newName;
      })
      .catch((err) => {
        console.error(`Error converting ${fileName} to WebP:`, err);
        const jpgName = path.basename(newName, ".webp") + ".jpg";
        const jpgPath = path.join(reportFolder, jpgName);
        return sharp(fullPath)
          .jpeg({ quality: 75 })
          .toFile(jpgPath)
          .then(() => {
            console.log(`${fileName} converted to JPG: ${jpgPath}`);
            return jpgName;
          })
          .catch((jpgErr) => {
            console.error(`Error converting ${fileName} to JPG:`, jpgErr);
            return null;
          });
      });
  }
  return Promise.resolve(null);
}

function compressFolder() {
  const archiveName = "report.7z";
  const params = ["a", "-t7z", "-m0=lzma2", "-mx=9", "-mfb=64", "-md=32m", "-ms=on", archiveName, reportFolder];

  _7z.cmd(params, (err) => {
    if (err) {
      console.error("Error during compression:", err);
    } else {
      console.log(`Compression completed: ${archiveName}`);
    }
  });
}

function generateDifferentialReport(oldFiles, newFiles) {
  const added = newFiles.filter((file) => !oldFiles.includes(file));
  const removed = oldFiles.filter((file) => !newFiles.includes(file));
  const unchanged = oldFiles.filter((file) => newFiles.includes(file));

  console.log("\nDifferential Report:");
  console.log("Added files:", added);
  console.log("Removed files:", removed);
  console.log("Unchanged files:", unchanged);

  const report = `
Differential Report:

Added files:
${added.join("\n")}

Removed files:
${removed.join("\n")}

Unchanged files:
${unchanged.join("\n")}
  `;

  fs.writeFileSync(path.join(reportFolder, "differential_report.txt"), report);
  console.log("Differential report written to differential_report.txt");
}

fs.readdir(imageFolder, (err, oldFiles) => {
  if (err) {
    console.error("Error reading source folder:", err);
    return;
  }

  Promise.all(oldFiles.map(processAndConvertFile)).then((processedFiles) => {
    processedFiles = processedFiles.filter((name) => name !== null);
    console.log("\nFiles processed and converted to WebP:");
    processedFiles.forEach((name) => console.log(name));

    fs.readdir(reportFolder, (err, newFiles) => {
      if (err) {
        console.error("Error reading report folder:", err);
        return;
      }

      // Filter out the differential_report.txt file
      const filteredNewFiles = newFiles.filter((file) => file !== "differential_report.txt");

      generateDifferentialReport(
        oldFiles.map((file) => path.basename(file, path.extname(file))),
        filteredNewFiles.map((file) => path.basename(file, path.extname(file))),
      );

      compressFolder();
    });
  });
});
