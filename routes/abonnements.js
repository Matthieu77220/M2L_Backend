import express from "express";
import { 
  getAllAbonnements, 
  acheterAbonnement, 
  choisirAbonnement, 
  getAbonnementUtilisateur 
} from "../controllers/abonnement.js";
import cookieJwt from "../middleware/jwt.js";

const router = express.Router();

// GET /api/abonnements - Liste tous les abonnements disponibles
router.get("/", getAllAbonnements);

// POST /api/abonnements/acheter - Acheter un abonnement
router.post("/acheter", acheterAbonnement);

// POST /api/abonnements/choisir - Choisir un abonnement (ancienne route)
router.post("/choisir", choisirAbonnement);

// GET /api/abonnements/utilisateur/:id_adherent - Récupérer l'abonnement d'un utilisateur
router.get("/utilisateur/:id_adherent", getAbonnementUtilisateur);

export default router;
