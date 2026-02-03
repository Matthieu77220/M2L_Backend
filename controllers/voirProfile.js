import db from "../config/db.js"
import 'dotenv/config'

// ----- LICENCE ----- //
export const voirProfile = (req, res) => {

    // --- Récupération de l'id de l'adherent depuis le middleware ---
    const id = req.user.id

    // --- Préparation de la requete préparée pour Afficher les informations de la licence ---
    const sql = ` SELECT nom, prenom, date_naissance, email, telephone
                  FROM adherent
                  WHERE id_adherent = ? ; `

    db.query(sql, id, (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            return res.send([result[0]])
        }
    })

}