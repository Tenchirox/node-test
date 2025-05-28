import express from 'express';
import * as FC from '../controllers/formateur.controller.js';
import verifyToken from '../middleware/auth.middleware.js';


const router = express.Router();
// Route pour créer un nouveau formateur
router.post('/', verifyToken, FC.newFormateur);

// Route pour obtenir tous les formateurs
router.get('/', verifyToken, FC.getAllFormateurs);

// Route pour obtenir un formateur par ID
router.get('/:id', verifyToken, FC.getFormateurById);

// Route pour mettre à jour un formateur
router.put('/:id', verifyToken, FC.updateFormateur);

// Route pour supprimer un formateur
router.delete('/:id', verifyToken, FC.deleteFormateur);

export default router;
