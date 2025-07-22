// Dados zerados, como solicitado
const mockAtivo = {
  valorAtual: 0,
  lucroAcumulado: 0,
  transacoesPositivas: 0,
  perdas: 0,
};
const mockHistorico = [];

async function handleRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const apiRoute = url.pathname.replace('/api/', '');

  try {
    if (apiRoute === 'ativo') {
      return new Response(JSON.stringify(mockAtivo), { headers: { 'Content-Type': 'application/json' } });
    }

    if (apiRoute === 'historico') {
      return new Response(JSON.stringify(mockHistorico), { headers: { 'Content-Type': 'application/json' } });
    }

    if (apiRoute === 'positive-message') {
      const { AI } = context.env;
      const prompt = "Você é um especialista em criar aforismos exclusivamente em português do Brasil. Sua tarefa é gerar uma única frase inspiradora e original. A frase deve ser curta, com 10 a 15 palavras no máximo. NÃO GERE NADA EM INGLÊS. Siga o estilo dos exemplos a seguir. Exemplos: 'O único passo entre o sonho e a realidade é a atitude.', 'A persistência realiza o impossível.'. Responda apenas com a nova frase gerada.";
      const aiResponse = await AI.run('@cf/meta/llama-2-7b-chat-int8', { prompt });
      return new Response(JSON.stringify({ message: aiResponse.response.trim() }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    if (apiRoute === 'motivation-summary') {
      const { AI } = context.env;
      const prompt = "Gere uma dica curta e impactante sobre crescimento pessoal ou motivação. A resposta deve ser um parágrafo conciso e inspirador, com cerca de 40 a 60 palavras, oferecendo um conselho prático que alguém possa aplicar em sua vida.";
      const aiResponse = await AI.run('@cf/meta/llama-2-7b-chat-int8', { prompt });
      return new Response(JSON.stringify({ summary: aiResponse.response.trim() }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (apiRoute === 'ai' && request.method === 'POST') {
      const { prompt } = await request.json();
      const { AI } = context.env;
      const aiResponse = await AI.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt: `Você é um assistente prestativo. Responda à seguinte pergunta de forma concisa e direta: ${prompt}`,
      });
      return new Response(JSON.stringify(aiResponse), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Rota de API não encontrada.', { status: 404 });

  } catch (e) {
    console.error("Erro na API:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export const onRequest = handleRequest;
