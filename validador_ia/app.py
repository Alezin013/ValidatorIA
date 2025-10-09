from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os

# 🔹 Carrega a chave da Gemini
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "🚀 Servidor IA Validador rodando!"

@app.route("/validate", methods=["POST"])
def validate_code():
    try:
        code = request.data.decode("utf-8")
        if not code.strip():
            return jsonify({"error": "Nenhum código enviado"}), 400

        prompt = f"""
        Avalie o seguinte código e produza um relatório em Markdown com:
        - Pontuação (0 a 10) em adequação funcional, manutenibilidade e confiabilidade.
        - Justificativa textual para cada critério.
        - Percentual geral de qualidade e sugestões de melhoria.

        Código:
        {code}
        """

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        return jsonify({"relatorio": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Iniciando servidor Flask...")
    app.run(host="127.0.0.1", port=5501, debug=True)

