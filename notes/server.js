const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Database connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
    connectionLimit: 10
});

// Create table with updated schema if it doesn't exist
const createTable = `
    CREATE TABLE IF NOT EXISTS notes (
        note_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId varchar(255)
    );
`;
pool.query(createTable, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table checked/created');
    }
});

// API Endpoints

// Get all notes
app.get('/notes', (req, res) => {
    const query = 'SELECT note_id, title, content, created_at FROM notes ORDER BY created_at DESC';
    pool.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving notes');
        }
        res.json(results);
    });
});

// Get a single note by note_id
app.get('/notes/:note_id', (req, res) => {
    const query = 'SELECT note_id, title, content, created_at FROM notes WHERE note_id = ?';
    pool.query(query, [req.params.note_id], (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving the note');
        }
        if (results.length === 0) {
            return res.status(404).send('Note not found');
        }
        res.json(results[0]);
    });
});
// Add a new note
app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }
    const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
    pool.query(query, [title, content], (err, result) => {
        if (err) {
            return res.status(500).send('Error adding the note');
        }
        res.send({ note_id: result.insertId, message: 'Note added successfully' });
    });
});

// Update a note by note_id
app.put('/notes/:note_id', (req, res) => {
    const { title, content } = req.body;
    const query = 'UPDATE notes SET title = ?, content = ? WHERE note_id = ?';
    pool.query(query, [title, content, req.params.note_id], (err, result) => {
        if (err) {
            return res.status(500).send('Error updating the note');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Note not found');
        }
        res.send('Note updated successfully');
    });
});

// Delete a note by note_id
app.delete('/notes/:note_id', (req, res) => {
    const query = 'DELETE FROM notes WHERE note_id = ?';
    pool.query(query, [req.params.note_id], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting the note');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Note not found');
        }
        // res.send('Note deleted successfully');
    });
});


// Fallback for any other route (serve index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(3020, () => {
    console.log('Server started on http://localhost:3020');
});
