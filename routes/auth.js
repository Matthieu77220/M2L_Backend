import express from "express"
import { inscription, connexion, deconnexion, suppressionCompte } from "../controllers/auth.js"

const router = express.Router()

// Chemins des routes -> controllers
router.post("/inscription", inscription)
router.post("/connexion", connexion)
router.post("/deconnexion", deconnexion)
router.post("/suppressionCompte", suppressionCompte)

export default router