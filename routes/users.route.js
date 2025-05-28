import express from 'express';
import * as US from '../controllers/user.controller.js';

const router = express.Router();
router.post('/register', US.registerUser);
router.post('/login', US.loginUser);
router.put('/:id', US.updateUser);
router.delete('/:id', US.deleteUser);
router.get('/', US.getAllUsers);


export default router;





