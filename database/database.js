const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/slc_store", {
    useMongoClient: true
}).then(res => {
    console.log('Banco conectado com sucesso.')
}).catch(err => {
    console.log('Houve um erro ao se conectar ao banco de dados!', err)
})