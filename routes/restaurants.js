const express = require("express");
const {
  getAllRestaurants,
  getOneRestaurant,
  createRestaurant,
  modifyRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurants");
const router = express.Router();
const { connection } = require("../database/config");

router.get("/", getAllRestaurants);

router.get("/:id", getOneRestaurant);

router.post("/", createRestaurant);

router.put("/:id", modifyRestaurant);

router.delete("/:id", deleteRestaurant);

module.exports = router;
