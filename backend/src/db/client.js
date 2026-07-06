// const { Pool } = require("pg");
// require("dotenv").config({
//   path: require("path").resolve(__dirname, "../../.env"),
// });

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// module.exports = pool;

const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.resolve(__dirname, "../../tricount.db"));

db.pragma("foreign_keys = ON");

const pool = {
  query: (text, params = []) => {
    try {
      const stmt = db.prepare(text);
      if (text.trim().toUpperCase().startsWith("SELECT")) {
        const rows = stmt.all(...params);
        return Promise.resolve({ rows });
      } else {
        const result = stmt.run(...params);
        return Promise.resolve({
          rows: result.lastInsertRowid
            ? [{ id: result.lastInsertRowid }]
            : [],
        });
      }
    } catch (err) {
      return Promise.reject(err);
    }
  },
  connect: () => {
    return Promise.resolve({
      query: (text, params = []) => {
        try {
          const stmt = db.prepare(text);
          if (text.trim().toUpperCase().startsWith("SELECT")) {
            const rows = stmt.all(...params);
            return Promise.resolve({ rows });
          } else {
            const result = stmt.run(...params);
            return Promise.resolve({
              rows: result.lastInsertRowid
                ? [{ id: result.lastInsertRowid }]
                : [],
            });
          }
        } catch (err) {
          return Promise.reject(err);
        }
      },
      release: () => {},
    });
  },
};

module.exports = pool;