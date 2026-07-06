const express = require("express");
const cors = require("cors");
require("dotenv").config();

const groupRoutes = require("./routes/groupRoutes");
const groupParticipantRoutes = require("./routes/groupParticipantRoutes");
const participantRoutes = require("./routes/participantRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const settlementRoutes = require("./routes/settlementRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/groups", groupRoutes);
app.use("/api/groups/:groupId/participants", groupParticipantRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/groups/:groupId/expenses", expenseRoutes);
app.use("/api/groups/:groupId/settlement", settlementRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
