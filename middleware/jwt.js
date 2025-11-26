import jwt from ('jsonwebtoken')
require('dotenv').config()

const cookieJwt = (req, res, next) => {

    const token = req.cookies['token']

    console.log(token)

    try {

        const user = jwt.verify(token, process.env.SECRET_KEY)

        req.user = user

        next();

    } catch(err) {
        res.clearCookie("token")
        return res.redirect("/Connexion")
    }

}

module.exports = cookieJwt