import db from "../config/db.js"
import 'dotenv/config'

// ----- Visualiser les Statistiques de l'adhérent ----- //
export const statistique = (req, res) => {

    const id = req.user.id

    const sql = `SELECT
                    COUNT(DISTINCT m.id_match) AS nombreMatch,
                    COALESCE(SUM(CASE
                        WHEN s.id_score IS NOT NULL AND
                             ((m.id_adherent_1 = ? AND s.nb_but_adherent_1 > s.nb_but_adherent_2) OR
                              (m.id_adherent_2 = ? AND s.nb_but_adherent_2 > s.nb_but_adherent_1))
                        THEN 1 ELSE 0 END), 0) AS victoire,
                    COALESCE(SUM(CASE
                        WHEN s.id_score IS NOT NULL AND
                             ((m.id_adherent_1 = ? AND s.nb_but_adherent_1 < s.nb_but_adherent_2) OR
                              (m.id_adherent_2 = ? AND s.nb_but_adherent_2 < s.nb_but_adherent_1))
                        THEN 1 ELSE 0 END), 0) AS defaite,
                    COALESCE(SUM(CASE
                        WHEN s.id_score IS NOT NULL AND s.nb_but_adherent_1 = s.nb_but_adherent_2
                        THEN 1 ELSE 0 END), 0) AS egalite
                 FROM matchs AS m
                 LEFT JOIN score AS s ON s.id_match = m.id_match
                 WHERE m.id_adherent_1 = ? OR m.id_adherent_2 = ?`

    db.query(sql, [id, id, id, id, id, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de l'exécution de la requête SQL." })
        }
        return res.status(200).json([results[0]])
    })
}

// ----- Visualisation des matchs de l'adhérent ----- //
export const visualisationMatch = (req, res) => {

    const id = req.user.id

    const sql = `SELECT
                    m.id_match,
                    m.date_match,
                    m.id_adherent_1,
                    a1.prenom AS prenom_adherent_1,
                    a1.nom AS nom_adherent_1,
                    m.id_adherent_2,
                    a2.prenom AS prenom_adherent_2,
                    a2.nom AS nom_adherent_2,
                    s.nb_but_adherent_1,
                    s.nb_but_adherent_2
                 FROM matchs AS m
                 JOIN adherent AS a1 ON a1.id_adherent = m.id_adherent_1
                 JOIN adherent AS a2 ON a2.id_adherent = m.id_adherent_2
                 LEFT JOIN score AS s ON s.id_match = m.id_match
                 WHERE m.id_adherent_1 = ? OR m.id_adherent_2 = ?
                 ORDER BY m.date_match DESC`

    db.query(sql, [id, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de l'exécution de la requête SQL." })
        }
        return res.status(200).json(results)
    })
}

// ----- Mettre le score après un match ----- //
export const mettreScore = (req, res) => {

    const id = req.user.id
    const { id_match, score, score_adversaire, nb_buts } = req.body

    // --- Validation des champs obligatoires ---
    if (
        id_match          == null ||
        score             == null ||
        score_adversaire  == null ||
        nb_buts           == null
    ) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." })
    }

    const scoreInt    = parseInt(score,            10)
    const advInt      = parseInt(score_adversaire, 10)
    const butsInt     = parseInt(nb_buts,          10)

    if (isNaN(scoreInt) || isNaN(advInt) || isNaN(butsInt)) {
        return res.status(400).json({ message: "Les scores et le nombre de buts doivent être des nombres." })
    }

    // --- Calcul victoire / défaite / égalité ---
    const nb_victoires = scoreInt > advInt  ? 1 : 0
    const nb_defaites  = scoreInt < advInt  ? 1 : 0
    const nb_egalites  = scoreInt === advInt ? 1 : 0

    const scoreStr = `${scoreInt}-${advInt}`
    const status   = "terminé"

    // --- Vérification que le match appartient bien à l'adhérent ---
    const sqlVerif = `SELECT m.id_match
                      FROM matchs m
                      JOIN adherent_reservation ad ON ad.id_reservation = m.id_reservation
                      WHERE m.id_match     = ?
                        AND ad.id_adherent = ?
                      LIMIT 1`

    db.query(sqlVerif, [id_match, id], (errVerif, rowsVerif) => {
        if (errVerif) {
            return res.status(500).json({ message: "Erreur lors de la vérification du match." })
        }
        if (rowsVerif.length === 0) {
            return res.status(403).json({ message: "Match introuvable ou accès non autorisé." })
        }

        // --- Mise à jour du score ---
        const sqlUpdate = `UPDATE matchs
                           SET score        = ?,
                               nb_victoires = ?,
                               nb_defaites  = ?,
                               nb_egalites  = ?,
                               nb_buts      = ?,
                               status       = ?
                           WHERE id_match   = ?`

        db.query(
            sqlUpdate,
            [scoreStr, nb_victoires, nb_defaites, nb_egalites, butsInt, status, id_match],
            (errUpdate, resultsUpdate) => {
                if (errUpdate) {
                    return res.status(500).json({ message: "Erreur lors de la mise à jour du score." })
                }
                if (resultsUpdate.affectedRows === 0) {
                    return res.status(404).json({ message: "Match non trouvé." })
                }
                return res.status(200).json({
                    message      : "Score mis à jour avec succès.",
                    score        : scoreStr,
                    nb_victoires,
                    nb_defaites,
                    nb_egalites,
                    nb_buts      : butsInt,
                    status,
                })
            }
        )
    })
}
