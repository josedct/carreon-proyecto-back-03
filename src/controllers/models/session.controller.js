const { hashPassword, isValidPassword } = require('./../../helpers/hashUtils')
const userModel = require('./../../dao/models/user.model')

const requireAuth = (req, res, next) => {
    if (req.session?.user) return next()
    return res.render( 'error', {
        titleError:'Usuario no encontrado', 
        error: 'Necesita iniciar sesion para acceder al recurso',
        link: '/login',
        textLink: 'Iniciar Sesion'
    })
}

const existAuth = (req, res, next) => {
    if (req.session?.user) return res.redirect('/products')
    return next()
}

const getUser = async (req, res) => {
    /* const { userEmail, userPassword } = req.body
    let user

    try {
        user = await userModel.findOne({email: userEmail}).lean().exec()
    } catch (error) {
        return res.render('error',{
            titleError:'Usuario no encontrado', 
            error: 'Necesita iniciar sesion para acceder al recurso',
            link: '/login',
            textLink: 'Iniciar Sesion'
        })
    }
    
    if(!user) {
        return res.render('error',{
            titleError:'Usuario no encontrado', 
            error: 'Necesita iniciar sesion para acceder al recurso',
            link: '/login',
            textLink: 'Iniciar Sesion'
        })
    }

    if (!isValidPassword(user, userPassword)) {
        return res.render('error',{
            titleError:'Password Incorrecto', 
            error: 'Verifique el password que ingreso',
            link: '/login',
            textLink: 'Iniciar Sesion'
        })
    }
 */
    const {email, role} = req.user
    
    req.session.user = {email, role}
    return res.redirect('/products')
}

const addUser = async (req, res) => {
    /* const data = req.body
    data.password = hashPassword(data.password)
    const role = data.email === 'adminCoder@coder.com' ? 'admin' : 'usuario'
    
    try {
        const result = await userModel.create({...data, role})
    } catch (error) {
        return res.render('error',{
            titleError:'Usuario no registrado', 
            error: 'No se pudo registrar el usuario, verifique los datos ingresados',
            link: '/register',
            textLink: 'Registrarse'
        })
    } */

    return res.redirect('/login')
}

const getGitHub = (req, res) => {

}

const getUserGitHub = (req, res) => {
    req.session.user = req.user
    return res.redirect('/products')
}


const delSession = (req, res) => {
    //req.session.destroy
    req.logout(err => {
        if(err) {
            res.status(500).render('/error', {
                titleError:'Sesión no terminada', 
                error: 'No se pudo cerrar la sesión',
                link: '/logout',
                textLink: 'Cerrar sesión'
            })
        } else res.redirect('/login')
    })
}

module.exports = {getUser, addUser, delSession, requireAuth, existAuth, getGitHub, getUserGitHub}