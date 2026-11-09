const Database = require('better-sqlite3');
const generator = require('fodselsnummer-generator');

const date = new Date(Date.now() - Math.floor(Math.random() * 1e12)).toISOString().slice(0, 10);
// fodselsnummer-generator 1.0.0 returns odd (male) numbers for 'f'; digit 9 odd = male.
const numbers = generator.generate(date, 'f').filter((n) => Number(n[8]) % 2 === 0);
const rnd = Math.floor(Math.random() * numbers.length);

let db;
try {
    db = new Database('names.db', { readonly: true, fileMustExist: true });
} catch (err) {
    console.error('Getting error ' + err);
    process.exit(1);
}

const row = db.prepare(`
select female, surname
from (select female from females order by random() limit 1)
join (select surname from surnames order by random() limit 1);
`).get();

console.log(numbers[rnd] + ', ' + row.female + ', ' + row.surname);
db.close();
