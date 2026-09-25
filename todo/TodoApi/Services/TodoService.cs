using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TodoApi.Models;

namespace TodoApi.Services;

/// <summary>
/// Singleton service that wraps all MongoDB CRUD operations for TodoItems.
/// MongoClient is thread-safe and intended to be used as a singleton.
/// </summary>
public class TodoService
{
    private readonly IMongoCollection<TodoItem> _todoItems;

    public TodoService(IOptions<TodoDatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _todoItems = database.GetCollection<TodoItem>(settings.Value.TodoItemsCollectionName);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public async Task<List<TodoItem>> GetAsync() =>
        await _todoItems.Find(_ => true).ToListAsync();

    public async Task<TodoItem?> GetAsync(string id) =>
        await _todoItems.Find(x => x.Id == id).FirstOrDefaultAsync();

    // ── Write ─────────────────────────────────────────────────────────────────

    public async Task CreateAsync(TodoItem newItem) =>
        await _todoItems.InsertOneAsync(newItem);

    public async Task UpdateAsync(string id, TodoItem updatedItem) =>
        await _todoItems.ReplaceOneAsync(x => x.Id == id, updatedItem);

    public async Task RemoveAsync(string id) =>
        await _todoItems.DeleteOneAsync(x => x.Id == id);
}
