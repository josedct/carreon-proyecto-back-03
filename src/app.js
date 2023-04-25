const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const {PORT, MONGO_URI, SESSION_SECRET} = require('./config/config')

const productRouter = require('./router/products.router')
const cartRouter = require('./router/carts.router')
const sessionRouter = require('./router/session.router')
const viewsRouter = require('./router/views.router')

const server = express()
const uri = MONGO_URI 

server.use(express.json())
server.use(express.urlencoded({extends: true}))
server.use(express.static(path.join(__dirname,'public')))
server.engine('handlebars', handlebars.engine())
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'handlebars')

server.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
server.use(passport.initialize())
server.use(passport.session())

server.use('/api/products',productRouter)
server.use('/api/carts',cartRouter)
server.use('/session',sessionRouter)
server.use('/',viewsRouter)

mongoose.connect(uri)
    .then( () => {
        console.log('DB conectada...')
        server.listen(PORT, () => console.log('Server Up')) 
    })
    .catch(error => handleError(error));
