const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();
const PORT = 3040;

// Enable CORS
app.use(cors());

// Enable body parsing for JSON and URL-encoded forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure file upload (handling multiple files)
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password if applicable
    database: 'test',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL connected...');
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SQL Queries to create tables
const createAuthorsTable = `
    CREATE TABLE IF NOT EXISTS authors (
        AuthorId INT AUTO_INCREMENT PRIMARY KEY,
        AuthorName VARCHAR(255) NOT NULL UNIQUE,
        Email VARCHAR(30) NULL UNIQUE,
        PhoneNo VARCHAR(15) NULL UNIQUE
    )
`;

const createQuotesTable = `
    CREATE TABLE IF NOT EXISTS quotes (
        QuoteId INT AUTO_INCREMENT PRIMARY KEY,
        Quote TEXT NOT NULL,
        Category VARCHAR(50) NOT NULL,
        AuthorId INT,
        FOREIGN KEY (AuthorId) REFERENCES authors(AuthorId) ON DELETE SET NULL
    )
`;

// Create Tables
db.query(createAuthorsTable, (err) => {
    if (err) {
        console.error('Error creating Authors table:', err);
        return;
    }
    console.log('Authors table created or already exists.');

    db.query(createQuotesTable, (err) => {
        if (err) {
            console.error('Error creating Quotes table:', err);
            return;
        }
        console.log('Quotes table created or already exists.');
    });
});

// Route to render the indexQuotes.ejs page
app.get('/', (req, res) => {
    res.render('indexQuotes');
});
app.get('/api/quotes', (req, res) => {
    const category = req.query.category;

    if (!category) {
        return res.status(400).json({ error: 'Category is required.' });
    }

    const query = `
        SELECT q.Quote, a.AuthorName
        FROM quotes q
        LEFT JOIN authors a ON q.AuthorId = a.AuthorId
        WHERE q.Category = ?
    `;

    db.query(query, [category], (err, results) => {
        if (err) {
            console.error('Error fetching quotes:', err);
            return res.status(500).json({ error: 'Failed to fetch quotes.' });
        }
        res.json(results);
    });
});


// API to upload multiple CSV files (authors and quotes)
app.post('/upload-quotes', upload.fields([{ name: 'authorsFile' }, { name: 'quotesFile' }]), (req, res) => {
    if (!req.files || !req.files.authorsFile || !req.files.quotesFile) {
        return res.status(400).json({ error: 'Both authors and quotes CSV files are required.' });
    }

    const authorsFile = req.files.authorsFile[0];
    const quotesFile = req.files.quotesFile[0];

    const authors = [];
    fs.createReadStream(authorsFile.path)
        .pipe(csvParser())
        .on('data', (row) => {
            if (row.AuthorId && row.AuthorName) {
                authors.push([row.AuthorId, row.AuthorName, row.Email || null, row.PhoneNo || null]);
            }
        })
        .on('end', () => {
            if (authors.length > 0) {
                const insertAuthorsQuery = `INSERT INTO authors (AuthorId, AuthorName, Email, PhoneNo) VALUES ?`;
                db.query(insertAuthorsQuery, [authors], (err, result) => {
                    if (err) {
                        console.error('Error inserting authors:', err);
                        return res.status(500).json({ error: 'Failed to insert authors.' });
                    }
                    console.log(`Inserted ${result.affectedRows} authors.`);
                    processQuotesFile();
                });
            } else {
                return res.status(400).json({ error: 'No valid authors found in the file.' });
            }
        })
        .on('error', (error) => {
            console.error('Error reading authors CSV file:', error);
            res.status(500).json({ error: 'Failed to process authors CSV file.' });
        });

    const quotes = [];
    const processQuotesFile = () => {
        fs.createReadStream(quotesFile.path)
            .pipe(csvParser())
            .on('data', (row) => {
                if (row.Quote && row.Category) {
                    const authorId = row.AuthorId ? parseInt(row.AuthorId) : null;
                    quotes.push([row.Quote, row.Category, authorId]);
                }
            })
            .on('end', () => {
                if (quotes.length > 0) {
                    const insertQuotesQuery = `INSERT INTO quotes (Quote, Category, AuthorId) VALUES ?`;
                    db.query(insertQuotesQuery, [quotes], (err, result) => {
                        if (err) {
                            console.error('Error inserting quotes:', err);
                            return res.status(500).json({ error: 'Failed to insert quotes.' });
                        }
                        console.log(`Inserted ${result.affectedRows} quotes successfully.`);
                        res.json({ success: true, message: 'Authors and quotes uploaded successfully.' });
                    });
                } else {
                    return res.status(400).json({ error: 'No valid quotes found in the file.' });
                }
            })
            .on('error', (error) => {
                console.error('Error reading quotes CSV file:', error);
                res.status(500).json({ error: 'Failed to process quotes CSV file.' });
            });
    };
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
