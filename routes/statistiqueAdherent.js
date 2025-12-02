import express from "express"
import { statistique, visualisationMatch } from "../controllers/statistiqueAdherent.js"
import cookieJwt from '../middleware/jwt.js'

const router = express.Router()

// Chemins des routes -> controllers
router.get("/statistique", cookieJwt, statistique)
router.post("/visualisationMatch", cookieJwt, visualisationMatch)

export default router