const Database = require('better-sqlite3');

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

console.log(row.female + ', ' + row.surname);
db.close();
