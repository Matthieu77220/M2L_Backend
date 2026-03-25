import db from "../config/db.js"
import 'dotenv/config'

// ----- Modification du Profil ----- //
export const modificationProfile = (req, res) => {
    const { prenom, nom, email, dateDeNaissance, telephone } = req.body    
    
    const id = req.user.id
  
    if (!prenom || !nom || !email || !dateDeNaissance || !telephone) {
        return res.status(400).send("Champs manquants !")
    }
    
    try {      
        const sql = "UPDATE adherent SET prenom = ?, nom = ?, email = ?, date_naissance = ?, telephone = ? WHERE id_adherent = ?"
        
        db.query(sql, [prenom, nom, email, dateDeNaissance, telephone, id], (err, results) => {
            if (err) {
                return res.status(500).send("Erreur lors de la modification du profil !")
            }
            
          
            if (results.length === 0) {
                return res.status(404).send("Utilisateur non trouvé !")
            }
            
            res.send("Profil modifié avec succès !")
        })
    } catch (error) {
        return res.status(401).send("Token invalide !")
    }
}