import db from "../config/db.js"
import 'dotenv/config'

// ----- Visualiser les Statistiques de l'adhérent ----- //
export const statistique = (req, res) => {

    const id = req.user.id

    const sql = `SELECT
                    COUNT(DISTINCT m.id_match) AS nombreMatch,
                    COALESCE(SUM(m.nb_victoires), 0) AS victoire,
                    COALESCE(SUM(m.nb_defaites), 0) AS defaite,
                    COALESCE(SUM(m.nb_egalites), 0) AS egalite
                 FROM matchs AS m
                 INNER JOIN reservation AS r ON r.id_reservation = m.id_reservation
                 INNER JOIN adherent_reservation AS ar ON ar.id_reservation = r.id_reservation
                 WHERE ar.id_adherent = ?`

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
                    m.id_reservation,
                    m.score,
                    m.status,
                    m.nb_buts,
                    m.nb_victoires,
                    m.nb_egalites,
                    m.nb_defaites,
                    r.numero_reservation,
                    r.date_reservation,
                    r.heure_debut,
                    r.heure_fin,
                    t.adresse AS terrain,
                    c.nom AS club
                 FROM matchs AS m
                 INNER JOIN reservation AS r ON r.id_reservation = m.id_reservation
                 INNER JOIN adherent_reservation AS ar ON ar.id_reservation = r.id_reservation
                 INNER JOIN terrain AS t ON t.id_terrain = r.id_terrain
                 INNER JOIN club AS c ON c.id_club = t.id_club
                 WHERE ar.id_adherent = ?
                 ORDER BY r.date_reservation DESC, r.heure_debut DESC`

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de l'exécution de la requête SQL." })
        }
        return res.status(200).json(results)
    })
}

// ----- Mettre le score d'un match lié à une réservation ----- //
export const mettreScore = (req, res) => {
    const idAdherent = req.user.id
    const { numero_reservation, score, nb_buts } = req.body

    if (!numero_reservation || !score || nb_buts === undefined) {
        return res.status(400).json({
            message: "numero_reservation, score et nb_buts sont obligatoires"
        })
    }

    const nbButs = Number(nb_buts)

    if (!Number.isInteger(nbButs) || nbButs < 0) {
        return res.status(400).json({
            message: "nb_buts doit etre un entier positif ou nul"
        })
    }

    const reservationSql = `SELECT
                                r.id_reservation
                            FROM reservation AS r
                            INNER JOIN adherent_reservation AS ar
                                ON ar.id_reservation = r.id_reservation
                            WHERE r.numero_reservation = ?
                              AND ar.id_adherent = ?
                            LIMIT 1`

    db.query(reservationSql, [numero_reservation, idAdherent], (reservationErr, reservationRows) => {
        if (reservationErr) {
            return res.status(500).json({
                message: "Erreur lors de la verification de la reservation"
            })
        }

        if (reservationRows.length === 0) {
            return res.status(404).json({
                message: "Reservation introuvable pour cet adherent"
            })
        }

        const idReservation = reservationRows[0].id_reservation

        const existingMatchSql = `SELECT
                                    id_match
                                  FROM matchs
                                  WHERE id_reservation = ?
                                  LIMIT 1`

        db.query(existingMatchSql, [idReservation], (matchErr, matchRows) => {
            if (matchErr) {
                return res.status(500).json({
                    message: "Erreur lors de la verification du match"
                })
            }

            if (matchRows.length > 0) {
                const updateSql = `UPDATE matchs
                                   SET score = ?,
                                       nb_buts = ?,
                                       status = 'termine'
                                   WHERE id_match = ?`

                return db.query(updateSql, [score, nbButs, matchRows[0].id_match], (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({
                            message: "Erreur lors de la mise a jour du score"
                        })
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Score mis a jour"
                    })
                })
            }

            const insertSql = `INSERT INTO matchs
                                (id_reservation, score, status, nb_buts, nb_victoires, nb_egalites, nb_defaites)
                               VALUES (?, ?, 'termine', ?, 0, 0, 0)`

            return db.query(insertSql, [idReservation, score, nbButs], (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({
                        message: "Erreur lors de l'enregistrement du score"
                    })
                }

                return res.status(200).json({
                    success: true,
                    message: "Score enregistre"
                })
            })
        })
    })
}
