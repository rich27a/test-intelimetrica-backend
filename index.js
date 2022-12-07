const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connection } = require("./database/config");
const app = express();

const restaurantRouter = require("./routes/restaurants");
const geospatialRouter = require("./routes/geospatial");

dotenv.config();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/restaurants", restaurantRouter);
app.use("/api/restaurants", geospatialRouter);

app.get("/", (req, res) => {
  res.send("Aqui empezamos el test");
});

app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
