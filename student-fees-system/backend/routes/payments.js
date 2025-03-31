const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { protect, authorize, checkStudentOwnership } = require('../middleware/authMiddleware');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET api/payments
// @desc    Get all payments (admin) or student-specific payments
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let payments;
    if (req.user.role === 'admin') {
      payments = await Payment.find()
        .populate('student', 'studentId fullName course')
        .populate('fee', 'course amount')
        .sort({ paymentDate: -1 });
    } else {
      const student = await Student.findOne({ user: req.user.id });
      if (!student) {
        return next(new ErrorResponse('No student profile found', 404));
      }
      payments = await Payment.find({ student: student._id })
        .populate('fee', 'course amount')
        .sort({ paymentDate: -1 });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST api/payments
// @desc    Create new payment
// @access  Private (Admin) or Student for own payments
router.post('/', [
  protect,
  check('fee', 'Fee ID is required').not().isEmpty(),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
  check('paymentMethod', 'Payment method is required').not().isEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation Error', 400, errors.array()));
  }

  try {
    // Verify fee exists
    const fee = await Fee.findById(req.body.fee);
    if (!fee) {
      return next(new ErrorResponse('Fee not found', 404));
    }

    // For students, verify they're paying their own fee
    let student;
    if (req.user.role === 'student') {
      student = await Student.findOne({ user: req.user.id });
      if (!student) {
        return next(new ErrorResponse('No student profile found', 404));
      }
      req.body.student = student._id;
    }

    // Verify amount doesn't exceed fee amount
    if (req.body.amount > fee.amount) {
      return next(new ErrorResponse('Payment amount exceeds fee amount', 400));
    }

    const payment = await Payment.create({
      ...req.body,
      status: 'paid' // Auto-mark as paid for now (would integrate payment gateway later)
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT api/payments/:id/status
// @desc    Update payment status (admin only)
// @access  Private (Admin)
router.put('/:id/status', [
  protect,
  authorize('admin'),
  check('status', 'Valid status is required').isIn(['paid', 'pending', 'failed', 'refunded'])
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation Error', 400, errors.array()));
  }

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    payment.status = req.body.status;
    await payment.save();

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/payments/report
// @desc    Generate payment report (admin only)
// @access  Private (Admin)
router.get('/report', [
  protect,
  authorize('admin'),
  check('startDate', 'Valid start date is required').optional().isISO8601(),
  check('endDate', 'Valid end date is required').optional().isISO8601()
], async (req, res, next) => {
  try {
    const { startDate, endDate, status } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('student', 'studentId fullName course')
      .populate('fee', 'course amount')
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;