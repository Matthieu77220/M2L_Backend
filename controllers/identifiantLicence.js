import db from "../config/db.js"
import 'dotenv/config'

// ----- LICENCE ----- //
export const identifiantLicence = (req, res) => {

    // --- Récupération de l'id de l'adherent depuis le middleware ---
    const id = req.user.id

    // --- Préparation de la requete préparée pour Afficher les informations de la licence ---
    const sql = `SELECT a.prenom, a.nom, a.date_naissance, a.type_abonnement, l.numero_adherent, l.debut_licence, l.fin_licence
                 FROM adherent as a
                 JOIN licence as l on l.id_adherent = a.id_adherent
                 WHERE l.id_adherent = ? `

    db.query(sql, id, (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            return res.send([result[0]])
        }
    })

}