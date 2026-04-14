import db from "../config/db.js"
import 'dotenv/config'

// ----- Visualiser les Statistiques de l'adhérent ----- //
export const statistique = (req, res) => {

    const id = req.user.id

    const sql = `SELECT 
                    COUNT(m.id_match)    AS nombreMatch,
                    SUM(m.nb_victoires)  AS victoire,
                    SUM(m.nb_defaites)   AS defaite,
                    SUM(m.nb_egalites)   AS egalite
                 FROM matchs AS m
                 JOIN reservation r          ON r.id_reservation  = m.id_reservation
                 JOIN adherent_reservation ad ON ad.id_reservation = r.id_reservation
                 WHERE ad.id_adherent = ?`

    db.query(sql, [id], (err, results) => {
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
                    r.date_reservation,
                    m.score,
                    m.status,
                    m.nb_victoires,
                    m.nb_defaites,
                    m.nb_egalites,
                    m.nb_buts
                 FROM reservation r
                 JOIN matchs m               ON m.id_reservation  = r.id_reservation
                 JOIN adherent_reservation ad ON r.id_reservation = ad.id_reservation
                 WHERE ad.id_adherent = ?
                 ORDER BY r.date_reservation DESC`

    db.query(sql, [id], (err, results) => {
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