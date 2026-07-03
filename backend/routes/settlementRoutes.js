const express = require("express");
const router = express.Router({ mergeParams: true });
const { get } = require("../controllers/settlementController");

router.get("/", get);

module.exports = router;
