const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aqui empezamos el test");
});

app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
