const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const app = express();
const PORT = 9001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbproj",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected!");
  }
});

const createTable = `
    CREATE TABLE IF NOT EXISTS moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mood VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userId VARCHAR(200) NOT NULL
);
`;
db.query(createTable, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table checked/created");
  }
});

// Routes
app.post("/api/moods", (req, res) => {
  const { mood, description, userId } = req.body; // Get userId from the request body
  const query =
    "INSERT INTO moods (mood, description, userId) VALUES (?, ?, ?)";

  db.query(query, [mood, description, userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving mood");
    } else {
      res.status(200).send("Mood saved successfully");
    }
  });
});

// Route to get moods of a specific user
app.get("/api/moods/:userId", (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const query =
    "SELECT id, mood, description, created_at FROM moods WHERE userId = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching moods");
    } else {
      res.status(200).json(results);
    }
  });
});

app.listen(5010, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});