const jwt = require('jsonwebtoken')
const User = require('../models/user')   //../ to get out of current directory

//auth middleware for indiv route
const auth = async (req, res, next) => {
    try{
        //validate token (header returns string token value, replace removes beginning portion)
        const token = req.header('Authorization').remove('Bearer ', '')
        //decoded: decoded payload for token 
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user){
            throw new Error()
        } 

        req.user =  user
        next() //letting express know we r done w the middleware fn
    }catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth  //fn