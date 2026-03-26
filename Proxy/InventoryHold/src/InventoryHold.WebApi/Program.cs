using System.Text.Json;
using System.Text.Json.Serialization;
using InventoryHold.Domain;
using InventoryHold.Domain.Services;
using InventoryHold.Infrastructure;
using InventoryHold.Infrastructure.Mongo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
});
builder.Services.Configure<HoldOptions>(builder.Configuration.GetSection(HoldOptions.SectionName));
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<HoldApplicationService>();
builder.Services.AddHostedService<InventoryDataSeeder>();

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
if (corsOrigins is null || corsOrigins.Length == 0)
{
    var raw = builder.Configuration["Cors:AllowedOrigins"];
    corsOrigins = string.IsNullOrWhiteSpace(raw)
        ? new[] { "http://localhost:5173", "http://127.0.0.1:5173" }
        : raw.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
}

builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();
