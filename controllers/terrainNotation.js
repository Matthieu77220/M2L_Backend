import db from "../config/db.js"
import 'dotenv/config'


// ----- Noter un Terrain ----- //
export const noterTerrain = (req, res) => {

    // --- Récupération de l'id de l'adherent depuis le middleware ---
    const id_adherent = req.user.id
    
    const {id_terrain, valeur_note} = req.body

    const sqlVerif = ` SELECT * from NOTE where id_terrain = ? AND id_adherent = ? `

    // --- Préparation de la requete préparée pour Afficher les informations de la licence ---
    const sql = ` INSERT INTO NOTE (id_terrain, id_adherent, valeur_note)
                   VALUES (?, ?, ?);
                `

    db.query(sqlVerif, [id_terrain, id_adherent], (err, result) => {
        if (result.length != 0) {
            return res.send("Vous avez déjà noter ceux terrains.")
        }

    })

    db.query(sql, [id_terrain, id_adherent, valeur_note], (err, result) => {

        console.log(result);
        

        // if (result. != 0) {
        //     return res.send(200).send("Vous avez déjà noté ce Terrain")
        // }

        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            return res.send("ca marche")
        }
    })

}

