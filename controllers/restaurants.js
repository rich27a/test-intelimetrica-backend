const { connection } = require("../database/config");
const {
  getDistanceFromLatLonInKm,
  getStandardDeviation,
} = require("../helpers/geospatial");

const getStadistics = async (req, res) => {
  const { latitude, longitude, radius } = req.query;
  let averageRating = 0;
  let arrayRatingsResults = [];

  const sql = "SELECT * FROM restaurants";
  try {
    const [results] = await connection.execute(sql);

    if (results.length <= 0) {
      return res.status(404).json({
        msg: "There is no restaurants",
      });
    }

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
  } catch (error) {
    return res.status(500).json({
      msg: "Error while searching in db",
      error: error.message,
    });
  }
};

const getAllRestaurants = async (req, res) => {
  const sql = "SELECT * FROM restaurants";

  try {
    const [results] = await connection.execute(sql);

    if (results.length <= 0) {
      return res.status(404).json({
        msg: "There is no restaurants",
      });
    }

    return res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error while searching in db",
      error: error.message,
    });
  }
};

const getOneRestaurant = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM restaurants WHERE id ='${id}'`;

  try {
    const [results] = await connection.execute(sql);

    if (results.length <= 0) {
      return res.status(404).json({
        msg: `There is no restaurant with id ${id}`,
      });
    }

    return res.status(200).json({
      results,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error while searching in db",
      error: error.message,
    });
  }
};

const createRestaurant = async (req, res) => {
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

  try {
    const [results] = await connection.execute(sql);

    if (results.affectedRows <= 0) {
      return res.status(500).json({
        msg: `Cannot create restaurant`,
      });
    }
    return res.status(200).json({
      msg: "Restaurant has been created succesfully",
      results,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      msg: "Error while creating restaurant",
    });
  }
};

const modifyRestaurant = async (req, res) => {
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

  try {
    const [results] = await connection.execute(sql);

    if (results.affectedRows <= 0) {
      return res.status(404).json({
        msg: `Restaurant with id ${id} does not exist`,
      });
    }
    return res.status(200).json({
      msg: "Restaurant has been modified succesfully",
      results,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      msg: "Error while modifying restaurant",
    });
  }
};
const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  sql = `DELETE FROM restaurants
           WHERE id = '${id}'`;

  try {
    const [results] = await connection.execute(sql);

    if (results.affectedRows <= 0) {
      return res.status(404).json({
        msg: `Restaurant with id ${id} does not exist`,
      });
    }
    return res.status(200).json({
      msg: "Restaurant has been deleted succesfully",
      results,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error while deleting restaurant" });
  }
};

module.exports = {
  getStadistics,
  getAllRestaurants,
  getOneRestaurant,
  createRestaurant,
  modifyRestaurant,
  deleteRestaurant,
};
