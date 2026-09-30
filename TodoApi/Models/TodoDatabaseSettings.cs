namespace TodoApi.Models;

/// <summary>
/// Strongly-typed binding for the "TodoDatabase" section in appsettings.json.
/// </summary>
public class TodoDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string TodoItemsCollectionName { get; set; } = null!;
}
