import Database from 'better-sqlite3';
import moment from 'moment';
import generator from 'fodselsnummer-generator';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/ssn.db');

const gender = ['m', 'f'];

function getRndDb(db, ssn, gender) {
    try {
        const row = db.prepare(`
            SELECT female, surname 
            FROM (SELECT female FROM females ORDER BY RANDOM() LIMIT 1) 
            JOIN (SELECT surname FROM surnames ORDER BY RANDOM() LIMIT 1)
        `).get();
        
        if (!row) {
            throw new Error('No names found in database');
        }
        
        return {
            ssn,
            gender,
            firstName: row.female,
            surname: row.surname
        };
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

async function generateBulkSSN(count = 12000) {
    const db = new Database(dbPath, { readonly: false });
    db.pragma('journal_mode = WAL');
    
    const results = [];
    
    try {
        for (let i = 1; i < count; i++) {
            const date = moment(new Date(Date.now() - Math.floor(i * 1000 * 24 * 3600))).format('YYYY-MM-DD');
            
            for (const person of gender) {
                const numbers = generator.generate(date, person);
                for (let j = 1; j < numbers.length; j++) {
                    const result = getRndDb(db, numbers[j], person);
                    results.push(result);
                    
                    // Output in CSV format
                    console.log(`${result.ssn},${result.firstName},${result.surname},${result.gender}`);
                }
            }
        }
        
        return results;
    } finally {
        db.close();
    }
}

export default {
    generateBulkSSN
};
