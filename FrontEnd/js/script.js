
// Validação tradicional do código colado no textarea
document.getElementById('validator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const code = document.getElementById('code-input').value;
    const type = document.querySelector('input[name="type"]:checked').value;
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Validando...';

    // Exemplo de requisição para o backend tradicional
    fetch('http://localhost:5500/api/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, type })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resultDiv.textContent = 'Código válido!';
            resultDiv.style.background = '#e8f5e9';
            resultDiv.style.color = '#2e7d32';
        } else {
            resultDiv.textContent = 'Erro: ' + (data.error || 'Código inválido.');
            resultDiv.style.background = '#ffebee';
            resultDiv.style.color = '#c62828';
        }
    })
    .catch(() => {
        resultDiv.textContent = 'Não foi possível validar. Verifique a conexão com o servidor.';
        resultDiv.style.background = '#fff3e0';
        resultDiv.style.color = '#ef6c00';
    });
});

// Análise de arquivo por IA
document.getElementById('file-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const resultDiv = document.getElementById('result');

    // Verifica se algum arquivo foi selecionado
    if (!fileInput.files || fileInput.files.length === 0) {
        resultDiv.textContent = 'Selecione um arquivo para análise.';
        resultDiv.style.background = '#fff3e0';
        resultDiv.style.color = '#ef6c00';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    // Lê o conteúdo do arquivo selecionado
    reader.onload = function(event) {
        const code = event.target.result;
        resultDiv.textContent = 'Analisando com IA...';

        // Envia o conteúdo do arquivo para o backend IA
    fetch('http://localhost:5500/api/ia-analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code }) // Envia o código lido
        })
        .then(response => response.json())
        .then(data => {
            // Espera receber um objeto { nota: 1-10, feedback: "..." }
            if (typeof data.nota === 'number') {
                resultDiv.innerHTML = `<strong>Nota da IA:</strong> ${data.nota} / 10<br>${data.feedback ? `<em>${data.feedback}</em>` : ''}`;
                resultDiv.style.background = '#e3f2fd';
                resultDiv.style.color = '#1565c0';
            } else {
                resultDiv.textContent = 'Não foi possível obter a nota da IA.';
                resultDiv.style.background = '#ffebee';
                resultDiv.style.color = '#c62828';
            }
        })
        .catch(() => {
            resultDiv.textContent = 'Erro ao conectar com o backend IA.';
            resultDiv.style.background = '#fff3e0';
            resultDiv.style.color = '#ef6c00';
        });
    };

    // Lê o arquivo como texto
    reader.readAsText(file);
});
