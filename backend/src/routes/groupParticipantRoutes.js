const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  add,
  getByGroup,
  getById,
  remove,
  updateName,
  updateGroup,
  getAll,
} = require("../controllers/participantController");

router.post("/", add);
router.get("/", getByGroup);
router.get("/:id", getById);
router.delete("/:id", remove);
router.put("/:id/name", updateName);
router.put("/:id/group", updateGroup);
router.get("/", getAll);

module.exports = router;
