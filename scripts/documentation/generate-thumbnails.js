import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the correct path in ES modules mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateThumbnails() {
  const imagesDir = path.join(process.cwd(), "docs/images");

  try {
    // Read all files in the directory
    const files = await fs.readdir(imagesDir);

    // Filter to keep only images that are not already thumbnails
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext) && !file.includes("-thumb.");
    });

    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(imagesDir, file);
      const ext = path.extname(file);
      const basename = path.basename(file, ext);
      const outputPath = path.join(imagesDir, `${basename}-thumb${ext}`);

      // Check if thumbnail already exists
      try {
        await fs.access(outputPath);
        console.log(`Thumbnail already exists for ${file}`);
        continue;
      } catch {
        // Thumbnail doesn't exist, create it
        await sharp(inputPath)
          .resize({
            height: 320,
            fit: "contain",
            withoutEnlargement: true,
          })
          .toFile(outputPath);

        console.log(`Thumbnail created for ${file}`);
      }
    }
  } catch (error) {
    console.error("Error generating thumbnails:", error);
    process.exit(1);
  }
}

// Direct call of the async function
generateThumbnails();
