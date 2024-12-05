// Fetch and display notes
const fetchNotes = async () => {
    const response = await fetch('/notes');
    const notes = await response.json();
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="editNotePrompt(${note.note_id})">Edit</button>
            <button onclick="deleteNotePrompt(${note.note_id})">Delete</button>
        `;
        notesList.appendChild(noteDiv);
    });
};

// Add a new note
document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const response = await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });
    if (response.ok) {
        alert('Note added successfully!');
        fetchNotes();
    } else {
        alert('Failed to add note');
    }
});

// Edit a note
const editNotePrompt = async (id) => {
    const newTitle = prompt('Enter new title:');
    const newContent = prompt('Enter new content:');
    if (newTitle && newContent) {
        const response = await fetch(`/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });
        if (response.ok) {
            alert('Note edited successfully!');
            fetchNotes();
        } else {
            alert('Failed to edit note');
        }
    }
};

// Delete a note
const deleteNotePrompt = async (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
        const response = await fetch(`/notes/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Note deleted successfully!');
            fetchNotes();
        } else {
            alert('Failed to delete note');
        }
    }
};

// Fetch notes on load
fetchNotes();
