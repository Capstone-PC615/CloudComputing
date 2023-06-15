const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const uploadImage = require('./helpers/helpers')

const app = express()

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
  try {
    const myFile = req.file
    const imageUrl = await uploadImage(myFile)

    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

//to get the image url and send to vertex ai
app.get('/uploads', async (req, res, next) => {
    try {
        const myFile = req.file
        const imageUrl = await uploadImage(myFile)
        res
            .status(200)
            .json({
                message: "Upload was successful",
                data: imageUrl
            })
    } catch (error) {
        next(error)
    }
})

//to get the classification result from vertex ai and send to user
app.get('/result', async (req, res, next) => {
    try {
        const result = req.result
        res
            .status(200)
            .json({
                message: "Classification was successful",
                data: result
            })
    } catch (error) {
        next(error)
    }
})

app.listen(9001, () => {
  console.log('app now listening for requests!!!')
})