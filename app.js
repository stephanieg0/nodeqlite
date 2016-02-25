'use strict';

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/Chinook_Sqlite.sqlite');

console.log('# of invoices per country')

db.all(`SELECT COUNT(*) AS count, BillingCountry AS country
       FROM Invoice
       GROUP BY BillingCountry
       ORDER BY count DESC;`, (err, res) => {
  console.log(res);
});
