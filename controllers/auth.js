import db from "../config/db.js"
import 'dotenv/config'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// ----- INSCRIPTION ----- //
export const inscription = (req, res) => {
    const sql = "SELECT * FROM adherent WHERE email = ?"
    const {prenom, nom, email, dateDeNaissance, telephone, password} = req.body
    // Rajouter autre lors de l'inscription

    db.query(sql, email, (err, results) => {
        if (err) {
            res.status(500).send("Erreur lors de las vérification des infos")
        } else {
            if (results.length) {
                if (email === results[0].email) {
                    res.send("Il existe déjà un adherent possédant le même email !")
                } else {
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            res.status(500).send("Erreur lors du hashage du password")
                        } else {
                            const sqlInscription = "INSERT INTO adherent (prenom, nom, email, telephone, date_naissance, mot_de_passe) VALUES(?,?,?,?,?,?)"

                            db.query(sqlInscription, [prenom, nom, email, telephone, dateDeNaissance, hash], (err, results) => {
                                if (err) {
                                    res.status(500).send("Erreur lors de l'ajout de l'adherent dans la Base De Données")
                                }
                                // const token = jwt.sign( { id: results.id }, process.env.secretKey, { expiresIn: "3h"} )
                                res.send("Adherent ajouté avec succès !")
                                // token
                            })
                        }
                    })
                }
            }
        }
    })
}

// ----- CONNEXION ----- //
export const connexion = (req, res) => {
    const { email, password } = req.body
    const sql = "SELECT * from adherent WHERE email = ? ;"

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            res.status(500).send("Erreur lors de la recherche de l'adherent !")
        } else {
            if (email === results[0].email) {
                // Vérifier si le mdp de l'user == mdp hashé dans la BDD
                bcrypt.compare(password, results[0].password_hash, (err, results) => {
                    if (err) {
                        res.status(500).send("Erreur lors de la vérification du mot de passe !")
                    } else {
                        if (results) {
                            // const token = jwt.sign( { id: results.id }, process.env.secretKey, { expiresIn: "3h"} )
                            res.send("Vous êtes connecté")
                            // token
                        } else {
                            res.send("Mot de passe incorrect")
                        }
                    }
                })
            } else {
                res.send("L'email n'existe pas !")
            }
        }
    })
}

// ----- DECONNEXION ----- //
export const deconnexion = (req, res) => {

}

// ----- SUPPRESSION ----- //
export const suppressionCompte = (req, res) => {
}