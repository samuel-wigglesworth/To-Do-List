export const NOTES_BASE = "/api/notes";

export async function fetchNotes() {
  const res = await fetch(NOTES_BASE);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createNote(content) {
  const res = await fetch(NOTES_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function linkNoteToTodo(noteId, todoId) {
  const res = await fetch(`${NOTES_BASE}/${noteId}/link/${todoId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to link note");
}

export async function deleteNote(id) {
  const res = await fetch(`${NOTES_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
}
