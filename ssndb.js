const Database = require('better-sqlite3');
const generator = require('fodselsnummer-generator');

const DAYS = Number(process.env.SSN_DAYS) || 12000;
const DAY_MS = 24 * 3600 * 1000;
const genders = ['m', 'f'];

function loadColumn(db, table, column) {
    return db.prepare(`select ${column} from ${table}`).pluck().all();
}

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// fodselsnummer-generator 1.0.0 mislabels and skips numbers for 'f'; generate all and filter on digit 9 (odd = male).
function sexOf(ssn) {
    return Number(ssn[8]) % 2 === 1 ? 'm' : 'f';
}

function ssn() {
    let db;
    try {
        db = new Database('ssn.db', { readonly: true, fileMustExist: true });
    } catch (err) {
        console.error('Getting error ' + err);
        process.exit(1);
    }

    const firstNames = {
        m: loadColumn(db, 'males', 'male'),
        f: loadColumn(db, 'females', 'female'),
    };
    const surnames = loadColumn(db, 'surnames', 'surname');
    db.close();

    const now = Date.now();
    for (let i = 1; i < DAYS; i++) {
        const date = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
        for (const sex of genders) {
            const numbers = generator.generate(date).filter((n) => sexOf(n) === sex);
            for (const number of numbers) {
                console.log(number + ',' + sex + ',' + pick(firstNames[sex]) + ',' + pick(surnames));
            }
        }
    }
}

ssn();
