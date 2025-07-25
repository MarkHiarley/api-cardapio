
import { ref, get } from 'firebase/database';
import db from '../firebase.js'; 

export async function getData(req, res) {
 try {  
        const cardapioRef = ref(db, 'cardapio');
        const snapshot = await get(cardapioRef);
        
        if (snapshot.exists()) {
            res.json({
                success: true,
                data: snapshot.val()
            });
        } else {
            res.json({
                success: true,
                data: {},
                message: 'Cardápio vazio'
            });
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal Server Error', 
            details: error.message 
        });
    }
}
