export async function createQRCode(amount) {

    const url = 'https://api.abacatepay.com/v1/pixQrCode/create';
    const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.APIKEY_ABACATE}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        return { 
            error: 'Erro ao criar QR Code',
            details: error.message 
        };
    }

}