const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/authMiddleware');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      // Admin dashboard stats
      const [totalStudents, totalFees, totalPayments, recentPayments] = await Promise.all([
        Student.countDocuments(),
        Fee.countDocuments(),
        Payment.countDocuments(),
        Payment.find()
          .populate('student', 'studentId fullName')
          .populate('fee', 'course amount')
          .sort({ paymentDate: -1 })
          .limit(5)
      ]);

      const paymentsSummary = await Payment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalStudents,
          totalFees,
          totalPayments,
          recentPayments,
          paymentsSummary: paymentsSummary.reduce((acc, curr) => {
            acc[curr._id] = { count: curr.count, totalAmount: curr.totalAmount };
            return acc;
          }, {})
        }
      });
    } else {
      // Student dashboard stats
      const student = await Student.findOne({ user: req.user.id });
      if (!student) {
        return next(new ErrorResponse('No student profile found', 404));
      }

      const [totalFees, paidPayments, pendingPayments] = await Promise.all([
        Fee.countDocuments({ course: student.course }),
        Payment.countDocuments({ student: student._id, status: 'paid' }),
        Payment.countDocuments({ student: student._id, status: 'pending' })
      ]);

      const dues = await Payment.aggregate([
        {
          $match: { student: student._id }
        },
        {
          $group: {
            _id: '$status',
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          studentId: student.studentId,
          fullName: student.fullName,
          course: student.course,
          totalFees,
          paidPayments,
          pendingPayments,
          dues: dues.reduce((acc, curr) => {
            acc[curr._id] = curr.totalAmount;
            return acc;
          }, {})
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;