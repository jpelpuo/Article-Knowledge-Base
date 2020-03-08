const Article = require('../models/article');

const getEveryArticle = async () => {
    try{
        return await Article.find({})
    }catch(e){
        throw new Error(e);
    }
}

const addArticle = async ({title, author, body}) => {
    try{
        return await new Article({title, author, body}).save();
    }catch(e){
        throw new Error(e)
    }
}

const getArticle = async (id) => {
    try{
        return await Article.findById(id);
    }catch(e){
        throw new Error(e)
    }
}

const editArticle = async (id, data) => {
    let query = {_id: id}
    try{
        return await Article.update(query, data);
    }catch(e){
        throw new Error(e)
    }
}

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