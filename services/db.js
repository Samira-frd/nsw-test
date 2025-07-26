// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./stop_orders.db');


// Run once to create table if it doesn't exist with structure below
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stop_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      address TEXT,
      detailLink TEXT UNIQUE
    )
  `);
});

module.exports = db;
