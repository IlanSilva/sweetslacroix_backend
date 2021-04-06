const express = require('express')
const Router = express.Router()


// REPOSITORIOS (REPOSITORY PATTERNS)
const orderRepository = require('../repositories/orderRepository')
const productRepository = require('../repositories/productRepository')

Router.post('/createorder', async (req, res) => {
    console.log(req.body)
    try{
        const createorder = await orderRepository.createOrder(req.body)
        if (Array.isArray(req.body.products)){
            for (product in req.body.products){
                let item = {client_id: createorder._id, product: product.name, value: product.value}
                await productRepository.createItem(item)
            }
        }
        

        res.status(200).json({message: 'Criação de pedido feita com sucesso!', error: false})
    }catch(err){
        console.log(err)
        res.status(404).json({message: 'Falha na criação do pedido!', error: true})
    }
})

module.exports = Router