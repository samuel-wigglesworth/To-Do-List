import { useState, useEffect, useCallback } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api";
import { fetchNotes, createNote, linkNoteToTodo, deleteNote } from "./notesApi";
import BrainGraph from "./BrainGraph";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedTodo, setSelectedTodo] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [todosData, notesData] = await Promise.all([
        fetchTodos(),
        fetchNotes()
      ]);
      setTodos(todosData);
      setNotes(notesData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleAddTodo(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const created = await createTodo(trimmed);
      setTodos(prev => [...prev, created]);
      setNewName("");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    const trimmed = newNoteContent.trim();
    if (!trimmed) return;
    try {
      const createdNote = await createNote(trimmed);
      if (selectedTodo) {
        await linkNoteToTodo(createdNote.id, selectedTodo);
        createdNote.linkedTodoIds = [selectedTodo];
      } else {
        createdNote.linkedTodoIds = [];
      }
      setNotes(prev => [...prev, createdNote]);
      setNewNoteContent("");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToggle(todo) {
    const updated = { ...todo, IsComplete: !todo.IsComplete };
    try {
      await updateTodo(updated);
      setTodos(prev => prev.map(t => t.Id === todo.Id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteTodo(id) {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.Id !== id));
    } catch (err) {
      console.error(err);
    }
  }
  
  async function handleDeleteNote(id) {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const remaining = todos.filter(t => !t.IsComplete).length;

  return (
    <div className="app-container" style={{ display: 'flex', gap: '2rem', padding: '2rem', justifyContent: 'center' }}>
      <div className="app" style={{ maxWidth: '400px', flex: 1 }}>
        <h1>Todo List</h1>
        <p className="subtitle">{remaining} item{remaining !== 1 ? "s" : ""} left</p>

        <form className="add-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.Id} className={`todo-item${todo.IsComplete ? " done" : ""}`}>
              <input type="checkbox" checked={todo.IsComplete} onChange={() => handleToggle(todo)} />
              <span className="todo-name">{todo.Name}</span>
              <button className="delete-btn" onClick={() => handleDeleteTodo(todo.Id)}>✕</button>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '2rem' }}>
          <h2>Notes</h2>
          <form className="add-form" style={{ flexDirection: 'column' }} onSubmit={handleAddNote}>
            <input
              type="text"
              placeholder="Add a new note..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
            />
            <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={selectedTodo} onChange={e => setSelectedTodo(e.target.value)}>
              <option value="">-- No link (Standalone Note) --</option>
              {todos.map(t => (
                <option key={t.Id} value={t.Id}>Link to: {t.Name}</option>
              ))}
            </select>
            <button type="submit">Add Note</button>
          </form>
          <ul className="todo-list">
            {notes.map(note => (
              <li key={note.id} className="todo-item">
                <span className="todo-name">{note.content}</span>
                <button className="delete-btn" onClick={() => handleDeleteNote(note.id)}>✕</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div style={{ flex: 1, maxWidth: '500px' }}>
        <h1>Brain Visualization</h1>
        <p className="subtitle">Blue = Todo, Green = Done, Orange = Note</p>
        <BrainGraph todos={todos} notes={notes} />
      </div>
    </div>
  );
}
