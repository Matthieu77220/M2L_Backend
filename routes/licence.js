import express from "express"
import { identifiantLicence } from "../controllers/identifiantLicence.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/licence", identifiantLicence)

export default router