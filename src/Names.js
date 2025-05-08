import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/names.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Getting error:", err);
        process.exit(1);
    }
});

function generateName() {
    return new Promise((resolve, reject) => {
        db.all(`
            select female, surname 
            from (select female from females order by random() limit 1) 
            join (select surname from surnames order by random() limit 1)
        `, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length > 0) {
                resolve(`${rows[0].female}, ${rows[0].surname}`);
            } else {
                reject(new Error('No names found in database'));
            }
        });
    });
}

export default {
    generateName
};

