const User = require('../models/user');
const bcrypt = require('bcryptjs');


const registerUser = async ({name, email, username, password}) => {    
    bcrypt.genSalt(10, (error, salt) => {
        if(error){
            console.log(error);
        }
        bcrypt.hash(password, salt, async (error, hash) => {
            if(error){
                console.log(error);
            }else{
                try{
                    let password = hash;
                    return await new User({name, email, username, password}).save();
                }catch(e){
                    throw new Error(e);
                }
            }
        })
    })
}

const getUser = async ({username}) => {
    try{
        return await User.findOne({username});
    }catch(e){
        throw new Error(e);
    }
}

module.exports = {
    registerUser,
    getUser
}