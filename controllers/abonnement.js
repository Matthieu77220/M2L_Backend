import db from "../config/db.js";


// ----- DONNÉES STATIQUES -----

// Liste des abonnements disponibles (stockés côté backend)
// Pas en base de données → choix simple pour éviter une table en plus
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


// ----- RÉCUPÉRER TOUS LES ABONNEMENTS -----

// GET /api/abonnements
// → retourne la liste complète des abonnements disponibles
export const getAllAbonnements = (req, res) => {

  // Envoi direct des données statiques au format JSON
  return res.json(ABONNEMENTS);
};



// ----- ACHETER UN ABONNEMENT -----

// id_adherent récupéré via middleware JWT (req.user.id)
export const acheterAbonnement = (req, res) => {

  // Récupération de l'id de l'abonnement envoyé par l'utilisateur
  const { id_abonnement } = req.body;

  // Récupération de l'id utilisateur depuis le token (middleware)
  const id_adherent = req.user.id;

  // Recherche de l'abonnement correspondant dans la liste
  const abonnement = ABONNEMENTS.find(a => a.id === id_abonnement);

  // Vérification : abonnement existe ?
  if (!abonnement) {
    return res.status(404).json({ message: "Abonnement introuvable" });
  }

  // Requête SQL pour mettre à jour l'abonnement de l'utilisateur
  const sql = "UPDATE ADHERENT SET type_abonnement = ? WHERE id_adherent = ?;";

  db.query(sql, [abonnement.nom, id_adherent], (err, result) => {

    // Gestion des erreurs serveur
    if (err) {
      console.error("Erreur lors de l'achat de l'abonnement :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de l'achat de l'abonnement" });
    }

    // Vérifie si l'utilisateur existe
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable pour cet id_adherent" });
    }

    // Succès
    return res.json({ 
      message: "Abonnement acheté avec succès", 
      abonnement: abonnement.nom 
    });
  });
};



// ----- CHOISIR UN ABONNEMENT (MANUEL) -----

// POST /api/abonnements/choisir
// body attendu : { id_adherent: number, abonnement: string }
// → mise à jour directe (moins sécurisé car sans JWT)
export const choisirAbonnement = (req, res) => {

  // Récupération des données envoyées
  const { id_adherent, abonnement } = req.body;

  // Vérification des champs
  if (!id_adherent || !abonnement) {
    return res
      .status(400)
      .json({ message: "id_adherent et abonnement sont requis" });
  }

  // Requête SQL pour mise à jour
  const sql = "UPDATE ADHERENT SET abonnement = ? WHERE id_adherent = ?;";

  db.query(sql, [abonnement, id_adherent], (err, result) => {

    // Gestion erreur serveur
    if (err) {
      console.error("Erreur lors de la mise à jour de l'abonnement :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de la mise à jour de l'abonnement" });
    }

    // Vérifie si utilisateur existe
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable pour cet id_adherent" });
    }

    // Succès
    return res.json({ message: "Abonnement mis à jour avec succès" });
  });
};



// ----- RÉCUPÉRER ABONNEMENT UTILISATEUR -----

// GET /api/abonnements/utilisateur/:id_adherent
// → retourne l'abonnement actuel d'un utilisateur
export const getAbonnementUtilisateur = (req, res) => {

  // Récupération de l'id depuis les paramètres de l'URL
  const { id_adherent } = req.params;

  // Requête SQL pour récupérer l'abonnement
  const sql =
    "SELECT id_adherent, abonnement FROM ADHERENT WHERE id_adherent = ?;";

  db.query(sql, [id_adherent], (err, results) => {

    // Gestion erreur serveur
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

    // Vérifie si utilisateur existe
    if (!results.length) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable pour cet id_adherent" });
    }

    // Retour des données
    return res.json(results[0]);
  });
};