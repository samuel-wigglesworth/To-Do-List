using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace TodoApi.Models;

public class TodoItem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string? Name { get; set; }

    public bool IsComplete { get; set; }

    /// <summary>
    /// Internal field — never exposed through the public API (use TodoItemDTO).
    /// </summary>
    public string? Secret { get; set; }
}
