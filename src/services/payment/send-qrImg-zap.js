export default async function enviarQRCodeImage(number, brCodeBase64) {
    // Validação dos parâmetros
    if (!brCodeBase64) {
        console.error('brCodeBase64 está undefined ou vazio:', brCodeBase64);
        return {
            error: 'brCodeBase64 é obrigatório para enviar mensagem',
            received_brCodeBase64: brCodeBase64
        };
    }

    const url = `https://evolution.hiarley.me/message/sendMedia/Teste`;
    const options = {
        method: 'POST',
        headers: { 
            apikey: `${process.env.ZAP_API_KEY}`, 
            'Content-Type': 'application/json' 
        },

        body: JSON.stringify({
            number: number || "5588981061375",
            mediaMessage: {
                mediatype: "image",
                media: brCodeBase64
            }
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { error: 'Erro ao enviar imagem do QR Code', details: error.message };
    }
}