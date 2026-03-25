import express from "express"
import cookieJwt from "../middleware/jwt.js"
import { rejoindreMatch } from "../controllers/rejoindreMatch.js"

const router = express.Router()

// Chemins des routes -> controllers
router.post("/rejoindreMatch", cookieJwt , rejoindreMatch)


export default router