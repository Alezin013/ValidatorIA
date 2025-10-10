const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Servir a pasta FrontEnd estaticamente para facilitar testes (abra http://localhost:5500/)
app.use(express.static(path.join(__dirname, '../FrontEnd')));

// Fallback simples para fetch quando Node < 18 (requer instalar 'node-fetch' se necessário)
let fetchFn = global.fetch;
try {
  if (!fetchFn) {
    // tenta carregar node-fetch (versão 2.x compatível com CommonJS)
    // se não estiver instalado, as chamadas a fetch vão lançar e o usuário verá a instrução para instalar
    // instale com: npm install node-fetch@2
    // Observação: node-fetch v3 é ESM-only e não funciona com require em CommonJS
    const nf = require('node-fetch');
    fetchFn = nf;
  }
} catch (e) {
  // não conseguir carregar node-fetch: deixamos fetchFn como está (pode ser undefined)
}

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

// In-memory ranking storage for analyzed repos
const analyses = [];

// New endpoint: analyze a GitHub repo URL with a lightweight heuristic (no external AI required)
app.post('/api/analyze', async (req, res) => {
  const repoUrl = req.body.repoUrl || req.body.code;
  if (!repoUrl || !repoUrl.startsWith('https://github.com/')) {
    return res.json({ success: false, error: 'URL inválida. Use uma URL do GitHub.' });
  }

  try {
    // Extract owner/repo
    const m = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i);
    if (!m) return res.json({ success: false, error: 'Não foi possível extrair owner/repo da URL.' });
    let owner = m[1];
    let repo = m[2].replace(/\.git$/i, '');

    // Use GitHub public API to fetch basic repo info and top-level contents
    const repoApi = `https://api.github.com/repos/${owner}/${repo}`;
    const contentsApi = `https://api.github.com/repos/${owner}/${repo}/contents`;

    // Node 18+ provides global fetch; this will throw if not available
    const repoResp = await fetch(repoApi, { headers: { 'User-Agent': 'validator-ia' } });
    if (!repoResp.ok) {
      return res.json({ success: false, error: `Erro ao buscar repositório: ${repoResp.status}` });
    }
    const repoData = await repoResp.json();

    const contentsResp = await fetch(contentsApi, { headers: { 'User-Agent': 'validator-ia' } });
    let contents = [];
    if (contentsResp.ok) {
      contents = await contentsResp.json();
    }

    // Heurística simples para gerar nota (0-10)
    let score = 5.0; // base
    const reasons = [];

    if (repoData.description) {
      score += 1.0;
      reasons.push('Tem descrição do repositório');
    }
    if (repoData.license && repoData.license.spdx_id !== 'NOASSERTION') {
      score += 1.0;
      reasons.push('Contém licença');
    }
    // README detection in top-level contents
    const hasReadme = contents.some(c => /readme/i.test(c.name));
    if (hasReadme) {
      score += 1.0;
      reasons.push('Inclui README');
    }
    if (repoData.stargazers_count && repoData.stargazers_count > 0) {
      score += 1.0;
      reasons.push('Possui estrelas (indicador de uso)');
    }
    const filesCount = Array.isArray(contents) ? contents.length : 0;
    if (filesCount > 10) {
      score += 1.0;
      reasons.push('Repositório com muitos arquivos (bom sinal de projeto)');
    }

    // Normalize score to max 10
    if (score > 10) score = 10;
    const scoreRounded = Math.round(score * 10) / 10;

    // Build markdown feedback
    const markdown = `# Análise automatizada: ${owner}/${repo}\n\n` +
      `**Nota:** ${scoreRounded} / 10\n\n` +
      `**Resumo:**\n- ${reasons.join('\n- ') || 'Nenhuma característica positiva detectada.'}\n\n` +
      `**Detalhes do repositório:**\n- Estrelas: ${repoData.stargazers_count || 0}\n- Issues abertas: ${repoData.open_issues_count || 0}\n- Tamanho (KB): ${repoData.size || 0}\n- Arquivos no top-level: ${filesCount}\n`;

    // Save analysis to in-memory list and produce a ranking
    analyses.push({ repo: `${owner}/${repo}`, score: scoreRounded });
    // Keep only last 50
    if (analyses.length > 50) analyses.shift();

    const ranking = analyses.slice().sort((a, b) => b.score - a.score).slice(0, 10);

    return res.json({ success: true, score: scoreRounded, markdown, ranking });
  } catch (err) {
    console.error('analyze error', err);
    return res.json({ success: false, error: 'Erro interno ao analisar o repositório.' });
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

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
