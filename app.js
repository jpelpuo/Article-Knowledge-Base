const express = require('express');
const path = require('path');
const chalk = require('chalk');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const {getEveryArticle} = require('./services/article');


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
    resave: true,
    saveUninitialized: true
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

// Route files
const articles = require('./routes/articles');
app.use('/articles', articles)

//Create server
app.listen('3000', () => {
    console.log(chalk.greenBright("Server started on port 3000"));
})