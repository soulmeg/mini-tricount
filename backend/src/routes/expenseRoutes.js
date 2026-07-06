const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  add,
  getByGroup,
  update,
  remove,
} = require("../controllers/expenseController");

router.get("/", getByGroup);
router.post("/", add);
router.put("/:expenseId", update);
router.delete("/:expenseId", remove);

module.exports = router;
