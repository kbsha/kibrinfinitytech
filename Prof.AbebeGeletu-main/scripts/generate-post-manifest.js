const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', '_posts');
const OUT_FILE = path.join(POSTS_DIR, 'index.json');

function scanPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('Posts directory not found:', POSTS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}-.+\.md$/i.test(f))
    .map(f => f.replace(/\.md$/i, ''));

  files.sort((a, b) => {
    const da = a.slice(0, 10);
    const db = b.slice(0, 10);
    return db.localeCompare(da);
  });

  return files;
}

function writeManifest(list) {
  const json = JSON.stringify(list, null, 2) + '\n';
  fs.writeFileSync(OUT_FILE, json, 'utf8');
  console.log('Wrote', OUT_FILE, 'with', list.length, 'items');
}

function main() {
  const list = scanPosts();
  writeManifest(list);
}

main();
