'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const db = new sqlite3.Database('./db/Chinook_Sqlite.sqlite');

const PORT = process.env.PORT || 3000;

console.log('# of invoices per country');

app.get('/sales-per-year', (req, res) => {
// How many Invoices were there in 2009 and 2011? What are the respective total sales for each of those years?
//url to test:  http://localhost:3000/sales-per-year?filter[year]=2009,2011
let having = '';

  if (req.query.filter) {
    having = 'HAVING';

    const filterYears = req.query.filter.year.split(',').map(y => +y);

    filterYears.forEach(y => {
      having += ` year = "${y}" OR`;
    });

    having = having.substring(0, having.length - 3);
  }

  db.all(`
    SELECT count(*) as invoices,
           sum(Total) as total,
           strftime('%Y', InvoiceDate) as year
    FROM   Invoice
    GROUP BY year
    ${having}`,
    (err, data) => {
        if (err) throw err;

        const roundedData = data.map(function (obj) {
          return {
            invoices: obj.invoices,
            year: +obj.year,
            total: +obj.total.toFixed(2)
          }
        });

        res.send({
          data: roundedData,
          info: '# of invoices and sales per year'
        });
      }
    );
});

app.get('/invoices-per-country', (req, res) => {
  db.all(`
    SELECT COUNT(*) AS count, BillingCountry AS country
    FROM Invoice
    GROUP BY BillingCountry
    ORDER BY count DESC;`,
    (err, data) => {
      if (err) throw err;

       res.send({
         data: data,
         info: '# of invoices per country'
       });
  });
});

app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
});
