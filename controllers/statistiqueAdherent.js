import db from "../config/db.js"
import 'dotenv/config'
import jwt from "jsonwebtoken"

// ----- Statistique ----- //
export const statistique = (req, res) => {

    // --- Récupération du token depuis le cookie ---
    const getToken = req.cookies['token']

    // --- Décode le jwt pour récupérer l'id de l'adherent
    const token = jwt.verify(getToken, process.env.secretKey)
    const id = token.id

    const sql =  `SELECT COUNT(m.id_match) AS nombreMatch , SUM(m.nb_victoires) AS victoire , SUM(m.nb_defaites) AS defaite , SUM(m.nb_egalites) AS egalite
                  FROM match as m
                  JOIN reservation r on r.id_reservation = m.id_reservation
                  JOIN adherent_reservation ad on ad.id_reservation =  r.id_reservation 
                  where adherent_reservation.id_adherent = ? `
    
    // --- Requete préparée ---
    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            if (results.length == 0 ) { // --- renvoie un JSON si l'adherent n'a fait aucun match ---
                return res.json([{ "matchsJoues": 0,
                                "victoires": 0, 
                                "defaites": 0, 
                                "nuls": 0
                            }]);

            }else {
                return res.json([results[0]])
            }
        }
    })


}

// ----- Visualisation Match ----- //
export const visualisationMatch = (req, res) => {

    // --- Récupération du token depuis le cookie ---
    const getToken = req.cookies['token']

    // --- Décode le jwt pour récupérer l'id de l'adherent
    const token = jwt.verify(getToken, process.env.secretKey)
    const id = token.id

    const sql = `SELECT r.date_reservation AS , m.score, m.status AS
                 FROM reservation r
                 JOIN match m on m.id_reservation = r.id_reservation
                 JOIN adherent_reservation ad on r.id_reservation = ad.id_reservation
                 WHERE ad.id_adherent = ? `

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            res.json([results[0]])
        }
    })
}