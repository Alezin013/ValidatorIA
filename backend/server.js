const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI('SUA_API_KEY_GEMINI'); // Coloque sua chave aqui

// Validação tradicional via URL
app.post('/api/validate', async (req, res) => {
  const { code } = req.body;
  // Verifica se é uma URL válida do GitHub
  if (code && code.startsWith('https://github.com/')) {
    // Prompt para Gemini
    const prompt = `Avalie o repositório do GitHub na URL: ${code}\nGere uma nota de 0 a 10, um relatório em Markdown e um ranking fictício.`;
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const markdown = result.text || 'Relatório não gerado.';
      // Exemplo de nota extraída (ajuste conforme resposta real)
      const nota = 8.5;
      // Ranking fictício
      const ranking = [
        { equipe: 'Equipe A', nota: 9.2 },
        { equipe: 'Equipe B', nota: 8.5 },
        { equipe: 'Equipe C', nota: 7.8 }
      ];
      // Salva relatório
      fs.writeFileSync(path.join(__dirname, '../relatorios/relatorio.md'), markdown);
      res.json({ success: true, nota, markdown, ranking });
    } catch (err) {
      res.json({ success: false, error: 'Erro na análise IA.' });
    }
  } else {
    res.json({ success: false, error: 'URL inválida.' });
  }
});

// Análise IA via arquivo
app.post('/api/ia-analyze', async (req, res) => {
  const { code } = req.body;
  // Prompt para Gemini
  const prompt = `Avalie o seguinte código:\n${code}\nGere uma nota de 0 a 10 e um relatório em Markdown.`;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const markdown = result.text || 'Relatório não gerado.';
    // Exemplo de nota extraída (ajuste conforme resposta real)
    const nota = 8.5;
    // Salva relatório
    fs.writeFileSync(path.join(__dirname, '../relatorios/relatorio.md'), markdown);
    res.json({ nota, feedback: markdown });
  } catch (err) {
    res.json({ error: 'Erro na análise IA.' });
  }
});

app.listen(5500, () => console.log('Backend rodando na porta 5500'));
