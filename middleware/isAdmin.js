import jwt from 'jsonwebtoken';
import 'dotenv/config';

const isAdmin = (req, res, next) => {
    const token = req.cookies['token'];
    const tokenMobile = req.headers.authorization?.split(" ")[1];

    // -- Pas de token --
    if (!token && !tokenMobile) {
        return res.status(401).json({ message: "Token manquant" });
    }

    try {

        let user

        // -- Selon le type d'appareil qu'on utilise on vérifie le jwt --
        if (tokenMobile) {
            user = jwt.verify(tokenMobile, process.env.secretKey)
        } else {
            user = jwt.verify(token, process.env.secretKey)
        }
        
        req.user = user;

        // -- On vérifie le rôle --
        if (user.role === 'admin' || user.role === 'superAdmin') {
            next();
        } else {
            return res.status(403).json({ 
                message: "Accès interdit : vous n'avez pas les droits !" 
            });
        }
    } catch (err) {
        console.error('Erreur JWT:', err);
        return res.status(401).json({ message: "Token invalide" });
    }
};

export default isAdmin;