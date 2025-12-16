import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /api/abonnements/choisir
// body attendu : { id_adherent: number, abonnement: string }
// → met à jour le champ "abonnement" dans la table ADHERENT
router.post("/choisir", (req, res) => {
  const { id_adherent, abonnement } = req.body;

  if (!id_adherent || !abonnement) {
    return res
      .status(400)
      .json({ message: "id_adherent et abonnement sont requis" });
  }

  const sql = "UPDATE ADHERENT SET abonnement = ? WHERE id_adherent = ?;";

  db.query(sql, [abonnement, id_adherent], (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de l'abonnement :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de la mise à jour de l'abonnement" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable pour cet id_adherent" });
    }

    return res.json({ message: "Abonnement mis à jour avec succès" });
  });
});

// GET /api/abonnements/utilisateur/:id_adherent
// → renvoie l'abonnement actuel de l'utilisateur (champ ADHERENT.abonnement)
router.get("/utilisateur/:id_adherent", (req, res) => {
  const { id_adherent } = req.params;

  const sql =
    "SELECT id_adherent, abonnement FROM ADHERENT WHERE id_adherent = ?;";

  db.query(sql, [id_adherent], (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération de l'abonnement de l'utilisateur :",
        err
      );
      return res.status(500).json({
        message:
          "Erreur serveur lors de la récupération de l'abonnement de l'utilisateur",
      });
    }

    if (!results.length) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable pour cet id_adherent" });
    }

    return res.json(results[0]);
  });
});

export default router;
