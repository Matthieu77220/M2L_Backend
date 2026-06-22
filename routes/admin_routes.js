import express from 'express';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getStats,
    getMatchAdherents,
    createMatch
} from '../controllers/admin.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Routes vers le controllers admin
router.get('/getAllUsers', isAdmin, getAllUsers);
router.post('/createUser', isAdmin, createUser);
router.put('/updateUser/:id', isAdmin, updateUser);
router.delete('/deleteUser/:id', isAdmin, deleteUser);
router.get('/stats', isAdmin, getStats);
router.get('/matchs/adherents', isAdmin, getMatchAdherents);
router.post('/matchs', isAdmin, createMatch);

export default router;
