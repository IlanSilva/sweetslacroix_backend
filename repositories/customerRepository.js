const customerModel = require('../models/customerModel')

const create = (data) => {
    return customerModel.create(data)
}

const getAll = () => {
    return customerModel.find()
}

const getByName = (name) => {
    return customerModel.find({
        name: `${name}`
    })
}
module.exports = {
    create,
    getAll,
    getByName,

}

