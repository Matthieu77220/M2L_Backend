import db from "../config/db.js";

export const rejoindreMatch = (req, res) => {
    const { numero_reservation } = req.body
    const id = req.user.id

    // Vérifie si la réservation existe + récupère le terrain
    const sql = `
        SELECT id_reservation, id_terrain
        FROM reservation
        WHERE numero_reservation = ?;
    `

    // Vérifie si l'utilisateur est déjà inscrit dans la réservation
    const sql2 = `
        SELECT *
        FROM adherent_reservation
        WHERE id_reservation = ? AND id_adherent = ?;
    `

    // Ajoute l'utilisateur dans la réservation
    const sql3 = `
        INSERT INTO adherent_reservation(id_adherent, id_reservation)
        VALUES (?, ?);
    `

    // Récupère l'id du club du terrain
    const sqlClub = `
        SELECT id_club
        FROM terrain
        JOIN reservation
            ON reservation.id_terrain = terrain.id_terrain
        WHERE numero_reservation = ?;
    `

    // Récupère le stock chasuble du terrain
    const sql4 = `
        SELECT stock_current
        FROM equipements
        WHERE id_club = ?
        AND id_terrain = ?
        AND equipement = "chasuble";
    `

    const updateChasuble = `
        UPDATE equipements
        SET stock_current = ?
        WHERE equipement = "chasuble"
        AND id_terrain = ?
        AND id_club = ?;
    `

    // Récupère le stock de crampon
    const sql5 = `
        SELECT stock_current
        FROM equipements
        WHERE id_club = ?
        AND id_terrain = ?
        AND equipement = "crampon";
    `

    const updateCrampon = `
        UPDATE equipements
        SET stock_current = ?
        WHERE equipement = "crampon"
        AND id_terrain = ?
        AND id_club = ?;
    `

    // Vérifie la réservation
    db.query(sql, [numero_reservation], (err, result) => {
        if (err) {
            return res.status(500).send("Erreur SQL réservation")
        }

        if (!result || result.length === 0) {
            return res.status(404).send({
                message: "Aucun match trouvé"
            })
        }

        const id_reservation = result[0].id_reservation
        const id_terrain = result[0].id_terrain

        // Vérifie que l'utilisateur est déjà inscrit
        db.query(sql2, [id_reservation, id], (err, result2) => {
            if (err) {
                return res.status(500).send("Erreur SQL inscription")
            }

            if (result2.length > 0) {
                return res.send({message: "Déjà inscrit"})
            }

            // Ajoute l'adherent dans la réservation
            db.query(sql3, [id, id_reservation], (err) => {
                if (err) {
                    return res.status(500).send("Erreur insertion")
                }

                // Récupère l'id du club
                db.query(sqlClub, [numero_reservation], (err, result4) => {
                    if (err) {
                        return res.status(500).send("Erreur club")
                    }

                    if (!result4 || result4.length === 0) {
                        return res.status(404).send({
                            message: "Aucun club associé"
                        })
                    }

                    const id_club = result4[0].id_club;

                    // Gestion chasuble
                    db.query(sql4, [id_club, id_terrain], (err, result5) => {
                        if (err) {
                            return res.status(500).send("Erreur stock chasuble")
                        }

                        if (!result5 || result5.length === 0) {
                            return res.status(404).send({message: "Stock chasuble introuvable"})
                        }

                        if (result5[0].stock_current <= 0) {
                            return res.status(400).send({message: "Plus de chasubles"})
                        }

                        const stock_chasuble = result5[0].stock_current - 1;

                        // Met a jour le stock de chasuble
                        db.query(updateChasuble, [stock_chasuble, id_terrain, id_club],(err, result6) => {
                                if (err) {
                                    return res.status(500).send("Erreur update chasuble")
                                }

                                // Gestion crampon
                                db.query(sql5, [id_club, id_terrain], (err, result7) => {
                                        if (err) {
                                            return res.status(500).send("Erreur stock crampon")
                                        }

                                        if (!result7 || result7.length === 0) {
                                            return res.status(404).send({message:"Stock crampon introuvable"})
                                        }

                                        if (result7[0].stock_current <= 0) {
                                            return res.status(400).send({message:"Plus de crampons"})
                                        }

                                        const stock_crampon = result7[0].stock_current - 1

                                        
                                        // Met à jour le stock de crampon
                                        db.query(updateCrampon,[stock_crampon, id_terrain, id_club], (err, result8) => {
                                                if (err) {
                                                    return res.status(500).send("Erreur update crampon")
                                                }

                                                return res.send({message:"Inscription réussie !"})
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