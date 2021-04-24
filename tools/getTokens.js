const jwt = require('jsonwebtoken')

const secretkey = '826ed73e9e30874fa7ea1034c48622d9'

const generatetoken = function(payload){
    const date = Date.now()
    const newhash = date.toString() + payload
    const token = jwt.sign(newhash, secretkey, {expiresIn: '1d'})
    return token
}


const tokenverify =  function(token){
    try{
        const verify = jwt.verify(token, secretkey)
        return true
    }catch(err){
        return false
    }
}

module.exports = {
    generatetoken,
    tokenverify
}