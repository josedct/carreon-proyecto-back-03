const mongoose = require('mongoose')

const cartCollection = 'carts'

const productSchema = new mongoose.Schema({
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            require:true 
        },
        quantity: {
            type: Number,
            default: 1,
            require: true
        }
    }
    ,{_id: false}
)

const cartSchema = new mongoose.Schema({
    products: {
        type: [productSchema],
        default: []
    }
})

cartSchema.pre('findOne', function () {
    this.populate('products.product')
}) 

const cartModel = mongoose.model(cartCollection,cartSchema)
module.exports = cartModel