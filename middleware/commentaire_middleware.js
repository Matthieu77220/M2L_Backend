import db from '../config/db.js'

export const commentaireMiddleware = (req, res, next) => {
  const commentaireId = Number(req.params.id)

  
  if (!Number.isInteger(commentaireId) || commentaireId <= 0) {   
    return res.status(400).json({ message: "ID commentaire invalide" })       
  }

  const sql = "SELECT * FROM commentaire WHERE id_commentaire = ?;"

  db.query(sql, [commentaireId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur lors de la verification de l'ID" })
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Commentaire introuvable" })
    }

    if (req.user && result[0].id_adherent !== req.user.id) {
      return res.status(403).json({ message: "Accès interdit : vous n'êtes pas l'auteur de ce commentaire" })
    }

    req.commentaire = result[0]
    return next()
  })
}