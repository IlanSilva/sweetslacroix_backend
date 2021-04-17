const { json, text } = require('body-parser')
const express = require('express')
const Router = express.Router()


// DATABASE
const db = require('../database/database')

Router.post('/createorder', async (req, res) => {
    if (!req.body.products || !req.body.products || !req.body.client || !req.body.value){
        res.status(200).json({message: "Sua requisição está com falta de dados, por favor verifique e tente novamente.", error: true, data: req.body})
        return
    }
    const client = await db.connect()
    try{
        const findquery = 'SELECT SL_ID_PK FROM CUSTOMERS.PERSONS WHERE SL_ID_PK = $1;'
        const findvalue = [req.body.client]
        const findcustomer = await db.query(findquery, findvalue)
        if (!findcustomer){
            res.status(200).json({message: "Não foi localizado nenhum cliente com este ID, favor verifique e tente novamente.", error: true, data: req.body})
            return
        }
        
        const querytext = 'INSERT INTO LOGISTIC.ORDERS (CD_CLIENT, SL_PRODUCTS, SL_SITUATION, SL_PRICE) VALUES ($1, $2, $3, $4) RETURNING *;'
        const values = [req.body.client, req.body.products, req.body.situation, req.body.value]
        const createorder = await client.query(querytext, values)


        res.status(201).json({message: 'Criação de pedido feito com sucesso!', error: false, data: createorder.rows})
    }catch(err){
        res.status(404).json({message: 'Falha na criação do pedido!', error: true})
    }finally{
        client.release()
    }
})


Router.get('/getorder', async (req, res) => {
    if (!req.query.id){
        const client = await db.connect()
        try{
            const querytext = 'SELECT * FROM LOGISTIC.ORDERS;'
            const getorder = await client.query(querytext)
            // LÓGICA DE RETORNO BASEADO NA QUANTIDADE DE REGISTROS RECUPERADOS.
            if (getorder.rowCount <= 0){
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: getorder.rows})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${getorder.rowCount} registros.`, error: false, data: getorder.rows})
            }
        }catch(err){
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }finally{
            client.release()
        }
    }else{
        const client = db.connect()
        try{
            const querytext = 'SELECT * FROM LOGISTIC.ORDERS WHERE SL_ID_PK = $1;'
            const values = [req.query.id]
            const getorder = await client.query(querytext, values)
            // LÓGICA DE RETORNO BASEADO NA QUANTIDADE DE REGISTROS RECUPERADOS.
            if (getorder.rowCount <= 0){
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: getorder.rows})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${getorder.rowCount} registros.`, error: false, data: getorder.rows})
            }
        }catch(err){
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }finally{
            client.release()
        }
    }
})

Router.put('/updateorder', async (req, res) => {
    if (!req.query.id){
        res.status(200).json({message: "Não foi passado nenhum ID em sua requisição!", error: true})
        return
    }
    const client = await db.connect()
    try{
        // VALIDATE ID
        const vl_id = await client.query('SELECT SL_ID_PK FROM LOGISTIC.ORDERS WHERE SL_ID_PK = $1;', [req.query.id])
        if (vl_id.rowCount == 0){
            res.status(200).json({message: "Não foi encontrado nenhum pedido com este ID!", error: true})
        return
        }
        
        const atts = []
        await client.query('BEGIN')
        if (req.body.products){
            let querytext = 'UPDATE LOGISTIC.ORDERS SET SL_PRODUCTS = $1 WHERE SL_ID_PK = $2 RETURNING *;'
            let values = [JSON.stringify(req.body.products), req.query.id]
            let updateorder = await client.query(querytext, values)
            atts.push('Produto(s)')
        }
        if (req.body.price){
            let querytext = 'UPDATE LOGISTIC.ORDERS SET SL_PRICE = $1 WHERE SL_ID_PK = $2 RETURNING *;'
            let values = [req.body.price, req.query.id]
            let updateorder = await client.query(querytext, values)
            atts.push('Preço')
        }
        if (req.body.situation){
            let querytext = 'UPDATE LOGISTIC.ORDERS SET SL_SITUATION = $1 WHERE SL_ID_PK = $2 RETURNING *;'
            let values = [req.body.situation, req.query.id]
            let updateorder = await client.query(querytext, values)
            atts.push('Situação')
        }
        const textatts = atts.join(", ")
        await client.query('COMMIT')
        res.status(201).json({message: `${textatts} atualizado(s) com sucesso!`, error: false})
        
        
    }catch(err){
        await client.query('ROLLBACK')
        res.status(404).json({message: "Falha ao atualizar o pedido!", error: true})
    }finally{
        client.release()
    }

})

module.exports = Router