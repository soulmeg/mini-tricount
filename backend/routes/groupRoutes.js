const express = require("express");
const router = express.Router();
const {
  create,
  getById,
  getAll,
  deleteGroupById,
  updateName,
} = require("../controllers/groupController");

router.post("/", create);
router.get("/:id", getById);
router.get("/", getAll);
router.delete("/:id", deleteGroupById);
router.put("/:id", updateName);

module.exports = router;
