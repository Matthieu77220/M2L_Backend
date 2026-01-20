import express from 'express';
import { 
    getAllUsers,  
    createUser, 
    updateUser, 
    deleteUser ,
    getStats
} from '../controllers/admin.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Routes CRUD pour les adhérents
router.get('/getAllUsers', isAdmin,getAllUsers);
router.post('/createUser', isAdmin, createUser);
router.put('/updateUser', isAdmin, updateUser);
router.delete('/deleteUser', isAdmin, deleteUser);
router.get('/stats', getStats);

export default router;