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

const convertQuery = (text) => {
  return text
    .replace(/\$\d+/g, "?")
    .replace(/NOW\(\)/gi, "datetime('now')")
    .replace(/RETURNING \*/gi, "");
};

const pool = {
  query: (text, params = []) => {
    try {
      const converted = convertQuery(text);
      const stmt = db.prepare(converted);
      const upper = text.trim().toUpperCase();

      if (upper.startsWith("SELECT")) {
        const rows = stmt.all(params);
        return Promise.resolve({ rows });
      } else {
        const result = stmt.run(params);
        const id = result.lastInsertRowid;

        if (id) {
          // INSERT — récupère la ligne créée
          const table = converted.match(/INTO (\w+)/i)?.[1];
          const row = table
            ? db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id)
            : { id };
          return Promise.resolve({ rows: [row] });
        } else {
          // UPDATE/DELETE — récupère la ligne modifiée via WHERE id = ?
          const idParam = params[params.length - 1];
          const table = converted.match(/UPDATE (\w+)/i)?.[1];
          if (table && idParam) {
            const row = db
              .prepare(`SELECT * FROM ${table} WHERE id = ?`)
              .get(idParam);
            return Promise.resolve({ rows: row ? [row] : [] });
          }
          return Promise.resolve({ rows: [] });
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  },

  connect: () => {
    const client = {
      query: (text, params = []) => {
        try {
          const converted = convertQuery(text);
          const stmt = db.prepare(converted);
          const upper = text.trim().toUpperCase();

          if (upper.startsWith("SELECT")) {
            const rows = stmt.all(params);
            return Promise.resolve({ rows });
          } else {
            const result = stmt.run(params);
            const id = result.lastInsertRowid;

            if (id) {
              // INSERT — récupère la ligne créée
              const table = converted.match(/INTO (\w+)/i)?.[1];
              const row = table
                ? db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id)
                : { id };
              return Promise.resolve({ rows: [row] });
            } else {
              // UPDATE/DELETE — récupère la ligne modifiée via WHERE id = ?
              const idParam = params[params.length - 1];
              const table = converted.match(/UPDATE (\w+)/i)?.[1];
              if (table && idParam) {
                const row = db
                  .prepare(`SELECT * FROM ${table} WHERE id = ?`)
                  .get(idParam);
                return Promise.resolve({ rows: row ? [row] : [] });
              }
              return Promise.resolve({ rows: [] });
            }
          }
        } catch (err) {
          return Promise.reject(err);
        }
      },
      beginTransaction: () => db.prepare("BEGIN").run(),
      commit: () => db.prepare("COMMIT").run(),
      rollback: () => db.prepare("ROLLBACK").run(),
      release: () => {},
    };
    return Promise.resolve(client);
  },
};

module.exports = pool;
