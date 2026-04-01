import db from "../config/db.js"

// ----- Visualisation des Chasuble ----- //
export const stockChasuble = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    // Récupère les chasubles d'un club
    const sql = `
                SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
                FROM terrain
                LEFT JOIN equipements 
                    ON equipements.id_terrain = terrain.id_terrain
                WHERE terrain.id_club = ? AND equipements.equipement = 'chasuble';
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
                SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
                FROM terrain
                LEFT JOIN equipements 
                    ON equipements.id_terrain = terrain.id_terrain
                WHERE terrain.id_club = ? AND equipements.equipement = 'crampon';
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
                SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
                FROM terrain
                LEFT JOIN equipements 
                    ON equipements.id_terrain = terrain.id_terrain
                WHERE terrain.id_club = ? AND equipements.equipement = 'ballon';
                `
    

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {            
            return res.json(results)
            
        }
    })
}