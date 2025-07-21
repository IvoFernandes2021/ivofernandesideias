addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST' && request.url.endsWith('/api/gemini')) {
    try {
      const apiKey = "<AIzaSyC0-wG8ZeMqFB_9TxLHzRnkJUVbofckZQ8>"; // Substitua pela sua chave real do Gemini API

      if (!apiKey || apiKey === "<SUA_CHAVE_DE_API_DO_GEMINI>") {
        return new Response(JSON.stringify({ error: "Chave da API do Gemini não configurada no Cloudflare Worker." }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const requestData = await request.json();
      const prompt = requestData.prompt;

      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt não fornecido." }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

      const geminiRequest = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          prompt: {
            text: prompt,
          },
        }),
      };

      const geminiResponse = await fetch(geminiApiUrl, geminiRequest);
      const geminiResponseData = await geminiResponse.json();

      if (geminiResponseData.error) {
        console.error("Erro da API Gemini:", geminiResponseData.error);
        return new Response(JSON.stringify({ error: `Erro da API Gemini: ${geminiResponseData.error.message}` }), {
          status: geminiResponse.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Formatar a resposta para corresponder à estrutura esperada pelo front-end
      const formattedResponse = {
        candidates: geminiResponseData.candidates ? geminiResponseData.candidates.map(candidate => ({
          content: {
            parts: candidate.content.parts.map(part => ({ text: part.text })),
          },
        })) : [],
      };

      return new Response(JSON.stringify(formattedResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      return new Response(JSON.stringify({ error: "Erro interno ao processar a requisição." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Se a requisição não for um POST para /api/gemini, retorne um erro 404
  return new Response("Não encontrado.", { status: 404 });
}
