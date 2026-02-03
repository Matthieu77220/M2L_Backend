import 'dotenv/config'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const isSuperAdmin = (req, res, next) => {
    const token = req.cookies['token']

    if (!token) {
        return res.status(401).json({ message: "Token manquant" })
    }

    try {
        const user = jwt.verify(token, process.env.secretKey)

        if (user.role === "superAdmin") {
            req.user = user
            next()
        } else {
            return res.status(403).json({ message: "Accès interdit : vous n'avez pas les droits !" })
        }
    } catch (err) {
        console.error('Erreur JWT:', err)
        res.clearCookie("token")
        return res.status(401).json({ message: "Token invalide" })
    }
}

export default isSuperAdmin