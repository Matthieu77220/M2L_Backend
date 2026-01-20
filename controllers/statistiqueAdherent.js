import db from "../config/db.js"
import 'dotenv/config'

// ----- Statistique ----- //
export const statistique = async (req, res) => {
    try {
        // --- Récupération de l'id de l'adherent depuis le middleware ---
        const id = req.user.id

        const sql = `SELECT COUNT(m.id_match) AS nombreMatch , SUM(m.nb_victoires) AS victoire , SUM(m.nb_defaites) AS defaite , SUM(m.nb_egalites) AS egalite
                     FROM matchs as m
                     JOIN reservation r on r.id_reservation = m.id_reservation
                     JOIN adherent_reservation ad on ad.id_reservation =  r.id_reservation 
                     where ad.id_adherent = ? `
        
        // --- Requete préparée ---
        const [results] = await db.query(sql, [id])

        return res.json([results[0]])
    } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err)
        return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
    }
}

// ----- Visualisation Match ----- //
export const visualisationMatch = async (req, res) => {
    try {
        // --- Récupération de l'id de l'adherent depuis le middleware ---
        const id = req.user.id

        // A FAIRE !!!!  apres les AS rennomer selon le map dans le front
        const sql = `SELECT r.date_reservation, m.score, m.status
                     FROM reservation r
                     JOIN matchs m on m.id_reservation = r.id_reservation
                     JOIN adherent_reservation ad on r.id_reservation = ad.id_reservation
                     WHERE ad.id_adherent = ? `

        const [results] = await db.query(sql, [id])
        
        return res.json(results)
    } catch (err) {
        console.error("Erreur lors de la récupération des matchs:", err)
        return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
    }
}
