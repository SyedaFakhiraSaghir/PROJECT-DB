const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Support for JSON-encoded bodies

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default user for XAMPP
    password: '', // Leave blank if no password set
    database: 'test'
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Route to store chat messages
app.post('/saveMessage', (req, res) => {
    const { user_message, chatbot_response } = req.body;

    const query = "INSERT INTO chat_messages (user_message, chatbot_response) VALUES (?, ?)";
    db.query(query, [user_message, chatbot_response], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Message saved to the database!', id: result.insertId });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
