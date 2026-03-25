import express from "express"
import { modificationProfile } from "../controllers/modifProfil.js"
import cookieJwt from "../middleware/jwt.js"

const router = express.Router()

// Chemins des routes -> controllers
router.put("/modificationProfile", cookieJwt, modificationProfile)

export default router