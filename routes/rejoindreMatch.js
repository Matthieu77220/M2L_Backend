import express from "express"
import cookieJwt from "../middleware/jwt.js"
import { rejoindreMatch } from "../controllers/rejoindreMatch.js"

const router = express.Router()

router.post("/rejoindreMatch", cookieJwt , rejoindreMatch)


export default router