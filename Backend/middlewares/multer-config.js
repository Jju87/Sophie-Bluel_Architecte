const multer = require('multer')

const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

const storage = multer.memoryStorage()

module.exports = multer({storage}).single('image')