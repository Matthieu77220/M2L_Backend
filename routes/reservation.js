import express from 'express'
import cookieJwt from '../middleware/jwt.js'
import { creerReservation, mesReservations } from '../controllers/reservation.js'
import { mettreScore } from '../controllers/statistiqueAdherent.js'

const router = express.Router()

router.get("/mesReservations", cookieJwt, mesReservations)
router.post("/creer", cookieJwt, creerReservation)
router.post("/mettreScore", cookieJwt, mettreScore)

export default router
