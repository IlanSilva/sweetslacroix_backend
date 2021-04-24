const express = require('express')
const Router = express.Router()

// DATABASE
const db = require('../database/database')

// MIDDLEWARES
const authMiddleware = require('../middlewares/validation/loginValidation')

// TOOLS 
const tokenTools = require('../tools/getTokens')
const bcrypt = require('bcrypt')

// AUTH
Router.post('/login', authMiddleware.loginverify, async (req, res) => {
    const client = await db.connect()
    try{
        const text_auth = 'SELECT AM_USER, AM_PASSWORD FROM OPERATORS.ACCOUNTS WHERE AM_USER = $1;'
        const values = [req.body.user]
        const query = await client.query(text_auth, values)
        if (query.rowCount < 1){
            res.status(401).json({message: 'Usuário ou senha incorretos!', error: true})
        }else{
            const match = await bcrypt.compare(req,body.password, query.rows[0].ac_password)
            if (match){
                const token = tokenTools.generatetoken(query.rows[0].ac_user)
                res.status(200).json({message: 'Usuário autenticado com sucesso!', error: false, token: token})
            }else{
                res.status(401).json({message: 'Usuário ou senha incorretos!', error: true})
            }
        }
    }catch(err){
        res.status(401).json({message: 'Usuário ou senha incorretos!', error: true})
    }finally{
        client.release()
    }
})

Router.post('/signin', authMiddleware.loginverify, async (req, res) => {
    const client = await db.connect()
    try{
        const salt = await bcrypt.genSalt(14)
        const hash = await bcrypt.hash(req.body.password, salt)
        const text_auth = 'INSERT INTO OPERATORS.ACCOUNTS (AC_USER, AC_PASSWORD) VALUES ($1, $2);'
        const values = [req.body.user, hash]
        await client.query(text_auth, values)
        
        res.status(201).json({message: 'Usuário criado com sucesso!', error: false})
    }catch(err){
        res.status(404).json({message: 'Houve um erro ao criar o usuário!' + err, error: true})
    }finally{
        client.release()
    }
})

module.exports = Router