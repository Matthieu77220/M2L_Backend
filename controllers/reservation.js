import db from "../config/db.js"
import 'dotenv/config'

// Fonction pour générer un numéro de réservation aléatoire
const generateReservationNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // Nombre compris entre 100.000 et 900.000
}

// ----- Liste des réservations de l'adhérent connecté (créateur ou participant) ----- //
export const mesReservations = (req, res) => {
    const id_adherent = req.user.id

    const sql = `
        SELECT
            r.numero_reservation,
            c.nom AS club,
            t.adresse AS terrain,
            DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS date,
            DATE_FORMAT(r.heure_debut, '%H:%i') AS heureDebut,
            DATE_FORMAT(r.heure_fin, '%H:%i') AS heureFin,
            IFNULL((
                SELECT m2.score FROM matchs m2
                WHERE m2.id_reservation = r.id_reservation
                ORDER BY m2.id_match DESC
                LIMIT 1
            ), '-') AS score,
            IFNULL((
                SELECT m2.nb_buts FROM matchs m2
                WHERE m2.id_reservation = r.id_reservation
                ORDER BY m2.id_match DESC
                LIMIT 1
            ), 0) AS nbButs,
            IFNULL((
                SELECT m2.status FROM matchs m2
                WHERE m2.id_reservation = r.id_reservation
                ORDER BY m2.id_match DESC
                LIMIT 1
            ), 'prevu') AS statut,
            (
                SELECT m3.id_match FROM matchs m3
                WHERE m3.id_reservation = r.id_reservation
                ORDER BY m3.id_match DESC
                LIMIT 1
            ) AS id_match
        FROM reservation r
        INNER JOIN adherent_reservation ar
            ON ar.id_reservation = r.id_reservation AND ar.id_adherent = ?
        INNER JOIN terrain t ON t.id_terrain = r.id_terrain
        INNER JOIN club c ON c.id_club = t.id_club
        ORDER BY r.date_reservation DESC, r.heure_debut DESC
    `

    db.query(sql, [id_adherent], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des réservations" })
        }
        const payload = rows.map((row) => ({
            numero_reservation: row.numero_reservation,
            club: row.club,
            terrain: row.terrain,
            date: row.date,
            heureDebut: row.heureDebut ?? row.heuredebut,
            heureFin: row.heureFin ?? row.heurefin,
            score: row.score ?? "-",
            nbButs: row.nbButs ?? row.nbbuts ?? 0,
            statut: row.statut ?? "prevu",
            id_match: row.id_match ?? null,
        }))
        return res.json(payload)
    })
}

export const mettreScore = (req, res) => {
    const idAdherent = req.user.id
    const { numero_reservation, score, nb_buts } = req.body

    if (!numero_reservation || !score || nb_buts === undefined) {
        return res.status(400).json({ message: "numero_reservation, score et nb_buts sont obligatoires" })
    }

    const nbButs = Number(nb_buts)
    if (Number.isNaN(nbButs) || nbButs < 0) {
        return res.status(400).json({ message: "nb_buts doit etre un nombre positif" })
    }

    const reservationSql = `
        SELECT r.id_reservation
        FROM reservation r
        INNER JOIN adherent_reservation ar ON ar.id_reservation = r.id_reservation
        WHERE r.numero_reservation = ? AND ar.id_adherent = ?
        LIMIT 1
    `

    db.query(reservationSql, [numero_reservation, idAdherent], (reservationErr, reservationRows) => {
        if (reservationErr) {
            return res.status(500).json({ message: "Erreur lors de la verification de la reservation" })
        }

        if (reservationRows.length === 0) {
            return res.status(404).json({ message: "Reservation introuvable pour cet adherent" })
        }

        const idReservation = reservationRows[0].id_reservation

        const existingMatchSql = "SELECT id_match FROM matchs WHERE id_reservation = ? LIMIT 1"
        db.query(existingMatchSql, [idReservation], (matchErr, matchRows) => {
            if (matchErr) {
                return res.status(500).json({ message: "Erreur lors de la verification du match" })
            }

            if (matchRows.length > 0) {
                const updateSql = `
                    UPDATE matchs
                    SET score = ?, nb_buts = ?, status = 'termine'
                    WHERE id_match = ?
                `
                return db.query(updateSql, [score, nbButs, matchRows[0].id_match], (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({ message: "Erreur lors de la mise a jour du score" })
                    }
                    return res.json({ success: true, message: "Score mis a jour" })
                })
            }

            const insertSql = `
                INSERT INTO matchs (id_reservation, score, status, nb_buts, nb_victoires, nb_egalites, nb_defaites)
                VALUES (?, ?, 'termine', ?, 0, 0, 0)
            `
            return db.query(insertSql, [idReservation, score, nbButs], (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({ message: "Erreur lors de l'enregistrement du score" })
                }
                return res.json({ success: true, message: "Score enregistre" })
            })
        })
    })
}




// ----- Créneaux réservés d'un terrain (futurs) ----- //
export const creneauxTerrain = (req, res) => {
    const idTerrain = Number(req.params.id_terrain)

    if (Number.isNaN(idTerrain) || idTerrain <= 0) {
        return res.status(400).json({ message: "id_terrain invalide" })
    }

    const sql = `
        SELECT
            DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS date_reservation,
            DATE_FORMAT(r.heure_debut, '%H:%i') AS heure_debut,
            DATE_FORMAT(r.heure_fin, '%H:%i') AS heure_fin,
            c.nom AS club,
            t.adresse AS terrain
        FROM reservation r
        INNER JOIN terrain t ON t.id_terrain = r.id_terrain
        INNER JOIN club c ON c.id_club = t.id_club
        WHERE r.id_terrain = ?
          AND r.date_reservation >= CURDATE()
        ORDER BY r.date_reservation ASC, r.heure_debut ASC
    `

    db.query(sql, [idTerrain], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des créneaux" })
        }

        return res.json(
            rows.map((row) => ({
                date_reservation: row.date_reservation,
                heure_debut: row.heure_debut,
                heure_fin: row.heure_fin,
                club: row.club,
                terrain: row.terrain,
            }))
        )
    })
}

// ----- Créer une réservation ----- //
export const creerReservation = (req, res) => {
    const { id_terrain, date_reservation, heure_debut, duree_minutes } = req.body;
    const id_adherent = req.user.id;

    // Calculer l'heure de fin
    const [hours, minutes] = heure_debut.split(':').map(Number);
    const startDate = new Date(2000, 0, 1, hours, minutes);
    startDate.setMinutes(startDate.getMinutes() + duree_minutes);
    const heure_fin = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:00`;

    // Vérifier que le terrain existe et récupérer son club
    const checkTerrainSql = `SELECT id_club FROM terrain WHERE id_terrain = ?`;
    
    db.query(checkTerrainSql, [id_terrain], (err, terrainResult) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la vérification du terrain" });
        }

        if (terrainResult.length === 0) {
            return res.status(404).json({ message: "Terrain non trouvé" });
        }

        // Vérifier que l'utilisateur appartient au club du terrain ou est adhérent
        const checkUserSql = `SELECT id_club FROM adherent WHERE id_adherent = ?`;
        
        db.query(checkUserSql, [id_adherent], (err, userResult) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la vérification de l'utilisateur" });
            }

            // Vérifier la disponibilité du terrain à cette heure
            const checkAvailabilitySql = `
                SELECT COUNT(*) as count FROM reservation 
                WHERE id_terrain = ? 
                AND date_reservation = ? 
                AND (
                    (heure_debut < ? AND heure_fin > ?) OR
                    (heure_debut < ? AND heure_fin > ?)
                )
            `;

            db.query(checkAvailabilitySql, [id_terrain, date_reservation, heure_fin, heure_debut, heure_fin, heure_debut], (err, availabilityResult) => {
                if (err) {
                    return res.status(500).json({ message: "Erreur lors de la vérification de disponibilité" });
                }

                if (availabilityResult[0].count > 0) {
                    return res.status(409).json({ message: "Ce créneau n'est pas disponible" });
                }

                // Générer le numéro de réservation
                const numero_reservation = generateReservationNumber();

                // Créer la réservation, son match associé et le lien adhérent dans une transaction
                const createReservationSql = `
                    INSERT INTO reservation (id_adherent, id_terrain, date_reservation, heure_debut, heure_fin, numero_reservation)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                const createMatchSql = `
                    INSERT INTO matchs (id_reservation, score, status, nb_buts, nb_victoires, nb_egalites, nb_defaites)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                const addAdherentReservationSql = `
                    INSERT INTO adherent_reservation (id_adherent, id_reservation)
                    VALUES (?, ?)
                `;

                db.getConnection((err, connection) => {
                    if (err) {
                        return res.status(500).json({ message: "Erreur lors de la connexion à la base de données" });
                    }

                    connection.beginTransaction((err) => {
                        if (err) {
                            connection.release();
                            return res.status(500).json({ message: "Erreur lors de l'initialisation de la transaction" });
                        }

                        connection.query(
                            createReservationSql,
                            [id_adherent, id_terrain, date_reservation, heure_debut, heure_fin, numero_reservation],
                            (err, result) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ message: "Erreur lors de la création de la réservation" });
                                    });
                                }

                                const id_reservation = result.insertId;

                                connection.query(
                                    createMatchSql,
                                    [id_reservation, "0-0", "prevu", 0, 0, 0, 0],
                                    (err, matchResult) => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                return res.status(500).json({ message: "Erreur lors de la création du match associé" });
                                            });
                                        }

                                        connection.query(
                                            addAdherentReservationSql,
                                            [id_adherent, id_reservation],
                                            (err) => {
                                                if (err) {
                                                    return connection.rollback(() => {
                                                        connection.release();
                                                        return res.status(500).json({ message: "Erreur lors de l'ajout à la réservation" });
                                                    });
                                                }

                                                connection.commit((err) => {
                                                    if (err) {
                                                        return connection.rollback(() => {
                                                            connection.release();
                                                            return res.status(500).json({ message: "Erreur lors de la validation de la réservation" });
                                                        });
                                                    }

                                                    connection.release();
                                                    return res.json({
                                                        success: true,
                                                        message: "Réservation créée avec succès",
                                                        numero_reservation: numero_reservation,
                                                        id_reservation: id_reservation,
                                                        id_match: matchResult.insertId
                                                    });
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    });
                });
            });
        });
    });
};
