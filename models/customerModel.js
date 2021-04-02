const mongoose = require('../database/database')


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
        street: {
            type: String,
            required: true
        },
        neighborhood: {
            type: String,
            required: true,
        },
        housenumber: {
            type: Number,
            required: true
        } 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer

