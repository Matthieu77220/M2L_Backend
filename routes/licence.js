import express from "express"
import cookieJwt from "../middleware/jwt.js"
import { identifiantLicence } from "../controllers/identifiantLicence.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/identifiantLicence", cookieJwt, identifiantLicence)

export default router