using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly Neo4jService _neo4jService;

    public NotesController(Neo4jService neo4jService) =>
        _neo4jService = neo4jService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NoteDTO>>> GetNotes()
    {
        var notes = await _neo4jService.GetNotesAsync();
        return Ok(notes);
    }

    [HttpPost]
    public async Task<ActionResult<Note>> PostNote([FromBody] string content)
    {
        var note = await _neo4jService.CreateNoteAsync(content);
        return CreatedAtAction(nameof(GetNotes), new { id = note.Id }, note);
    }

    [HttpPost("{noteId}/link/{todoId}")]
    public async Task<IActionResult> LinkNoteToTodo(string noteId, string todoId)
    {
        await _neo4jService.LinkNoteToTodoAsync(noteId, todoId);
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNote(string id)
    {
        await _neo4jService.DeleteNoteAsync(id);
        return NoContent();
    }
}
