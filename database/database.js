const { Pool } = require('pg')


const db = new Pool({
    user: "postgres",
    password: "323232",
    host: "localhost",
    port: 5432,
    database: "slc_store"
})


module.exports = db