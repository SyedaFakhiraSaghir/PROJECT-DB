document.getElementById('categories-btn').addEventListener('click', () => {
    const categoriesDiv = document.getElementById('categories');
    categoriesDiv.style.display = categoriesDiv.style.display === 'none' ? 'block' : 'none';
});

// Event listener for each category button
document.querySelectorAll('.quote-button').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        fetchQuote(category);
    });
});
function fetchQuote(category) {
    fetch(`/api/quotes?category=${encodeURIComponent(category)}`)
        .then(response => response.json())
        .then(data => {
            // If quotes are available for the category, display them
            if (data.length > 0) {
                const randomQuote = data[Math.floor(Math.random() * data.length)];
                document.getElementById('quote-category').innerText = `Category: ${category}`;
                document.getElementById('quote-text').innerHTML = `"${randomQuote.Quote}"<br>― ${randomQuote.AuthorName}`;
            } else {
                document.getElementById('quote-category').innerText = `Category: ${category}`;
                document.getElementById('quote-text').innerText = 'No quotes available.';
            }
        })
        .catch(error => {
            console.error("Error fetching quote:", error);
            document.getElementById('quote-category').innerText = "Error";
            document.getElementById('quote-text').innerText = "Could not fetch quote. Please try again.";
        });
}

