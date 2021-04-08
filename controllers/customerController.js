const express = require('express')
const Router = express.Router()

// DATABASE
const db = require('../database/database')

// CRIAÇÃO DE CLIENTE

Router.post('/createclients', async (req, res) => {
    if (!req.body.name)
    const client = await db.connect()
    try{
        const textquery = 'INSERT INTO LOGISTIC.PRODUCTS (SL_NAME, SL_PHONE, SL_EMAIL) VALUES ($1, $2, $3) RETURNING *;'
        const values = [req.body.name, req.body.phone, req.body.email]
        const createcustomer = await client.query(textquery, values)
        
        res.status(200).json({message: 'Cliente registrado com sucesso!', error: false, data: createcustomer.rows[0]})
        
    }catch(err){
        console.log(err)
        res.status(404).json({message: 'Falha no registro do cliente!', error: true, data: req.body})
    }finally{
        client.release()
    }
})

// LOCALIZAÇÃO DE CLIENTES

Router.get('/getclients', async (req, res) => {
    const client = await db.connect()
    if (!req.query.name){
        try{
            const querytext = 'SELECT * FROM CUSTOMERS.PERSONS;'
            const getcustomer = await client.query(querytext)
            // LÓGICA DE RETORNO BASEADO NA QUANTIDADE DE REGISTROS RECUPERADOS.
            if (getcustomer.rows.length <= 0){
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: getcustomer.rows})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${customers.length} registros.`, error: false, data: getcustomer.rows})
            }
        }catch(error) {
            console.log(error)
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }finally{
            client.release()
        }
    }else{
        try{
            const querytext = 'SELECT * FROM CUSTOMERS.PERSONS WHERE SL_ID_PK ILIKE $1;'
            const values = [`${req.body.name}%`]
            const getcustomer = await client.query(querytext)
            // LÓGICA DE RETORNO BASEADO NA QUANTIDADE DE REGISTROS RECUPERADOS.
            if (getcustomer.rows.length <= 0){
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: getcustomer.rows})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${customers.length} registros.`, error: false, data: getcustomer.rows})
            }
                // LÓGICA DE RETORNO BASEADO NA QUANTIDADE DE REGISTROS RECUPERADOS.

            if (getcustomer.length <= 0){
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: getcustomer.rows})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${customers.length} registros.`, error: false, data: getcustomer.rows})
            }
        }catch(error) {
            console.log(error)
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }finally{
            client.release()
        }
    }
})

// ATUALIZAÇÃO DE PRODUTOS

Router.put('/updateclients', (req, res) => {
    if (!req.query.id) {
        res.status(404).json({message: "Não foi passado nenhum ID em sua requisição!", error: true})
        return
    }
    const client = await db.connect()

    try{
        const querytext = 'UPDATE CUSTOMERS.PERSONS SET SL_NAME = $1, SL_PHONE = $2, SL_EMAIL = $3 WHERE SL_ID_PK = $4 RETURNING *;'
        const values = [req.body.name, req.body.phone, req.body.email, req.query.id]
        const updateproduct = await client.query(querytext, values)
        
        res.status(200).json({message: "Cadastro de cliente atualizado com sucesso!", error: false, data: updateproduct})

    }catch(err){
        console.log(err)
        res.status(404).json({message: "Falha ao atualizar o cadastro do cliente!", error: true, data: req.body})
    }finally{
        client.release()
    }
})

// EXCLUSÃO DE CLIENTES

Router.delete('/deleteclients', (req, res) => {
    if (!req.query.id){
        res.status(404).json({message: "Não foi passado nenhum ID em sua requisição!", error: true})
        return
    }
    const client = await db.connect()
    try{
        const querytext = 'DELETE FROM CUSTOMERS.PERSONS WHERE SL_ID_PK = $1 RETURNING *;'
        const values = [req.query.id]
        const deleteproduct = await client.query(querytext, values)
        res.status(200).json({message: "Cliente deletado com sucesso!", error: false, data: deleteproduct.rows})
    }catch(err){
        res.status(404).json({message: "Falha ao tentar deletar o cliente!", error: true, data: req.body})
    }finally{
        client.release()
    }
})

module.exports = Router