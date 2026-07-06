const {
  createGroup,
  findGroupById,
  findAllGroups,
  dropGroupById,
  updateGroupName,
} = require("../models/groupModel");

const create = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: "Le nom du groupe est requis" });
  }
  const group = await createGroup(name.trim());
  res.status(201).json(group);
};

const getById = async (req, res) => {
  const group = await findGroupById(req.params.id);
  if (!group) return res.status(404).json({ error: "Groupe introuvable" });
  res.json(group);
};

const getAll = async (req, res) => {
  const groups = await findAllGroups();
  res.json(groups);
};

const deleteGroupById = async (req, res) => {
  const group = await dropGroupById(req.params.id);
  if (!group) return res.status(404).json({ error: "Groupe introuvable" });
  res.json(group);
};

const updateName = async (req, res) => {
  const { name } = req.body;
  const group = await updateGroupName(req.params.id, name);
  if (!group) return res.status(404).json({ error: "Groupe introuvable" });
  res.json(group);
};

module.exports = { create, getById, getAll, deleteGroupById, updateName };
