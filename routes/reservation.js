import express from "express";
import cookieJwt from "../middleware/jwt.js";
import { creerReservation, mesReservations } from "../controllers/reservation.js";

const router = express.Router();

router.post("/creer", cookieJwt, creerReservation);
router.get("/mesReservations", cookieJwt, mesReservations);

export default router;

