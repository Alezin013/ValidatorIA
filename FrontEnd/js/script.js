// const form = document.querySelector('.esquerda-container'); // Alterado de ID para classe
// const fileInput = document.getElementById('file-input');
// const feedback = document.getElementById('file-feedback');

// // Evita comportamento padrão do navegador
// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//     form.addEventListener(eventName, preventDefaults, false);
// });

// function preventDefaults(e) {
//     e.preventDefault();
//     e.stopPropagation();
// }

// // Adiciona destaque ao arrastar
// ['dragenter', 'dragover'].forEach(eventName => {
//     form.addEventListener(eventName, () => {
//         form.classList.add('highlight');
//     }, false);
// });

// ['dragleave', 'drop'].forEach(eventName => {
//     form.addEventListener(eventName, () => {
//         form.classList.remove('highlight');
//     }, false);
// });

// // Quando o arquivo é solto
// form.addEventListener('drop', (e) => {
//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//         fileInput.files = files;
//         showFeedback(files[0]);
//     }
// });

// // Quando o usuário escolhe um arquivo pelo botão
// fileInput.addEventListener('change', () => {
//     if (fileInput.files.length > 0) {
//         showFeedback(fileInput.files[0]);
//     }
// });

// // Função para mostrar o nome do arquivo
// function showFeedback(file) {
//     feedback.textContent = `✅ Arquivo "${file.name}" carregado com sucesso`;
// }

// // Validação tradicional do código colado no textarea
// document.getElementById('validator-form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const code = document.getElementById('code-input').value;
//     const type = document.querySelector('input[name="type"]:checked').value;
//     const resultDiv = document.getElementById('result');
//     resultDiv.textContent = 'Validando...';

//     // Exemplo de requisição para o backend tradicional
//     fetch('http://localhost:5500/api/validate', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ code, type })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             resultDiv.textContent = 'Código válido!';
//             resultDiv.style.background = '#e8f5e9';
//             resultDiv.style.color = '#2e7d32';
//         } else {
//             resultDiv.textContent = 'Erro: ' + (data.error || 'Código inválido.');
//             resultDiv.style.background = '#ffebee';
//             resultDiv.style.color = '#c62828';
//         }
//     })
//     .catch(() => {
//         resultDiv.textContent = 'Não foi possível validar. Verifique a conexão com o servidor.';
//         resultDiv.style.background = '#fff3e0';
//         resultDiv.style.color = '#ef6c00';
//     });
// });

// // Análise de arquivo por IA
// document.getElementById('file-form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const fileInput = document.getElementById('file-input');
//     const resultDiv = document.getElementById('result');

//     // Verifica se algum arquivo foi selecionado
//     if (!fileInput.files || fileInput.files.length === 0) {
//         resultDiv.textContent = 'Selecione um arquivo para análise.';
//         resultDiv.style.background = '#fff3e0';
//         resultDiv.style.color = '#ef6c00';
//         return;
//     }

//     const file = fileInput.files[0];
//     const reader = new FileReader();

//     // Lê o conteúdo do arquivo selecionado
//     reader.onload = function(event) {
//         const code = event.target.result;
//         resultDiv.textContent = 'Analisando com IA...';

//         // Envia o conteúdo do arquivo para o backend IA
//     fetch('http://localhost:5500/api/ia-analyze', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ code }) // Envia o código lido
//         })
//         .then(response => response.json())
//         .then(data => {
//             // Espera receber um objeto { nota: 1-10, feedback: "..." }
//             if (typeof data.nota === 'number') {
//                 resultDiv.innerHTML = `<strong>Nota da IA:</strong> ${data.nota} / 10<br>${data.feedback ? `<em>${data.feedback}</em>` : ''}`;
//                 resultDiv.style.background = '#e3f2fd';
//                 resultDiv.style.color = '#1565c0';
//             } else {
//                 resultDiv.textContent = 'Não foi possível obter a nota da IA.';
//                 resultDiv.style.background = '#ffebee';
//                 resultDiv.style.color = '#c62828';
//             }
//         })
//         .catch(() => {
//             resultDiv.textContent = 'Erro ao conectar com o backend IA.';
//             resultDiv.style.background = '#fff3e0';
//             resultDiv.style.color = '#ef6c00';
//         });
//     };

//     // Lê o arquivo como texto
//     reader.readAsText(file);
// });








 // ==============================================
  // VARIÁVEIS E EVENTOS DO DRAG & DROP
  // ==============================================
  const form = document.querySelector('.esquerda-container');
  const fileInput = document.getElementById('file-input');
  const feedback = document.getElementById('file-feedback');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    form.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    form.addEventListener(eventName, () => form.classList.add('highlight'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    form.addEventListener(eventName, () => form.classList.remove('highlight'), false);
  });

  form.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      showFeedback(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      showFeedback(fileInput.files[0]);
    }
  });

  function showFeedback(file) {
    feedback.textContent = `✅ Arquivo "${file.name}" carregado com sucesso`;
  }

  // ==============================================
  // RANKING GLOBAL E FUNÇÃO DE ATUALIZAÇÃO
  // ==============================================
  const RANKING_KEY = 'validatoria-ranking';
  const ranking = [];

  function loadRanking() {
    try {
      const raw = localStorage.getItem(RANKING_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        ranking.splice(0, ranking.length, ...arr);
      }
    } catch (e) {
      console.error('Erro ao carregar ranking localStorage', e);
    }
  }

  function saveRanking() {
    try {
      localStorage.setItem(RANKING_KEY, JSON.stringify(ranking.slice(0, 50)));
    } catch (e) {
      console.error('Erro ao salvar ranking localStorage', e);
    }
  }

  function atualizarTabelaRanking() {
    const tbody = document.querySelector("#rankingTable tbody");
    tbody.innerHTML = "";

    ranking.sort((a, b) => b.nota - a.nota);

    ranking.forEach((item, index) => {
      const tr = document.createElement("tr");
      const tdRank = document.createElement("td");
      const tdNome = document.createElement("td");
      const tdNota = document.createElement("td");

      tdRank.innerHTML = index === 0 ? '<i class="fa-solid fa-crown"></i>' : `${index + 1}°`;
      tdNome.textContent = item.nome;
      tdNota.textContent = item.nota;

      tr.appendChild(tdRank);
      tr.appendChild(tdNome);
      tr.appendChild(tdNota);
      tbody.appendChild(tr);
    });
    // persistir
    saveRanking();
  }

  // carregar ranking salvo ao iniciar
  loadRanking();
  atualizarTabelaRanking();

  // ==============================================
  // ANÁLISE DE ARQUIVO POR IA
  // ==============================================
  document.getElementById('file-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('result');

    if (!fileInput.files || fileInput.files.length === 0) {
      resultDiv.textContent = 'Selecione um arquivo para análise.';
      resultDiv.style.background = '#fff3e0';
      resultDiv.style.color = '#ef6c00';
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const code = event.target.result;
      resultDiv.textContent = 'Analisando com IA...';

    // Análise de arquivo no cliente (heurística simples)
    try {
      const lines = code.split(/\r?\n/).length;
      let score = 5.0;
      const notes = [];
      if (lines > 200) {
        score += 1;
        notes.push('Arquivo com muitas linhas (bom sinal de conteúdo)');
      } else if (lines < 20) {
        score -= 0.5;
        notes.push('Arquivo muito curto');
      }
      if (/TODO|FIXME/i.test(code)) {
        score -= 0.5;
        notes.push('Contém TODO/FIXME');
      }
      if (/license|licença/i.test(code)) {
        score += 0.5;
        notes.push('Possui referência a licença');
      }
      const scoreRounded = Math.max(0, Math.min(10, Math.round(score * 10) / 10));
      resultDiv.innerHTML = `<strong>Nota (análise local):</strong> ${scoreRounded} / 10<br><div style="margin-top:8px;white-space:pre-wrap">${notes.join('\n') || 'Sem observações'}</div>`;
      resultDiv.style.background = '#e3f2fd';
      resultDiv.style.color = '#1565c0';

      const fileName = file.name.replace(/\.[^/.]+$/, "");
      ranking.push({ nome: fileName, nota: scoreRounded });
      atualizarTabelaRanking();
    } catch (e) {
      console.error(e);
      resultDiv.textContent = 'Erro ao analisar o arquivo localmente.';
      resultDiv.style.background = '#fff3e0';
      resultDiv.style.color = '#ef6c00';
    }
    };

    reader.readAsText(file);
  });

  // ==============================================
  // ANÁLISE VIA URL (GitHub)
  // ==============================================
  document.getElementById('validator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('result');
    const repoUrl = document.getElementById('code-input').value.trim();

    if (!repoUrl) {
      resultDiv.textContent = 'Cole a URL do repositório do GitHub no campo acima.';
      resultDiv.style.background = '#fff3e0';
      resultDiv.style.color = '#ef6c00';
      return;
    }

    resultDiv.textContent = 'Analisando repositório...';

    // Tenta usar backend se disponível, senão faz análise no cliente via GitHub API
    const backendUrl = 'http://localhost:5501/api/analyze';
    fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl }),
      // tempo curto: se o backend não responder rápido, vamos cair para o modo cliente
      // (não há timeout nativo no fetch, então cairemos apenas no reject)
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.success) {
          resultDiv.innerHTML = `<strong>Nota:</strong> ${data.score} / 10<br><div style="margin-top:8px;white-space:pre-wrap">${data.markdown}</div>`;
          resultDiv.style.background = '#e8f5e9';
          resultDiv.style.color = '#2e7d32';

          const repoNameMatch = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/i);
          const repoName = repoNameMatch ? repoNameMatch[1] : repoUrl;

          ranking.push({ nome: repoName, nota: data.score });
          atualizarTabelaRanking();
          return;
        }
        // se backend respondeu mas com erro, cair para cliente
        return analyzeRepoClient(repoUrl, resultDiv);
      })
      .catch(err => {
        // backend indisponível -> modo cliente
        console.warn('Backend indisponível, usando modo cliente', err);
        analyzeRepoClient(repoUrl, resultDiv);
      });
  });

  // ==============================================
  // Função: análise via GitHub API diretamente no cliente
  // ==============================================
  async function analyzeRepoClient(repoUrl, resultDiv) {
    resultDiv.textContent = 'Analisando via GitHub (cliente)...';
    try {
      const m = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i);
      if (!m) {
        resultDiv.textContent = 'URL inválida. Use uma URL do GitHub.';
        resultDiv.style.background = '#ffebee';
        resultDiv.style.color = '#c62828';
        return;
      }
      const owner = m[1];
      const repo = m[2].replace(/\.git$/i, '');

      const repoApi = `https://api.github.com/repos/${owner}/${repo}`;
      const contentsApi = `https://api.github.com/repos/${owner}/${repo}/contents`;

      const repoResp = await fetch(repoApi, { headers: { 'User-Agent': 'validator-ia' } });
      if (!repoResp.ok) {
        resultDiv.textContent = `Erro ao buscar repositório: ${repoResp.status}`;
        resultDiv.style.background = '#ffebee';
        resultDiv.style.color = '#c62828';
        return;
      }
      const repoData = await repoResp.json();

      const contentsResp = await fetch(contentsApi, { headers: { 'User-Agent': 'validator-ia' } });
      let contents = [];
      if (contentsResp.ok) {
        contents = await contentsResp.json();
      }

      // Heurística cliente (mesma do backend)
      let score = 5.0;
      const reasons = [];
      if (repoData.description) { score += 1.0; reasons.push('Tem descrição do repositório'); }
      if (repoData.license && repoData.license.spdx_id !== 'NOASSERTION') { score += 1.0; reasons.push('Contém licença'); }
      const hasReadme = Array.isArray(contents) && contents.some(c => /readme/i.test(c.name));
      if (hasReadme) { score += 1.0; reasons.push('Inclui README'); }
      if (repoData.stargazers_count && repoData.stargazers_count > 0) { score += 1.0; reasons.push('Possui estrelas (indicador de uso)'); }
      const filesCount = Array.isArray(contents) ? contents.length : 0;
      if (filesCount > 10) { score += 1.0; reasons.push('Repositório com muitos arquivos (bom sinal de projeto)'); }
      if (score > 10) score = 10;
      const scoreRounded = Math.round(score * 10) / 10;

      const markdown = `# Análise (cliente): ${owner}/${repo}\n\n**Nota:** ${scoreRounded} / 10\n\n**Resumo:**\n- ${reasons.join('\n- ') || 'Nenhuma característica positiva detectada.'}`;

      resultDiv.innerHTML = `<strong>Nota:</strong> ${scoreRounded} / 10<br><div style="margin-top:8px;white-space:pre-wrap">${markdown}</div>`;
      resultDiv.style.background = '#e8f5e9';
      resultDiv.style.color = '#2e7d32';

      const repoName = `${owner}/${repo}`;
      ranking.push({ nome: repoName, nota: scoreRounded });
      atualizarTabelaRanking();
    } catch (err) {
      console.error(err);
      resultDiv.textContent = 'Erro interno na análise cliente.';
      resultDiv.style.background = '#fff3e0';
      resultDiv.style.color = '#ef6c00';
    }
  }
