// Dados falsos que simulam nosso banco de dados
const mockAtivo = {
  valorAtual: 00.00,
  lucroAcumulado: 00.00,
  transacoesPositivas: 00,
  perdas: 0,
};

const mockHistorico = [
  { id: 3, data: '2025-07-22', tipo: 'Lucro Trade', valor: 00.00 },
  { id: 2, data: '2025-07-21', tipo: 'Lucro Trade', valor: 00.00 },
  { id: 1, data: '2025-07-20', tipo: 'Aporte Inicial', valor: 00.00 },
];

// Função principal da API
async function handleRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const apiRoute = url.pathname.replace('/api/', '');

  try {
    // Rota para buscar os dados do ativo (usando dados falsos)
    if (apiRoute === 'ativo') {
      return new Response(JSON.stringify(mockAtivo), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rota para buscar o histórico (usando dados falsos)
    if (apiRoute === 'historico') {
      return new Response(JSON.stringify(mockHistorico), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rota para gerar uma mensagem positiva com IA
    // CÓDIGO NOVO E DEFINITIVO
if (apiRoute === 'positive-message') {
  const { AI } = context.env;
  
  // PROMPT DEFINITIVO: Com persona, exemplos e restrições fortes.
  const prompt = "Você é um especialista em criar aforismos exclusivamente em português do Brasil. Sua tarefa é gerar uma única frase inspiradora e original. A frase deve ser curta, com 10 palavras no máximo. NÃO GERE NADA EM INGLÊS. Siga o estilo dos exemplos a seguir. Exemplos: 'O único passo entre o sonho e a realidade é a atitude.', 'A persistência realiza o impossível.'. Responda apenas com a nova frase gerada.";

  const aiResponse = await AI.run('@cf/meta/llama-2-7b-chat-int8', { prompt });
  
  return new Response(JSON.stringify({ message: aiResponse.response.trim() }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

    // Rota para interagir com a IA do modal
    if (apiRoute === 'ai' && request.method === 'POST') {
      const { prompt } = await request.json();
      const { AI } = context.env;
      const aiResponse = await AI.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt: `Você é um assistente prestativo. Responda à seguinte pergunta de forma concisa e direta: ${prompt}`,
      });
      return new Response(JSON.stringify(aiResponse), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Rota de API não encontrada.', { status: 404 });

  } catch (e) {
    console.error("Erro na API:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export const onRequest = handleRequest;
