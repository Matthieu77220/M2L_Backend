import db from "../config/db.js"


export const ajtCommentaire = (req, res) => {

    const {contenu} = req.body
    const idAdherent = req.user.id

    console.log(req.body)

    if(!contenu) {
        
        return res.status(400).json({message : "champs manquants"})
    }

    if(contenu.length < 5){
        return res.status(400).json({message : "commentaire trop court"})
    }


    const sqlInsert = "INSERT INTO commentaire (id_adherent, contenu) VALUES (?, ?);"

    db.query(sqlInsert, [idAdherent, contenu], (err, result) =>{

        if(err){
           console.log(err)
           return res.status(500).json({ message : "Erreur serveur lors de la requête sql(ajtCommentaire)"})
        }

        console.log(err)

        if(result){
           return res.status(200).json({message : "commentaire ajouté avec succès"})
        }
    })
}

export const getCommentaire = (req, res) => {
    const sqlGetCommentaire = "SELECT * FROM commentaire ORDER BY date_publication;"

    db.query(sqlGetCommentaire, (err, result) => {

        if(err){
           return res.status(500).json({message : "erreur serveur lors de la requête (getCommentaire)"})
        } 

        console.log(err)

        if(result){
           return res.status(200).json({
            message : "commentaire affiché avec succès",
            commentaires: result
           })
        }
    })

}

export const editCommentaire = (req, res) => {
    
    const {contenu} = req.body
    const commentaireId = req.commentaire.id_commentaire

    if(!contenu){
      return res.status(400).json({message : "champs manquants"})
    }

    if(contenu.length < 5 ){
       return res.status(400).json({message : "commentaire trop court"})
    }

    const sqlEditCommentaire = "UPDATE commentaire SET contenu = ? WHERE id_commentaire = ?;"

    db.query(sqlEditCommentaire, [contenu, commentaireId], (err, result) => {

        if(err){
            return res.status(500).json({message : "Erreur serveur lors de la requête sql (editcommetaire)"})
        }
        console.log(err)

        if(result){
            return res.status(200).json({message : "Commentaire modifié avec succès"})
        }
    })
}

export const deleteCommentaire = (req, res) => {

    const id = req.commentaire.id_commentaire

    const sqlDelete = "DELETE FROM commentaire WHERE id_commentaire = ?;"

    db.query(sqlDelete, [id], (err, result) =>{

        if(err){
            return res.status(500).json({message : "Erreur serveur lors de la requête sql (suppressio)"})
        }

        if(result){
            return res.status(200).json({message : "Commentaire supprimé avec succès"})
        }
    })
}
