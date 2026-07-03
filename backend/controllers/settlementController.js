const { computeSettlement } = require("../services/settlementService");

const get = async (req, res) => {
  const result = await computeSettlement(req.params.groupId);
  res.json(result);
};

module.exports = { get };
