import express from 'express';
import { getData } from './actions/get-data.js';
import { cadastrarProduto } from './actions/post-data.js';
import { deletarProduto } from './actions/dele-data.js';


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


app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
    console.log('Press Ctrl+C to stop the server');
});