using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using OpenAI;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);

// Carrega chave da OpenAI do User Secrets
string apiKey = builder.Configuration["OpenAI:ApiKey"];
if (string.IsNullOrWhiteSpace(apiKey))
{
    Console.WriteLine("⚠️ Chave da OpenAI não encontrada.");
    Console.WriteLine("Execute: dotnet user-secrets set \"OpenAI:ApiKey\" \"sua_chave\"");
    return;
}

var client = new OpenAIClient(apiKey);

var app = builder.Build();

app.MapPost("/validate", async (HttpContext context) =>
{
    try
    {
        using var reader = new StreamReader(context.Request.Body);
        string code = await reader.ReadToEndAsync();

        var request = new ChatCompletionRequest
        {
            Model = "gpt-4o-mini",
            Messages =
            {
                new ChatMessage(ChatRole.System, "Você é um avaliador rigoroso de código HTML, CSS e JS."),
                new ChatMessage(ChatRole.User, $"Analise este código:\n{code}")
            }
        };

        var response = await client.Chat.CreateCompletionAsync(request);

        string output = response.Choices[0].Message.Content;

        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { result = output }));
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
    }
});

app.Run();
