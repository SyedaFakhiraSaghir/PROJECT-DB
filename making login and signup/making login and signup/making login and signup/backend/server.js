const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
// const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust for your React app
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Middleware
app.use(express.json());

// // MongoDB connection setup
// const dbConnect = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://k224499:NoAdoNrSmqXRPH9Z@cluster0.lb8y9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", // Store this in .env
//       { useNewUrlParser: true, useUnifiedTopology: true }
//     );
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//   }
// };

// dbConnect();

// // MongoDB User Schema
// const userSchema = new mongoose.Schema({
//   userId: { type: String, unique: true },
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   age: Number,
//   phone_number: String,
//   created_at: { type: Date, default: Date.now },
// });

// const User = mongoose.model("User", userSchema);

// MySQL database setup
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbproj",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.stack);
    process.exit(1);
  }
  console.log("Connected to MySQL.");
  connection.release();
});

// Signup route
app.post("/signup", async (req, res) => {
  const { name, email, password, age, phone_number } = req.body;
  const userId = uuidv4(); // Generate a unique userId

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  try {
    // // Save in MongoDB
    // const newUser = new User({
    //   userId,
    //   name,
    //   email,
    //   password,
    //   age,
    //   phone_number,
    // });
    // await newUser.save();

    // Save in MySQL
    const sql =
      "INSERT INTO signup (userId, name, email, password, age, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [userId, name, email, password, age, phone_number], (err) => {
      if (err) {
        console.error("MySQL error:", err);
        return res
          .status(500)
          .json({ message: "MySQL error", error: err.message });
      }
      res.status(201).json({ message: "User created successfully", userId });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// Login route (MySQL)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Adjusted to use 'signup' table
  const sql = "SELECT userId FROM signup WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res
        .status(500)
        .json({ message: "Database error", error: err.message });
    }

    if (results.length > 0) {
      const { userId } = results[0];
      return res.status(200).json({ message: "Login successful", userId });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});