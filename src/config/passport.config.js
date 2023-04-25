const passport = require('passport')
const local = require('passport-local')
const GitHubStrategy = require('passport-github2')
const userModel = require('./../dao/models/user.model')
const {hashPassword, isValidPassword} = require('./../helpers/hashUtils')
const {ADMIN_EMAIL, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL} = require('./config')

const LocalStrategy = local.Strategy

const initializePassport = () =>{
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, 
    async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body

        try {
            
            const user = await userModel.findOne({email: username})
            if(user){
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: hashPassword(password),
                role: email === ADMIN_EMAIL ? 'admin' : 'usuario' 
            }

            const result = await userModel.create(newUser)

            return done(null, result)

        } catch (error) {
            return done('Error al intentar crear al usuario')
        }
    }))
    
    passport.use('login' , new LocalStrategy({
        passReqToCallback: true,
        usernameField:'userEmail',
        passwordField:'userPassword'
    },
    async (req, username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(!user){
                return done(null, false)
            }

            if(!isValidPassword(user, password)){
                return done(null, false)
            }

            return done(null, user)

        } catch (error) {
            return done("Error al buscar al usuario")
        }
    }))
    

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID, 
        clientSecret: CLIENT_SECRET, 
        callbackURL: CALLBACK_URL 
    }, async(accessToken, refreshToken, profile, done) => {

        try {
            const user = await userModel.findOne({ email: profile._json.email})

            if (user) {
                return done(null, user)
            }

            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                age: 0,
                password: "",
                role: profile._json.email === ADMIN_EMAIL ? 'admin' : 'usuario'
            })

            return done(null, newUser)
            
        } catch(error) {
            return done('Error to login with github')
        }

    }))


    passport.serializeUser(() => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

module.exports = initializePassport