import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import Notification from './components/Notification';
import Footer from './components/Footer';
import './index.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [flashMessage, setFlashMessage] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initalNotes => setNotes(initalNotes))
      .catch((err) => console.log(err));
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then((returnedNotes) => {
        setNotes(notes.concat(returnedNotes));
        setNewNote('');
        createFlashMessage('New note created', true);
      })
      .catch((err) => {
        createFlashMessage('Error adding note', false);
        console.log(err)
      });
  }

  const handleNoteChange = (event) => setNewNote(event.target.value);

  const handleInputFocus = (event) => {
    if (newNote === 'a new note...') {
      setNewNote('');
    }
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id);
    const updatedNote = { ...note, important: !note.important }

    noteService
      .update(id, updatedNote)
      .then((returnedNotes) => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNotes));
        createFlashMessage('Note importance toggled', true);
      })
      .catch((err) => {
        const message = `Note '${note.content}' was already removed from server`;
        createFlashMessage(message, false);
        console.log(err)
      });
  }

  const createFlashMessage = (message, success) => {
    setRequestSuccess(success);
    setFlashMessage(message);
    setTimeout(() => setFlashMessage(null), 5000);
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={flashMessage} requestSuccess={requestSuccess} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map(note => 
            <Note 
              key={note.id} 
              note={note} 
              toggleImportance={() => toggleImportanceOf(note.id)} 
            />
          )}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
          onFocus={handleInputFocus} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App