using Microsoft.Extensions.Options;
using Neo4j.Driver;
using TodoApi.Models;

namespace TodoApi.Services;

public class Neo4jService : IDisposable, IAsyncDisposable
{
    private readonly IDriver _driver;

    public Neo4jService(IOptions<Neo4jSettings> settings)
    {
        _driver = GraphDatabase.Driver(
            settings.Value.Uri, 
            AuthTokens.Basic(settings.Value.User, settings.Value.Password));
    }

    public async Task<Note> CreateNoteAsync(string content)
    {
        var note = new Note { Content = content };
        await using var session = _driver.AsyncSession();
        
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = "CREATE (n:Note { id: $id, content: $content, createdAt: $createdAt }) RETURN n";
            await tx.RunAsync(query, new { id = note.Id, content = note.Content, createdAt = note.CreatedAt.ToString("o") });
        });
        
        return note;
    }

    public async Task<List<NoteDTO>> GetNotesAsync()
    {
        await using var session = _driver.AsyncSession();
        return await session.ExecuteReadAsync(async tx =>
        {
            var query = @"
                MATCH (n:Note)
                OPTIONAL MATCH (n)-[:RELATED_TO]->(t:TodoRef)
                RETURN n.id AS id, n.content AS content, collect(t.todoId) AS linkedTodos";
            
            var cursor = await tx.RunAsync(query);
            var records = await cursor.ToListAsync();
            
            return records.Select(r => new NoteDTO
            {
                Id = r["id"].As<string>(),
                Content = r["content"].As<string>(),
                LinkedTodoIds = r["linkedTodos"].As<List<string>>() ?? new List<string>()
            }).ToList();
        });
    }

    public async Task LinkNoteToTodoAsync(string noteId, string todoId)
    {
        await using var session = _driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = @"
                MATCH (n:Note { id: $noteId })
                MERGE (t:TodoRef { todoId: $todoId })
                MERGE (n)-[:RELATED_TO]->(t)";
            await tx.RunAsync(query, new { noteId, todoId });
        });
    }
    
    public async Task DeleteNoteAsync(string id)
    {
        await using var session = _driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            var query = "MATCH (n:Note { id: $id }) DETACH DELETE n";
            await tx.RunAsync(query, new { id });
        });
    }

    public void Dispose()
    {
        _driver?.Dispose();
    }

    public ValueTask DisposeAsync()
    {
        return _driver?.DisposeAsync() ?? ValueTask.CompletedTask;
    }
}
