const fs = require('fs');
const path = require('path');

const MAPPING_FILE = path.join(__dirname, '../../public/images/image-mapping.json');
const SRC_DIR = path.join(__dirname, '../');

/**
 * Update image paths in source files
 */
function updateImagePaths() {
  try {
    // Check if mapping file exists
    if (!fs.existsSync(MAPPING_FILE)) {
      console.error('Mapping file not found. Please run optimize-images script first.');
      process.exit(1);
    }

    const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
    console.log('Loaded image mapping:', Object.keys(mapping).length, 'images');

    // Find all JSX files
    const jsxFiles = findFiles(SRC_DIR, ['.jsx', '.js']);
    console.log(`Found ${jsxFiles.length} JSX/JS files to scan.`);

    let totalUpdates = 0;

    jsxFiles.forEach((file) => {
      let content = fs.readFileSync(file, 'utf-8');
      let updated = false;

      Object.entries(mapping).forEach(([oldName, newName]) => {
        const oldPath = `/images/${oldName}`;
        const newPath = `/images/${newName}`;

        if (content.includes(oldPath)) {
          content = content.replace(new RegExp(oldPath, 'g'), newPath);
          updated = true;
          totalUpdates++;
        }
      });

      if (updated) {
        fs.writeFileSync(file, content);
        console.log(`✓ Updated: ${path.relative(SRC_DIR, file)}`);
      }
    });

    console.log(`\n✓ Update complete! ${totalUpdates} image paths updated.`);

    // Generate manifest
    generateManifest(mapping);
  } catch (error) {
    console.error('Error updating image paths:', error);
    process.exit(1);
  }
}

/**
 * Find files recursively
 */
function findFiles(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (!file.startsWith('.') && file !== 'node_modules') {
        findFiles(filePath, extensions, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Generate image manifest
 */
function generateManifest(mapping) {
  const manifestPath = path.join(__dirname, '../../public/images/manifest.json');
  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    images: Object.entries(mapping).map(([original, optimized]) => ({
      original,
      optimized,
      path: `/images/${optimized}`,
    })),
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Manifest generated: ${manifestPath}`);
}

// Run update
updateImagePaths();
