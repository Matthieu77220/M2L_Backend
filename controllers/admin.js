import bcrypt from 'bcrypt'
import db from "../config/db.js"

// GET - Récupérer tous les utilisateurs
export const getAllUsers = (req, res) => {
    try {
        const sql = `SELECT 
                id_adherent AS id, 
                role, 
                prenom, 
                nom, 
                email, 
                telephone, 
                date_naissance, 
                debut_adhesion, 
                fin_adhesion, 
                type_abonnement 
             FROM ADHERENT 
             ORDER BY id_adherent ASC`

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).json({ message: "Erreur serveur !" });
            }

            if (result.length === 0) {
                return res.status(200).json([]);
            }


            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// POST - Créer un nouvel utilisateur
export const createUser = (req, res) => {
    const {
        role,
        prenom,
        nom,
        email,
        telephone,
        date_naissance,
        mot_de_passe,
        montant_cotisation,
        debut_adhesion,
        fin_adhesion,
        type_abonnement
    } = req.body;

    if (!email || !mot_de_passe || !prenom || !nom || !role || !telephone || !date_naissance) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Format d\'email invalide' });
    }

    if (mot_de_passe.length < 12) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 12 caractères' });
    }

    const rolesValides = ['utilisateur'];
    if (!rolesValides.includes(role)) {
        return res.status(400).json({ message: 'Rôle invalide' });
    }

    if (req.user.role === 'admin' && role !== 'utilisateur') {
        return res.status(403).json({ message: 'Un admin ne peut créer que des utilisateurs simples' });
    }


    const checkEmailSql = 'SELECT id_adherent FROM ADHERENT WHERE email = ?';

    db.query(checkEmailSql, [email], (err, existingUsers) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'email:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Cet email existe déjà' });
        }


        bcrypt.hash(mot_de_passe, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Erreur lors du hashage du mot de passe:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }


            const insertSql = `INSERT INTO ADHERENT 
                (role, prenom, nom, email, telephone, date_naissance, mot_de_passe, montant_cotisation, debut_adhesion, fin_adhesion, type_abonnement) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                role,
                prenom,
                nom,
                email,
                telephone,
                date_naissance,
                hashedPassword,
                montant_cotisation || null,
                debut_adhesion || null,
                fin_adhesion || null,
                type_abonnement || null
            ];

            db.query(insertSql, values, (err, result) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion:', err);
                    return res.status(500).json({ message: 'Erreur serveur' });
                }

                res.status(201).json({
                    message: 'Utilisateur créé avec succès',
                    userId: result.insertId
                });
            });
        });
    });
};

// PUT - Modifier un utilisateur
export const updateUser = (req, res) => {
    const { id } = req.params;
    const {
        role,
        prenom,
        nom,
        email,
        telephone,
        date_naissance,
        mot_de_passe,
        montant_cotisation,
        debut_adhesion,
        fin_adhesion,
        type_abonnement
    } = req.body;

    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        return res.status(403).json({ message: 'Accès interdit' });
    }

    try {

        const checkUserSql = 'SELECT id_adherent, role FROM ADHERENT WHERE id_adherent = ?';

        db.query(checkUserSql, [id], (err, users) => {
            if (err) {
                console.error('Erreur lors de la vérification de l\'utilisateur:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            if (users.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            const targetUser = users[0];


            if (req.user.role === 'admin' && targetUser.role !== 'utilisateur') {
                return res.status(403).json({ message: 'Un admin ne peut modifier que des utilisateurs simples' });
            }

            let updateFields = [];
            let updateValues = [];

            if (role) {
                const rolesValides = ['admin', 'superadmin', 'utilisateur'];
                if (!rolesValides.includes(role)) {
                    return res.status(400).json({ message: 'Rôle invalide' });
                }

                updateFields.push('role = ?');
                updateValues.push(role);
            }

            if (prenom) {
                updateFields.push('prenom = ?');
                updateValues.push(prenom);
            }

            if (nom) {
                updateFields.push('nom = ?');
                updateValues.push(nom);
            }

            if (telephone) {
                updateFields.push('telephone = ?');
                updateValues.push(telephone);
            }

            if (date_naissance) {
                updateFields.push('date_naissance = ?');
                updateValues.push(date_naissance);
            }

            if (montant_cotisation !== undefined) {
                updateFields.push('montant_cotisation = ?');
                updateValues.push(montant_cotisation);
            }

            if (debut_adhesion !== undefined) {
                updateFields.push('debut_adhesion = ?');
                updateValues.push(debut_adhesion);
            }

            if (fin_adhesion !== undefined) {
                updateFields.push('fin_adhesion = ?');
                updateValues.push(fin_adhesion);
            }

            if (type_abonnement !== undefined) {
                updateFields.push('type_abonnement = ?');
                updateValues.push(type_abonnement);
            }


            const proceedWithUpdate = () => {
                if (updateFields.length === 0) {
                    return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
                }

                updateValues.push(id);

                const updateSql = `UPDATE ADHERENT SET ${updateFields.join(', ')} WHERE id_adherent = ?`;

                db.query(updateSql, updateValues, (err, result) => {
                    if (err) {
                        console.error('Erreur lors de la mise à jour:', err);
                        return res.status(500).json({ message: 'Erreur serveur' });
                    }

                    res.status(200).json({ message: 'Utilisateur modifié avec succès' });
                });
            };


            if (email) {
                const checkEmailSql = 'SELECT id_adherent FROM ADHERENT WHERE email = ? AND id_adherent != ?';

                db.query(checkEmailSql, [email, id], (err, existingUsers) => {
                    if (err) {
                        console.error('Erreur lors de la vérification de l\'email:', err);
                        return res.status(500).json({ message: 'Erreur serveur' });
                    }

                    if (existingUsers.length > 0) {
                        return res.status(409).json({ message: 'Cet email est déjà utilisé' });
                    }

                    updateFields.push('email = ?');
                    updateValues.push(email);


                    if (mot_de_passe) {
                        if (mot_de_passe.length < 12) {
                            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
                        }

                        bcrypt.hash(mot_de_passe, 10, (err, hashedPassword) => {
                            if (err) {
                                console.error('Erreur lors du hashage du mot de passe:', err);
                                return res.status(500).json({ message: 'Erreur serveur' });
                            }

                            updateFields.push('mot_de_passe = ?');
                            updateValues.push(hashedPassword);

                            proceedWithUpdate();
                        });
                    } else {
                        proceedWithUpdate();
                    }
                });
            } else {

                if (mot_de_passe) {
                    if (mot_de_passe.length < 8) {
                        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
                    }

                    bcrypt.hash(mot_de_passe, 10, (err, hashedPassword) => {
                        if (err) {
                            console.error('Erreur lors du hashage du mot de passe:', err);
                            return res.status(500).json({ message: 'Erreur serveur' });
                        }

                        updateFields.push('mot_de_passe = ?');
                        updateValues.push(hashedPassword);

                        proceedWithUpdate();
                    });
                } else {
                    proceedWithUpdate();
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de la modification de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const deleteUser = (req, res) => {
    const { id } = req.params;

    if (!req.user || (req.user.role !== "admin" && req.user.role !== "superadmin")) {
        return res.status(403).json({ message: "Accès interdit" });
    }
    if (req.user.id === parseInt(id)) {
        return res.status(403).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
    }

    const checkUserSql = "SELECT role FROM ADHERENT WHERE id_adherent = ?";
    db.query(checkUserSql, [id], (err, users) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        if (users.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const targetUser = users[0];
        if (req.user.role === "admin" && targetUser.role !== "utilisateur") {
            return res.status(403).json({ message: "Un admin ne peut supprimer que des utilisateurs simples" });
        }

        // Supprimer les matchs des réservations que cet adhérent possède
        const deleteMatchsSql = `
      DELETE FROM matchs
      WHERE id_reservation IN (
        SELECT id_reservation FROM reservation WHERE id_adherent = ?
      )
    `;
        db.query(deleteMatchsSql, [id], (err) => {
            if (err) return res.status(500).json({ message: "Erreur serveur (matchs)" });

            // Supprimer toutes les liaisons adherent_reservation où il est PARTICIPANT (c'est ça qui te bloque)
            const deleteARByAdherentSql = `
        DELETE FROM adherent_reservation
        WHERE id_adherent = ?
      `;
            db.query(deleteARByAdherentSql, [id], (err) => {
                if (err) return res.status(500).json({ message: "Erreur serveur (adherent_reservation par adherent)" });

                // Supprimer les liaisons adherent_reservation des réservations qu’il possède (au cas où)
                const deleteARByReservationSql = `
          DELETE FROM adherent_reservation
          WHERE id_reservation IN (
            SELECT id_reservation FROM reservation WHERE id_adherent = ?
          )
        `;
                db.query(deleteARByReservationSql, [id], (err) => {
                    if (err) return res.status(500).json({ message: "Erreur serveur (adherent_reservation par reservation)" });

                    // Supprimer ses réservations
                    const deleteReservationSql = "DELETE FROM reservation WHERE id_adherent = ?";
                    db.query(deleteReservationSql, [id], (err) => {
                        if (err) return res.status(500).json({ message: "Erreur serveur (reservation)" });

                        // licences
                        const deleteLicencesSql = "DELETE FROM licence WHERE id_adherent = ?";
                        db.query(deleteLicencesSql, [id], (err) => {
                            if (err) return res.status(500).json({ message: "Erreur serveur (licence)" });
                            
                            //supprimer l’adhérent
                            const deleteSql = "DELETE FROM ADHERENT WHERE id_adherent = ?";
                            db.query(deleteSql, [id], (err, result) => {
                                if (err) return res.status(500).json({ message: "Erreur serveur (adherent)" });
                                if (result.affectedRows === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });

                                return res.status(200).json({ message: "Utilisateur supprimé avec succès" });
                            });
                        });
                    });
                });
            });
        });
    });
};




// ----- STATISTICS ----- //
export const getStats = (req, res) => {
    const sql = `
            SELECT 
                (SELECT COUNT(*) FROM adherent) AS total_users,
                (SELECT COUNT(*) FROM club) AS total_clubs,
                (SELECT COUNT(*) FROM licence WHERE fin_licence IS NULL OR fin_licence >= CURDATE()) AS active_licenses,
                (SELECT COUNT(*) FROM licence) AS total_licenses,
                (SELECT COUNT(*) FROM reservation) AS total_reservations,
                (SELECT COUNT(*) FROM matchs) AS total_matches
        `

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: "Erreur lors de la récupération des statistiques" })
        }

        if (result.length == 0) {
            res.status(500).json({ error: "Aucune statistique" })
        } else {
            res.status(200).send(result[0])
        }

    })
}