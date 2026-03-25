import express from "express";
import { getAllAbonnements, acheterAbonnement, choisirAbonnement, getAbonnementUtilisateur } from "../controllers/abonnement.js";
import cookieJwt from "../middleware/jwt.js";

const router = express.Router();

// Liste tous les abonnements disponibles
router.get("/", getAllAbonnements);

// Acheter un abonnement (authentification requise)
router.post("/acheter", cookieJwt, acheterAbonnement);

// Choisir un abonnement (ancienne route)
router.post("/choisir", choisirAbonnement);

// Récupérer l'abonnement d'un utilisateur
router.get("/utilisateur/:id_adherent", getAbonnementUtilisateur);

export default router;
