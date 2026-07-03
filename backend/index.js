const express = require("express");
const cors = require("cors");
require("dotenv").config();

const groupRoutes = require("./routes/groupRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/groups", groupRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
