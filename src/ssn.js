import sqlite3 from 'sqlite3';
import moment from 'moment';
import generator from 'fodselsnummer-generator';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/names.db');

const date = moment(new Date(Date.now() - Math.floor(Math.random()*1e+12))).format('YYYY-MM-DD');
const numbers = generator.generate(date, 'f');
const rnd = Math.floor(Math.random() * numbers.length);

function generateSSN() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(err);
                return;
            }
            
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
                    resolve(`${numbers[rnd]}, ${rows[0].female}, ${rows[0].surname}`);
                } else {
                    reject(new Error('No names found in database'));
                }
                db.close();
            });
        });
    });
}

export default {
    generateSSN
};
