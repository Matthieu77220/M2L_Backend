import express from "express"
import isSuperAdmin from "../middleware/isSuperAdmin.js"
import {
    getDashboardStats,
    getAllClubs,
    getClubById,
    createClub,
    updateClub,
    deleteClub,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getGlobalStats
} from "../controllers/superadmin.js"

const router = express.Router()


router.use(isSuperAdmin)

// ----- Dashboard Stats ----- //
router.get("/dashboard/stats",isSuperAdmin, getDashboardStats)
router.get("/stats/global", isSuperAdmin,getGlobalStats)

// ----- Clubs Routes ----- //
router.get("/clubs",isSuperAdmin, getAllClubs)
router.get("/clubs/:id",isSuperAdmin, getClubById)
router.post("/clubs", isSuperAdmin,createClub)
router.put("/clubs/:id", isSuperAdmin,updateClub)
router.delete("/clubs/:id", isSuperAdmin,deleteClub)

// ----- Users Routes ----- //
router.get("/users",isSuperAdmin, getAllUsers)
router.get("/users/:id", isSuperAdmin,getUserById)
router.put("/users/:id",isSuperAdmin, updateUser)
router.delete("/users/:id", isSuperAdmin,deleteUser)

export default router
