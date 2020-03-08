const express = require('express');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const { addArticle, getArticle, editArticle, getEveryArticle, deleteArticle } = require('./services/article');


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
        throw new Error(chalk.redBright("Error connecting to db"))
    }
})().then(() => {
    console.log(chalk.greenBright("Connected to database"))
}).catch(error => {
    console.log(error)
});

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

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
    secret: 'hi there',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

//   Express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Home route
app.get('/', (request, response) => {
    getEveryArticle()
        .then(articles => {
            response.render('index', {
                title: "Articles",
                articles
            });
        }).catch(error => {
            console.log(chalk.redBright(error));
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

// Get single article
app.get('/article/:id', (request, response) => {
    let id = request.params.id;
    getArticle(id)
        .then(article => {
            response.render('article', {
                article: article
            })
        })
        .catch(error => {
            console.log(error)
        })
})

// Load edit form
app.get('/article/edit/:id', (request, response) => {
    let id = request.params.id;
    getArticle(id)
        .then(article => {
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
app.post('/articles/edit/:id', (request, response) => {
    let article = {};
    article.title = request.body.title;
    article.author = request.body.author;
    article.body = request.body.body;

    editArticle(request.params.id, article)
        .then(article => {
            response.redirect('/');
            console.log(article);
        })
        .catch(error => {
            console.log(error)
            return;
        })
})

//Delete post
app.delete('/article/:id', (request, response) => {
    let id = request.params.id;
    deleteArticle(id)
        .then(article => {
            response.send('Success');
        })
        .catch(error => {
            console.log(error)
        })
})


//Create server
app.listen('3000', () => {
    console.log(chalk.greenBright("Server started on port 3000"));
})