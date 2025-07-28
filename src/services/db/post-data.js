import { ref, push, set } from 'firebase/database';
import db from '../../firebase.js';

export async function cadastrarProduto(dadosProduto) {
    try {
        console.log('Dados recebidos:', dadosProduto);
        const { nome, preco, categoria, descricao } = dadosProduto;
        if (!nome || preco === undefined || preco === null || !categoria) {
            throw new Error('Nome, preço e categoria são obrigatórios');
        }
        const precoString = String(preco).trim();
        const regexPreco = /^[0-9]+([.,][0-9]+)?$/;
        if (!regexPreco.test(precoString)) {
            throw new Error('Preço inválido. Use apenas números (ex: 25.90)');
        }
        const precoLimpo = precoString.replace(',', '.');
        const precoNumerico = parseFloat(precoLimpo);
        if (isNaN(precoNumerico) || precoNumerico <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }
        const precoArredondado = Math.round(precoNumerico * 100) / 100;

        if (nome.trim().length < 2) {
            throw new Error('Nome deve ter pelo menos 2 caracteres');
        }
        const novoProduto = {
            nome: nome.trim(),
            preco: precoArredondado, 
            categoria: categoria.toLowerCase().trim(),
            descricao: descricao?.trim() || '',
            disponivel: true,
            criadoEm: new Date().toISOString()
        };
        const produtosRef = ref(db, 'cardapio/pratos');
        const novoProdutoRef = push(produtosRef);
        await set(novoProdutoRef, novoProduto);

        return {
            success: true,
            message: 'Produto cadastrado com sucesso',
            data: {
                id: novoProdutoRef.key,
                ...novoProduto
            }
        };
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
}