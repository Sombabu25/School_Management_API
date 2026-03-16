require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", schoolRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "School Management API is running",
    version: "1.0.0",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;