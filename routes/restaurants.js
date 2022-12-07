const express = require("express");
const router = express.Router();
const { connection } = require("../database/config");
const { getDistanceFromLatLonInKm } = require("../helpers/geospatial");

// router.get("/api/stadistics", (req, res) => {
//   const { latitude, longitude, radius } = req.query;

//   const sql = "SELECT * FROM restaurants";

//   connection.query(sql, (err, results) => {
//     if (err) throw err;
//     if (results.length > 0) {
//       results.filter((restaurant) =>
//         getDistanceFromLatLonInKm(
//           latitude,
//           longitude,
//           restaurant.lat,
//           restaurant.lng,
//           radius
//         )
//       );
//     }
//     return res.status(404).json({
//       msg: "There is no restaurants",
//     });
//   });
// });
router.get("/", async (req, res) => {
  const sql = "SELECT * FROM restaurants";

  connection.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(200).json({
        count: results.length,
        results,
      });
    }
    return res.status(404).json({
      msg: "There is no restaurants",
    });
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM restaurants WHERE id ='${id}'`;

  connection.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(200).json({
        results,
      });
    }
    return res.status(404).json({
      msg: `There is no restaurant with id ${id}`,
    });
  });
});

router.post("/", (req, res) => {
  const {
    id,
    rating,
    name,
    site,
    email,
    phone,
    street,
    city,
    state,
    lat,
    lng,
  } = req.body;

  const sql = `INSERT INTO restaurants (id, rating, name, site, 
    email, phone, street, city, state, lat, lng
    )
  VALUES
  ('${id}', ${rating}, '${name}', '${site}', 
   '${email}', '${phone}', '${street}', '${city}', 
    '${state}', ${lat}, ${lng}
    )`;

  connection.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ msg: "Error while creating restaurant" });
    if (results.affectedRows > 0) {
      return res.status(200).json({
        msg: "Restaurant has been created succesfully",
        results,
      });
    }
    return res.status(500).json({
      msg: `Cannot create restaurant`,
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { rating, name, site, email, phone, street, city, state, lat, lng } =
    req.body;

  const sql = `UPDATE restaurants 
               SET rating = ${rating}, name = '${name}', 
               site = '${site}', email = '${email}', 
               phone = '${phone}', street = '${street}',
               city = '${city}', state = '${state}', 
               lat = ${lat}, lng = ${lng}
               WHERE id = '${id}'`;

  connection.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ msg: "Error while modifying restaurant" });
    if (results.affectedRows > 0) {
      return res.status(200).json({
        msg: "Restaurant has been modified succesfully",
      });
    }
    return res.status(404).json({
      msg: `Restaurant with id ${id} does not exist`,
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  sql = `DELETE FROM restaurants
         WHERE id = '${id}'`;

  connection.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ msg: "Error while deleting restaurant" });
    if (results.affectedRows > 0) {
      return res.status(200).json({
        msg: "Restaurant has been deleted succesfully",
      });
    }
    return res.status(404).json({
      msg: `Restaurant with id ${id} does not exist`,
    });
  });
});

module.exports = router;
