// Ficheiro: functions/api/gemini.js
// Este é o código correto para o nosso projeto.

export async function onRequest(context) {
    // Apenas permitir pedidos do tipo POST
    if (context.request.method !== 'POST') {
        return new Response('Método não permitido.', { status: 405 });
    }

    try {
        // Obter o prompt enviado pelo frontend
        const { prompt } = await context.request.json();

        if (!prompt) {
            return new Response(JSON.stringify({ message: 'O "prompt" é obrigatório no corpo do pedido.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Obter a chave de API das variáveis de ambiente (configuradas no painel da Cloudflare)
        const apiKey = context.env.GEMINI_API_KEY;

        if (!apiKey) {
             return new Response(JSON.stringify({ message: 'A chave da API da Gemini não está configurada no servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        // Fazer a chamada segura para a API da Gemini
        const geminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const geminiData = await geminiResponse.json();

        if (geminiData.error) {
             return new Response(JSON.stringify(geminiData), {
                headers: { 'Content-Type': 'application/json' },
                status: 400
            });
        }

        return new Response(JSON.stringify(geminiData), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Erro no servidor proxy: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
