const { json, text } = require('body-parser')
const express = require('express')
const Router = express.Router()

// MIDDLEWARES
const orderMiddleware = require('../middlewares/validation/orderValidation')

// DATABASE
const db = require('../database/database')

Router.post('/createorder', orderMiddleware.createValidation, async (req, res) => {
    const client = await db.connect()
    try{
        // EMPACOTAÇÃO DOS PRODUTOS
        const products = []
        let pre_value = 0
        let discount = 0
        if (req.body.discount){
            discount += req.body.discount
        }
        let productCount = 0
        for (element of req.body.basket){
            const productverify = await client.query('SELECT SL_PRODUCT_NAME, SL_PRODUCT_VALUE FROM LOGISTIC.PRODUCTS WHERE SL_ID_PK = $1;', [element.id])
            if(productverify.rowCount > 0){
                productCount += 1
                pre_value += parseFloat(productverify.rows[0].sl_product_value)
                products.push({index: productCount, name: productverify.rows[0].sl_product_name, value: productverify.rows[0].sl_product_value})
                let pvst = pre_value.toFixed(2)
                pre_value = parseFloat(pvst) 
            }
        }
        const final_value = pre_value - (pre_value * discount / 100)

        // START TRANSACTION
        await client.query('BEGIN')
        
        const text_createaddress = 'INSERT INTO LOGISTIC.ADDRESSES_FOR_ORDERS(AO_CEP, AO_UF, AO_CITY, AO_NEIGHBORHOOD, AO_STREET, AO_NUMBERHOUSE, AO_REFERENCE, AO_DESCRIPTION) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING AO_ID_PK;'
        const values_createaddress = [req.body.address.cep, req.body.address.uf, req.body.address.city, req.body.address.neighborhood, req.body.address.street, req.body.address.numberhouse,
        req.body.address.reference, req.body.address.description]
        
        const query_address = await client.query(text_createaddress, values_createaddress)
        const addressId = query_address.rows[0].ao_id_pk
        const text_createorder = "INSERT INTO LOGISTIC.ORDERS (CD_CLIENT, OR_PRODUCTS, OR_SITUATION, OR_PRICE, OR_ADDRESS) VALUES ($1, $2, $3, $4, $5) RETURNING OR_ID_PK;"
        const values_createorder = [req.body.client.id, {data: products}, "CRIADO", final_value, addressId]
        const query_order = await client.query(text_createorder, values_createorder)
    
        await client.query('COMMIT')
        // END TRANSACTION

        res.status(201).json({message: 'Criação de pedido feito com sucesso!', error: false, data: query_order.rows})
    }catch(err){
        await client.query('ROLLBACK')
        console.log(err)
        res.status(404).json({message: 'Falha na criação do pedido!', error: true})
    }finally{
        client.release()
    }
})

Router.get('/getorder', async (req, res) => {
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
})

Router.get('/getorder/:id', async (req, res) => {
    const client = await db.connect()
    try{
        const querytext = 'SELECT * FROM LOGISTIC.ORDERS WHERE OR_ID_PK = $1;'
        const values = [req.params.id]
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
    
})

Router.put('/updateorder/:id',orderMiddleware.updateValidation, async (req, res) => {
    const client = await db.connect()
    // FIND ORDER
    const query_find_order = await client.query('SELECT * FROM LOGISTIC.ORDERS WHERE OR_ID_PK = $1', [req.params.id])
    if (query_find_order.rowCount < 1){
        res.status(200).json({message: "Não foi encontrado nenhum pedido com este ID!", error: true})
        return
    }else if (query_find_order.rows[0].or_situation === 'CANCELADO' || query_find_order.rows[0].or_situation === 'SUSPENSO'){
        res.status(200).json({message: "Não é possível alterar dados de um pedido que está suspenso ou cancelado!", error: true})
        return
    }
    try{
        // EMPACOTAÇÃO DOS PRODUTOS
        const products = []
        let pre_value = 0
        const discount = 0
        if (req.body.discount){
            discount += req.body.discount
        }
        let productCount = 0
        for (element of req.body.basket){
            const productverify = await client.query('SELECT SL_PRODUCT_NAME, SL_PRODUCT_VALUE FROM LOGISTIC.PRODUCTS WHERE SL_ID_PK = $1;', [element.id])
            if(productverify.rowCount > 0){
                productCount += 1
                pre_value += parseFloat(productverify.rows[0].sl_product_value)
                products.push({index: productCount, name: productverify.rows[0].sl_product_name, value: productverify.rows[0].sl_product_value})
                let pvst = pre_value.toFixed(2)
                pre_value = parseFloat(pvst) 
            }
        }
        const final_value = pre_value - (pre_value * discount / 100)

        // START TRANSACTION
        await client.query('BEGIN')
        
        const text_createaddress = 'UPDATE LOGISTIC.ADDRESSES_FOR_ORDERS ' +
        'SET AO_CEP = $1, AO_UF = $2, AO_CITY = $3, AO_NEIGHBORHOOD = $4, AO_STREET = $5, AO_NUMBERHOUSE = $6, AO_REFERENCE = $7, AO_DESCRIPTION = $8 WHERE AO_ID_PK = $9 RETURNING AO_ID_PK;'
        const values_createaddress = [req.body.address.cep, req.body.address.uf, req.body.address.city, req.body.address.neighborhood, req.body.address.street, req.body.address.numberhouse,
        req.body.address.reference, req.body.address.description, query_find_order.rows[0].or_address]
        
        const query_address = await client.query(text_createaddress, values_createaddress)
        const text_updateorder = "UPDATE LOGISTIC.ORDERS SET OR_PRODUCTS = $1, OR_PRICE = $2 WHERE OR_ID_PK = $3 RETURNING OR_ID_PK;"
        const values_updateorder = [{data: products}, final_value, req.params.id]
        const query_order = await client.query(text_updateorder, values_updateorder)
        await client.query('COMMIT')
        // END TRANSACTION

        res.status(201).json({message: `Pedido atualizado com sucesso!`, error: false})
    }catch(err){
        await client.query('ROLLBACK')
        res.status(404).json({message: "Falha ao atualizar o pedido!", error: true})
    }finally{
        client.release()
    }
})

// SITUATION UPDATE
Router.put('/situation/:id', orderMiddleware.updateSituationValidation, async (req, res) => {
    const client = await db.connect()
    try{
        const query_find_order = await client.query('SELECT * FROM LOGISTIC.ORDERS WHERE OR_ID_PK = $1', [req.params.id])
        if (query_find_order.rowCount < 1){
            res.status(200).json({message: "Não foi encontrado nenhum pedido com este ID!", error: true})
            return
        }
        const text_order_ups = "UPDATE LOGISTIC.ORDERS SET OR_SITUATION = $1 WHERE OR_ID_PK = $2 RETURNING OR_SITUATION;"
        const values_ups = [req.body.order.situation, req.params.id]
        const query = await client.query(text_order_ups, values_ups)

        res.status(201).json({message: `Situação do pedido atualizado com sucesso para '${query.rows[0].or_situation}'`, error: false})
    }catch(err){
        res.status(404).json({message: "Falha ao atualizar o pedido!", error: true})
    }finally{
        client.release()
    }
})

module.exports = Router