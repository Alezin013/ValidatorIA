using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

// ==========================================================
// 🧠 CONFIGURAÇÃO INICIAL
// ==========================================================
var builder = WebApplication.CreateBuilder(args);

// 🔹 Define porta fixa (opcional, útil para evitar portas aleatórias)
builder.WebHost.UseUrls("http://localhost:5501");

// 🔹 Permite leitura da chave do Gemini via User Secrets
builder.Configuration.AddUserSecrets<Program>();

// 🔹 Adiciona suporte a HttpClient (para chamadas à API do Gemini)
builder.Services.AddHttpClient();

// ==========================================================
// 🚀 CONSTRÓI A APLICAÇÃO
// ==========================================================
var app = builder.Build();

// ==========================================================
// 🔧 CONFIGURA PIPELINE DE ROTEAMENTO
// ==========================================================
app.UseRouting();

// ==========================================================
// ✅ REGISTRA O ENDPOINT /validate
// ==========================================================
app.UseEndpoints(endpoints =>
{
    endpoints.MapPost("/validate", async (HttpContext context, IHttpClientFactory httpFactory) =>
    {
        try
        {
            // Lê o corpo da requisição
            using var reader = new StreamReader(context.Request.Body);
            string code = await reader.ReadToEndAsync();

            // Obtém a chave do Gemini
            var apiKey = builder.Configuration["Gemini:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "⚠️ Chave da Gemini API não encontrada nos User Secrets." }));
                return;
            }

            // Prompt enviado à IA Gemini
            string prompt = $"Você é um avaliador rigoroso de código HTML, CSS e JavaScript. Analise este código e descreva erros, melhorias e boas práticas:\n\n{code}";

            // Corpo da requisição para Gemini
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

            // Converte para JSON e envia via POST
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

            var client = httpFactory.CreateClient();
            var response = await client.PostAsync(url, content);
            var body = await response.Content.ReadAsStringAsync();

            // Verifica sucesso
            if (!response.IsSuccessStatusCode)
            {
                context.Response.StatusCode = (int)response.StatusCode;
                await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = $"Erro da Gemini API: {body}" }));
                return;
            }

            // Extrai o texto de resposta do Gemini
            var doc = JsonDocument.Parse(body);
            string result = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Retorna JSON ao cliente
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { result }));
        }
        catch (Exception ex)
        {
            // Captura erros gerais
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
        }
    });
});

// ==========================================================
// 🔍 LISTA DE ENDPOINTS REGISTRADOS (LOG DE DEBUG)
// ==========================================================
var ds = app.Services.GetRequiredService<EndpointDataSource>();
foreach (var e in ds.Endpoints)
{
    Console.WriteLine("↪ " + e.DisplayName);
}

// ==========================================================
// 🟢 INICIA A APLICAÇÃO
// ==========================================================
app.Run();
