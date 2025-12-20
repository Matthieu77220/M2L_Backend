import express from "express"
import cookieJwt from "../middleware/jwt.js"
import { inscription, connexion, deconnexion, suppressionCompte, modifierMotDePasse } from "../controllers/auth.js"

const router = express.Router()

// Chemins des routes -> controllers
router.post("/inscription", inscription)
router.post("/connexion", connexion)
router.post("/deconnexion", deconnexion)
router.delete("/suppressionCompte", cookieJwt , suppressionCompte)
router.put("/modifierMotDePasse", modifierMotDePasse)

export default router