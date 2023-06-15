const cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './keys.json')
const { Storage } = cloud
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'trashsort-388213'
})

module.exports = storage