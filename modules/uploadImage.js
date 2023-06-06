'use strict'
const fs = require('fs')
const path = require('path')
const {Storage} = require('@google-cloud/storage')
const path = require('path');

const keyPath = path.join('./sakeybucket.json')
const sakeypath = path.resolve(keyPath)

const storage = new Storage({
    keyFilename: sakeypath,
    projectId: 'YOUR_PROJECT_ID'
})

const bucketName = 'YOUR_BUCKET_NAME'
const bucket = storage.bucket(bucketName)

const getPublicUrl = (filename) => {
    return `https://storage.googleapis.com/${bucketName}/${filename}`
    }

let uploadImg = {}

uploadImg.upload = (req, res, next) => {
    if (!req.file) {
        return next()
    }

    const gcsname = Date.now() + req.file.originalname
    const file = bucket.file(gcsname)

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname
        file.makePublic().then(() => {
            req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
            next()
        })
    })

    stream.end(req.file.buffer)
}

module.exports = uploadImg