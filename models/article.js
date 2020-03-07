const {Schema, model} = require('mongoose');

const articleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
})

const Article = model("Article", articleSchema);

module.exports = Article;