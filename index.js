const bodyparser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()

// TOOLS
app.use(cors())
app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))
    // MIDDLEWARES
    const tokenMiddleware = require('./middlewares/validation/loginValidation')

// IMPORT CONTROLLERS

const productListController = require('./controllers/productListController')
const customerController = require('./controllers/customerController')
const orderController = require('./controllers/orderController')
const addressController = require('./controllers/addressController')
const authController = require('./controllers/authController')

app.use('/products', tokenMiddleware.authverify, productListController)
app.use('/customers', tokenMiddleware.authverify, customerController)
app.use('/orders', tokenMiddleware.authverify, orderController)
app.use('/address', tokenMiddleware.authverify, addressController)
app.use('/auth', authController)

// OTHERS
const PORT = 8082

app.listen(PORT, () => {
    console.log(`Server executing on port ${PORT}`)
})
