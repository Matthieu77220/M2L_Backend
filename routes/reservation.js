import express from 'express'
import cookieJwt from '../middleware/jwt.js'
import { creerReservation, mesReservations, mettreScore } from '../controllers/reservation.js'

const router = express.Router()

router.get("/mesReservations", cookieJwt, mesReservations)
router.post("/creer", cookieJwt, creerReservation)
router.post("/mettreScore", cookieJwt, mettreScore)

export default router
