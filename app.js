const express = require('express');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { addArticle } = require('./services/article');


    //Connect to MongoDB
    (async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/nodekb',
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
            // console.log(chalk.greenBright("Connected to database"));
        } catch (e) {
            throw new Error("Error connecting to db")
        }
    })().then(() => {
        console.log(chalk.greenBright("Connected to database"))
    }).catch(error => {
        console.log(error)
    });

let db = mongoose.connection;

const Article = require('./models/article');

//Initialise app
const app = express();

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Home route
app.get('/', (request, response) => {
    Article.find({}, (error, articles) => {
        if (error) {
            console.log(error);
        } else {
            response.render('index', {
                title: "Articles",
                articles
            });
        }
    })
    console.log(request);
})

//Add route
app.get('/articles/add', (request, response) => {
    response.render('add_article', {
        title: "Add Article"
    })
    console.log(request);
})

//Add article POST route
app.post('/articles/add', (request, response) => {
    let title = request.body.title;
    let author = request.body.author;
    let body = request.body.body;

    addArticle({ title, author, body })
        .then(result => {
            response.redirect('/');
            console.log(result);
        })
        .catch(error => {
            console.log(error)
            return;
        })
})

//Create server
app.listen('3000', () => {
    console.log(chalk.greenBright("Server started on port 3000"));
})