require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
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

app.use(express.json())

//Register for new user
app.post('/register', (req, res) => {
    const email = req.body.email;
    const name = req.body.username;
    const hashedPasswrord = bcrypt.hash(req.body.password, 10);

    db.getConnection((err, connection) => {
        if (err) throw (err)

        const dbSearch = 'SELECT * FROM users WHERE email = ?'
        const search_query = mysql.format(dbSearch, [email])

        const dbInsert = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
        const insert_query = mysql.format(dbInsert, [name, email, hashedPasswrord])

        connection.query(search_query, (err, result) => {
            if (err) throw (err)

            if (result.length > 0) {
                res.send('User already exists')
            } else {
                connection.query(insert_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    res.send('User created')
                })
            }
        })
    })
})

//Login for existing user
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.getConnection((err, connection) => {
        if (err) throw (err)

        const dbSearch = 'SELECT * FROM users WHERE email = ?'
        const search_query = mysql.format(dbSearch, [email])

        connection.query(search_query, (err, result) => {
            connection.release()
            if (err) throw (err)

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, response) => {
                    if (response) {
                        res.send('Logged in')
                    } else {
                        res.send('Wrong password')
                    }
                })
            } else {
                res.send('User does not exist')
            }
        })
    })
})