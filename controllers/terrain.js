import db from "../config/db.js"
import 'dotenv/config'

// ----- Visualiser les Terrains ----- //
export const voirTerrain = (req, res) => {
    const id = req.user.id

    // Vérifie d'abord le rôle et l'id_club de l'utilisateur
    const checkUserSql = `SELECT id_club, role FROM adherent WHERE id_adherent = ?`

    db.query(checkUserSql, id, (err, userResult) => {
        if (err) {
            return res.status(500).send("Erreur lors de la vérification de l'utilisateur.")
        }

        if (userResult.length === 0) {
            return res.status(404).send("Utilisateur non trouvé.")
        }

        const user = userResult[0]
        
        // Si l'utilisateur a un club (admin), affiche seulement les terrains de son club
        // Sinon (adhérent standard), affiche tous les terrains
        const sql = user.id_club 
            ? `SELECT * FROM terrain WHERE id_club = ? ORDER BY id_terrain ASC`
            : `SELECT * FROM terrain ORDER BY id_terrain ASC`

        const params = user.id_club ? [user.id_club] : []

        db.query(sql, params, (err, result) => {
            if (err) {
                return res.status(500).send("Erreur lors de l'éxecution de la requête SQL.")
            }

            return res.send(result)
        })
    })
}


// ----- Ajouter les terrains ----- //
export const ajouterTerrain = (req, res) => {

    const { adresse } = req.body

    const id = req.user.id

    // --- Récupère le id_club de l'admin
    const id_club = ` SELECT id_club FROM adherent 
                      where id_adherent = ? `


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

    db.query(id_club, id, (err, result) => {
        // -- Vérifie que l'admin est associé a id_club
        if (result.length == 1) {
            db.query(sql, [adresse, result[0].id_club], (err, result) => { // result[0].id_club = id_club
                if (err) {
                    return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
                }

                if (result) {
                    db.query(sqlRelaodPage, id, (err, result) => {
                        if (err) {
                            return res.status(500).send("Erreur lors de l'éxecution de la requêtes Sql")
                        } else {
                            return res.send(result)
                        }
                    })
                }
            })
        }else {
            return res.status(500).send("Le compte n'appartient pas à un club.")
        }
    })


}


// ----- Surrpimer un Terrains ----- //
export const supprimerTerrain = (req, res) => {

    const { id_terrain } = req.body


    // -- Suppression des Foreign Key et le terrain
    const sqlDeleteFK = `
                        DELETE FROM chasuble WHERE id_terrain = ?;
                        DELETE FROM crampon  WHERE id_terrain = ?;
                        DELETE FROM ballon   WHERE id_terrain = ?;
                        DELETE FROM reservation WHERE id_terrain = ?;
                        DELETE FROM terrain WHERE id_terrain = ?;`

    db.query(sqlDeleteFK, [id_terrain, id_terrain, id_terrain, id_terrain, id_terrain], (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            return res.status(200).send("Terrain supprimer avec succès !")
        }
    })

}



// ----- Modifier un Terrains ----- //
export const modifierTerrain = (req, res) => {

    const { id_terrain, adresse } = req.body

    // -- Modifier
    const sql = ` UPDATE terrain SET adresse = ? where id_terrain = ? `


    db.query(sql, [adresse, id_terrain], (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            return res.status(200).send("Terrain supprimer avec succès !")
        }
    })

}
