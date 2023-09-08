const sql = require('better-sqlite3')
const moment = require('moment')
const math = require('math')
const generator = require('fodselsnummer-generator')
var date
var numbers
var row
const gender = [ 'm', 'f']

function ssn() {

    const db = require('better-sqlite3')('ssn.db', sql.OPEN_READWRITE);
    db.pragma('journal_mode = WAL');
    for (i=1; i< 12000; i++) {
      date = moment(new Date(+(new Date()) - Math.floor(i*1000*24*3600))).format('YYYY-MM-DD');
      //console.log(i, date);
      for ( const person of gender) {
        numbers = generator.generate(date, person);
        for (j=1; j<numbers.length; j++) {
          row = getRndDb(db, numbers[j],person);
        }
      }
    }
}
function getRndDb(db, ssn, sex){

    if (sex=='f') {
        const row = db.prepare("select female,surname from (select female from females order by random() limit 1) join     (select surname from surnames order by random() limit 1);").get();
        console.log(ssn + ',' + sex + ',' + row.female + ',' + row.surname);
    } else {
        const row = db.prepare("select male, surname from (select male from males order by random() limit 1) join (select surname from surnames order by random() limit 1);").get();
        console.log(ssn + ',' + sex + ',' + row.male + ',' + row.surname);
    }
}

ssn();
