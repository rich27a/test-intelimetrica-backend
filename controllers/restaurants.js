const express = require("express");
const { connection } = require("../database/config");
const {
  getDistanceFromLatLonInKm,
  getStandardDeviation,
} = require("../helpers/geospatial");

const getStadistics = (req, res) => {
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
};

const getAllRestaurants = (req, res) => {
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
};

const getOneRestaurant = (req, res) => {
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
};

const createRestaurant = (req, res) => {
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

  if (rating < 0 || rating > 4) {
    return res.status(400).json({
      msg: "Error: rating has to be between 0 and 4",
    });
  }

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
};

const modifyRestaurant = (req, res) => {
  const { id } = req.params;
  const { rating, name, site, email, phone, street, city, state, lat, lng } =
    req.body;

  if (rating < 0 || rating > 4) {
    return res.status(400).json({
      msg: "Error: rating has to be between 0 and 4",
    });
  }

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
};
const deleteRestaurant = (req, res) => {
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
};

module.exports = {
  getStadistics,
  getAllRestaurants,
  getOneRestaurant,
  createRestaurant,
  modifyRestaurant,
  deleteRestaurant,
};
