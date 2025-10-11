const mongoose = require("mongoose");
const app = require("./app");


// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/myapp")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
