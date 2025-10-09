# ValidatorIA 🔍
Sistema de validação automática de código com IA (Gemini API), desenvolvido em Python + Flask.  
Analisa repositórios do GitHub e gera relatórios de qualidade em Markdown.
![Python](https://img.shields.io/badge/Python-3.10-blue)
![Flask](https://img.shields.io/badge/Flask-Framework-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 📑 Sumário
- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
- [Exemplo de Resposta da IA](#exemplo-de-resposta-da-ia)
- [Segurança da Chave API](#segurança-da-chave-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🧠 Descrição
O **ValidatorIA** é um backend em Python que usa a **Gemini API** para validar códigos automaticamente.
Ele analisa repositórios, detecta problemas de engenharia de software (manutenibilidade, confiabilidade e adequação funcional) e gera relatórios técnicos em **Markdown**.

Ideal para equipes de desenvolvimento que desejam **monitorar a qualidade do código em tempo real**.

## ⚙️ Funcionalidades
- ✅ Validação automática de código com IA (Gemini API)
- 📊 Relatório detalhado em Markdown
- 💡 Pontuação e justificativa de qualidade
- 🔒 Proteção da chave da API com `.env`
- 🧪 Endpoint REST `/validate` para integração com front-end

## 🛠️ Tecnologias Utilizadas
- Python 3.10+
- Flask
- Gemini API (Google AI)
- dotenv (segurança da chave)
- requests / json

## 🚀 Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/ValidatorIA.git
   cd ValidatorIA
---

### 8. **Uso**
> Mostre como enviar uma requisição e o que esperar.

```markdown
## 🧪 Uso

Envie uma requisição POST para o endpoint `/validate` com o código a ser analisado.

### Exemplo com PowerShell:
```bash
Invoke-RestMethod -Uri "http://localhost:5501/validate" `
  -Method Post `
  -Headers @{ "Content-Type" = "text/plain" } `
  -Body "<h1>Teste</h1>"
---

### 9. **Exemplo de Resposta da IA**
```markdown
## 🧾 Exemplo de Saída
```json
{
  "adequacao_funcional": 8.5,
  "manutenibilidade": 9.0,
  "confiabilidade": 7.5,
  "comentarios": "O código está bem estruturado, mas falta tratamento de exceções..."
}
---

### 10. **Segurança da Chave API**
```markdown
## 🔒 Segurança da Chave API
A chave da API **não deve ser exposta no código-fonte**.  
Ela deve ser armazenada em um arquivo `.env` e nunca commitada no GitHub.
## 🤝 Contribuição
Sinta-se livre para abrir *issues* e *pull requests*!  
Antes de contribuir, leia o arquivo [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 Licença
Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.