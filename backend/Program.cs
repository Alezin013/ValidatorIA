
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

// Configuração do servidor ASP.NET Core minimalista
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5500"); // Porta fixa
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll",
		policy => policy.AllowAnyOrigin()
						.AllowAnyHeader()
						.AllowAnyMethod());
});

var app = builder.Build();
app.UseCors("AllowAll");

// Endpoint para análise de código por IA (DeepSeek)
app.MapPost("/api/ia-analyze", async (HttpRequest request) =>
{
	// Lê o corpo da requisição (JSON)
	using var reader = new StreamReader(request.Body);
	var body = await reader.ReadToEndAsync();
	string code = null;
	try
	{
		var json = System.Text.Json.JsonDocument.Parse(body);
		if (json.RootElement.TryGetProperty("code", out var codeProp))
			code = codeProp.GetString();
	}
	catch
	{
		return Results.BadRequest(new { error = "JSON inválido ou campo 'code' ausente." });
	}
	if (string.IsNullOrWhiteSpace(code))
		return Results.BadRequest(new { error = "Código não enviado." });

	// Prompt customizável
	string prompt = $"Avalie o seguinte código, verifique se está semanticamente correto, atribua uma nota de 0 a 10. Logo após, forneça um feedback construtivo:\n\n{code}";

	// Chave e URL da API DeepSeek
	string deepSeekApiKey = "sk-a22fcfa3a94c4edebafae6c595180130"; // Troque pela sua chave
	string deepSeekApiUrl = "https://api.deepseek.com/v1/chat/completions"; // Troque se necessário

	var payload = new
	{
		model = "deepseek-chat",
		messages = new[] {
			new { role = "user", content = prompt }
		},
		temperature = 0.7
	};

	var httpClient = new HttpClient();
	httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {deepSeekApiKey}");

	var jsonPayload = System.Text.Json.JsonSerializer.Serialize(payload);
	var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

	string nota = "?";
	string feedback = "";
	try
	{
		var response = await httpClient.PostAsync(deepSeekApiUrl, content);
		var responseString = await response.Content.ReadAsStringAsync();
		var doc = System.Text.Json.JsonDocument.Parse(responseString);
		var msg = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
		// Evita erro de referência nula
		if (!string.IsNullOrWhiteSpace(msg))
		{
			var notaMatch = System.Text.RegularExpressions.Regex.Match(msg, @"Nota[:\s]+(\d+)");
			if (notaMatch.Success) nota = notaMatch.Groups[1].Value;
			feedback = msg;
		}
		else
		{
			feedback = "Resposta da IA vazia.";
		}
	}
	catch (Exception ex)
	{
		feedback = $"Erro ao processar resposta da IA: {ex.Message}";
	}

	return Results.Json(new { nota, feedback });
});

app.Run();

app.Run();
