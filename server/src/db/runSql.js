// Runs every .sql file inside src/db/<folder> (migrations|seeds) in filename order.
// Usage: node src/db/runSql.js migrations
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const folder = process.argv[2];

if (!folder || !['migrations', 'seeds'].includes(folder)) {
  console.error('Usage: node src/db/runSql.js <migrations|seeds>');
  process.exit(1);
}

const dir = path.join(__dirname, folder);
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

const run = async () => {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`Running ${folder}/${file} ...`);
    await pool.query(sql);
  }
  console.log(`Done. Executed ${files.length} file(s) in ${folder}/`);
  await pool.end();
};

run().catch((err) => {
  console.error('Failed to run SQL:', err.message);
  process.exit(1);
});
