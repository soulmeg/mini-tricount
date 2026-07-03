const {
  createParticipant,
  findParticipantsByGroup,
  findParticipantById,
  deleteParticipantById,
  updateParticipantName,
  updateParticipantGroup,
  findAllParticipants,
} = require("../models/participantModel");
const { findGroupById } = require("../models/groupModel");

const add = async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: "Le nom du participant est requis" });
  }
  const group = await findGroupById(groupId);
  if (!group) return res.status(404).json({ error: "Groupe introuvable" });

  const participant = await createParticipant(groupId, name.trim());
  res.status(201).json(participant);
};

const getByGroup = async (req, res) => {
  const participants = await findParticipantsByGroup(req.params.groupId);
  res.json(participants);
};

const getById = async (req, res) => {
  const participant = await findParticipantById(req.params.id);
  if (!participant)
    return res.status(404).json({ error: "Participant introuvable" });
  res.json(participant);
};

const remove = async (req, res) => {
  const participant = await deleteParticipantById(req.params.id);
  if (!participant)
    return res.status(404).json({ error: "Participant introuvable" });
  res.json(participant);
};

const updateName = async (req, res) => {
  const { name } = req.body;
  const participant = await updateParticipantName(req.params.id, name);
  if (!participant)
    return res.status(404).json({ error: "Participant introuvable" });
  res.json(participant);
};

const updateGroup = async (req, res) => {
  const { groupId } = req.body;
  const group = await findGroupById(groupId);
  if (!group) return res.status(404).json({ error: "Groupe introuvable" });
  const participant = await updateParticipantGroup(req.params.id, groupId);
  if (!participant)
    return res.status(404).json({ error: "Participant introuvable" });
  res.json(participant);
};

const getAll = async (req, res) => {
  const participants = await findAllParticipants();
  res.json(participants);
};

module.exports = {
  add,
  getByGroup,
  getById,
  remove,
  updateName,
  updateGroup,
  getAll,
};
