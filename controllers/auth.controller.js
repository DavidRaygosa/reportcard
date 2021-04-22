let jwt = require('jsonwebtoken');
var Auth = (req) =>{
    let token = req.headers['authorization'];
    if(!token) return false;
    token = token.replace('Bearer ', '');
    jwt.verify(token, 'Secret Password', function(err, user) {
        if(err) return false;
    });
    return true;
}
module.exports = Auth;