import express from "express"
import { modificationProfile } from "../controllers/modifProfil.js"
import cookieJwt from "../middleware/jwt.js"

const router = express.Router()

router.put("/modificationProfile", cookieJwt, modificationProfile)

export default router