const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const SESSION_SECRET = process.env.SESSION_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL

module.exports = { PORT, MONGO_URI, SESSION_SECRET, ADMIN_EMAIL, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL }