import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser,
    getStats
} from '../controllers/admin.js';
import isAdmin from '../middleware/isAdmin.js';
import cookieJwt from '../middleware/jwt.js';

const router = express.Router();


router.use((req, res, next) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:5173', 
        'http://localhost:5174'
    ];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
 
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});


router.use(cookieJwt);
router.use(isAdmin);

// Routes CRUD pour les adhérents
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;