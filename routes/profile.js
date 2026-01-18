import express from "express"
import cookieJwt from "../middleware/jwt.js"
import { voirProfile } from "../controllers/voirProfile.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/voirProfile", cookieJwt, voirProfile)

export default router