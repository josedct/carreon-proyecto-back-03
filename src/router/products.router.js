const {Router} = require('express')
const {getProducts, getProduct, addProduct, updProduct, delProduct} = require('./../controllers/models/product.controller')

const router = Router()

router.get('/', getProducts)

router.get('/:pid',getProduct)

router.post('/',addProduct)

router.put('/:pid',updProduct)

router.delete('/:pid',delProduct)

module.exports = router