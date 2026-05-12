import express from "express"
import cookieJwt from "../middleware/jwt.js"
import honeypot from "../middleware/honeypot.js"
import { inscription, connexion, deconnexion, suppressionCompte, modifierMotDePasse } from "../controllers/auth.js"

const router = express.Router()

// Chemins des routes -> controllers
router.post("/inscription", honeypot(), inscription)
router.post("/connexion", honeypot(), connexion)
router.post("/deconnexion", deconnexion)
router.delete("/suppressionCompte", cookieJwt , suppressionCompte)
router.put("/modifierMotDePasse", cookieJwt, modifierMotDePasse)


export default router
