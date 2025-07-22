// Código para functions/api/[[path]].js

// Dados falsos que simulam nosso banco de dados
const mockAtivo = {
  valorAtual: 1850.55,
  lucroAcumulado: 600.55,
  transacoesPositivas: 12,
  perdas: 2,
};

const mockHistorico = [
  { id: 3, data: '2025-07-22', tipo: 'Lucro Trade', valor: 100.25 },
  { id: 2, data: '2025-07-21', tipo: 'Lucro Trade', valor: 150.00 },
  { id: 1, data: '2025-07-20', tipo: 'Aporte Inicial', valor: 1250.50 },
];

// Função principal da API
async function handleRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const apiRoute = url.pathname.replace('/api/', '');

  try {
    if (apiRoute === 'ativo') {
      return new Response(JSON.stringify(mockAtivo), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (apiRoute === 'historico') {
      return new Response(JSON.stringify(mockHistorico), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
