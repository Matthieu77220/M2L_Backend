import express from "express"
import { inscription, connexion, deconnexion, suppressionCompte, modificationProfile } from "../controllers/auth.js"

const router = express.Router()

// Chemins des routes -> controllers
router.post("/inscription", inscription)
router.post("/connexion", connexion)
router.post("/deconnexion", deconnexion)
router.delete("/suppressionCompte", suppressionCompte)
router.put("/modificationProfile", modificationProfile)

export default router