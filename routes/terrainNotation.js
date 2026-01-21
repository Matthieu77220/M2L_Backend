import express from "express"
import isAdmin from "../middleware/isAdmin.js"
import { noterTerrain } from "../controllers/terrainNotation.js"

const router = express.Router()

// Chemins des routes -> controllers
router.post("/noterTerrain", isAdmin, noterTerrain)


export default router