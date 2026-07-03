const pool = require("../db/client");

const createParticipant = async (groupId, name) => {
  const result = await pool.query(
    "INSERT INTO participants (group_id, name) VALUES ($1, $2) RETURNING *",
    [groupId, name]
  );
  return result.rows[0];
};

const findParticipantsByGroup = async (groupId) => {
  const result = await pool.query(
    "SELECT * FROM participants WHERE group_id = $1 AND deleted_at IS NULL",
    [groupId]
  );
  return result.rows;
};

const findParticipantById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM participants WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  return result.rows[0] || null;
};

const deleteParticipantById = async (id) => {
  const result = await pool.query(
    "UPDATE participants SET deleted_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
};
const updateParticipantName = async (id, name) => {
  const result = await pool.query(
    "UPDATE participants SET name = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *",
    [name, id]
  );
  return result.rows[0] || null;
};

const findAllParticipants = async () => {
  const result = await pool.query(
    "SELECT * FROM participants WHERE deleted_at IS NULL"
  );
  return result.rows;
};

const updateParticipantGroup = async (id, groupId) => {
  const result = await pool.query(
    "UPDATE participants SET group_id = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *",
    [groupId, id]
  );
  return result.rows[0] || null;
};

module.exports = {
  createParticipant,
  findParticipantsByGroup,
  findParticipantById,
  deleteParticipantById,
  updateParticipantName,
  updateParticipantGroup,
  findAllParticipants,
};
