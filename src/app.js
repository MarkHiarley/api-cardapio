import express from 'express';
import { getData } from './services/db/get-data.js';
import { cadastrarProduto } from './services/db/post-data.js';
import  {deletarProduto } from './services/db/dele-data.js';
import  {createQRCode}  from './services/payment/create-qrcode.js';
import enviarQRCode from './services/payment/send-qrcode-zap.js';
import enviarQRCodeImagem from './services/payment/send-qrcode-image.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send({
        message: 'API Cardápio is running',
        version: '1.0.0',
        getData: 'Use /cardapio to get the menu data http://localhost:3000/cardapio'
    });
});

app.get('/cardapio', async (req, res) => {
    try {
        const data = await getData(req, res);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        });
    }
});


app.post('/cardapio/cadastrar',  async (req, res) => {
    try {
        const resultado = await cadastrarProduto(req.body);
        res.status(201).json(resultado);
        
    } catch (error) {

        console.error('Erro:', error.message);
      
        if (error.message.includes('obrigatórios') || 
            error.message.includes('caracteres') || 
            error.message.includes('número válido')) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                details: error.message
            });
        }
        
  
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
        });
    }
});


app.delete('/cardapio/deletar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const resultado = await deletarProduto(id);
        res.status(200).json(resultado);
        
    } catch (error) {
        if (error.code === 'NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado',
                id_fornecido: id
            });
        }
        
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/pagamento/qr-code-create',async (req, res) => {
    try {
        const qrcode = await createQRCode(req.body.amount);
        console.log('QR Code response:', qrcode); // Debug log
        console.log('brCode value:', qrcode.data?.brCode); // Debug log
        
        if (!qrcode.data || !qrcode.data.brCode) {
            console.log('brCode não encontrado na resposta. Estrutura completa:', JSON.stringify(qrcode, null, 2));
            return res.status(400).json({
                success: false,
                message: 'brCode não foi retornado pela API de pagamento',
                qrcode_response: qrcode
            });
        }
        
        // Enviar texto com o brCode
        const resultTexto = await enviarQRCode(req.body.number, qrcode.data.brCode);
        
        // Enviar imagem do QR Code
        const resultImagem = await enviarQRCodeImagem(req.body.number, qrcode.data.brCodeBase64);

        return res.status(201).json({
            success: true,
            message: 'QR Code criado, texto e imagem enviados com sucesso',
            qrcode_data: {
                id: qrcode.data.id,
                amount: qrcode.data.amount,
                brCode: qrcode.data.brCode,
                status: qrcode.data.status,
                expiresAt: qrcode.data.expiresAt
            },
            whatsapp_results: {
                texto: resultTexto,
                imagem: resultImagem
            }
        });
    } catch (error) {
        console.error('Erro ao criar QR Code:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao criar QR Code',
            details: error.message
        });
    }
});


app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
    console.log('Press Ctrl+C to stop the server');
});