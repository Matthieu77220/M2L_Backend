import jwt from "jsonwebtoken"
import 'dotenv/config'

const cookieJwt = (req, res, next) => {
  const token = req.cookies.token  

  if (!token) {
    return res.status(401).json({ message: "Token manquant" })
  }

    try {

        const user = jwt.verify(token, process.env.secretKey)

        req.user = user

        next()

    } catch(err) {
        return res.status(401).json({ message: "Token invalide" })
    }

}

export default cookieJwt