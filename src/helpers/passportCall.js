const passport = require('passport')

const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(error, user, info) {
            if (error){
                return res.render('error',{
                    titleError:'Error de Operacion', 
                    error: 'Ocurrio algun error al consultar las credenciales',
                    link: '/login',
                    textLink: 'Intentar nuevamente'
                })
            }
            if (!user) {
                return res.render('error',{
                    titleError:'Usuario no registrado o encontrado', 
                    error: `Verifique alguno de los siguientes casos <br>
                        1. El email y password ingresados <br> 
                        2. Si ya existe el usuario no lo vuelva a registrar <br> 
                        3. Que el metodo de identificacion se el correcto`,
                    link: '/login',
                    textLink: 'Regresar al login'
                })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = passportCall