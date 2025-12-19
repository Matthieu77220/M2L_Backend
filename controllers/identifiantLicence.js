import db from "../config/db.js"
import 'dotenv/config'
import jwt from "jsonwebtoken"

// ----- LICENCE ----- //
export const identifiantLicence = (req, res) => {

    // --- Récupération du token depuis le cookie ---
    const getToken = req.cookies['token']

    // --- Décode le jwt pour récupérer l'id de l'adherent
    const token = jwt.verify(getToken, process.env.secretKey)
    const id = token.id

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