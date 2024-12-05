const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (like your HTML, CSS, and JS)
app.use(express.static('public'));
app.set('view engine', 'ejs');
// Route for the homepage (if your main file is 'index.html')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.ejs'));
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
