import db from "../config/db.js"

// ----- Visualisation des Chasuble ----- //
export const stockChasuble = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    // Récupère les chasubles d'un club
    const sql = `
                SELECT * FROM equipements 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?) 
                    AND 
                        equipement = "chasuble";
                `

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

    // Récupère les crampons d'un club
    const sql = `
                SELECT * FROM equipements 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?) 
                    AND 
                        equipement = "crampon";
                `

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

    // Récupère les ballons d'un club
    const sql = `
                SELECT * FROM equipements 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?) 
                    AND 
                        equipement = "ballon";
                `
    

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            return res.json(results)
            
        }
    })
}