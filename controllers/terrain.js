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
            return res.send(result)
        }
    })

}


// ----- Ajouter les terrains ----- //
export const ajouterTerrain = (req, res) => {

    const {adresse} = req.body

    const id = req.user.id

    // --- Créer et ajouter un Terrain
    const sql = ` INSERT INTO terrain (adresse, id_club)
                  VALUES
                  (?,?); `

    // -- Récupère le terrain selon l'admin du club
    const sqlRelaodPage = ` SELECT * 
                  FROM terrain
                  WHERE id_club = (
                        SELECT id_club
                        FROM adherent
                        WHERE id_adherent = ?
                  )
                  ORDER BY id_terrain ASC ; `

    db.query(sql, [adresse, id], (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            db.query(sqlRelaodPage, id, (err, result) => {
                if (err) {
                    return res.status(500).send("Erreur lors de l'éxecution de la requêtes Sql")
                }else {
                    return res.send(result)  
                }
            })
        }
    })
}


// ----- Surrpimer un Terrains ----- //
export const supprimerTerrain = (req, res) => {

    const { id_terrain } = req.body
    

    // -- Récupère le terrain selon l'admin du club
    const sql = ` DELETE FROM terrain WHERE id_terrain = ?;`

    // -- Récupère le terrain selon l'admin du club
    const sqlRelaodPage = ` SELECT * 
                  FROM terrain
                  WHERE id_club = (
                        SELECT id_club
                        FROM adherent
                        WHERE id_adherent = ?
                  )
                  ORDER BY id_terrain ASC ; `

    db.query(sql, [id_terrain], (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            return res.status(200).send("Terrain supprimer avec succès !")
        }
    })

}