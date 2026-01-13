import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/admin.js';
import isAdmin from '../middlewares/isAdmin.js';
import cookieJwt from '../middlewares/jwt.js';

const router = express.Router();

router.use((req, res, next) => {
    // Vérifie l'origine de la requête
    const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

//routes protégés par lla vérification admin
router.use(cookieJwt);
router.use(isAdmin);


router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);


router.post('/users', createUser);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

export default router;