import jwt from "jsonwebtoken"
import 'dotenv/config'

const cookieJwt = (req, res, next) => {

  const token = req.cookies.token
  const tokenMobile = req.headers.authorization?.split(" ")[1] // APP Mobile : Split l'espace dans le headeder 'Bearer $token' = [Bearer, token] et récupère l'index 1

  // -- Pas de token --
  if (!token && !tokenMobile) {
    return res.status(401).json({ message: "Token manquant" })
  }

  try {

    let user

    // -- Selon le type d'appareil qu'on utilise on vérifie le jwt
    if (tokenMobile) {
      user = jwt.verify(tokenMobile, process.env.secretKey)
    } else {
      user = jwt.verify(token, process.env.secretKey)
    }

    req.user = user

    next()

  } catch(err) {
    return res.status(401).json({ message: "Token invalide" })
  }

}

export default cookieJwt