const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // Get all notes
    router.get('/', (req, res) => {
        pool.query('SELECT * FROM notes', (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json(results);
        });
    });

    // Add a new note
    router.post('/', (req, res) => {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        pool.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database insert error' });
            }
            res.status(201).json({ id: results.insertId, title, content });
        });
    });

    return router;
};
