// In production set VITE_API_BASE_URL to your deployed API host, e.g.
// https://todo-api.your-domain.com
// Leave it empty (or unset) for local dev — the Vite proxy handles /api/* then.
const BASE = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/todoitems`;

export async function fetchTodos() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export async function createTodo(name) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Name: name, IsComplete: false }),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  return res.json();
}

export async function updateTodo(todo) {
  const res = await fetch(`${BASE}/${todo.Id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to update todo");
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete todo");
}
