const sql = require('sqlite3');
const moment = require('moment');
const math = require('math')
const generator = require('fodselsnummer-generator');
var date = moment(new Date(+(new Date()) - Math.floor(Math.random()*1e+12))).format('YYYY-MM-DD');
var numbers = generator.generate(date, 'f');
var rnd=math.floor(math.random()*numbers.length);
var db = new sql.Database('Names.db', sql.OPEN_READWRITE, (err) => {
    if (err) {
            console.log("Getting error " + err);
            exit(1);
    };
});

db.all(`select female,surname from (select female from females order by random() limit 1) join (select surname from surnames order by random() limit 1);
  `, (err, rows) => {
        rows.forEach(row => {
            console.log(numbers[rnd]+ ', ' + row.female +', '+row.surname);
        });
  });
