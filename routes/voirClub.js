import express from 'express'
import cookieJwt from '../middleware/jwt.js'
import { voirClub, voirTerrain } from '../controllers/club.js'


const router = express.Router()

// Chemins des routes -> controllers
router.get("/voirClub", cookieJwt, voirClub)
router.post("/voirTerrain", cookieJwt, voirTerrain)

export default router
