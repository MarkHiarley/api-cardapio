export default async function enviarQRCodeImagem(number, brCodeBase64) {
    // Validação dos parâmetros
    if (!brCodeBase64) {
        return { 
            error: 'brCodeBase64 é obrigatório para enviar imagem',
            received_brCodeBase64: brCodeBase64 
        };
    }
    
    // Remover o prefixo data:image/png;base64, se existir
    let mediaData = brCodeBase64;
    if (brCodeBase64.startsWith('data:image/')) {
        mediaData = brCodeBase64.split(',')[1]; // Pega apenas a parte após a vírgula
    }
    
    const url = 'https://evolution.hiarley.me/message/sendMedia/Teste';
    const options = {
        method: 'POST',
        headers: { apikey: `${process.env.ZAP_API_KEY}`, 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
            number: number,
            mediatype: "image",
            media: mediaData
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        return { 
            error: 'Erro ao enviar imagem do QR Code',
            details: error.message 
        };
    }
}
