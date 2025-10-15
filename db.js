const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const pool = new Pool({
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // password: process.env.DB_PASS,
    // database: process.env.DB_DATABASE
    connectionString: process.env.DB_URL
})

pool.connect().then(() => {
    console.log("DB Connected Successfully");
}).catch(() => {
    console.log("ERR");
})

module.exports = pool