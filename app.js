const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const registerRoute = require("./routes/registerRoute");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use("/api/products", productRoutes);
app.use("/api/reg", registerRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/shop-applications", shopRoutes); 

module.exports = app;