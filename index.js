const bodyparser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// DATABASE
const db = require('./database/database')

const app = express()

// TOOLS
app.use(cors())
app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

// IMPORT CONTROLLERS

const productListController = require('./controllers/productListController')
const customerController = require('./controllers/customerController')
const orderController = require('./controllers/orderController')
const addressController = require('./controllers/addressController')
const authController = require('./controllers/authController')

app.use('/products', productListController)
app.use('/customers', customerController)
app.use('/orders', orderController)
app.use('/address', addressController)
app.use('/auth', authController)

// OTHERS
const PORT = 8082

app.listen(PORT, () => {
    console.log(`Server executing on port ${PORT}`)
})
