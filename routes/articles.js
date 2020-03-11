const express = require('express');
const { addArticle, getArticle, editArticle, getEveryArticle, deleteArticle } = require('../services/article');
const { check, validationResult } = require('express-validator');
const chalk = require('chalk');
const User = require('../models/user');
const Article = require('../models/article');


const router = express.Router();

//Add article POST route
router.post('/add', [
    check('title', 'Title is required').notEmpty(),
    // check('author', 'Author is required').notEmpty(),
    check('body', 'Body is required').notEmpty()
], (request, response) => {

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        response.render('add_article', {
            title: 'Add Article',
            errors: errors.array()
        });
    }
        console.log(chalk.redBright("Did not work"));
        let title = request.body.title;
        let author = request.user._id;
        let body = request.body.body;

        addArticle({ title, author, body })
            .then(result => {
                request.flash('success', 'Article Added')
                response.redirect('/');
                console.log(result);
            })
            .catch(error => {
                console.log(error)
                return;
            })
    

})

//Add route
router.get('/add', ensureAuthenticated, (request, response) => {
    response.render('add_article', {
        title: "Add Article"
    })
    console.log(request);
})

// Get single article
router.get('/:id', (request, response) => {
    let id = request.params.id;
    getArticle(id)
        .then((article) => {
            User.findById(article.author, (error, user) => {
                response.render('article', {
                    article: article,
                    author: user.name
                })
            })
        })
        .catch(error => {
            console.log(error)
        })
})

// Access Control
function ensureAuthenticated(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }else{
        request.flash('danger', 'Please login');
        response.redirect('/users/login');
    }
}

// Load edit form
router.get('/edit/:id', ensureAuthenticated, (request, response) => {
    let id = request.params.id;
    getArticle(id)
        .then(article => {
            if(article.author != request.user._id){
                request.flash('danger', 'Not Authorized');
                response.redirect('/');
            }
            response.render('edit_article', {
                title: "Edit Article",
                article: article
            })
        })
        .catch(error => {
            console.log(error)
        })
})


// Update Submit POST article
router.post('/edit/:id', (request, response) => {
    let article = {};
    article.title = request.body.title;
    article.author = request.body.author;
    article.body = request.body.body;

    editArticle(request.params.id, article)
        .then(article => {
            request.flash('success', 'Article Updated')
            response.redirect('/');
            console.log(article);
        })
        .catch(error => {
            console.log(error)
            return;
        })
})

//Delete post
router.delete('/:id', (request, response) => {
    if(!request.user._id){
        response.status(500).send();
    }
    let id = request.params.id;
    deleteArticle(id)
        .then(() => {
            Article.findById(id, (error, article) =>{
                if(article.author != request.user._id){
                    response.status(500).send();
                }else{
                    response.send('Success');
                }
            })
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = router;

