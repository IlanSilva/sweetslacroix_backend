const express = require('express')
const Router = express.Router()

// REPOSITORIOS
const customerRepository = require('../repositories/customerRepository')


// CRIAÇÃO DE CLIENTE

Router.post('/create', async (req, res) => {
    console.log(req.body)
    try{
        const customer = await customerRepository.create(req.body)
        res.status(200).json({message: 'Cliente registrado com sucesso!', error: false})
    }catch(err){
        console.log(err)
        res.status(404).json({message: 'Falha no registro do cliente!', error: true, data: req.body})
    }
})




module.exports = Router