import express from 'express'
import cookieJwt from '../middleware/jwt.js'
import { voirTerrain } from '../controllers/terrain.js'


const router = express.Router()

router.get("/voirTerrain", cookieJwt, voirTerrain)

export default router
