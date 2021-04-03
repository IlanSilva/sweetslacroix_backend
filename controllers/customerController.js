const express = require('express')
const Router = express.Router()

// REPOSITORIOS (REPOSITORY PATTERN)
const customerRepository = require('../repositories/customerRepository')


// CRIAÇÃO DE CLIENTE

Router.post('/create', async (req, res) => {
    try{
        const createcustomer = await customerRepository.create(req.body)
        res.status(200).json({message: 'Cliente registrado com sucesso!', error: false})
    }catch(err){
        console.log(err)
        res.status(404).json({message: 'Falha no registro do cliente!', error: true, data: req.body})
    }
})

// LOCALIZAÇÃO DE CLIENTES

Router.get('/clients', async (req, res) => {
    const customers = []
    if (!req.query.name){
        try{
            const getcustomer = await customerRepository.getAll()
            if (Array.isArray(getcustomer)){
                for (i of getcustomer) {
                    customers.push(i)
                } 
            }else{
                customers.push(getcustomer)
            }
            
            // LÓGICA DE RETORNO BASEADO NA QUANTIDADE DE REGISTROS RECUPERADOS.

            if (customers.length <= 0){
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: customers})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${customers.length} registros.`, error: false, data: customers})
            }

        }catch(error) {
            console.log(error)
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }
    }else{
        try{
            const getcustomer = await customerRepository.getByName(req.query.name)
            if (Array.isArray(getcustomer)){
                for (i of getcustomer) {
                    customers.push(i)
                } 
            }else{
                customers.push(getcustomer)
            }
            
            // LÓGICA DE RETORNO BASEADO NA QUANTIDADE DE REGISTROS RECUPERADOS.

            if (customers.length <= 0){
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: customers})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${customers.length} registros.`, error: false, data: customers})
            }
        }catch(error) {
            console.log(error)
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }
    }
    
    
})




module.exports = Router