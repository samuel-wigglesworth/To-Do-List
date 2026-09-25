using TodoApi.Models;
using TodoApi.Services;

var builder = WebApplication.CreateBuilder(args);

// ── MongoDB configuration ─────────────────────────────────────────────────────
builder.Services.Configure<TodoDatabaseSettings>(
    builder.Configuration.GetSection("TodoDatabase"));

// Singleton: MongoClient is thread-safe and should be reused across requests
builder.Services.AddSingleton<TodoService>();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow the Vite dev server (port 5173) to call the API
builder.Services.AddCors(options =>
    options.AddPolicy("ReactDevClient", policy =>
        policy.WithOrigins(
                  "http://localhost:5173",
                  "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()));

// ── MVC + JSON ────────────────────────────────────────────────────────────────
// Disable camelCase: property names in JSON match CLR property names exactly
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.PropertyNamingPolicy = null);

// ── OpenAPI (Scalar/Swagger UI available at /openapi/v1.json) ─────────────────
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("ReactDevClient");
app.UseAuthorization();
app.MapControllers();

app.Run();
