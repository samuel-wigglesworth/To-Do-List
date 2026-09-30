namespace TodoApi.Models;

/// <summary>
/// Data Transfer Object for TodoItem — prevents over-posting
/// and hides internal fields (e.g. Secret).
/// </summary>
public class TodoItemDTO
{
    public string? Id { get; set; }

    public string? Name { get; set; }

    public bool IsComplete { get; set; }
}
