import express from "express"
import cookieJwt from "../middleware/jwt.js"
import { commentaireMiddleware } from "../middleware/commentaire_middleware.js"
import { ajtCommentaire,getCommentaire, editCommentaire, deleteCommentaire } from "../controllers/commentaire.js"

const router = express.Router()

router.post('/ajtCommentaire', cookieJwt, ajtCommentaire)
router.get('/getCommentaire', getCommentaire)
router.put('/editCommentaire/:id', cookieJwt, commentaireMiddleware, editCommentaire)
router.delete('/deleteCommentaire/:id', cookieJwt, commentaireMiddleware, deleteCommentaire)

export default router