require('dotenv').config()
const express = require('express')
const app = express()
const dbhost = cre.env.DB_HOST
const dbuser = cre.env.DB_USER
const dbpass = cre.env.DB_PASSWORD
const dbname = cre.env.DB_DATABASE

const mysql = require('mysql')

const db = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    password: dbpass,
    database: dbname,
})

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
}
)