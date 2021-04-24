const loginverify = function(req, res, next){
    if(!req.body.user || !req.body.password){
        res.status(404).json({message: 'Usuário ou senha incorretos!', error: true})
        return
    }
    next()
}

module.exports = {
    loginverify
}