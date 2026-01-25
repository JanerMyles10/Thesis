const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const registerRoute = require("./routes/registerRoute");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const MessageRoutes = require("./routes/MessageRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);
app.use("/api/reg", registerRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/shop-applications", shopRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", MessageRoutes);

module.exports = app;