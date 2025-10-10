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
      const file = files[0];
      fileInput.files = files;
      showFeedback(file);
      // hide dashboard info when user has selected a file
      const info = document.getElementById('dashboardInfo');
      const res = document.getElementById('result');
      if (info) info.style.display = 'none';
      if (res) res.style.display = 'block';
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      showFeedback(file);
      // hide dashboard info when user has selected a file
      const info = document.getElementById('dashboardInfo');
      const res = document.getElementById('result');
      if (info) info.style.display = 'none';
      if (res) res.style.display = 'block';
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
        if (!raw) return false;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        // ensure every item has an addedAt timestamp for arrival-order charts
        const now = Date.now();
        const normalized = arr.map((it, idx) => {
          if (!it.addedAt) {
            // older entries get timestamps spaced in the past to preserve order
            return Object.assign({}, it, { addedAt: now - (arr.length - idx) * 1000 });
          }
          return it;
        });
        ranking.splice(0, ranking.length, ...normalized);
          return true;
        }
        return false;
    } catch (e) {
      console.error('Erro ao carregar ranking localStorage', e);
        return false;
    }
  }

  function saveRanking() {
    try {
      // Persist only top 9 entries
      localStorage.setItem(RANKING_KEY, JSON.stringify(ranking.slice(0, 9)));
    } catch (e) {
      console.error('Erro ao salvar ranking localStorage', e);
    }
  }

  function atualizarTabelaRanking() {
    const tbody = document.querySelector("#rankingTable tbody");
    tbody.innerHTML = "";
    // Sort descending and keep only top 9
    ranking.sort((a, b) => b.nota - a.nota);
    if (ranking.length > 9) ranking.splice(9);

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
    // update podium display
    updatePodium();
    // update line chart to reflect current ranking comparison
    try { updateLineChartFromRanking(); } catch (e) { /* ignore if chart not present */ }
  }

  // Build a simple line chart dataset comparing top N ranking scores
  function updateLineChartFromRanking() {
    const chart = window.lineChart;
    if (!chart) return;
    // Use arrival order (addedAt) rather than sorting by score
    const ordered = Array.isArray(ranking) ? ranking.slice().sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0)) : [];
    const labels = ordered.map((r, idx) => r.nome || `#${idx+1}`);
    const data = ordered.map(r => (typeof r.nota === 'number' ? r.nota : Number(r.nota) || 0));
    // If chart has no datasets, create one
    if (!chart.data || !Array.isArray(chart.data.datasets) || chart.data.datasets.length === 0) {
      chart.data = { labels, datasets: [{ label: 'Ranking - Notas', data, borderColor: 'rgba(54,162,235,1)', backgroundColor: 'rgba(54,162,235,0.2)', fill: true }] };
    } else {
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].label = 'Ranking - Notas';
    }
    chart.update();
  }

  // Smooth-scroll to dashboard section when results should be shown
  function scrollToDashboard() {
    try {
      const dashboardEl = document.getElementById('dashboard');
      if (dashboardEl && typeof dashboardEl.scrollIntoView === 'function') {
        dashboardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // fallback: change the hash
        window.location.hash = '#dashboard';
      }
    } catch (e) {
      // ignore scrolling errors
    }
  }

  // carregar ranking salvo ao iniciar
  loadRanking();
  atualizarTabelaRanking();

    // If the page was reloaded (not a fresh navigation), reset ranking per user request.
    // Behavior: if ranking is empty -> silently clear; if not empty -> ask user to confirm reset.
    function handlePageReloadReset() {
      // Navigation API: performance.getEntriesByType('navigation') may not be available in all browsers
      let wasReload = false;
      try {
        const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
        if (Array.isArray(navEntries) && navEntries.length > 0) {
          wasReload = navEntries[0].type === 'reload';
        } else if (performance && performance.navigation) {
          // legacy
          wasReload = performance.navigation.type === performance.navigation.TYPE_RELOAD;
        }
      } catch (e) {
        // ignore and assume not reload
      }

      if (!wasReload) return;

      // If ranking empty, just clear and update UI
      if (!Array.isArray(ranking) || ranking.length === 0) {
        // Ensure localStorage key removed
        try { localStorage.removeItem(RANKING_KEY); } catch (e) { }
        atualizarTabelaRanking();
        return;
      }

      // If there are items, ask the user whether to reset
      const confirmReset = confirm('A página foi recarregada. Deseja reiniciar o ranking? (OK = sim, Cancel = manter)');
      if (confirmReset) {
        ranking.splice(0, ranking.length);
        try { localStorage.removeItem(RANKING_KEY); } catch (e) { }
        atualizarTabelaRanking();
      } else {
        // user chose to keep ranking; nothing to do
      }
    }

    // Run the check shortly after load to ensure performance timing available
    window.addEventListener('load', () => setTimeout(handlePageReloadReset, 50));

  // If there's a saved lastAnalysis (from upload page), restore it into the dashboard
  function restoreLastAnalysis() {
    try {
      const raw = localStorage.getItem('lastAnalysis');
      if (!raw) return;
      const last = JSON.parse(raw);
      if (!last) return;
      const resultDiv = document.getElementById('result');
      const info = document.getElementById('dashboardInfo');
      if (info) info.style.display = 'none';
      const hint = document.getElementById('resultHint');
      if (hint) hint.style.display = 'none';
      if (resultDiv) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<strong>${last.nome}</strong><br><strong>Nota:</strong> ${last.nota} / 10<br><div style="margin-top:8px;white-space:pre-wrap">${(last.notes && last.notes.length) ? last.notes.join('\n') : ''}</div>`;
      }
      // update score box
      const scoreBox = document.getElementById('scoreBox');
      if (scoreBox) scoreBox.textContent = `${last.nota} / 10`;
      // update polar chart if breakdown present
      if (Array.isArray(last.breakdown) && last.breakdown.length > 0) {
        try { updatePolarChart(last.breakdown); } catch (e) { console.warn('Erro ao restaurar polar do lastAnalysis', e); }
      }
      // remove lastAnalysis so it doesn't persist indefinitely
      try { localStorage.removeItem('lastAnalysis'); } catch (e) { }
    } catch (e) {
      console.warn('Erro ao restaurar lastAnalysis', e);
    }
  }

  // try to restore when script loads (dashboard page)
  restoreLastAnalysis();

  // Clear ranking button handler (if button exists)
  const clearBtn = document.getElementById('clearRankingBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('Tem certeza que deseja limpar o ranking? Esta ação não pode ser desfeita.')) return;
      ranking.splice(0, ranking.length);
      try { localStorage.removeItem(RANKING_KEY); } catch (e) { console.error(e); }
      atualizarTabelaRanking();
    });
  }

  // Update podium elements: center (1st), left (2nd), right (3rd)
  function updatePodium() {
    const p1 = document.querySelector('.podio-1');
    const p2 = document.querySelector('.podio-2');
    const p3 = document.querySelector('.podio-3');
    // default
    if (p1) p1.textContent = ranking[0] ? `${ranking[0].nome}` : '--';
    if (p2) p2.textContent = ranking[1] ? `${ranking[1].nome}` : '--';
    if (p3) p3.textContent = ranking[2] ? `${ranking[2].nome}` : '--';
  }

  // Build per-requirement scores (5 items) from raw code (file upload)
  function buildPolarDataFromCode(code) {
    const values = [0,0,0,0,0];
    const lines = code.split(/\r?\n/).length;
    // description-like: check for a header comment at top
    const firstBlock = code.split(/\r?\n/).slice(0,8).join('\n');
    if (/\/\*|^\/\//.test(firstBlock) && firstBlock.length > 40) values[0] = 8;
    else if (firstBlock.length > 10) values[0] = 5;
    else values[0] = 2;
    // license mention
    values[1] = /license|licença/i.test(code) ? 9 : 1;
    // README-like: presence of README or long header
    values[2] = /README|readme/i.test(code) ? 9 : (values[0] > 6 ? 7 : 3);
    // stars/usage not applicable for single file -> low default
    values[3] = 2;
    // many lines -> more content
    if (lines > 200) values[4] = 9;
    else if (lines > 80) values[4] = 7;
    else if (lines > 20) values[4] = 4;
    else values[4] = 1;
    return values;
  }

  // Update the polar chart with raw values (any scale). Plugin will normalize to 0-10.
  // polar chart removed — persist breakdown if needed
  function persistPolarBreakdown(rawValues) {
    try { localStorage.setItem('polarRawData', JSON.stringify(Array.isArray(rawValues) ? rawValues : [])); } catch (e) { }
  }

  // ==============================================
  // UTIL: exibir relatório Markdown com copiar/baixar (escopo global)
  // ==============================================
  function showMarkdownReport(markdown, filename = 'TECH_REVIEW.md') {
    // Always build a fresh report panel and replace the content of #resultContainer.
    const resultContainer = document.getElementById('resultContainer');
    const panel = document.createElement('div');
    panel.style.marginTop = '8px';
    panel.style.padding = '12px';
    panel.style.border = '1px solid #ddd';
    panel.style.background = '#fafafa';

    const title = document.createElement('h3');
    title.textContent = 'Relatório Markdown gerado';
    panel.appendChild(title);

    const textarea = document.createElement('textarea');
    textarea.value = markdown;
    textarea.style.width = '100%';
    textarea.style.minHeight = '220px';
    textarea.style.fontFamily = 'monospace';
    textarea.style.fontSize = '13px';
    textarea.style.whiteSpace = 'pre-wrap';
    panel.appendChild(textarea);

    const btns = document.createElement('div');
    btns.style.marginTop = '8px';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copiar Markdown';
    copyBtn.style.marginRight = '8px';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(textarea.value);
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => copyBtn.textContent = 'Copiar Markdown', 1500);
      } catch (e) {
        textarea.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => copyBtn.textContent = 'Copiar Markdown', 1500);
      }
    });
    btns.appendChild(copyBtn);

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Baixar (.md)';
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([textarea.value], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
    btns.appendChild(downloadBtn);

    panel.appendChild(btns);

    // Replace #resultContainer content so only the markdown panel is visible there
    if (resultContainer) {
      resultContainer.innerHTML = '';
      resultContainer.appendChild(panel);
    } else {
      // fallback: hide #result and append panel after it
      const resultDiv = document.getElementById('result');
      if (resultDiv && resultDiv.parentNode) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
        resultDiv.parentNode.insertBefore(panel, resultDiv.nextSibling);
      } else {
        document.body.appendChild(panel);
      }
    }
  }

  // Ensure the dashboard result area exists and remove any markdown panel
  function ensureResultArea() {
    // remove markdown panel if present
    const panel = document.getElementById('markdownReportContainer');
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);

    const resultContainer = document.getElementById('resultContainer');
    if (!resultContainer) return;

    // recreate the hint and result elements inside resultContainer
    resultContainer.innerHTML = '';

    let hint = document.getElementById('resultHint');
    if (!hint) {
      hint = document.createElement('p');
      hint.id = 'resultHint';
      hint.textContent = 'Aqui aparecerá o resultado da análise. Mantemos esse espaço reservado para evitar que o botão se mova.';
      hint.style.width = '50%';
      hint.style.textAlign = 'center';
    }

    let resultDiv = document.getElementById('result');
    if (!resultDiv) {
      resultDiv = document.createElement('div');
      resultDiv.id = 'result';
      resultDiv.className = 'result';
    }

    resultContainer.appendChild(hint);
    resultContainer.appendChild(resultDiv);
  }

  // Read and analyze a File object, update UI, ranking and polar chart
  function processUploadedFile(file) {
    const resultDiv = document.getElementById('result');
    if (!file) return;
    const reader = new FileReader();
    resultDiv.textContent = 'Lendo arquivo...';
    reader.onload = function(ev) {
      const code = ev.target.result || '';
      resultDiv.textContent = 'Analisando arquivo...';
      try {
        // simple heuristic score (0-10)
        let score = 5.0;
        const notes = [];
        const lines = code.split(/\r?\n/).length;
        if (lines > 200) { score += 1.5; notes.push('Arquivo extenso'); }
        else if (lines < 20) { score -= 0.8; notes.push('Arquivo curto'); }
        if (/TODO|FIXME/i.test(code)) { score -= 0.5; notes.push('Contém TODO/FIXME'); }
        if (/license|licença/i.test(code)) { score += 0.6; notes.push('Referência à licença'); }
        // clamp
        const scoreRounded = Math.max(0, Math.min(10, Math.round(score * 10) / 10));
        resultDiv.innerHTML = `<strong>Nota (arquivo):</strong> ${scoreRounded} / 10<br><div style="margin-top:8px;white-space:pre-wrap">${notes.join('\n') || 'Sem observações'}</div>`;
        resultDiv.style.background = '#e3f2fd'; resultDiv.style.color = '#1565c0';

        // hide the dashboard placeholder/hint and any dashboard info so the result is visible
        try {
          const hint = document.getElementById('resultHint'); if (hint) hint.style.display = 'none';
          const info = document.getElementById('dashboardInfo'); if (info) info.style.display = 'none';
          resultDiv.style.display = 'block';
        } catch (e) { /* ignore */ }

        // ranking
  const name = file.name.replace(/\.[^/.]+$/, '');
  ranking.push({ nome: name, nota: scoreRounded, addedAt: Date.now() });
        atualizarTabelaRanking();

        // compute breakdown and persist (polar chart removed)
        try {
          const breakdown = buildPolarDataFromCode(code);
          persistPolarBreakdown(breakdown);
          // update dashboard score box
          try {
            const scoreBox = document.getElementById('scoreBox');
            if (scoreBox) scoreBox.textContent = `${scoreRounded} / 10`;
          } catch (e) { /* ignore */ }
          // persist lastAnalysis so dashboard can restore it on load
          try {
            const lastAnalysis = { nome: name, nota: scoreRounded, notes: notes, breakdown };
            localStorage.setItem('lastAnalysis', JSON.stringify(lastAnalysis));
          } catch (e) { console.warn('Erro ao salvar lastAnalysis', e); }
          // generate markdown report for this file and show it
          try {
            const md = `# Análise local: ${name}\n\n**Nota:** ${scoreRounded} / 10\n\n**Resumo:**\n- ${notes.join('\n- ') || 'Sem observações'}\n\n**Detalhes do arquivo:**\n- Nome: ${file.name}\n- Linhas: ${lines}`;
            showMarkdownReport(md, `${name.replace(/[^a-z0-9_-]/ig,'_')}-TECH_REVIEW.md`);
          } catch (e) { console.warn('Erro ao gerar relatório markdown local', e); }
        } catch (e) { console.warn('Erro ao gerar breakdown do arquivo', e); }
      } catch (err) {
        console.error('Erro ao processar arquivo', err);
        resultDiv.textContent = 'Erro ao analisar o arquivo.';
        resultDiv.style.background = '#fff3e0'; resultDiv.style.color = '#ef6c00';
      }
    };
    reader.readAsText(file);
  }

  // ==============================================
  // ANÁLISE DE ARQUIVO POR IA
  // ==============================================
  document.getElementById('file-form').addEventListener('submit', function(e) {
    e.preventDefault();
    ensureResultArea();
    const resultDiv = document.getElementById('result');
    if (!fileInput.files || fileInput.files.length === 0) {
      resultDiv.textContent = 'Selecione um arquivo para análise.';
      resultDiv.style.background = '#fff3e0';
      resultDiv.style.color = '#ef6c00';
      const hint = document.getElementById('resultHint'); if (hint) hint.style.display = 'none';
      resultDiv.style.display = 'block';
      return;
    }
    const file = fileInput.files[0];
    // delegate to the centralized processor (ensures a single analysis path)
    processUploadedFile(file);
    // Clear the selected file and feedback so the input appears empty after submit
    try {
      fileInput.value = '';
      feedback.textContent = '';
      form.classList.remove('highlight');
    } catch (err) {
      console.warn('Não foi possível limpar o input de arquivo:', err);
    }
    // move to dashboard so user sees the result area
    try { scrollToDashboard(); } catch (e) { }
  });

  // ==============================================
  // ANÁLISE VIA URL (GitHub)
  // ==============================================
  document.getElementById('validator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    ensureResultArea();
    const resultDiv = document.getElementById('result');
    const repoUrl = document.getElementById('code-input').value.trim();

    if (!repoUrl) {
      resultDiv.textContent = 'Cole a URL do repositório do GitHub no campo acima.';
      resultDiv.style.background = '#fff3e0';
      resultDiv.style.color = '#ef6c00';
      return;
    }

    // Clear the textarea after starting the validation so user gets a clean field
    try {
      document.getElementById('code-input').value = '';
    } catch (err) {
      console.warn('Não foi possível limpar o textarea de validação:', err);
    }
    // move to dashboard so user sees the result area
    try { scrollToDashboard(); } catch (e) { }

  resultDiv.textContent = 'Analisando repositório...';
  const hint = document.getElementById('resultHint'); if (hint) hint.style.display = 'none';
  resultDiv.style.display = 'block';

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
          const hint2 = document.getElementById('resultHint'); if (hint2) hint2.style.display = 'none';
          resultDiv.style.display = 'block';
          // update global box
          const scoreBox = document.getElementById('scoreBox');
          if (scoreBox) scoreBox.textContent = `${data.score} / 10`;
          resultDiv.style.background = '#e8f5e9';
          resultDiv.style.color = '#2e7d32';

          const repoNameMatch = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/i);
          const repoName = repoNameMatch ? repoNameMatch[1] : repoUrl;

          ranking.push({ nome: repoName, nota: data.score, addedAt: Date.now() });
          atualizarTabelaRanking();
          // show the markdown report returned by the backend (if any)
          try { if (data.markdown) showMarkdownReport(data.markdown, `${repoName.replace(/[^a-z0-9_-]/ig,'_')}-TECH_REVIEW.md`); } catch (e) { console.warn('Erro ao exibir markdown backend', e); }
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
  const hint3 = document.getElementById('resultHint'); if (hint3) hint3.style.display = 'none';
  resultDiv.style.display = 'block';
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


  // (duplicate local definition removed; single global showMarkdownReport exists above)
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
  const markdown = `# Análise (cliente): ${owner}/${repo}\n\n**Nota: ** ${scoreRounded} / 10\n\n**Resumo:**\n- ${reasons.join('\n- ') || 'Nenhuma característica positiva detectada.'}`;

  resultDiv.innerHTML = `<strong>Nota: </strong> ${scoreRounded} / 10<br><div style="margin-top:8px;white-space:pre-wrap">${markdown}</div>`;
  // update global score box
  const scoreBox = document.getElementById('scoreBox');
  if (scoreBox) scoreBox.textContent = `${scoreRounded} / 10`;
      resultDiv.style.background = '#e8f5e9';
      resultDiv.style.color = '#2e7d32';

  const repoName = `${owner}/${repo}`;
  ranking.push({ nome: repoName, nota: scoreRounded, addedAt: Date.now() });
      atualizarTabelaRanking();
  // show markdown report for client analysis
  try { showMarkdownReport(markdown, `${repoName.replace(/[^a-z0-9_-]/ig,'_')}-TECH_REVIEW.md`); } catch (e) { console.warn('Erro ao exibir markdown cliente', e); }
    } catch (err) {
      console.error(err);
      resultDiv.textContent = 'Erro interno na análise cliente.';
      resultDiv.style.background = '#fff3e0';
      resultDiv.style.color = '#ef6c00';
    }
  }
