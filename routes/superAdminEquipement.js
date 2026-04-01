import express from 'express'
import isSuperAdmin from '../middleware/isSuperAdmin.js'
import { stockChasuble, stockCrampon, stockBallon} from '../controllers/superAdminEquipement.js'


const router = express.Router()

// Chemins des routes -> controllers
router.get("/stockChasuble", isSuperAdmin, stockChasuble)
router.get("/stockCrampon", isSuperAdmin, stockCrampon)
router.get("/stockBallon", isSuperAdmin, stockBallon)

export default router
