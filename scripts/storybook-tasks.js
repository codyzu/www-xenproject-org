import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// eslint-disable-next-line no-undef
const contextFolder = process.cwd();
const storyTasksFolder = path.join("./scripts/storytasks");
const fileNames = fs.readdirSync(storyTasksFolder);

fileNames.forEach(async (fileName) => {
  const filePath = path.join(storyTasksFolder, fileName);
  const fileProcess = spawn("node", [filePath], { cwd: contextFolder });

  fileProcess.stdout.on("data", (data) => {
    console.log(`${fileName} stdout: ${data}`);
  });

  fileProcess.stderr.on("data", (data) => {
    console.error(`${fileName} stderr: ${data}`);
  });

  fileProcess.on("close", (code) => {
    if (code === 0) console.log(`${fileName} processed`);
    else console.error(`${fileName} exited with code ${code}`);
  });
});
