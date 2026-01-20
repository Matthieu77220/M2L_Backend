import express from "express"
import isAdmin from "../middleware/isAdmin.js"
import { voirTerrain } from "../controllers/terrain.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/voirTerrain", isAdmin , voirTerrain)
// router.put("/ajouterTerrain", isAdmin, ajouterTerrain)


export default router