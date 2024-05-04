const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');
const checkWork = require('../middlewares/checkWork');
const workCtrl = require('../controllers/works.controller');
const uploadToCloudinary = require('../middlewares/cloudinary');
const moderateImage = require('../middlewares/moderation');

router.post('/', auth, multer, uploadToCloudinary, moderateImage, checkWork, workCtrl.create);
router.get('/', workCtrl.findAll);
router.delete('/:id', auth, workCtrl.delete);

module.exports = router;
