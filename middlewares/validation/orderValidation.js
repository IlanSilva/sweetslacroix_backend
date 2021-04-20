// DATABASE
const db = require('../../database/database')

const createValidation = function (req, res, next){
    const client = await db.connect()
    try{
        if (!req.body){
            res.status(200).json({message: 'Não foi recebido nenhum dado no corpo da requisição!', error: true})
            return
        }
        
        // VALIDAR DADOS DE CLIENTE
        if(!req.body.client.id){
            res.status(200).json({message: 'Não foi recebido nenhum id de cliente em sua requisição!', error: true})
            return
        }else if(req.body.client.id){
            const getclient = await client.query('SELECT SL_ID_PK FROM CUSTOMERS.PERSONS WHERE SL_ID_PK = $1;', [req.body.client.id])
            if (getclient.rowCount > 0){
                // EMPTY
            }else{
                res.status(200).json({message: `Não foi encontrado nenhum cliente com o ID ${req.body.client.id}!`, error: true})
                return
            }
        }
        // VALIDAR ITENS
        if (!req.body.basket || req.body.basket.length < 1){
            res.status(200).json({message: 'Não foi recebido nenhum produto em sua requisição!', error: true})
            return
        }else if(req.body.basket){
            let arraytest = []
            req.body.basket.forEach((element) => {
                if(!element.id){
                // EMPTY
                }else{
                    const productverify = await client.query('SELECT SL_ID_PK FROM LOGISTIC.PRODUCTS WHERE SL_ID_PK = $1;', [element.id])
                    if(productverify.rowCount > 0){
                        arraytest.push(element)
                    }
                }
            })
            if (arraytest.length != req.body.basket.length){
                res.status(200).json({message: 'Há produtos em sua lista que não está válido!', error: true})
                return
            }
        }
        
        //VALIDAR ENDEREÇO
        if(!req.body.address.cep || !req.body.address.uf || !req.body.address.city || !req.body.address.neighborhood || !req.body.address.street){
            res.status(200).json({message: 'Está faltando dados de endereço!', error: true})
            return
        }
    }catch(err){
        console.log(err)
        res.status(404).json({message: 'Houve um erro ao tentar realizar a validação de itens! ' + err, error: true})
    }finally{
        client.release()
    }
}