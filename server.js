const mongoose = require("mongoose");
const app = require("./app");


mongoose.connect("mongodb://localhost:27017/thesisdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
