import db from "../config/db.js"
import 'dotenv/config'

// ----- Visualiser les Terrains ----- //
export const voirTerrain = (req, res) => {

    const id = req.user.id

    // -- Récupère le terrain selon l'admin du club
    const sql = ` SELECT * 
                  FROM terrain
                  WHERE id_club = (
                        SELECT id_club
                        FROM adherent
                        WHERE id_adherent = ?
                  )
                  ORDER BY id_terrain ASC ; `

    db.query(sql, id, (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            return res.send([result[0]])
        }
    })

}


// // ----- Ajouter les terrains ----- //
// export const ajouterTerrain = (req, res) => {

//     // --- Récupération de l'id de l'adherent depuis le middleware ---
//     const id = req.user.id

//     // --- Préparation de la requete préparée pour Afficher les informations de la licence ---
//     const sql = ` SELECT nom, prenom, date_naissance, email, telephone
//                   FROM adherent
//                   WHERE id_adherent = ? ; `

//     db.query(sql, id, (err, result) => {
//         if (err) {
//             return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
//         }

//         if (result) {
//             return res.send([result[0]])
//         }
//     })

// }