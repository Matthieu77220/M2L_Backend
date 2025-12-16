import db from "../config/db.js"
import 'dotenv/config'
import jwt from "jsonwebtoken"

export const modificationProfile = (req, res) => {
    const { prenom, nom, email, telephone } = req.body
    
    // Récupération de l'ID depuis le token
    const token = req.cookies.token
    
  
    if (!token) {
        return res.status(401).send("Non authentifié !")
    }
    
  
    if (!prenom || !nom || !email || !telephone) {
        return res.status(400).send("Champs manquants !")
    }
    
    // Décodage du token pour récupérer l'ID
    try {
        const decoded = jwt.verify(token, process.env.secretKey)
        const userId = decoded.id
        
      
        const sql = "UPDATE adherent SET prenom = ?, nom = ?, email = ?, telephone = ? WHERE id = ?"
        
        db.query(sql, [prenom, nom, email, telephone, userId], (err, results) => {
            if (err) {
                return res.status(500).send("Erreur lors de la modification du profil !")
            }
            
          
            if (results.affectedRows === 0) {
                return res.status(404).send("Utilisateur non trouvé !")
            }
            
            res.send("Profil modifié avec succès !")
        })
    } catch (error) {
        return res.status(401).send("Token invalide !")
    }
}