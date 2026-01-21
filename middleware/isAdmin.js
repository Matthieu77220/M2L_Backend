import jwt from 'jsonwebtoken';
import 'dotenv/config';

const isAdmin = (req, res, next) => {
    const token = req.cookies.token
    

    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }

    try {

        const user = jwt.verify(token, process.env.secretKey);

        req.user = user;

 
        if (user.role === 'admin') {
            next();
            // console.log(user);
            
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