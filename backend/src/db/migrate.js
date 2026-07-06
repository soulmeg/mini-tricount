const pool = require("./client");

const migrate = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        paid_by INTEGER REFERENCES participants(id) ON DELETE CASCADE,
        amount NUMERIC(10,2) NOT NULL,
        label VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expense_shares (
        id SERIAL PRIMARY KEY,
        expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
        participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
        share_amount NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP
    );
  `);

  console.log("Tables créées avec succès");
  await pool.end();
};

migrate().catch(console.error);
