const express = require("express");
const { getStadistics } = require("../controllers/restaurants");
const router = express.Router();

router.get("/statistics", getStadistics);

module.exports = router;
