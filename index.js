const bodyparser = require('body-parser')
const express = require('express')
const morgan = require('morgan')

const app = express()

// TOOLS
app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

// IMPORT CONTROLLERS

const productListController = require('./controllers/productListController')
const customerController = require('./controllers/customerController')
const orderController = require('./controllers/orderController')

app.use('/products', productListController)
app.use('/customers', customerController)
app.use('/orders', orderController)

// OTHERS
const PORT = 8082

app.listen(PORT, () => {
    console.log(`Server executing on port ${PORT}`)
})
