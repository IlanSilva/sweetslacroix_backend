const mongoose = require('mongoose')


const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    address: {
        street: String,
        neighborhood: String,
        housenumber: Number 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer

