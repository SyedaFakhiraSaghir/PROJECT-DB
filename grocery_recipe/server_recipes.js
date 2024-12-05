const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 5002;

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

const createTable = `
  CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(100) NOT NULL,
    ingredients TEXT NOT NULL,
    recipe TEXT NOT NULL,
    author VARCHAR(50),
    userId VARCHAR(255)
);`;

db.query(createTable, (err) => {
    if (err) console.error("Error creating table:", err);
    else console.log("Table checked/created");
});

// Routes

// 1. Display All Recipes
app.get("/", (req, res) => {
    const userId = req.query.userId;  // Extract userId from the query string
    if (!userId) {
        return res.status(400).send("User ID is required.");
    }

    db.query("SELECT * FROM recipes WHERE userId = ?", [userId], (err, results) => {
        if (err) throw err;
        res.render("recipes", { recipes: results, userId: userId });
    });
});

// 2. Show Add Recipe Form
app.get("/add", (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).send("User ID is required.");
    }
    res.render("add-recipe", { userId: userId });
});

// 3. Add New Recipe
app.post("/add-recipe", (req, res) => {
    const { recipe_name, ingredients, recipe, author, userId } = req.body;
    if (!userId) {
        return res.status(400).send("User ID is required.");
    }

    db.query(
        "INSERT INTO recipes (recipe_name, ingredients, recipe, author, userId) VALUES (?, ?, ?, ?, ?)",
        [recipe_name, ingredients, recipe, author, userId],
        (err) => {
            if (err) throw err;
            res.redirect(`/?userId=${userId}`);
        }
    );
});

// 4. Show Edit Recipe Form (Single handler for GET /edit/:id)
app.get("/edit/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;  // Get userId from query string

    db.query("SELECT * FROM recipes WHERE id = ? AND userId = ?", [id, userId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render("edit-recipe", { recipe: results[0], userId: userId });
        } else {
            res.status(404).send("Recipe Not Found or Unauthorized Access");
        }
    });
});

// 5. Update Recipe
app.post("/edit/:id", (req, res) => {
    const { id } = req.params;
    const { recipe_name, ingredients, recipe, author } = req.body;
    const { userId } = req.query; // Extract the userId from the query string

    if (!userId) {
        return res.status(400).send("User ID is required.");
    }

    db.query(
        "UPDATE recipes SET recipe_name = ?, ingredients = ?, recipe = ?, author = ? WHERE id = ? AND userId = ?",
        [recipe_name, ingredients, recipe, author, id, userId],
        (err) => {
            if (err) throw err;
            res.redirect(`/?userId=${userId}`); // Make sure userId is passed in the redirect
        }
    );
});


// 6. Delete Recipe
app.get("/delete/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;  // Get userId from query string

    db.query("DELETE FROM recipes WHERE id = ? AND userId = ?", [id, userId], (err) => {
        if (err) throw err;
        res.redirect(`/?userId=${userId}`);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
