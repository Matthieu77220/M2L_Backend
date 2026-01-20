import db from "../config/db.js"

// ----- Visualisation des crampons ----- //
export const visualitionStock = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id
    console.log(id);
    

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