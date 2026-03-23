const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  loadModels,
  registerFace,
  recognizeFace,
  detectFaces,
  getAllFaces
} = require('../controllers/faceController');

// Public
router.get('/load-models', loadModels);

// Protected
router.use(protect);

router.post('/register', registerFace);
router.post('/recognize', recognizeFace);
router.post('/detect', detectFaces);
router.get('/', authorize('admin'), getAllFaces);

module.exports = router;