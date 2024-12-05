const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use("/public", express.static(path.join(__dirname, "public")));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbproj",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});

// Create Table for Groceries
const createTable = `
  CREATE TABLE IF NOT EXISTS groceries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(50),
    brand VARCHAR(50),
    userId VARCHAR(255) NOT NULL
);`;

db.query(createTable, (err) => {
    if (err) console.error("Error creating table:", err);
    else console.log("Groceries table checked/created");
});

// Routes

// 1. Display All Groceries
app.get("/", (req, res) => {
    const userId = req.query.userId;  // Extract userId from the query string
    if (!userId) {
        return res.status(400).send("User ID is required.");
    }

    db.query("SELECT * FROM groceries WHERE userId = ?", [userId], (err, results) => {
        if (err) throw err;
        res.render("grocery", { groceries: results, userId: userId });
    });
});

// 2. Show Add Grocery Form
app.get("/add", (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).send("User ID is required.");
    }
    res.render("add-grocery", { userId: userId });
});

// 3. Add New Grocery
app.post("/add-grocery", (req, res) => {
    const { item, quantity, unit, brand, userId } = req.body;
    if (!userId) {
        return res.status(400).send("User ID is required.");
    }

    db.query(
        "INSERT INTO groceries (item, quantity, unit, brand, userId) VALUES (?, ?, ?, ?, ?)",
        [item, quantity, unit, brand, userId],
        (err) => {
            if (err) throw err;
            res.redirect(`/?userId=${userId}`);
        }
    );
});


// 4. Show Edit Grocery Form (Single handler for GET /edit/:id)
app.get("/edit/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;  // Get userId from query string

    db.query("SELECT * FROM groceries WHERE id = ? AND userId = ?", [id, userId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render("edit-grocery", { grocery: results[0], userId: userId });
        } else {
            res.status(404).send("Grocery Not Found or Unauthorized Access");
        }
    });
});

// 5. Update Grocery
app.post("/edit/:id", (req, res) => {
    const { id } = req.params;
    const { item, quantity, unit, brand} = req.body;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).send("User ID is required.");
    }

    db.query(
        "UPDATE groceries SET item = ?, quantity = ?, unit = ?, brand = ? WHERE id = ? AND userId = ?",
        [item, quantity, unit, brand, id, userId],
        (err) => {
            if (err) throw err;
            res.redirect(`/?userId=${userId}`);
        }
    );
});


// 6. Delete Grocery
app.get("/delete/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;  // Get userId from query string

    db.query("DELETE FROM groceries WHERE id = ? AND userId = ?", [id, userId], (err) => {
        if (err) throw err;
        res.redirect(`/?userId=${userId}`);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
