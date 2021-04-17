const express = require('express')
const Router = express.Router()

// DATABASE
const db = require('../database/database')


Router.post('/create', async (req, res) => {
    if (!req.body || !req.body.cep || !req.body.street || !req.body.neighborhood || !req.body.city || !req.body.uf || 
        !req.body.reference || !req.body.client_id){
        res.status(200).json({message: "Sua requisição está com falta de dados, por favor verifique e tente novamente.", error: true, data: req.body })
        return
    }

    const client = await db.connect()
    try{
        const textquery = 'INSERT INTO CUSTOMERS.ADDRESSES(CD_CLIENT, AD_CEP, AD_UF, AD_CITY, AD_NEIGHBORHOOD, AD_STREET, AD_NUMBERHOUSE, AD_REFERENCE, AD_DESCRIPTION) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING AD_ID_PK;'
        const values = [req.body.client_id, req.body.cep, req.body.uf, req.body.city, req.body.neighborhood, req.body.street, req.body.numberhouse,
                        req.body.reference, req.body.description]
        
        const createaddress = await client.query(textquery, values)

        res.status(201).json({message: 'Endereço registrado com sucesso!', error: false, data: createaddress.rows[0]})
        

    }catch(err){
        console.log(err)
        console.log(req.body)
        console.log(typeof(req.body.cep))
        res.status(400).json({message: 'Falha ao tentar cadastrar o endereço!', error: true, data: req.body})
    }finally{
        client.release()
    }
})

Router.get('/get/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(200).json({message: "Não foi passado nenhum ID em sua requisição!", error: true})
        return
    }

    const client = await db.connect()

    try{
        const textquery = 'SELECT * FROM CUSTOMERS.ADDRESSES WHERE CD_CLIENT = $1;'
        const values = [parseInt(req.params.id)]
        
        const getaddress = await client.query(textquery, values)

        if (getaddress.rowCount <= 0){
            res.status(200).json({message: `Não foi localizado nenhum registro com este id!`, error: true, data: getaddress.rows})
        }else{
            res.status(200).json({message: `Localização feita com sucesso!`, error: false, data: getaddress.rows})
        }

    }catch(err){
        console.log(err)
        res.status(400).json({message: 'Falha ao recuperar dados!', error: true})
    }finally{
        client.release()
    }
})

Router.delete('/delete/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(200).json({message: "Não foi passado nenhum ID em sua requisição!", error: true})
        return
    }

    const client = await db.connect()

    try{
        const textquery = 'DELETE FROM CUSTOMERS.ADDRESSES WHERE AD_ID_PK = $1 RETURNING AD_ID_PK;'
        const values = [req.params.id]
        
        const deleteaddress = await client.query(textquery, values)

        res.status(200).json({message: `Endereço deletado com successo!`, error: false, data: deleteaddress.rows})

    }catch(err){
        console.log(err)
        res.status(400).json({message: 'Falha ao deletar o endereço!', error: true})
    }finally{
        client.release()
    }
})

module.exports = Router;