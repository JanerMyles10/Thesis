const http = require("http"); // Added this to fix your error
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');

// Import your routes
const productRoutes = require("./routes/productRoutes");
const registerRoute = require("./routes/registerRoute");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const MessageRoutes = require("./routes/MessageRoutes");

const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.receiverId).emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/reg", registerRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/shop-applications", shopRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", MessageRoutes);

// EXPORT THE SERVER (Required for Socket.io to work)
module.exports = server;