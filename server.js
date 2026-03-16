require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Auto-create schools table on startup
async function initDB() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255)  NOT NULL,
        address    VARCHAR(500)  NOT NULL,
        latitude   FLOAT(10, 6)  NOT NULL,
        longitude  FLOAT(10, 6)  NOT NULL,
        created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("schools table ready");
  } catch (err) {
    console.error("DB init error:", err.message);
  }
}

initDB();

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
