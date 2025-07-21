// Ficheiro: functions/api/gemini.js (Versão Melhorada)

export async function onRequestPost(context) {
    try {
        const { prompt } = await context.request.json();

        if (!prompt) {
            return new Response(JSON.stringify({ message: 'O "prompt" é obrigatório.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = context.env.GEMINI_API_KEY;

        if (!apiKey) {
             return new Response(JSON.stringify({ message: 'A chave da API da Gemini não está configurada no servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        const geminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const geminiData = await geminiResponse.json();

        if (geminiData.error) {
             return new Response(JSON.stringify(geminiData), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(geminiData), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Erro no servidor proxy: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
