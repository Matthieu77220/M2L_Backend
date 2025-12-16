import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET /api/abonnements
// → retourne toutes les formules d'abonnement disponibles
router.get("/", (req, res) => {
  const sql =
    "SELECT id_abonnement AS id, nom, prix, periode, description FROM ABONNEMENT;";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des abonnements :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de la récupération des abonnements" });
    }
    return res.json(results);
  });
});

// POST /api/abonnements/acheter
// body attendu : { id_adherent: number, id_abonnement: number }
// → enregistre en BDD quelle personne a choisi quelle formule
router.post("/acheter", (req, res) => {
  const { id_adherent, id_abonnement } = req.body;

  if (!id_adherent || !id_abonnement) {
    return res
      .status(400)
      .json({ message: "id_adherent et id_abonnement sont requis" });
  }

  const sql = `
    INSERT INTO ADHERENT_ABONNEMENT (id_adherent, id_abonnement, date_debut, date_fin)
    SELECT
      ? AS id_adherent,
      ? AS id_abonnement,
      CURDATE() AS date_debut,
      CASE
        WHEN periode = 'mois' THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
        WHEN periode = 'an' THEN DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
        ELSE CURDATE()
      END AS date_fin
    FROM ABONNEMENT
    WHERE id_abonnement = ?;
  `;

  db.query(sql, [id_adherent, id_abonnement, id_abonnement], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'achat d'un abonnement :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de l'achat", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Abonnement introuvable pour cet id_abonnement" });
    }

    return res
      .status(201)
      .json({ message: "Abonnement acheté avec succès" });
  });
});

// GET /api/abonnements/utilisateur/:id_adherent
// → liste les abonnements choisis par un utilisateur donné
router.get("/utilisateur/:id_adherent", (req, res) => {
  const { id_adherent } = req.params;

  const sql = `
    SELECT
      aa.id_adherent,
      a.id_abonnement AS id,
      a.nom,
      a.prix,
      a.periode,
      a.description,
      aa.date_debut,
      aa.date_fin
    FROM ADHERENT_ABONNEMENT aa
    JOIN ABONNEMENT a ON aa.id_abonnement = a.id_abonnement
    WHERE aa.id_adherent = ?;
  `;

  db.query(sql, [id_adherent], (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des abonnements de l'utilisateur :",
        err
      );
      return res
        .status(500)
        .json({
          message:
            "Erreur serveur lors de la récupération des abonnements de l'utilisateur",
        });
    }

    return res.json(results);
  });
});

export default router;

import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Récupérer tous les abonnements
router.get("/", (req, res) => {
  const sql = "SELECT id_abonnement AS id, nom, prix, periode, description FROM ABONNEMENT;";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des abonnements :", err);
      // On renvoie l'erreur complète en JSON pour faciliter le debug côté client
      return res.status(500).json(err);
    }
    return res.json(results);
  });
});

// Acheter un abonnement (pour tout type d'utilisateur stocké dans ADHERENT avec un rôle différent)
router.post("/acheter", (req, res) => {
  const { id_adherent, id_abonnement } = req.body;

  if (!id_adherent || !id_abonnement) {
    return res
      .status(400)
      .json({ message: "id_adherent et id_abonnement sont requis" });
  }

  // On calcule date_debut = aujourd'hui, date_fin en fonction de la période de l'abonnement
  const sql = `
    INSERT INTO ADHERENT_ABONNEMENT (id_adherent, id_abonnement, date_debut, date_fin)
    SELECT
      ? AS id_adherent,
      ? AS id_abonnement,
      CURDATE() AS date_debut,
      CASE
        WHEN periode = 'mois' THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
        WHEN periode = 'an' THEN DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
        ELSE CURDATE()
      END AS date_fin
    FROM ABONNEMENT
    WHERE id_abonnement = ?;
  `;

  db.query(sql, [id_adherent, id_abonnement, id_abonnement], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'achat d'un abonnement :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de l'achat", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Abonnement introuvable pour cet id_abonnement" });
    }

    return res
      .status(201)
      .json({ message: "Abonnement acheté avec succès" });
  });
});

export default router;
