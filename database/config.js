const mysql = require("mysql2");
require("dotenv").config();
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

module.exports = { connection };
