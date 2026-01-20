import express from "express"
import isAdmin from "../middleware/jwt.js"
import { visualitionStock } from "../controllers/equipement.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/visualitionStock", isAdmin, visualitionStock)


export default router