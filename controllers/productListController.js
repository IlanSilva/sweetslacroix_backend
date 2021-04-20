const express = require('express')
const Router = express.Router()

// DATABASE
const db = require('../database/database')

// LOCALIZAÇÃO DE PRODUTOS

Router.get('/getproducts', async (req, res) => {
    if(req.query.name){
        const client = await db.connect()
        try{
            const querytext = "SELECT * FROM LOGISTIC.PRODUCTS WHERE SL_PRODUCT_NAME ILIKE $1 ORDER BY SL_PRODUCT_NAME LIMIT 10;"
            const values = [`${req.query.name}%`]
            const getproducts = await client.query(querytext, values)
            if (getproducts.rowCount <= 0) {
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: getproducts.rows})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${getproducts.rowCount} registros.`, error: false, data: getproducts.rows})
            }
        }catch(err){
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }finally{
            client.release()
        }
    }else{
        const client = await db.connect()
        try{
            const querytext = 'SELECT * FROM LOGISTIC.PRODUCTS ORDER BY SL_PRODUCT_NAME LIMIT 10;'
            const getproducts = await client.query(querytext)
            if (getproducts.rowCount <= 0) {
                res.status(200).json({message: `Não foi localizado nenhum registro.`, error: false, data: getproducts.rows})
            }else{
                res.status(200).json({message: `Localização feita com sucesso! foi recuperado ${getproducts.rowCount} registros.`, error: false, data: getproducts.rows})
            }
        }catch(err){
            res.status(404).json({message: 'Falha ao recuperar dados!', error: true})
        }finally{
            client.release()
        }
    }
})

// CRIAÇÃO DE PRODUTOS

Router.post('/createproducts', async (req, res) => {
    if (req.body.name && req.body.value){
        const client = await db.connect()
        const nameverify = await client.query('SELECT SL_PRODUCT_NAME FROM LOGISTIC.PRODUCTS WHERE SL_PRODUCT_NAME = $1;', [req.body.name])
        if (nameverify.rowCount > 0){
            res.status(200).json({message: "Já exisite um produto com este nome!", error: true})
            return
        }
        try{
            // TRANSACTION
            await db.query('BEGIN')
            const textquery = 'INSERT INTO LOGISTIC.PRODUCTS(SL_PRODUCT_NAME, SL_PRODUCT_VALUE) VALUES ($1, $2) RETURNING *;'
            const values = [req.body.name, req.body.value]
            const createproduct = await client.query(textquery, values)
            await client.query('COMMIT')
            // END TRANSACTION
            res.status(201).json({message: 'Produto cadastrado com sucesso!', error: false, data: createproduct.rows[0]})
        }catch(err){
            await client.query('ROLLBACK')
            res.status(404).json({message: 'Falha no cadastro do produto!', error: true, data: req.body})
        }finally{
            // CLIENT EXIT
            client.release()
        }
    }else{
        res.status(200).json({message: "Sua requisição está com falta de dados, por favor verifique e tente novamente.", error: true})
    }
})

// ATUALIZAÇÃO DE PRODUTOS

Router.put('/updateproducts', async (req, res) => {
    if (req.query.id && req.body.name && req.body.value || Number.isInteger(req.body.value)){
        const client = await db.connect()
        try{
            // TRANSACTION
            await client.query('BEGIN')
            const querytext = 'UPDATE LOGISTIC.PRODUCTS SET SL_PRODUCT_NAME = $1, SL_PRODUCT_VALUE = $2 WHERE SL_ID_PK = $3 RETURNING *;'
            const values = [req.body.name, req.body.value, req.query.id]
            const updateproduct = await client.query(querytext, values)
            await client.query('COMMIT')
            // END TRANSACTION
            res.status(201).json({message: 'Produto atualizado com sucesso!', error: false, data: updateproduct.rows[0]})
        }catch(err){
            await client.query('ROLLBACK')
            res.status(404).json({message: 'Falha na atualização do produto!', error: true, data: req.body})
        }finally{
            // CLIENT EXIT
            client.release()
        }
    }else{
        res.status(200).json({message: "Sua requisição está com falta de dados, por favor verifique e tente novamente.", error: true})
    }
})

// EXCLUSÃO DE PRODUTOS

Router.delete('/deleteproducts/:id', async (req, res) => {
    if (req.params.id){
        const client = await db.connect()
        try{
            // TRANSACTION 
            await client.query('BEGIN')
            const querytext = 'DELETE FROM LOGISTIC.PRODUCTS WHERE SL_ID_PK = $1 RETURNING *;'
            const values = [req.params.id]
            const deleteproduct = await client.query(querytext, values)
            await client.query('COMMIT')
            // END TRANSACTION
            res.status(201).json({message: 'Produto deletado com sucesso!', error: false, data: deleteproduct.rows[0]})
        }catch(err){
            await client.query('ROLLBACK')
            res.status(404).json({message: 'Falha na atualização do produto!', error: true, data: req.body})
        }finally{
            // CLIENT EXIT
            client.release()
        }
    }else{
        res.status(200).json({message: "Sua requisição está com falta de dados, por favor verifique e tente novamente.", error: true})
    }
})


module.exports = Router