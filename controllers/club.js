import db from "../config/db.js"
import 'dotenv/config'

// ----- Visualiser les Clubs ----- //
export const voirClub = (req, res) => {
    const id = req.user.id
    
    const sql = `SELECT nom, adresse
                 FROM club
                `

    db.query(sql, id, (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de la vérification de l'utilisateur.")
        }

        if (result) {
            return res.send(result)
        }
    })
}


// ----- Visualiser les Terrains ----- //
export const voirTerrain = (req, res) => {

    const { nom } = req.body

    const sql = `SELECT terrain.adresse, club.nom
                 from terrain
                 join club on club.id_club = terrain.id_club
                 where club.nom = ? ;
                `

    db.query(sql, nom, (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de la vérification de l'utilisateur.")
        }

        if (result) {
            return res.send(result)
        }
    })
}