const currencyFormat = require("../../helpers/formatPrice")

const getHome = async (req, res) => {
    return res.render('home')
}

const getViewProducts = async (req, res) => {

    const url = req.originalUrl
    const urlQuery = url.replace('/products','/api/products')
    const protocol = req.protocol
    const host = req.header('host')
    let products

    try {
        const response = await fetch(`${protocol}://${host}${urlQuery}`)
        products = await response.json()
        products.prevLink = products.prevLink.replace('/api/products','/products')
        products.nextLink = products.nextLink.replace('/api/products','/products')
        products.payload = products.payload.map(prod => ({...prod, price : currencyFormat(prod.price) }))
        
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

    return res.render('products',{...products, title: "Lista de peliculas", email: req.session.user.email, role: req.session.user.role})

}

const getViewProduct = async (req, res) => {

    const url = req.originalUrl
    const urlParam = url.replace('/product','/api/products')
    const protocol = req.protocol
    const host = req.header('host')
    let data
    
    try {
        const response = await fetch(`${protocol}://${host}${urlParam}`)
        data = await response.json()
    } catch (error) {
        data = {
            status : 'error',
            product : {},
            message : 'product id no found'
        }
    }

    return res.render('product',{...data.product, title: data.product.title})

}

const getViewCart = async (req, res) => {
    
    const url = req.originalUrl
    const urlParam = url.replace('/cart','/api/carts')
    const protocol = req.protocol
    const host = req.header('host')
    let data
    
    try {
        const response = await fetch(`${protocol}://${host}${urlParam}`)
        data = await response.json()
        
    } catch (error) {
        data = {
            status : 'error',
            payload : [],
            message : 'cart id no found'
        }
    }

    return res.render('cart', {...data, title:"Carrito de compra"})

}

const getLogin = async (req, res) => {
    return res.render('login', {title: "Login"})
}

const getRegister = async (req, res) => {
    return res.render('register', {title: "Registro de Usuario"})
}

const getError = async (req, res) => {
    return res.render('error',{
        titleError:'Titulo del error', 
        error: 'Descripcion del error',
        link: '/error',
        textLink: 'Texto del link de error'
    })
}

module.exports = {getHome, getViewProducts, getViewProduct, getViewCart, getLogin, getRegister,getError}