
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
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

app.MapPost("/api/ia-analyze", async (HttpRequest request) =>
{
	using var reader = new StreamReader(request.Body);
	var body = await reader.ReadToEndAsync();
	var code = System.Text.Json.JsonDocument.Parse(body).RootElement.GetProperty("code").GetString();

	string prompt = $"Avalie o seguinte código, verifique se está semanticamente correto, atribua uma nota de 0 a 10. Logo após, forneça um feedback construtivo:\n\n{code}";

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

	var response = await httpClient.PostAsync(deepSeekApiUrl, content);
	var responseString = await response.Content.ReadAsStringAsync();

	string nota = "?";
	string feedback = "";
	try
	{
		var doc = System.Text.Json.JsonDocument.Parse(responseString);
		var msg = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
		var notaMatch = System.Text.RegularExpressions.Regex.Match(msg, @"Nota[:\s]+(\d+)");
		if (notaMatch.Success) nota = notaMatch.Groups[1].Value;
		feedback = msg;
	}
	catch { feedback = "Erro ao processar resposta da IA."; }

	return Results.Json(new { nota, feedback });
});

app.Run();
