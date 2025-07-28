export default async function enviarQRCodeImagem(number, brCodeBase64) {
    // Validação dos parâmetros
    if (!brCodeBase64) {
        console.error('brCodeBase64 está undefined ou vazio:', brCodeBase64);
        return { 
            error: 'brCodeBase64 é obrigatório para enviar imagem',
            received_brCodeBase64: brCodeBase64 
        };
    }
    
    // Log para debug
    console.log('brCodeBase64 recebido:', brCodeBase64.substring(0, 100) + '...');
    
    // Remover o prefixo data:image/png;base64, se existir
    let mediaData = brCodeBase64;
    if (brCodeBase64.startsWith('data:image/')) {
        mediaData = brCodeBase64.split(',')[1]; // Pega apenas a parte após a vírgula
        console.log('Prefixo removido, usando apenas base64 puro');
    }
    
    const url = 'https://evolution.hiarley.me/message/sendMedia/Teste';
    const options = {
        method: 'POST',
        headers: { apikey: `${process.env.ZAP_API_KEY}`, 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
            number: number || "5588981061375",
            mediatype: "image",
            media: mediaData
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
