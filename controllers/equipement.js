import db from "../config/db.js"

// ----- Visualisation des Chasuble ----- //
export const stockChasuble = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    const sql = ` SELECT * FROM chasuble 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?); `

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            return res.json(results)
            
        }
    })
}

// ----- Visualisation des Crampons ----- //
export const stockCrampon = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    const sql = ` SELECT * FROM crampon 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?); `

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            return res.json(results)
            
        }
    })
}



// ----- Visualisation des Ballons ----- //
export const stockBallon = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    const sql = ` SELECT * FROM ballon 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?); `

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            return res.json(results)
            
        }
    })
}