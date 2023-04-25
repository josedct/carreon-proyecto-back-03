const {Router} = require('express')
const {getHome, getViewProducts, getViewProduct, getViewCart, getLogin, getRegister, getError} = require('./../controllers/views/view.controller')
const {delSession, requireAuth, existAuth, getGitHub} = require('./../controllers/models/session.controller')
const passport = require('passport')

const router = Router()

router.get('/', getHome)

router.get('/products', requireAuth, getViewProducts)

router.get('/product/:pid', requireAuth, getViewProduct)

router.get('/cart/:cid', requireAuth, getViewCart)

router.get('/login', existAuth, getLogin)

router.get('/register', existAuth, getRegister)

router.get('/error', getError)

router.get('/logout', delSession)

router.get('/github', passport.authenticate('github', { scope: ['user: email']}), getGitHub)

module.exports = router