const express = require('express');
const path = require('path');
const chalk = require('chalk')

//Initialise app
const app = express();

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//Home route
app.get('/', (request, response) => {
    response.render('index', {
        title : "Hello"
    });
    console.log(request);
})

//Add route
app.get('/articles/add', (request, response) => {
    response.render('add_article', {
        title: "Add Article"
    })
    console.log(request);
})

//Create server
app.listen('3000', () => {
    console.log(chalk.greenBright("Server started on port 3000"));
})