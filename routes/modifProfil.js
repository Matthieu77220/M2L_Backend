import express from "express"
import { modificationProfile } from "../controllers/modifProfil.js"

const router = express.Router()

router.put("/modificationProfile", modificationProfile)

export default router