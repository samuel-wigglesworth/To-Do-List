import { useState, useEffect } from "react";
import "./App.css";

const STORAGE_KEY = "todo-items";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function App() {
  const [todos, setTodos] = useState(() => loadFromStorage());
  const [newName, setNewName] = useState("");

  useEffect(() => {
    saveToStorage(todos);
  }, [todos]);

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    const newTodo = {
      Id: crypto.randomUUID(),
      Name: trimmed,
      IsComplete: false,
    };
    setTodos(prev => [...prev, newTodo]);
    setNewName("");
  }

  function handleToggle(id) {
    setTodos(prev =>
      prev.map(t => (t.Id === id ? { ...t, IsComplete: !t.IsComplete } : t))
    );
  }

  function handleDelete(id) {
    setTodos(prev => prev.filter(t => t.Id !== id));
  }

  const remaining = todos.filter(t => !t.IsComplete).length;

  return (
    <div className="app">
      <h1>Todo List</h1>
      <p className="subtitle">
        {remaining} item{remaining !== 1 ? "s" : ""} left
      </p>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          aria-label="New todo name"
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p className="empty">No todos yet — add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li
              key={todo.Id}
              className={`todo-item${todo.IsComplete ? " done" : ""}`}
            >
              <input
                type="checkbox"
                checked={todo.IsComplete}
                onChange={() => handleToggle(todo.Id)}
                aria-label={`Mark "${todo.Name}" as ${
                  todo.IsComplete ? "incomplete" : "complete"
                }`}
              />
              <span className="todo-name">{todo.Name}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(todo.Id)}
                aria-label={`Delete "${todo.Name}"`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
