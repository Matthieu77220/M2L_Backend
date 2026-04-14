import express from "express"
import { statistique, visualisationMatch, mettreScore } from "../controllers/statistiqueAdherent.js"
import cookieJwt from '../middleware/jwt.js'
 
const router = express.Router()
 
// Chemins des routes -> controllers
router.get("/statistique", cookieJwt, statistique)
router.get("/visualisationMatch", cookieJwt, visualisationMatch)
router.post("/mettreScore", cookieJwt, mettreScore)
 
export default router