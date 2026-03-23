const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  markAttendance,
  getAllAttendance,
  getStudentAttendance,
  getClassAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');

// All attendance routes are protected
router.use(protect);

// Stats route (specific before generic)
router.get('/stats', getAttendanceStats);

// Main routes
router.route('/')
  .get(getAllAttendance)
  .post(authorize('teacher', 'admin'), markAttendance);

// Student specific attendance
router.get('/student/:studentId', getStudentAttendance);

// Class specific attendance
router.get('/class/:className', getClassAttendance);

// Single attendance record operations
router.route('/:id')
  .put(authorize('teacher', 'admin'), updateAttendance)
  .delete(authorize('admin'), deleteAttendance);

module.exports = router;