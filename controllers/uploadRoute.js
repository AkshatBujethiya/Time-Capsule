const {Router} = require('express');
const UploadRouter = Router();
const {cloudinary} = require('../cloudinaryConfig');
const upload = require('../multer');

UploadRouter.get('/upload', (req, res) => {
    res.render('upload');
});

UploadRouter.post('/upload', upload.single('file'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send('Image uploaded to cloudinary server');
    });
});

module.exports=UploadRouter;
