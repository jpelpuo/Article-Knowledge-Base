const Article = require('../models/article');

// Get all articles
const getEveryArticle = async () => {
    try{
        return await Article.find({})
    }catch(e){
        throw new Error(e);
    }
}

// Add an article
const addArticle = async ({title, author, body}) => {
    try{
        return await new Article({title, author, body}).save();
    }catch(e){
        throw new Error(e)
    }
}

// Get one article
const getArticle = async (id) => {
    try{
        return await Article.findById(id);
    }catch(e){
        throw new Error(e)
    }
}

// Edit article
const editArticle = async (id, data) => {
    let query = {_id: id}
    try{
        return await Article.update(query, data);
    }catch(e){
        throw new Error(e)
    }
}

// Delete article
const deleteArticle = async id => {
    let query = {_id: id};
    try{
        return await Article.remove(query);
    }catch(e){
        throw new Error(e);
    }
}


module.exports = {
    addArticle,
    getArticle,
    editArticle,
    getEveryArticle,
    deleteArticle
}