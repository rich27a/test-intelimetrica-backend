const express = require("express");
const router = express.Router();
const { connection } = require("../database/config");
const {
  getDistanceFromLatLonInKm,
  getStandardDeviation,
} = require("../helpers/geospatial");

router.get("/statistics", (req, res) => {
  const { latitude, longitude, radius } = req.query;
  let averageRating = 0;
  let arrayRatingsResults = [];

  const sql = "SELECT * FROM restaurants";

  connection.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      results.forEach((restaurant) => {
        if (
          getDistanceFromLatLonInKm(
            latitude,
            longitude,
            restaurant.lat,
            restaurant.lng
          ) < radius
        ) {
          averageRating += restaurant.rating;
          arrayRatingsResults.push(restaurant.rating);
        }
      });

      const totalRestaurants = arrayRatingsResults.length;
      averageRating = averageRating / totalRestaurants;
      let std = getStandardDeviation(arrayRatingsResults);
      return res.status(200).json({
        count: totalRestaurants,
        avg: averageRating,
        std,
      });
    }
    return res.status(404).json({
      msg: "There is no restaurants",
    });
  });
});

module.exports = router;
