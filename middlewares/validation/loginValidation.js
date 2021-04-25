const tokenTools = require('../../tools/getTokens')

const loginverify = function(req, res, next){
    if(!req.body.user || !req.body.password){
        res.status(401).json({message: 'Usuário ou senha incorretos!', error: true})
        return
    }
    next()
}

const authverify = function(req, res, next){
    if(req.headers.authorization){
        const [bearer, token] = req.headers.authorization.split(' ')
        const verify = tokenTools.tokenverify(token)
        if(!verify){
            res.status(401).json({message: 'Usuário não autenticado!', error: true})
        }else{
            next()
        }
    }else{
        res.status(401).json({message: 'Usuário não autenticado!', error: true})
    }
}

module.exports = {
    loginverify,
    authverify
}