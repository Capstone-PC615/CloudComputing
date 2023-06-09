//Write for this app.js fie
const express = require('express');
const app = express();
const port = 3000;
const {uploadImg, getPublicUrl} = require('./modules/uploadImage');
const {classifyImage} = require('./modules/VertexAI');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const imgUrl = require('./modules/uploadImage')

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
}
);

app.post('/upload', upload.single('image'), uploadImg.upload, (req, res) => {
    res.redirect('/result');
});

app.get('/result', async (req, res) => {
    const imagePath = getPublicUrl();
    const predictedClass = await classifyImage(imagePath);
    res.render('result', {predictedClass: predictedClass});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});