const pool = require("../db/client");

const computeSettlement = async (groupId) => {
  const participants = await pool.query(
    "SELECT * FROM participants WHERE group_id = $1 AND deleted_at IS NULL",
    [groupId]
  );

  if (participants.rows.length === 0) {
    return { balances: [], transactions: [] };
  }

  const shares = await pool.query(
    `SELECT es.participant_id, es.share_amount, e.paid_by
     FROM expense_shares es
     JOIN expenses e ON es.expense_id = e.id
     WHERE e.group_id = $1`,
    [groupId]
  );

  // Solde net par participant
  const balances = {};
  participants.rows.forEach((p) => {
    balances[p.id] = { name: p.name, balance: 0 };
  });

  shares.rows.forEach(({ participant_id, share_amount, paid_by }) => {
    balances[paid_by].balance += parseFloat(share_amount);
    balances[participant_id].balance -= parseFloat(share_amount);
  });

  // Algo greedy : minimum de virements
  const creditors = [];
  const debtors = [];

  Object.values(balances).forEach(({ name, balance }) => {
    if (balance > 0.01) creditors.push({ name, amount: balance });
    if (balance < -0.01) debtors.push({ name, amount: -balance });
  });

  const transactions = [];

  while (creditors.length > 0 && debtors.length > 0) {
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const creditor = creditors[0];
    const debtor = debtors[0];
    const amount = Math.min(creditor.amount, debtor.amount);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: parseFloat(amount.toFixed(2)),
    });

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) creditors.shift();
    if (debtor.amount < 0.01) debtors.shift();
  }

  return { balances: Object.values(balances), transactions };
};

module.exports = { computeSettlement };
