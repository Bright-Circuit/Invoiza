import fs from 'fs';
import path from 'path';
import os from 'os';

const baseDir = process.env.DATA_DIR || path.join(os.tmpdir(), 'invoiza_data');

function ensureBaseDir() {
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
}

function getFilePath(filename) {
  ensureBaseDir();
  const filePath = path.join(baseDir, filename);

  // If the file doesn't exist in writable dir but exists in project data, seed it
  const projectFile = path.join(process.cwd(), 'src', 'data', filename);
  if (!fs.existsSync(filePath) && fs.existsSync(projectFile)) {
    try {
      fs.copyFileSync(projectFile, filePath);
    } catch (e) {
      // ignore copy errors; downstream code will handle missing file
    }
  }

  return filePath;
}

export function readJsonFile(filename) {
  const filePath = getFilePath(filename);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function writeJsonFile(filename, data) {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function ensureJsonFile(filename, defaultContent) {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
  }
  return filePath;
}

export default {
  getFilePath,
  readJsonFile,
  writeJsonFile,
  ensureJsonFile,
};
