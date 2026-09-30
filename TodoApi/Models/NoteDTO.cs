namespace TodoApi.Models;

public class NoteDTO
{
    public string Id { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> LinkedTodoIds { get; set; } = new();
}
