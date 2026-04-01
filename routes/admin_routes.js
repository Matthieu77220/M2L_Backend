import express from 'express';
import {getAllUsers, createUser, updateUser, deleteUser , getStats} from '../controllers/admin.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Routes vers le controllers admin
router.get('/getAllUsers', isAdmin, getAllUsers);
router.post('/createUser', isAdmin, createUser);
router.put('/updateUser/:id', isAdmin, updateUser);
router.delete('/deleteUser/:id', isAdmin, deleteUser);
router.get('/stats', isAdmin, getStats);

export default router;