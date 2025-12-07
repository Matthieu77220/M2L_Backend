import jwt from 'jsonwebtoken'
require('dotenv').config()

const isAdmin = (req, res, next) => {

    const token = req.cookies['token']

    try{
        const user = jwt.verify(token, process.env.SECRET_KEY)

        if (user.role === "admin") {
            next()
        }else {
            return res.status(403).send("Accès interdit : vous n'avez pas les droits !")
        }
    }catch (err) {
        res.clearCookie("token")
        return res.redirect("/Connexion");
    }

}

module.exports = isAdmin

