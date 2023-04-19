const jwt = require('jsonwebtoken');
const Users = require('../module/userSchema')

const requirelogin =async(req,res,next)=> {
try {
    const {authorization =''}= req.headers;
    const [ bearer, token] = authorization?.split(' ');
    // console.log(authorization,'authorization');
    if (!authorization || !token) {
        res.status(401).send('Invalid token')
    }
const verifyToken = jwt.verify(token,'himanshu@46');     
const user = await Users.find({_id: verifyToken.id})
if (!user) {
    res.status(401).send('user not found')
}
req.user = user;
next()
} catch (error) {
res.status(440).send(error);
}
}

module.exports = requirelogin;