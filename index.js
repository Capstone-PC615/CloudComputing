'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = require('./modules/uploadImage')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer({ dest: './uploads/' }).single('file'))

app.post('/upload', upload.upload, (req, res) => {
    res.send(req.file.cloudStoragePublicUrl)
})

app.listen(9001, () => {
    console.log('app now listening for requests!!!')
})