import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = "public/img";
const DOCS_FILE = "docs/images.md";
const THUMBNAIL_SIZE = 320;

async function getAllImageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getAllImageFiles(fullPath);
      } else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(entry.name)) {
        return fullPath;
      }
      return [];
    }),
  );
  return files.flat();
}

async function generateImageDoc() {
  try {
    // Read all files recursively from the images directory
    const imageFiles = await getAllImageFiles(IMAGES_DIR);

    let markdown = "# Images\n\n";
    markdown += "This document lists all available images in the project with their paths and usage examples.\n\n";
    markdown += "## List of images\n\n";

    for (const filePath of imageFiles) {
      const file = path.basename(filePath);
      const relativePath = filePath.replace(/^public\//, "/");

      // Generate thumbnail
      const thumbnailPath = path.join("docs", "thumbnails", file);
      await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

      if (!file.endsWith(".svg")) {
        await sharp(filePath)
          .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFile(thumbnailPath);
      } else {
        // Pour les SVGs, lire le contenu, ajouter les dimensions et sauvegarder
        const svgContent = await fs.readFile(filePath, "utf8");
        const modifiedSvg = svgContent.replace(/<svg/, `<svg width="${THUMBNAIL_SIZE}" height="${THUMBNAIL_SIZE}"`);
        await fs.writeFile(thumbnailPath, modifiedSvg, "utf8");
      }

      // Add image information to markdown
      markdown += [
        `### ${file}\n`,
        `![${file}](thumbnails/${file})\n`,
        "**Path:** `" + relativePath + "`\n",
        "**Usage Examples:**\n",
        "```markdown",
        `![${file}](${relativePath})`,
        "```\n",
        "```markdown",
        `<img src="${relativePath}" alt="${file}" />`,
        "```\n",
      ].join("\n");
    }

    // Write the markdown file
    await fs.writeFile(DOCS_FILE, markdown, "utf8");
    console.log("Image documentation generated successfully!");
  } catch (error) {
    console.error("Error generating image documentation:", error);
  }
}

generateImageDoc();
