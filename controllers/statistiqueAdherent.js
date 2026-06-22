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
    const idAdherent = Number(req.user.id)
    const idMatch = Number(req.body.id_match)
    const monScore = Number(req.body.mon_score)
    const scoreAdversaire = Number(req.body.score_adversaire)

    if (!Number.isInteger(idMatch) || idMatch <= 0 ||
        !Number.isInteger(monScore) || monScore < 0 ||
        !Number.isInteger(scoreAdversaire) || scoreAdversaire < 0) {
        return res.status(400).json({
            message: "id_match, mon_score et score_adversaire doivent etre des entiers positifs ou nuls."
        })
    }

    // Le filtre sur l'adherent interdit de saisir le score d'un autre match.
    const sqlMatch = `SELECT
                        id_match,
                        id_adherent_1,
                        id_adherent_2,
                        date_match
                      FROM matchs
                      WHERE id_match = ?
                        AND (id_adherent_1 = ? OR id_adherent_2 = ?)
                      LIMIT 1`

    db.query(sqlMatch, [idMatch, idAdherent, idAdherent], (matchErr, matchRows) => {
        if (matchErr) {
            console.error("Erreur lors de la verification du match:", matchErr)
            return res.status(500).json({ message: "Erreur serveur." })
        }

        if (matchRows.length === 0) {
            return res.status(403).json({
                message: "Match introuvable ou vous ne participez pas a ce match."
            })
        }

        const match = matchRows[0]
        const dateMatch = match.date_match instanceof Date
            ? new Date(match.date_match)
            : new Date(`${match.date_match}T00:00:00`)
        const aujourdHui = new Date()
        dateMatch.setHours(0, 0, 0, 0)
        aujourdHui.setHours(0, 0, 0, 0)

        if (dateMatch > aujourdHui) {
            return res.status(400).json({
                message: "Le score ne peut etre saisi qu'apres la date du match."
            })
        }

        // La table score suit toujours l'ordre defini dans la table matchs.
        const estAdherent1 = Number(match.id_adherent_1) === idAdherent
        const butsAdherent1 = estAdherent1 ? monScore : scoreAdversaire
        const butsAdherent2 = estAdherent1 ? scoreAdversaire : monScore

        const sqlScore = `INSERT INTO score
                            (id_match, nb_but_adherent_1, nb_but_adherent_2)
                          VALUES (?, ?, ?)
                          ON DUPLICATE KEY UPDATE
                            nb_but_adherent_1 = VALUES(nb_but_adherent_1),
                            nb_but_adherent_2 = VALUES(nb_but_adherent_2)`

        db.query(
            sqlScore,
            [idMatch, butsAdherent1, butsAdherent2],
            (scoreErr) => {
                if (scoreErr) {
                    console.error("Erreur lors de l'enregistrement du score:", scoreErr)
                    return res.status(500).json({ message: "Erreur serveur." })
                }

                // On recalcule les victoires des deux participants. Cela reste
                // correct meme lorsqu'un score existant est ensuite modifie.
                const sqlVictoires = `UPDATE adherent AS a
                                      SET nombre_victoires = (
                                          SELECT COUNT(*)
                                          FROM matchs AS m
                                          INNER JOIN score AS s ON s.id_match = m.id_match
                                          WHERE (m.id_adherent_1 = a.id_adherent
                                                 AND s.nb_but_adherent_1 > s.nb_but_adherent_2)
                                             OR (m.id_adherent_2 = a.id_adherent
                                                 AND s.nb_but_adherent_2 > s.nb_but_adherent_1)
                                      )
                                      WHERE a.id_adherent IN (?, ?)`

                db.query(
                    sqlVictoires,
                    [match.id_adherent_1, match.id_adherent_2],
                    (victoiresErr) => {
                        if (victoiresErr) {
                            console.error("Erreur lors de la mise a jour des victoires:", victoiresErr)
                            return res.status(500).json({ message: "Erreur serveur." })
                        }

                        return res.status(200).json({
                            message: "Score enregistre avec succes.",
                            id_match: idMatch,
                            nb_but_adherent_1: butsAdherent1,
                            nb_but_adherent_2: butsAdherent2
                        })
                    }
                )
            }
        )
    })
}
