export default async function enviarQRCode(number, brCode) {
    if (!brCode) {
        return {
            error: 'brCode é obrigatório para enviar mensagem',
            received_brCode: brCode
        };
    }

    const url = `${process.env.EVOLUTION_URL}/message/sendText/Teste`;
    const options = {
        method: 'POST',
        headers: { apikey: `${process.env.ZAP_API_KEY}`, 'Content-Type': 'application/json' },

        body: JSON.stringify({
            number: number,
            text: `${brCode}`
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        return { 
            error: 'Erro ao enviar QR Code via WhatsApp',
            details: error.message 
        };
    }
}