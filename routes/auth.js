import express from "express"
import addAuth from "../controllers/auth.js"

const router = express.Router()

// test du router -> controllers
router.get("/test", addAuth)

export default router