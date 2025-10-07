
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

// Exemplo de backend minimalista ASP.NET Core
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
var app = builder.Build();

// Endpoint para análise por IA (DeepSeek)
app.MapPost("/api/ia-analyze", async (HttpRequest request) =>
{
	// Lê o corpo da requisição (JSON)
	using var reader = new StreamReader(request.Body);
	var body = await reader.ReadToEndAsync();
	// Extrai o código do JSON recebido
	var code = System.Text.Json.JsonDocument.Parse(body).RootElement.GetProperty("code").GetString();

	// MONTE SEU PROMPT PERSONALIZADO AQUI
	string prompt = $"Avalie o seguinte código, verifique se está semanticamente correto, atribua uma nota de 0 a 10. Logo após, forneça um feedback construtivo:\n\n{code}";

	// Chave e URL da API DeepSeek (preencha com seus dados)
	string deepSeekApiKey = "SUA_CHAVE_AQUI"; // Troque pela sua chave
	string deepSeekApiUrl = "https://api.deepseek.com/v1/chat/completions"; // Troque se necessário

	// Monta o payload para DeepSeek
	var payload = new
	{
		model = "deepseek-chat", // ou outro modelo disponível
		messages = new[] {
			new { role = "user", content = prompt }
		},
		temperature = 0.7
	};

	var httpClient = new HttpClient();
	httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {deepSeekApiKey}");

	var jsonPayload = System.Text.Json.JsonSerializer.Serialize(payload);
	var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

	// Faz a requisição para DeepSeek
	var response = await httpClient.PostAsync(deepSeekApiUrl, content);
	var responseString = await response.Content.ReadAsStringAsync();

	// Extrai a resposta do modelo
	string nota = "?";
	string feedback = "";
	try
	{
		var doc = System.Text.Json.JsonDocument.Parse(responseString);
		var msg = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
		// Tenta extrair nota e feedback do texto retornado
		// Exemplo: "Nota: 8\nFeedback: ..."
		var notaMatch = System.Text.RegularExpressions.Regex.Match(msg, @"Nota[:\s]+(\d+)");
		if (notaMatch.Success) nota = notaMatch.Groups[1].Value;
		feedback = msg;
	}
	catch { feedback = "Erro ao processar resposta da IA."; }

	// Retorna nota e feedback para o front-end
	return Results.Json(new { nota, feedback });
});

app.Run();
