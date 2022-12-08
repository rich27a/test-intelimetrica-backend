const mysql = require("mysql2");
require("dotenv").config();
const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

module.exports = { connection };
