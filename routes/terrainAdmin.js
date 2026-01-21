import express from "express"
import isAdmin from "../middleware/isAdmin.js"
import { voirTerrain, ajouterTerrain, supprimerTerrain } from "../controllers/terrain.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/voirTerrain", isAdmin , voirTerrain)
router.post("/ajouterTerrain", isAdmin, ajouterTerrain)
router.delete("/supprimerTerrain", isAdmin, supprimerTerrain)


export default router