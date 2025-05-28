import express from 'express';
import * as US from '../controllers/user.controller.js';
import  verifyToken  from '../middleware/auth.middleware.js';


const router = express.Router();
// Route pour la connexion d'un utilisateur - Publique
router.post('/login', US.loginUser);

// Route pour obtenir tous les utilisateurs - Protégée
router.get('/', verifyToken, US.getAllUsers);

// Route pour mettre à jour un utilisateur - Protégée (exemple)
router.put('/:id', verifyToken, US.updateUser);

// Route pour supprimer un utilisateur - Protégée (exemple)
router.delete('/:id', verifyToken, US.deleteUser);


export default router;





