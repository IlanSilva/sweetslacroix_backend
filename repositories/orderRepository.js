const orderModel = require('../models/orderModel')


const createOrder = (data) => {
    return orderModel.create(data)
}


module.exports = {
    createOrder,
}