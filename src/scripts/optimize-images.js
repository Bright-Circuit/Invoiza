const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../../public/images/src');
const OUTPUT_DIR = path.join(__dirname, '../../public/images');

/**
 * Optimize images and convert to WebP
 */
async function optimizeImages() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Check if input directory exists
    if (!fs.existsSync(INPUT_DIR)) {
      console.log('Input directory not found. Creating it...');
      fs.mkdirSync(INPUT_DIR, { recursive: true });
      console.log(`Please place your images in: ${INPUT_DIR}`);
      return;
    }

    console.log('Starting image optimization...');

    // Get all files from input directory
    const files = fs.readdirSync(INPUT_DIR);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('No images found to optimize.');
      return;
    }

    console.log(`Found ${imageFiles.length} images to optimize.`);

    const results = [];

    for (const file of imageFiles) {
      const inputPath = path.join(INPUT_DIR, file);
      const outputFileName = path.parse(file).name + '.webp';
      const outputPath = path.join(OUTPUT_DIR, outputFileName);

      try {
        const stats = fs.statSync(inputPath);
        const originalSize = stats.size;

        // Optimize and convert to WebP
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath);

        const newStats = fs.statSync(outputPath);
        const newSize = newStats.size;
        const savings = ((originalSize - newSize) / originalSize) * 100;

        results.push({
          file,
          originalSize: (originalSize / 1024).toFixed(2) + ' KB',
          newSize: (newSize / 1024).toFixed(2) + ' KB',
          savings: savings.toFixed(2) + '%',
        });

        console.log(`✓ Optimized: ${file} -> ${outputFileName}`);
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
      }
    }

    console.log('\n--- Optimization Summary ---');
    console.table(results);

    // Save mapping file
    const mappingPath = path.join(OUTPUT_DIR, 'image-mapping.json');
    const mapping = {};
    imageFiles.forEach((file) => {
      const outputFileName = path.parse(file).name + '.webp';
      mapping[file] = outputFileName;
    });
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`\nMapping file saved to: ${mappingPath}`);

    console.log('\n✓ Image optimization complete!');
  } catch (error) {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeImages();
