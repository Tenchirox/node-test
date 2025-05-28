import express from 'express';
import * as FC from '../controllers/formateur.controller.js';

const router = express.Router();
router.get('/', FC.getAllFormateurs);
router.post('/', FC.newFormateur);
router.put('/:id', FC.updateFormateur);
router.delete('/:id', FC.deleteFormateur);

export default router;
