const User = require('../models/user');
const bcrypt = require('bcryptjs');


const registerUser = async ({ name, email, username, password }) => {
    try {
        return bcrypt.genSalt(10, (error, salt) => {
            if (error) {
                console.log(error);
            }
            bcrypt.hash(password, salt, async (error, hash) => {
                if (error) {
                    console.log(error);
                } else {
                    try {
                        return await new User({ name, email, username, hash }).save();
                    } catch (e) {
                        throw new Error(e);
                    }
                }
            })
        })
    } catch (e) {

    }
}

module.exports = {
    registerUser
}