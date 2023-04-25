const cartModel = require('./../../dao/models/cart.model')
const productModel =require('./../../dao/models/product.model')

// GET /api/carts/:cid 
const getCart = async (req, res) => {
    const {cid} = req.params
    const info = {}

    if(cid === undefined){
        info.status = "error"
        info.payload = []
        info.message = "the cart id is not a correct number"
        return res.json(info)
    }

    try {
        //populate('products.product')
        const cart = await cartModel.findById(cid).lean().exec()
        info.status = "success"
        info.payload = cart
        info.message = "ok"
    } catch (error) {
        info.status = "error"
        info.payload = []
        info.message = "cart id no found"
    }

    return res.json(info)
}

//POST /api/carts/ 
const addCart = async (req, res) => {
    const info = {}

    try {
        const result = await cartModel.create({})
        info.status = 'success'
        info.message = 'cart added successfully.'
        info.id = result._id
    } catch (error) {
        info.status = 'error'
        info.message = 'the cart could not be added.'
        info.id = "0"
    }
    
    return res.json(info)
}

//POST /api/carts/:cid/product/:pid
const addProductToCart = async (req, res) => {
    const {cid, pid} = req.params
    const info = {}

    if(cid === undefined || pid === undefined){
        info.status = "error"
        info.message = "the cart id or product id is not a correct number."
        info.added = false
        return res.json(info)
    }

    //exista el producto
    try {
        if(await productModel.exists({_id:pid}) === null){
            info.status = "error"
            info.message = "the product id no exists."
            info.added = false
            return res.json(info)
        }
    } catch (error) {
        info.status = "error"
        info.message = "could not be consulted product."
        info.added = false
        return res.json(info)
    }

    //exita el carrito
    try {
        if(await cartModel.exists({_id:cid}) === null){
            info.status = "error"
            info.message = "the cart id no exists."
            info.added = false
            return res.json(info)
        }
    } catch (error) {
        info.status = "error"
        info.message = "could not be consulted cart."
        info.added = false
        return res.json(info)
    }

    //agregar o actualizar el producto en el carrito
    let result
    try {
        result = await cartModel.updateOne({_id:cid , 'products.product':pid},{$inc:{'products.$.quantity':1}})
        if(result.modifiedCount > 0){
            info.status = 'success'
            info.message = 'product quantity updated successfully'
            info.added = true
            return res.json(info)
        }

        result = await cartModel.updateOne({_id:cid },{$addToSet: {products: {product: pid}}})
        if(result.modifiedCount > 0){
            info.status = 'success'
            info.message = 'product successfully added to cart'
            info.added = true
            return res.json(info)
        }

    } catch (error) {
        info.status = 'error'
        info.message = 'the query could not be made'
        info.added = false
        return res.json(info)
    }

    info.status = 'error'
    info.message = 'product cannot be added'
    info.added = false
    return res.json(info)

}

//DELETE /api/carts/:cid/products/:pid
const delProducToCart = async (req, res) => {
    //eliminar del carrito el producto seleccionado.
    const {cid, pid} = req.params
    const info = {}

    if(cid === undefined || pid === undefined){
        info.status = "error"
        info.message = "the cart id or product id is not a correct number."
        info.remov = false
        return res.json(info)
    }

    try {
        if(await cartModel.exists({_id:cid}) === null){
            info.status = "error"
            info.message = "the cart id no exists."
            info.remov = false
            return res.json(info)
        }
    } catch (error) {
        console.log(error)
        info.status = "error"
        info.message = "could not be consulted cart."
        info.remov = false
        return res.json(info)
    }

    let result

    try {
        result = await cartModel.updateOne({_id:cid},{$pull:{ products:{ product: pid } }})
        console.log(result)
        if(result.modifiedCount > 0){
            info.status = 'success'
            info.message = `product whit ${pid} deleted successfully`
            info.remov = true
            return res.json(info)
        }

        info.status = 'error'
        info.message = `product whit ${pid} was not found in the cart`
        info.remov = false
        return res.json(info)

    } catch (error) {
        console.log(error)
        info.status = "error"
        info.message = "could not be consulted cart."
        info.remov = false
        return res.json(info)
    }

}

//PUT /api/carts/:cid
const updProductsToCart = async (req, res) => {
    //actualizar el carrito con un arreglo de productos
    const {cid} = req.params
    const arrayProducts = req.body
    const info = {}

    if(cid === undefined){
        info.status = "error"
        info.message = "the cart id is not a correct number."
        info.modif = -1
        return res.json(info)
    }

    if(arrayProducts === undefined || !(Array.isArray(arrayProducts))){
        info.status = "error"
        info.message = " the array of products is not valid"
        info.modif = -1
        return res.json(info)
    }

    const auxProducts = arrayProducts.map( prod => {
        return { product : {_id : prod.id}, quantity : prod.quantity }
    })

    let result

    try {
        result = await cartModel.updateOne({_id:cid},{ products: auxProducts })
        console.log(result)
        if(result.modifiedCount > 0 && result.matchedCount > 0){
            info.status = "success"
            info.message = `products cart whit ${cid} updated successfully`
            info.modif = 1
            return res.json(info)
        }

        if(result.modifiedCount === 0 && result.matchedCount > 0){
            info.status = "success"
            info.message = `products cart whit ${cid} found but not updated`
            info.modif = 0
            return res.json(info)
        }

        if(result.matchedCount === 0){
            info.status = "error"
            info.message = `cart whit ${cid} not found`
            info.modif = -1
            return res.json(info)
        } 

    } catch (error) {
        info.status = "error"
        info.message = `products cart whit ${cid} not updated`
        info.modif = -1
        return res.json(info)
    }

}

//PUT /api/carts/:cid/products/:pid
const updQuantityToCart = async (req, res) => {
    //actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
    const {cid,pid} = req.params
    let {quantity} = req.body
    const info = {}

    quantity = parseInt(quantity)

    if(cid === undefined || pid === undefined){
        info.status = "error"
        info.message = "the cart id or product id is not a correct number."
        info.modif = -1
        return res.json(info)
    }

    if(isNaN(quantity)){
        info.status = "error"
        info.message = "the quantity is not a correct number."
        info.modif = -1
        return res.json(info)
    }

    try {
        if(await cartModel.exists({_id:cid}) === null){
            info.status = "error"
            info.message = "the cart id no exists."
            info.modif = -1
            return res.json(info)
        }
    } catch (error) {
        info.status = "error"
        info.message = "could not be consulted cart."
        info.modif = -1
        return res.json(info)
    }

    let result

    try {
        result = await cartModel.updateOne({_id:cid , 'products.product':pid},{$set:{'products.$.quantity':quantity}})
        if(result.modifiedCount > 0 && result.matchedCount > 0){
            info.status = "success"
            info.message = "quantity of product updated."
            info.modif = 1
            return res.json(info)
        }

        if(result.modifiedCount === 0 && result.matchedCount > 0){
            info.status = "success"
            info.message = "quantity of product not updated."
            info.modif = 0
            return res.json(info)
        }

        if(result.matchedCount === 0){
            info.status = "error"
            info.message = "product not found in the cart."
            info.modif = -1
            return res.json(info)
        }
        
        
    } catch (error) {
        info.status = "error"
        info.message = "product not updated"
        info.modif = -1
        return res.json(info)
    } 
    
}

//DELETE /api/carts/:cid
const delProductsToCart = async (req, res) => {
    //eliminar todos los productos del carrito 
    const {cid} = req.params
    const info = {}

    if(cid === undefined){
        info.status = "error"
        info.message = "the cart id is not a correct number."
        info.modif = -1
        return res.json(info)
    }

    try {
        if(await cartModel.exists({_id:cid}) === null){
            info.status = "error"
            info.message = "the cart id no exists."
            info.modif = -1
            return res.json(info)
        }
    } catch (error) {
        info.status = "error"
        info.message = "could not be consulted cart."
        info.modif = -1
        return res.json(info)
    }

    let result

    try {
        result = await cartModel.updateOne({_id:cid},{ products: [] })

        if(result.modifiedCount > 0 && result.matchedCount > 0){
            info.status = "success"
            info.message = `products cart whit ${cid} updated successfully`
            info.modif = 1
            return res.json(info)
        }

        if(result.modifiedCount === 0 && result.matchedCount > 0){
            info.status = "success"
            info.message = `products cart whit ${cid} found but not updated`
            info.modif = 0
            return res.json(info)
        }

        if(result.matchedCount === 0){
            info.status = "error"
            info.message = `cart whit ${cid} not found`
            info.modif = -1
            return res.json(info)
        }


    } catch (error) {
        info.status = "error"
        info.message = "could not be consulted cart."
        info.modif = -1
        return res.json(info)
    }

}

module.exports = {getCart, addCart, addProductToCart,delProducToCart, updProductsToCart, updQuantityToCart, delProductsToCart}