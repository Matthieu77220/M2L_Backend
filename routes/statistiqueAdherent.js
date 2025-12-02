import express from "express"
import { statistique, visualisationMatch } from "../controllers/statistiqueAdherent.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/statistique", statistique)
router.post("/visualisationMatch", visualisationMatch)

export default router