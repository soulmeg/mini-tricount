const {
  createExpense,
  findExpensesByGroup,
  updateExpense,
  deleteExpense,
} = require("../models/expenseModel");

const add = async (req, res) => {
  const { groupId } = req.params;
  const { paid_by, amount, label, participant_ids } = req.body;

  if (!paid_by || !amount || !label?.trim() || !participant_ids?.length) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  if (amount <= 0) {
    return res.status(400).json({ error: "Le montant doit être positif" });
  }

  const expense = await createExpense({
    groupId,
    paid_by,
    amount,
    label: label.trim(),
    participant_ids,
  });
  res.status(201).json(expense);
};

const getByGroup = async (req, res) => {
  const expenses = await findExpensesByGroup(req.params.groupId);
  res.json(expenses);
};

const update = async (req, res) => {
  const { groupId, expenseId } = req.params;
  const { paid_by, amount, label, participant_ids } = req.body;

  if (!paid_by || !amount || !label?.trim() || !participant_ids?.length) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  if (amount <= 0) {
    return res.status(400).json({ error: "Le montant doit être positif" });
  }

  const expense = await updateExpense({
    expenseId,
    groupId,
    paid_by,
    amount,
    label: label.trim(),
    participant_ids,
  });
  res.json(expense);
};

const remove = async (req, res) => {
  const { groupId, expenseId } = req.params;
  const deleted = await deleteExpense(expenseId, groupId);
  if (!deleted) return res.status(404).json({ error: "Dépense introuvable" });
  res.json({ message: "Dépense supprimée" });
};

module.exports = { add, getByGroup, update, remove };
