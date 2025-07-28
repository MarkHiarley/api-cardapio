export default async function enviarPedido(pedido) {
    const number = "120363419110788884@g.us";
    const url = `${process.env.EVOLUTION_URL}/message/sendText/Teste`;
    const options = {
        method: 'POST',
        headers: { apikey: `${process.env.ZAP_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            number: number,
            text: `Pedido recebido: ${JSON.stringify(pedido, null, 2)}`
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        return { 
            error: 'Erro ao enviar pedido',
            details: error.message 
        };
    }
}