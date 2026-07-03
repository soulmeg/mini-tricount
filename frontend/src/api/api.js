import axios from "axios";

// ==================================================
// Axios configuration
// ==================================================
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// ==================================================
// Groups
// ==================================================

export const getAllGroups = () => api.get("/groups").then((r) => r.data);

export const createGroup = (name) =>
  api.post("/groups", { name }).then((r) => r.data);

export const getGroup = (id) => api.get(`/groups/${id}`).then((r) => r.data);

export const updateGroupName = (id, name) =>
  api.put(`/groups/${id}`, { name }).then((r) => r.data);

export const deleteGroup = (id) =>
  api.delete(`/groups/${id}`).then((r) => r.data);

// ==================================================
// Participants
// ==================================================

export const getParticipants = (groupId) =>
  api.get(`/groups/${groupId}/participants`).then((r) => r.data);

export const addParticipant = (groupId, name) =>
  api.post(`/groups/${groupId}/participants`, { name }).then((r) => r.data);

export const updateParticipantName = (groupId, participantId, name) =>
  api
    .put(`/groups/${groupId}/participants/${participantId}/name`, { name })
    .then((r) => r.data);

export const deleteParticipant = (groupId, participantId) =>
  api
    .delete(`/groups/${groupId}/participants/${participantId}`)
    .then((r) => r.data);

// ==================================================
// Expenses
// ==================================================

export const getExpenses = (groupId) =>
  api.get(`/groups/${groupId}/expenses`).then((r) => r.data);

export const addExpense = (groupId, data) =>
  api.post(`/groups/${groupId}/expenses`, data).then((r) => r.data);

export const updateExpense = (groupId, expenseId, data) =>
  api.put(`/groups/${groupId}/expenses/${expenseId}`, data).then((r) => r.data);

export const deleteExpense = (groupId, expenseId) =>
  api.delete(`/groups/${groupId}/expenses/${expenseId}`).then((r) => r.data);

// ==================================================
// Settlement
// ==================================================

export const getSettlement = (groupId) =>
  api.get(`/groups/${groupId}/settlement`).then((r) => r.data);
