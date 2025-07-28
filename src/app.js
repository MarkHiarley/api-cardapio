import express from 'express';
import { getData } from './services/db/get-data.js';
import { cadastrarProduto } from './services/db/post-data.js';
import  {deletarProduto } from './services/db/dele-data.js';
import  {createQRCode}  from './services/payment/create-qrcode.js';
import enviarQRCode from './services/payment/send-qrcode-zap.js';
import enviarQRCodeImagem from './services/payment/send-qrcode-image.js';
import checarPagamento from './services/payment/check-payment.js';
import enviarPedido from './services/notes/send-pedido.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API Cardápio - Sistema de Lanchonete',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            cardapio: {
                listar: 'GET /cardapio',
                cadastrar: 'POST /cardapio/cadastrar',
                deletar: 'DELETE /cardapio/deletar/:id'
            },
            pagamento: {
                criar_qrcode: 'POST /pagamento/qr-code-create',
                verificar_pagamento: 'POST /pagamento/qr-code-check?id=payment_id'
            }
        },
        documentation: 'Consulte o README.md para mais detalhes'
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
        
        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'ID do produto é obrigatório'
            });
        }
        
        const resultado = await deletarProduto(id);
        res.status(200).json(resultado);
        
    } catch (error) {
        if (error.code === 'NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado',
                id_fornecido: req.params.id
            });
        }
        
        res.status(400).json({
            success: false,
            message: error.message || 'Erro ao deletar produto'
        });
    }
});

app.post('/pagamento/qr-code-create', async (req, res) => {
    try {
        const { amount, number } = req.body;
        
        // Validações de entrada
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valor do pagamento é obrigatório e deve ser maior que zero',
                received_amount: amount
            });
        }
        
        if (!number) {
            return res.status(400).json({
                success: false,
                message: 'Número do WhatsApp é obrigatório',
                help: 'Forneça o número no formato: 5588999999999'
            });
        }

        const qrcode = await createQRCode(amount);
        
        if (!qrcode.data || !qrcode.data.brCode) {
            return res.status(400).json({
                success: false,
                message: 'Erro ao processar resposta da API de pagamento',
                details: 'QR Code não foi gerado corretamente'
            });
        }

        // Enviar texto do QR Code
        const resultTexto = await enviarQRCode(number, qrcode.data.brCode);
        
        // Enviar imagem do QR Code
        const resultImagem = await enviarQRCodeImagem(number, qrcode.data.brCodeBase64);

        return res.status(201).json({
            success: true,
            message: 'QR Code criado e enviado com sucesso',
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
        return res.status(500).json({
            success: false,
            message: 'Erro ao processar pagamento',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
        });
    }
});

app.post('/pagamento/qr-code-check', async (req, res) => {
    try {
        const { id } = req.query;
        const { pedido } = req.body;

        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'ID do pagamento é obrigatório',
                help: 'Use ?id=seu_id_do_pagamento na URL'
            });
        }
        
        const resultado = await checarPagamento(id);
        
        if (!resultado.success) {
            return res.status(400).json({
                success: false,
                message: 'Erro ao consultar status do pagamento',
                details: resultado.message
            });
        }
        
        if (resultado.payment_data.data.status === "PAID") {
            if (!pedido) {
                return res.status(400).json({
                    success: false,
                    message: 'Pagamento confirmado, mas dados do pedido não foram fornecidos'
                });
            }
            
            await enviarPedido(pedido);
            return res.json({
                success: true,
                message: 'Pagamento confirmado e pedido enviado com sucesso',
                payment_status: 'PAID',
                payment_data: resultado.payment_data
            });
        } else {
            return res.json({
                success: false,
                message: 'Pagamento ainda pendente',
                status: resultado.payment_data.data.status,
                payment_data: resultado.payment_data
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar pagamento',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
        });
    }
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        requested_path: req.originalUrl,
        available_endpoints: [
            'GET /',
            'GET /cardapio',
            'POST /cardapio/cadastrar',
            'DELETE /cardapio/deletar/:id',
            'POST /pagamento/qr-code-create',
            'POST /pagamento/qr-code-check?id=payment_id'
        ]
    });
});

app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
    console.log('Press Ctrl+C to stop the server');
});