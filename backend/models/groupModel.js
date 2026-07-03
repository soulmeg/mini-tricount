const pool = require("../db/client");

const createGroup = async (name) => {
  const result = await pool.query(
    "INSERT INTO groups (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
};

const findGroupById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM groups WHERE id = $1 and deleted_at IS NULL",
    [id]
  );
  return result.rows[0] || null;
};

const findAllGroups = async () => {
  const result = await pool.query(
    "SELECT * FROM groups WHERE deleted_at IS NULL ORDER BY created_at DESC"
  );
  return result.rows;
};
const dropGroupById = async (id) => {
  const result = await pool.query(
    "UPDATE groups SET deleted_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
};
const updateGroupName = async (id, name) => {
  const result = await pool.query(
    "UPDATE groups SET name = $1 WHERE id = $2 RETURNING *",
    [name, id]
  );
  return result.rows[0] || null;
};

module.exports = {
  createGroup,
  findGroupById,
  findAllGroups,
  dropGroupById,
  updateGroupName,
};
