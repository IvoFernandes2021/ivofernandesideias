// Ficheiro: functions/api/imagen.js (Versão Cloudflare AI)
// Este ficheiro atua como um proxy seguro, usando agora o modelo de imagem da própria Cloudflare.

// Função para converter ArrayBuffer para Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function onRequestPost(context) {
    try {
        const { prompt } = await context.request.json();

        if (!prompt) {
            return new Response(JSON.stringify({ message: 'O "prompt" é obrigatório.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Executa o modelo de IA da Cloudflare para gerar a imagem.
        // Não é necessária uma chave de API, pois a Cloudflare gere a autenticação internamente.
        const imageBuffer = await context.env.AI.run(
            '@cf/stabilityai/stable-diffusion-xl-base-1.0',
            { prompt: prompt }
        );
        
        // Converte a resposta da imagem (que vem como um buffer) para uma string Base64.
        const base64Image = arrayBufferToBase64(imageBuffer);

        // Cria uma resposta JSON no mesmo formato que a API da Google esperava,
        // para que não precisemos de alterar o código do nosso site (autocad.html).
        const responsePayload = {
            predictions: [
                {
                    bytesBase64Encoded: base64Image
                }
            ]
        };

        return new Response(JSON.stringify(responsePayload), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Erro na função de imagem da Cloudflare: ", error);
        return new Response(JSON.stringify({ message: `Erro no servidor proxy de imagem: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
