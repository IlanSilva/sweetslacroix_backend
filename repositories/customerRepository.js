const customerModel = require('../models/customerModel')

const create = (data) => {
    return customerModel.create(data)
}



module.exports = {
    create,

}

