import 'dotenv/config'
import db from "../config/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// ----- INSCRIPTION ----- //
export const inscription = (req, res) => {

    const {prenom, nom, email, dateDeNaissance, telephone, motDePasse} = req.body


    // --- Vérifications des inputs récupéré ---
    if (!prenom || !nom || !email || !dateDeNaissance || !telephone || !motDePasse) {
        return res.status(400).send("Champs manquants !")
    }

    if (motDePasse.length < 12) {
        return res.status(400).send("Mot de passe trop court !")
    }

    // --- Préparation de la requete préparée pour Vérifier l'Email ---

    const sql = "SELECT * FROM adherent WHERE email = ?;"

    db.query(sql, [email], (err, results) => {

        if (err) {
            return res.status(500).send("Erreur lors de las vérification des infos")
        }

        if (results.length > 0) {
            return res.status(400).send("Il existe déjà un adherent possédant le même email !");
        }

        // --- Hachage du mot de passe ---
        bcrypt.hash(motDePasse, 10, (err, hash) => {
            if (err) {
                res.status(500).send("Erreur lors du hashage du motDePasse")
            } else {

                // --- Préparation de la requete préparée pour Créer le compte ---
                const sqlInscription = "INSERT INTO adherent (role, prenom, nom, email, telephone, date_naissance, mot_de_passe) VALUES(?,?,?,?,?,?,?) ;"

                db.query(sqlInscription, ["utilisateur", prenom, nom, email, telephone, dateDeNaissance, hash], (err, match) => {

                    if (err) {
                        res.status(500).send("Erreur lors de l'ajout de l'adherent dans la Base De Données")
                    }

                    // Ajout du numero de l'adherent dans la table licence générer aléatoirement
                    let numero_adherent = "LIC";

                    for (let index = 0; index < 5; index++) { // Boucle 5 fois
                        const nombre_aleatoire = Math.floor(Math.random() * 10); // Donne un nombre aléatoire compris entre 0 et 9 inclus
                        numero_adherent += nombre_aleatoire.toString();
                    }
                    
                    // -- Insert dans la table licence les données de l'utlisateur
                    const sqlLicence = `INSERT INTO licence (numero_adherent, debut_licence, fin_licence, id_adherent)
                                        VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?);
                                        `

                    db.query(sqlLicence, [numero_adherent, match.insertId], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Erreur lors de l'ajout de la licence.")
                        }
                        console.log("Licence ajoutée avec succès.")
                    })

                    // On récupère dans l'object match la clé insertId | on ne peut pas faire match[0].id_adherent car seulement pour les SELECT
                    const user = match.insertId

                    // --- Création du token ---
                    const token = jwt.sign(
                        { id: user, role: "utilisateur" },
                        process.env.secretKey,
                        { expiresIn: "24h" }
                    )

                    // --- Cookie sécurisé ---
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: false,
                        maxAge: 24 * 60 * 60 * 1000,// 24h
                    })         

                    // Renvoie l'ID et le rôle pour que le frontend puisse les stocker
                    return res.json({
                        message: "Adherent ajouté avec succès !",
                        id: user,
                        role: "utilisateur",
                        token: token
                    })
                })
            }
        })
    })
}

// ----- CONNEXION ----- //
export const connexion = (req, res) => {
    const { email, motDePasse } = req.body

    // --- Vérifications des inputs récupéré ---
    if (!email || !motDePasse) {
        return res.status(400).send("Champs manquants !")
    }

    if (motDePasse.length < 12) {
        return res.status(400).send("Mot de passe trop court !")
    }

    // --- Préparation de la requete préparée pour Vérifier l'Email ---

    const sql = "SELECT * from adherent WHERE email = ? ;"

    db.query(sql, [email], (err, results) => {

        if (err) {
            return res.status(500).send("Erreur lors de la recherche de l'adherent !");
        }

        if (results.length === 0) {
            return res.status(404).send("L'email n'existe pas !");
        }

        const user = results[0];

        // --- Compare le mot de passe ---
        bcrypt.compare(motDePasse, user.mot_de_passe, (err, match) => {

            if (err) {
                return res.status(500).send("Erreur lors de la vérification du mot de passe !");
            }

            if (!match) {
                return res.status(401).send("Mot de passe incorrect !");
            }

            // --- Création du token ---
            const token = jwt.sign(
                { id: user.id_adherent, role: user.role },
                process.env.secretKey,
                { expiresIn: "24h" }
            );

            // --- Cookie sécurisé ---
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: 24 * 60 * 60 * 1000,//24h

            });
            
            return res.json({ 
                message: "Vous êtes connecté !",
                role: user.role,
                id: user.id_adherent,
                token: token
            });
        });
    })
}

// ----- DECONNEXION ----- //
export const deconnexion = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true
    })
    res.send("Déconnexion")
}

// ----- SUPPRESSION ----- //
export const suppressionCompte = (req, res) => {

    // --- Récupération de l'id de l'adherent depuis le middleware ---
    const id = req.user.id

    
    // Supprimer les matchs des réservations que cet adhérent possède
    const deleteMatchsSql = `
      DELETE FROM matchs
      WHERE id_reservation IN (
        SELECT id_reservation FROM reservation WHERE id_adherent = ?
      )
    `;
    db.query(deleteMatchsSql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur lors de la suppression des matchs.")
        }
        console.log("Matchs supprimés avec succès.")
        // Supprimer toutes les liaisons adherent_reservation où il est PARTICIPANT
        const deleteARByAdherentSql = `
        DELETE FROM adherent_reservation
        WHERE id_adherent = ?
      `;
        db.query(deleteARByAdherentSql, [id], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erreur lors de la suppression des réservations d'adhérent.")
            }
            console.log("Liaisons adherent_reservation supprimées avec succès.")
            // Supprimer les liaisons adherent_reservation des réservations qu'il possède
            const deleteARByReservationSql = `
          DELETE FROM adherent_reservation
          WHERE id_reservation IN (
            SELECT id_reservation FROM reservation WHERE id_adherent = ?
          )
        `;
            db.query(deleteARByReservationSql, [id], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Erreur lors de la suppression des réservations.")
                }
                console.log("Liaisons adherent_reservation supprimées avec succès.")
                // Supprimer ses réservations
                const deleteReservationSql = "DELETE FROM reservation WHERE id_adherent = ?";
                db.query(deleteReservationSql, [id], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Erreur lors de la suppression des réservations principales.")
                    }
                    console.log("Réservations supprimées avec succès.")
                    // Supprimer les licences
                    const deleteLicencesSql = "DELETE FROM licence WHERE id_adherent = ?";
                    db.query(deleteLicencesSql, [id], (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Erreur lors de la suppression des licences.")
                        }
                        console.log("Licences supprimées avec succès.")
                        // Supprimer les commentaires
                        
                            // Supprimer l'adhérent
                            const deleteSql = "DELETE FROM adherent WHERE id_adherent = ?";
                            db.query(deleteSql, [id], (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).send("Erreur lors de la suppression du compte.")
                                }
                                console.log("Adhérent supprimé avec succès.")
                                res.clearCookie("token", {
                                    httpOnly: true,
                                    secure: false
                                })

                                return res.send("User supprimé avec succès.")
                            });
                     
                    });
                });
            });
        });
    })
    

}


// ----- Modifier MDP ----- //
export const modifierMotDePasse = (req, res) => {

    // Récupération des inputs
    const { email, oldMotDePasse, newConfirmMotDePasse } = req.body

    if (!newConfirmMotDePasse) {
        return res.status(400).send("Champs manquants !")
    }

    if (newConfirmMotDePasse.length < 12 ) {
        return res.status(400).send("Mot de passe trop court !")
    }

    const sql = "SELECT * FROM adherent where email = ?"

    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de la recherche de l'adherent !");
        }

        if (results.length === 0) {
            return res.status(404).send("L'email n'existe pas !");
        }

        const user = results[0]

        // --- Compare le mot de passe ---
        bcrypt.compare(oldMotDePasse, user.mot_de_passe, (err, match) => {

            if (err) {
                return res.status(500).send("Erreur lors de la vérification du mot de passe !");
            }

            if (!match) {
                return res.status(401).send("Mot de passe incorrect !");
            }

                // --- Hachage du mot de passe ---
                bcrypt.hash(newConfirmMotDePasse, 10, (err, hash) => {
                    if (err) {
                        res.status(500).send("Erreur lors du hashage du mot de passe")
                    } else {

                        // --- Préparation de la requete préparée pour Modifier le MDP ---
                        const sqlAjouteMotDePasse = "UPDATE adherent SET mot_de_passe = ? where email = ?;"

                        db.query(sqlAjouteMotDePasse, [hash, email], (err, results) => {

                            if (err) {
                                res.status(500).send("Erreur lors de la mise à jour du mot de passe")
                            }

                            return res.send("Modification réussite avec succès.")
                        })
                    }
                })
        })

    })
}