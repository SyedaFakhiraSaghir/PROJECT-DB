var sendBtn = document.getElementById('sendBtn'); 
var textbox = document.getElementById('textbox');
var chatContainer = document.getElementById('chat-container');

sendBtn.addEventListener('click', function() {
    var text = textbox.value.trim(); // Trim to avoid empty spaces

    var arrOfPossibleResponses = [
        { message: 'what is your name?', response: 'I am a chatbot!' },
        { message: 'what functionalities do you have?', response: 'This website contains 10 modules\n1.User Profile Management\n2.Schedule Management\n3.Notes Management\n4.Quotes Management\n5.Book Suggestion\n6.Health and Fitness Management\n7.Personal Finance Management\n8.Notifications and Reminders\n9.Recipe and Grocery Organizer\n10.Mood Determination' },
        { message: 'give me details about user profile management module', response: 'Maintain user profiles, including personal information, preferences, and settings. Attributes: Name, ID, Email, password, Phone Number' },
        { message: 'give me details about schedule management module', response: 'Allow users to create, edit, and delete events. Attributes: Name, Date, Time, Id, Details, Address, Links' },
        { message: 'give me details about notes management module', response: 'Enable users to create, organize, and search notes. Attributes: Text, Date, Time' },
        { message: 'give me details about quotes management module', response: 'Provide motivational quotes to users. Attributes: Quote, category' },
        { message: 'give me details about book suggestion module', response: 'Suggest books based on user preferences and interests. Attributes: Book, category' },
        { message: 'give me details about health and fitness management module', response: 'Monitor health metrics (water intake, sleep; user input). Provide health tips and allow users to set fitness goals. Attributes: Steps, Workouts, Water Intake, Sleep, Health Tips, Fitness Goals' },
        { message: 'give me details about notifications and reminders module', response: 'Deliver reminders for events, tasks, health activities, finance deadlines, etc. Attributes: alert on Mail' },
        { message: 'give me details about recipe and organizer module', response: 'Save, organize, and search for recipes. Provide meal planning functionality. Attributes: Dish, ingredients, quantity' },
        { message: 'give me details about mood determination module', response: 'Shows icons and allows user to select how they feel. Shows a weekly history of users’ mood. Attributes: Mood icons, weekly mood history, date' },
        { message: 'give me details about personal finance management module', response: 'Track income, expenses, and budgets. Attributes: income categories, expense categories, summary (graphs and charts), access control.' }
    ];



    // Function to display the user's message
    function sendMessage(text) {
        var messageElement = document.createElement('div');
        messageElement.style.textAlign = 'right';
        messageElement.style.margin = "10px";
        messageElement.innerHTML = "<span><strong>You:</strong> </span><span>" + text + "</span>";
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
    }

    // Function to generate the chatbot response
    function chatbotResponse(text) {
        var chatbotResponse = "Sorry, I don't understand."; // Default response
        if (text.toLowerCase() === "hi"|| text.toLowerCase() === "hello") {
            chatbotResponse = "Hello!";
        } else if (text.length > 2) {
            var result = arrOfPossibleResponses.find(val => val.message.includes(text.toLowerCase()));
            if (result) {
                chatbotResponse = result.response;
            }
        }

        var messageElement = document.createElement('div');
        messageElement.style.textAlign = 'left';
        messageElement.style.margin = "10px";
        messageElement.innerHTML = "<span><strong>Chatbot:</strong> </span><span>" + chatbotResponse + "</span>";

        setTimeout(() => {
            chatContainer.appendChild(messageElement);
            saveToDatabase(text, chatbotResponse);  // Call to save data
        }, 1000);
        
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
    }

    // Function to save the user message and chatbot response to the database
    function saveToDatabase(userMessage, chatbotResponse) {
        fetch('http://localhost:3001/saveMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_message: userMessage,
                chatbot_response: chatbotResponse,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // Check if the user has entered any message
    if (!text) {
        alert('Please write something in the message box');
    } else {
        sendMessage(text);             // Display user's message
        chatbotResponse(text);         // Generate and display chatbot response
        textbox.value = "";            // Clear the input field
    }
});
