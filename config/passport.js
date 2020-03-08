const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const { getUser } = require('../services/users');

module.exports = passport => {
    // Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {
        getUser({ username })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'No user found' })
                }

                // Match Password
                bcrypt.compare(password, user.password, (error, isMatch) => {
                    if(error){
                        throw error;
                    }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Wrong password' })
                    }
                })
            })
            .catch(error => {
                console.log(error)
            })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}