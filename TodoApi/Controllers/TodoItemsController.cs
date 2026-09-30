using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly TodoService _todoService;

    public TodoItemsController(TodoService todoService) =>
        _todoService = todoService;

    // GET: api/todoitems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
    {
        var items = await _todoService.GetAsync();
        return Ok(items.Select(ItemToDTO));
    }

    // GET: api/todoitems/{id}
    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<TodoItemDTO>> GetTodoItem(string id)
    {
        var item = await _todoService.GetAsync(id);

        if (item is null)
            return NotFound();

        return ItemToDTO(item);
    }

    // POST: api/todoitems
    [HttpPost]
    public async Task<ActionResult<TodoItemDTO>> PostTodoItem(TodoItemDTO dto)
    {
        var todoItem = new TodoItem
        {
            Name = dto.Name,
            IsComplete = dto.IsComplete
        };

        await _todoService.CreateAsync(todoItem);

        return CreatedAtAction(
            nameof(GetTodoItem),
            new { id = todoItem.Id },
            ItemToDTO(todoItem));
    }

    // PUT: api/todoitems/{id}
    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> PutTodoItem(string id, TodoItemDTO dto)
    {
        if (id != dto.Id)
            return BadRequest();

        var existing = await _todoService.GetAsync(id);

        if (existing is null)
            return NotFound();

        // Update only the fields exposed through the DTO; preserve Secret
        existing.Name = dto.Name;
        existing.IsComplete = dto.IsComplete;

        await _todoService.UpdateAsync(id, existing);

        return NoContent();
    }

    // DELETE: api/todoitems/{id}
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> DeleteTodoItem(string id)
    {
        var item = await _todoService.GetAsync(id);

        if (item is null)
            return NotFound();

        await _todoService.RemoveAsync(id);

        return NoContent();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static TodoItemDTO ItemToDTO(TodoItem item) =>
        new()
        {
            Id = item.Id,
            Name = item.Name,
            IsComplete = item.IsComplete
            // Secret intentionally excluded
        };
}
