const Article = require('../models/article');

const addArticle = async ({title, author, body}) => {
    try{
        return await new Article({title, author, body}).save((error) => {
            if(error){
                throw new Error("Document not saved");
            }else{
                console.log("Saved");
            } 
        })
    }catch(e){
        throw new Error("Error")
    }
}

module.exports.addArticle = addArticle;