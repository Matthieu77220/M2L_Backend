import express from 'express'
import cookieJwt from '../middleware/jwt.js'
import { creerReservation } from '../controllers/reservation.js'

const router = express.Router()

router.post("/creer", cookieJwt, creerReservation)

export default router
