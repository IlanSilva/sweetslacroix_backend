const db = require('../database/database')

const createProduct = (data) => {
    const querytext = `INSERT INTO LOGISTIC.PRODUCTS (SL_PRODUCT_NAME, SL_PRODUCT_VALUE) VALUES ($1, $2) RETURNING *;`
    const values = [data.product.name, data.product.value]
    const query = db.query(querytext, values)
    return query

}

const getProductByName = (name) => {
    const querytext = `SELECT * FROM LOGISTIC.PRODUCTS WHERE SL_PRODUCT_NAME ILIKE $1;`
    let date = new Date(2021, 04, 06)
    const values = [`${name}%`]
    const query = db.query(querytext, values)
    return query
}

const updateProduct = (id, data) => {
    const querytext = `UPDATE LOGISTIC.PRODUCTS SET SL_PRODUCT_NAME = $1, SL_PRODUCT_VALUE = $2 WHERE SL_ID_PK = $3 RETURNING *;`
    const values = [data.product.name, data.product.value, id]
    const query = db.query(querytext, values)
    return query
}

const deleteProduct = (id) => {
    const querytext = `DELETE FROM LOGISTIC.PRODUCTS WHERE SL_ID_PK = $1 RETURNING *;`
    const values = [id]
    const query = db.query(querytext, values)
    return query
}


module.exports = {
    createProduct,
    getProductByName,
    updateProduct,
    deleteProduct
}