import express from "express"
import isAdmin from "../middleware/jwt.js"
import { stockChasuble, stockCrampon, stockBallon } from "../controllers/equipement.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/stockChasuble", isAdmin, stockChasuble)
router.get("/stockCrampon", isAdmin, stockCrampon)
router.get("/stockBallon", isAdmin, stockBallon)


export default router