// Ficheiro: functions/api/imagen.js (Versão Melhorada)

export async function onRequestPost(context) {
    try {
        const { prompt } = await context.request.json();

        if (!prompt) {
            return new Response(JSON.stringify({ message: 'O "prompt" é obrigatório.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = context.env.GEMINI_API_KEY;

        if (!apiKey) {
             return new Response(JSON.stringify({ message: 'A chave da API não está configurada no servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const imagenApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        const payload = {
            instances: [{ "prompt": prompt }],
            parameters: { "sampleCount": 1 }
        };

        const imagenResponse = await fetch(imagenApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const imagenData = await imagenResponse.json();

        if (imagenData.error) {
             return new Response(JSON.stringify(imagenData), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(imagenData), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Erro no servidor proxy: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
