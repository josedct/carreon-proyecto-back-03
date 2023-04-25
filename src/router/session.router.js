const {Router} = require('express')
const {getUser, addUser, getUserGitHub} = require('./../controllers/models/session.controller')
const  passportCall = require('./../helpers/passportCall')

const router = Router()

router.post('/login', passportCall('login'), getUser)

router.post('/register', passportCall('register'), addUser)

router.get('/githubcallback', passportCall('github'), getUserGitHub)

module.exports = router