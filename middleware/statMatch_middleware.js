import db from "../config/db.js";


export const statMatchMiddleware = (req, res, next) => {
    const matchID = Number(req.params.id)
    const userID = req.user?.id


    if(!Number.isInteger(matchID) || matchID <= 0){
        return res.status(400).json({message: "ID match invalide"})
    }

    if (!userID) {
        return res.status(401).json({message: "Utilisateur non authentifié"})
    }

    const sql = `
        SELECT 
            m.*,
            r.id_adherent AS reservation_owner_id
        FROM matchs AS m
        JOIN reservation AS r ON r.id_reservation = m.id_reservation
        WHERE m.id_match = ?;
    `
    
    db.query(sql, [matchID], (err, result) => {
        if(err){
            return res.status(500).json({message : "Erreur serveur lors de la vérification de l'ID"})
        }

        if ( !result || result.length === 0){
            return res.status(404).json({message : "Match introuvable"})
        }

        if(result[0].reservation_owner_id !== userID){
            return res.status(403).json({message : "Accès interdit : vous n'êtes pas propriétaire de cette réservation"})
        }

        req.match = result[0]
        return next()
    })
}