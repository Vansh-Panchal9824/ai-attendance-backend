const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass
} = require('../controllers/classController');

// All routes are protected
router.use(protect);

// Class CRUD operations
router.route('/')
  .get(getAllClasses)
  .post(authorize('teacher', 'admin'), createClass);

router.route('/:id')
  .get(getClassById)
  .put(authorize('teacher', 'admin'), updateClass)
  .delete(authorize('admin'), deleteClass);

// Student management in class
router.route('/:id/students')
  .post(authorize('teacher', 'admin'), addStudentToClass);

router.route('/:id/students/:studentId')
  .delete(authorize('teacher', 'admin'), removeStudentFromClass);

module.exports = router;