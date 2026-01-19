import db from "../config/db.js";

// Liste des abonnements disponibles (données statiques)
const ABONNEMENTS = [
  {
    id: 1,
    nom: "Mensuel",
    prix: 29,
    periode: "mois",
    description: "Accès aux terrains\nSupport standard\nRéservation en ligne"
  },
  {
    id: 2,
    nom: "Trimestriel",
    prix: 79,
    periode: "trimestre",
    description: "Accès aux terrains\nSupport prioritaire\nRéservation en ligne\nAccès vestiaires premium"
  },
  {
    id: 3,
    nom: "Annuel",
    prix: 249,
    periode: "an",
    description: "Accès illimité aux terrains\nSupport VIP\nRéservation prioritaire\nAccès vestiaires premium\nParticipation aux événements"
  }
];

// GET /api/abonnements
// → renvoie la liste de tous les abonnements disponibles
export const getAllAbonnements = (req, res) => {
  return res.json(ABONNEMENTS);
};

// POST /api/abonnements/acheter
// body attendu : { id_adherent: number, id_abonnement: number }
// → met à jour le champ "type_abonnement" dans la table ADHERENT
export const acheterAbonnement = (req, res) => {
  const { id_adherent, id_abonnement } = req.body;

  if (!id_adherent || !id_abonnement) {
    return res
      .status(400)
      .json({ message: "id_adherent et id_abonnement sont requis" });
  }

  // Trouver l'abonnement correspondant
  const abonnement = ABONNEMENTS.find(a => a.id === id_abonnement);
  if (!abonnement) {
    return res.status(404).json({ message: "Abonnement introuvable" });
  }

  const sql = "UPDATE ADHERENT SET type_abonnement = ? WHERE id_adherent = ?;";

  db.query(sql, [abonnement.nom, id_adherent], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'achat de l'abonnement :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de l'achat de l'abonnement" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable pour cet id_adherent" });
    }

    return res.json({ message: "Abonnement acheté avec succès", abonnement: abonnement.nom });
  });
};

// POST /api/abonnements/choisir
// body attendu : { id_adherent: number, abonnement: string }
// → met à jour le champ "abonnement" dans la table ADHERENT
export const choisirAbonnement = (req, res) => {
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
};

// GET /api/abonnements/utilisateur/:id_adherent
// → renvoie l'abonnement actuel de l'utilisateur (champ ADHERENT.abonnement)
export const getAbonnementUtilisateur = (req, res) => {
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
};
