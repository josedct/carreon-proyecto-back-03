const bcrypt = require('bcrypt')

const hashPassword = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9))
}

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

module.exports = {hashPassword, isValidPassword}