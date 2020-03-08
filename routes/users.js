const express = require('express');
const { check, validationResult } = require('express-validator');
const { registerUser } = require('../services/users');
const chalk = require('chalk');
const passport = require('passport');

const router = express.Router();

router.get('/register', (request, response) => {
    response.render('register');
})


router.post('/register', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty().isEmail(),
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    // check('password2', 'Passwords do not match').equals(check('password')),
], (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        response.render('register', {
            errors: errors.array()
        })
    } else {
        let name = request.body.name;
        let email = request.body.email;
        let username = request.body.username;
        let password = request.body.password;

        registerUser({name, email, username, password })
            .then((user) => {
                request.flash('success', 'You have registered successfully');
                response.redirect('/users/login');
                console.log(user);
            })
            .catch(error => {
                console.log(chalk.redBright(error));
            })

    }
})


router.get('/login', (request, response) => {
    response.render('login');
})

// Login Process
router.post('/login', (request, response, next) => {
    passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(request, response, next);
})

// Logout
router.get('/logout', (request, response) => {
    request.logout();
    request.flash('success', 'You are logged out');
    response.redirect('/users/login')
})

module.exports = router;