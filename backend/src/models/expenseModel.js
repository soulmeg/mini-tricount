const pool = require("../db/client");

const createExpense = async ({
  groupId,
  paid_by,
  amount,
  label,
  participant_ids,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const expenseResult = await client.query(
      "INSERT INTO expenses (group_id, paid_by, amount, label) VALUES ($1, $2, $3, $4) RETURNING *",
      [groupId, paid_by, amount, label]
    );
    const expense = expenseResult.rows[0];

    const shareAmount = (amount / participant_ids.length).toFixed(2);
    for (const participantId of participant_ids) {
      await client.query(
        "INSERT INTO expense_shares (expense_id, participant_id, share_amount) VALUES ($1, $2, $3)",
        [expense.id, participantId, shareAmount]
      );
    }

    await client.query("COMMIT");
    return expense;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const findExpensesByGroup = async (groupId) => {
  const expenses = await pool.query(
    `SELECT e.*, p.name AS paid_by_name
     FROM expenses e
     JOIN participants p ON e.paid_by = p.id
     WHERE e.group_id = $1
     ORDER BY e.created_at DESC`,
    [groupId]
  );

  // Pour chaque dépense, on récupère les participants concernés
  const expensesWithShares = await Promise.all(
    expenses.rows.map(async (expense) => {
      const shares = await pool.query(
        `SELECT p.name, es.share_amount
         FROM expense_shares es
         JOIN participants p ON es.participant_id = p.id
         WHERE es.expense_id = $1`,
        [expense.id]
      );
      return { ...expense, shares: shares.rows };
    })
  );

  return expensesWithShares;
};

const updateExpense = async ({
  expenseId,
  groupId,
  paid_by,
  amount,
  label,
  participant_ids,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE expenses SET paid_by = $1, amount = $2, label = $3 WHERE id = $4 AND group_id = $5",
      [paid_by, amount, label, expenseId, groupId]
    );

    // On supprime les anciennes parts et on recalcule
    await client.query("DELETE FROM expense_shares WHERE expense_id = $1", [
      expenseId,
    ]);

    const shareAmount = (amount / participant_ids.length).toFixed(2);
    for (const participantId of participant_ids) {
      await client.query(
        "INSERT INTO expense_shares (expense_id, participant_id, share_amount) VALUES ($1, $2, $3)",
        [expenseId, participantId, shareAmount]
      );
    }

    await client.query("COMMIT");

    const result = await client.query(
      `SELECT e.*, p.name AS paid_by_name
       FROM expenses e
       JOIN participants p ON e.paid_by = p.id
       WHERE e.id = $1`,
      [expenseId]
    );
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const deleteExpense = async (expenseId, groupId) => {
  const result = await pool.query(
    "DELETE FROM expenses WHERE id = $1 AND group_id = $2 RETURNING *",
    [expenseId, groupId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createExpense,
  findExpensesByGroup,
  updateExpense,
  deleteExpense,
};
