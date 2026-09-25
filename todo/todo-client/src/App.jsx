import { useState, useEffect, useCallback } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTodos(); }, [loadTodos]);

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const created = await createTodo(trimmed);
      setTodos(prev => [...prev, created]);
      setNewName("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(todo) {
    const updated = { ...todo, IsComplete: !todo.IsComplete };
    try {
      await updateTodo(updated);
      setTodos(prev => prev.map(t => t.Id === todo.Id ? updated : t));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.Id !== id));
    } catch (err) {
      setError(err.message);
    }
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

      {error && <p className="error">⚠ {error}</p>}

      {loading ? (
        <p className="loading">Loading…</p>
      ) : todos.length === 0 ? (
        <p className="empty">No todos yet — add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.Id} className={`todo-item${todo.IsComplete ? " done" : ""}`}>
              <input
                type="checkbox"
                checked={todo.IsComplete}
                onChange={() => handleToggle(todo)}
                aria-label={`Mark "${todo.Name}" as ${todo.IsComplete ? "incomplete" : "complete"}`}
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
