using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

// ==========================================================
// 🧠 CONFIGURAÇÃO INICIAL DO SERVIDOR ASP.NET
// ==========================================================
var builder = WebApplication.CreateBuilder(args);

// 🔹 Define porta fixa
builder.WebHost.UseUrls("http://localhost:5501");

// 🔹 Permite leitura da chave da API do Gemini via User Secrets
builder.Configuration.AddUserSecrets(System.Reflection.Assembly.GetExecutingAssembly());

// 🔹 Adiciona suporte a HttpClient (necessário para acessar a API do Gemini)
builder.Services.AddHttpClient();

// ==========================================================
// 🚀 CONSTRÓI A APLICAÇÃO
// ==========================================================
var app = builder.Build();

// ==========================================================
// ✅ ENDPOINT: /validate
// ==========================================================
app.MapPost("/validate", async (HttpContext context, IHttpClientFactory httpFactory) =>
{
    try
    {
        // 🔸 Lê o corpo da requisição
        using var reader = new StreamReader(context.Request.Body);
        string code = await reader.ReadToEndAsync();

        // 🔸 Obtém a chave da API Gemini (configure com: dotnet user-secrets set "Gemini:ApiKey" "SUA_CHAVE_AQUI")
        var apiKey = builder.Configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "⚠️ Chave da Gemini API não encontrada. Configure usando: dotnet user-secrets set \"Gemini:ApiKey\" \"SUA_CHAVE_AQUI\"" }));
            return;
        }

        // 🔸 Monta o prompt de análise
        string prompt = $"Você é um avaliador rigoroso de código HTML, CSS e JavaScript. Analise este código e descreva erros, melhorias e boas práticas:\n\n{code}";

        // 🔸 Cria o corpo da requisição para a API Gemini
        var payload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        // 🔸 Serializa para JSON
        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // 🔸 Endpoint oficial da API Gemini
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

        // 🔸 Envia requisição
        var client = httpFactory.CreateClient();
        var response = await client.PostAsync(url, content);
        var body = await response.Content.ReadAsStringAsync();

        // 🔸 Verifica se houve erro na resposta da API
        if (!response.IsSuccessStatusCode)
        {
            context.Response.StatusCode = (int)response.StatusCode;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = $"Erro da Gemini API: {body}" }));
            return;
        }

        // 🔸 Lê o texto retornado pela Gemini
        var doc = JsonDocument.Parse(body);
        if (!doc.RootElement.TryGetProperty("candidates", out var candidates))
            throw new Exception("Resposta inesperada da Gemini API: " + body);

        string result = candidates[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        // 🔸 Retorna o resultado como JSON
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { result }));
    }
    catch (Exception ex)
    {
        Console.WriteLine("Erro interno: " + ex);
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
    }
});

// ==========================================================
// 🟢 INICIA A APLICAÇÃO
// ==========================================================
app.Run();
