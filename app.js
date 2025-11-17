const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const registerRoute = require("./routes/registerRoute");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/reg", registerRoute);

module.exports = app