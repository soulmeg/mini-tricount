const express = require("express");
const router = express.Router({ mergeParams: true });
const { getAll } = require("../controllers/participantController");

router.get("/", getAll);

module.exports = router;
