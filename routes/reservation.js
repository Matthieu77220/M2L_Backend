import express from 'express'
import cookieJwt from '../middleware/jwt.js'
import { creerReservation, creneauxTerrain, mesReservations, mettreScore } from '../controllers/reservation.js'

const router = express.Router()

router.get("/mesReservations", cookieJwt, mesReservations)
router.get("/terrain/:id_terrain/creneaux", cookieJwt, creneauxTerrain)
router.post("/creer", cookieJwt, creerReservation)
router.post("/mettreScore", cookieJwt, mettreScore)

export default router
