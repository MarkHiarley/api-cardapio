import { ref, push, set, get, remove } from 'firebase/database';
import db from '../../firebase.js';
export async function deletarProduto(id) {
    try {
        if (!id || id.trim() === '') {
            throw new Error('ID do produto é obrigatório');
        }
        const produtoRef = ref(db, `cardapio/pratos/${id}`);
        const snapshot = await get(produtoRef);

        if (!snapshot.exists()) {
            
            const error = new Error('Produto não encontrado');
            error.code = 'NOT_FOUND';
            throw error;
        }

        const produtoData = snapshot.val();

        await remove(produtoRef);
        return {
            success: true,
            message: 'Produto deletado com sucesso',
            data: {
                id: id,
                produto_deletado: produtoData
            }
        };
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
    }
}