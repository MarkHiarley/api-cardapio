export default async function enviarQRCode(number, brCode) {

    if (!brCode) {
        console.error('brCode está undefined ou vazio:', brCode);
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
            number: "5588981061375",
            text: `${brCode}`
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { error: 'Erro ao criar QR Code', details: error.message };
    }
}