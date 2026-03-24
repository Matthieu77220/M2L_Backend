import express from "express"
import isAdmin from "../middleware/isAdmin.js"
import { stockChasuble, stockCrampon, stockBallon, ajouterEquipement, listerEquipements, supprimerEquipement } from "../controllers/equipement.js"

const router = express.Router()

// Chemins des routes -> controllers
router.get("/stockChasuble", isAdmin, stockChasuble)
router.get("/stockCrampon", isAdmin, stockCrampon)
router.get("/stockBallon", isAdmin, stockBallon)


//Ajouter un équipement
router.post("/", isAdmin, ajouterEquipement)
//Lister les équipements
router.get("/", isAdmin, listerEquipements)
//Supprimer un équipement
router.delete("/:id", isAdmin, supprimerEquipement)

export default router