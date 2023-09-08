const sql = require('sqlite3');
var db = new sql.Database('Names.db', sql.OPEN_READWRITE, (err) => {
    if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    runQueries(db);
});


function runQueries(db) {
    db.all(`
select female,surname from (select female from females order by random() limit 1) join (select surname from surnames order by random() limit 1);
    `, (err, rows) => {
        rows.forEach(row => {
            console.log(row.female +', '+row.surname);
        });
    });
}

