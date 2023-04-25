const productModel = require('./../../dao/models/product.model')
const generateUrl = require('./../../helpers/generateUrl')

// Get products /api/products [? limit = (N) & page = (N) & sort = (asc|desc) & availability = (yes|no)]
const getProducts =  async (req, res) => {
    const {limit = 10, page: pag = 1, sort ='none', query = {} } = req.query
    const {category = 'all', availability ='all'} = query ? query : {category:'all', availability: 'all'}

    const filter = {}
    
    if(category !== 'all'){
        filter.category = category
    }

    if(availability !== 'all' && (availability === 'yes' || availability === 'no')){
        filter.stock = availability === 'yes' ? { $gt: 0 }  : { $eq: 0 }
    }

    const option = {}

    option.limit = isNaN(limit) ? 10 : parseInt(limit)
    option.page = isNaN(pag) ? 1 : parseInt(pag)
    option.lean = true

    if(sort !== 'none' && (sort === 'asc' || sort === 'desc')){
        option.sort = { price: sort }
    }

    let products = {}
    try {
        const {docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage} = await productModel.paginate(filter, option)
        products = {
            status: "success",
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? generateUrl(req.originalUrl,prevPage) : '',
            nextLink: hasNextPage ? generateUrl(req.originalUrl,nextPage) : ''
        }
    } catch (error) {
        products = {
            status: "error",
            payload: [],
            totalPages : 0,
            prevPage: 0,
            nextPage: 0,
            page: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevLink: '',
            nextLink: ''
        }    
    }
    
    return res.json(products) 
}

// Get product /api/products/:pid
const getProduct =  async (req, res) => {
    const { pid } = req.params
    const info = { 
        status: 'success',
        message: 'ok'
    }

    try {
        info.product = await productModel.findById(pid).lean().exec()
    } catch (error) {
        info.status = 'error'
        info.product = {}
        info.message = 'product id no found'
    }
    
    return res.json(info) 
}

//Post for add product /api/products
const addProduct =  async (req, res) => {
    const data = req.body
    const info = {}

    try {
        const result = await productModel.create(data)
        info.status = 'success'
        info.message = 'product added successfully.'
        info.id = result._id
    } catch (error) {
        info.status = 'error'
        info.message = 'the product could not be added check the data sent.'
        info.id = "0"
    }

    return res.json(info)
}

//Put for update product /api/products/:pid
const updProduct =  async (req, res) => {
    const {pid} = req.params
    const data = req.body
    const info = {}

    if(pid === undefined || data === undefined || Object.entries(data).length === 0){
        info.status = 'error'
        info.message = 'verify that id or data, does not exist or is invalid'
        info.modif -1
        return res.json(info)
    }
    
    try {
        const result = await productModel.updateOne({_id: pid}, data)
        
        if(result.modifiedCount > 0){   
            info.status = 'success'
            info.message = `product whit id: ${pid} updated`
            info.modif = 1
            return res.json(info)
        }

        if(result.matchedCount > 0 && result.modifiedCount === 0){
            info.status = 'success'
            info.message = `product whit id: ${pid} not updated`
            info.modif = 0
            return res.json(info)
        }

        if(result.matchedCount === 0 ){
            info.status = 'error'
            info.message = `product whit id: ${pid} not found`
            info.modif = -1
            return res.json(info)
        }
        
    } catch (error) {
        console.log(error)
        info.status = "error"
        info.message = "could not update, id does not exist, or did not need to update."
        info.modif = -1
        return res.json(info)
    }

}

//Delete product /api/products/:pid
const delProduct =  async (req, res) => {
    const {pid} = req.params
    const info = {}

    try {
        const result = await productModel.deleteOne({_id : pid})
        console.log (result)
        if(result.deletedCount > 0){
            info.status = 'success'
            info.message = `product whit id: ${pid} deleted`
            info.remov = true
        }else{
            info.status = 'error'
            info.message = `no products have been removed`
            info.remov = false
        }
        
    } catch (error) {
        console.log (error)
        info.status = 'error'
        info.message = 'could not delete, id does not exist.'
        info.remov = false
    }

    return res.json(info)
}

module.exports = {getProducts, getProduct, addProduct, updProduct, delProduct}