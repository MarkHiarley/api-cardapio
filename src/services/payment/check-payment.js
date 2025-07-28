export default async function checarPagamento(id) {
    const url = `https://api.abacatepay.com/v1/pixQrCode/check?id=${id}`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.APIKEY_ABACATE}` }
    };

    try {
        if (!id) {
            return { 
                success: false, 
                message: 'ID de pagamento é obrigatório' 
            };
        }

        // Timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.text();
            return {
                success: false,
                message: `Erro ao verificar pagamento: ${response.status}`,
                details: errorData
            };
        }

        const data = await response.json();
     
        return {
            success: true,
            status: data.status || 'UNKNOWN',
            payment_data: data
        };

    } catch (error) {
        if (error.name === 'AbortError') {
            return {
                success: false,
                message: 'Timeout: API demorou mais de 10 segundos para responder',
                details: 'Verifique a conexão com a internet'
            };
        }
        
        return {
            success: false,
            message: 'Erro ao verificar pagamento',
            details: error.message
        };
    }
}