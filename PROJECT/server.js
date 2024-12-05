const express = require('express'); 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
app.use(cors());                //allow requests from different origins
app.use(bodyParser.json());  
// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default user for XAMPP
    password: '', // Leave blank if no password set
    database: 'dbproj'
});
// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL connected...');
});
// Set up the view engine and specify the views directory location
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Adjust views directory to /public/views
app.use(express.static('public'));
// Serve the EJS file
app.get('/', (req, res) => {
    res.render('index'); // Render the EJS template instead of sending the file
});
// Endpoint to save messages to the database
app.post('/saveMessage', (req, res) => {
    const { user_message, chatbot_response } = req.body;
    if (!user_message || !chatbot_response) {
        return res.status(400).send({ message: 'Invalid input data' });
    }

    const query = "INSERT INTO chatbot (user_message, chatbot_response) VALUES (?, ?)";
    db.query(query, [user_message, chatbot_response], (err, result) => {
        if (err) {
            console.error('Database insertion error:', err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send({ message: 'Message saved to the database!', id: result.insertId });
    });
});
// Start the server
app.listen(3005, () => {
    console.log('Server started on http://localhost:3005');
});
