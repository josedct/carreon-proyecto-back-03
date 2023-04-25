const { Router } = require('express')
const {getCart, addCart, addProductToCart, delProducToCart, updProductsToCart, updQuantityToCart, delProductsToCart} = require('./../controllers/models/cart.controller')

const router = Router()

router.get('/:cid', getCart)

router.post('/',addCart)

router.post('/:cid/product/:pid', addProductToCart)


router.delete('/:cid/products/:pid',delProducToCart)

router.put('/:cid',updProductsToCart)

router.put('/:cid/products/:pid',updQuantityToCart)

router.delete('/:cid',delProductsToCart)

module.exports = router