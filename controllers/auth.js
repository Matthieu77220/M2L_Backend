import db from "../config/db.js"
import bcrypt, { hash } from "bcrypt"

// ----- INSCRIPTION ----- //
export const inscription = (req,res) => {
    const sql = "SELECT * FROM adherent WHERE email = ?"
    // const {email, password} = req.body
    // Rajouter autre lors de l'inscription

    db.query(sql, email, (err, results) => {
        if (err) {
            res.status(500).send("Erreur lors de las vérification des infos")
        }else {
            if (results.length) {
                if (email === results[0].email) {
                    res.send("Votre compte a déjà été crée.")
                }
            }else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).send("Erreur lors du hashage du password")
                    }else {
                        // const sqlInscription = "INSERT INTO adherent () VALUES(?,?,?)"
                        // Créer la BDD

                        db.query(sqlInscription,[email,hash], (err,results) => {
                            if (err) {
                                res.status(500).send("Erreur lors de l'ajout de l'adherent dans la Base De Données")
                            }else {
                                res.status(200).send("User ajouté avec succès !")
                            }
                            
                        })
                    }
                })
            }
        }
    })
}

export const connexion = (req,res) => {

}

export const deconnexion = (req,res) => {

}