// Gemini Repo Evaluator
// Node.js script to analyze GitHub repos and generate Markdown reports

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 1. Get repo info from GitHub API
async function fetchRepoData(repoUrl) {
  // Extract owner/repo from URL
  const match = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:$|\/)/);
  if (!match) throw new Error('Invalid GitHub URL');
  const owner = match[1];
  const repo = match[2];
  // Get repo contents
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
  const { data } = await axios.get(apiUrl);
  return { owner, repo, contents: data };
}

// 2. Download README.md and key files
async function fetchFile(owner, repo, filePath) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  try {
    const { data } = await axios.get(apiUrl);
    if (data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf8');
    }
    return data.content;
  } catch (e) {
    return null;
  }
}

// 3. Analyze repo structure and files
function analyzeStructure(contents) {
  const files = contents.map(item => item.name);
  return {
    hasReadme: files.includes('README.md'),
    hasTests: files.some(f => /test|spec/i.test(f)),
    hasDocs: files.includes('docs') || files.includes('documentation'),
    files,
  };
}

// 4. Prepare prompt for Gemini
function buildGeminiPrompt({ readme, structure, codeFiles }) {
  return `Avalie o seguinte repositório de acordo com os critérios:

3.1 Qualidade de Engenharia de Software (ISO/IEC 25010)
- Adequação Funcional: README.md e estrutura
- Manutenibilidade: clareza, comentários, padronização
- Confiabilidade: existência de testes
- Usabilidade: documentação
- Desempenho: velocidade e recursos

3.2 Qualidade de Aplicação de IA
- Origem e tratamento dos dados
- Técnicas aplicadas
- Estratégia de validação e escolha de modelos
- Métricas de avaliação, custo e desempenho
- Segurança e governança

README.md:
${readme || 'Não encontrado'}

Estrutura:
${JSON.stringify(structure, null, 2)}

Arquivos de código:
${codeFiles.map(f => `Arquivo: ${f.name}\nConteúdo:\n${f.content ? f.content.slice(0, 500) : 'Não encontrado'}...`).join('\n\n')}

Gere um relatório em Markdown e atribua uma nota de 0 a 10.`;
}

// 5. Call Gemini API (pseudo-code, replace with real call)
async function callGemini(prompt) {
  // Replace with actual Gemini API call
  return `# Relatório de Avaliação\n\nNota: 8.5\n\n- Adequação Funcional: ...\n- Manutenibilidade: ...\n...`;
}

// 6. Main function
async function evaluateRepo(repoUrl) {
  const { owner, repo, contents } = await fetchRepoData(repoUrl);
  const structure = analyzeStructure(contents);
  const readme = await fetchFile(owner, repo, 'README.md');
  // Get up to 3 code files
  const codeFileNames = structure.files.filter(f => /\.js$|\.py$|\.ts$|\.java$/.test(f)).slice(0, 3);
  const codeFiles = [];
  for (const fileName of codeFileNames) {
    const content = await fetchFile(owner, repo, fileName);
    codeFiles.push({ name: fileName, content });
  }
  const prompt = buildGeminiPrompt({ readme, structure, codeFiles });
  const report = await callGemini(prompt);
  fs.writeFileSync(path.join(__dirname, `${repo}_report.md`), report);
  console.log('Relatório gerado:', `${repo}_report.md`);
}

// Exemplo de uso:
// evaluateRepo('https://github.com/owner/repo');

module.exports = { evaluateRepo };