const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Student = require('../models/Student');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { protect, authorize, checkStudentOwnership } = require('../middleware/authMiddleware');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET api/students
// @desc    Get all students (admin) or single student (student)
// @access  Private
router.get('/', [
  protect,
  authorize('admin')
], async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate('user', 'email role')
      .sort({ enrollmentDate: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/students/:id
// @desc    Get student by ID
// @access  Private (Admin or Student for own profile)
router.get('/:id', [
  protect,
  checkStudentOwnership
], async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'email role')
      .populate({
        path: 'payments',
        select: 'amount status paymentDate',
        populate: {
          path: 'fee',
          select: 'course amount dueDate'
        }
      });

    if (!student) {
      return next(new ErrorResponse(`Student not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT api/students/:id
// @desc    Update student profile
// @access  Private (Admin or Student for own profile)
router.put('/:id', [
  protect,
  checkStudentOwnership,
  check('fullName', 'Full name is required').optional().not().isEmpty(),
  check('contactNumber', 'Contact number is required').optional().not().isEmpty(),
  check('address', 'Address is required').optional().not().isEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation Error', 400, errors.array()));
  }

  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ErrorResponse(`Student not found with id ${req.params.id}`, 404));
    }

    // Update only provided fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        student[key] = req.body[key];
      }
    });

    await student.save();
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/students/:id/payments
// @desc    Get student's payment history
// @access  Private (Admin or Student for own payments)
router.get('/:id/payments', [
  protect,
  checkStudentOwnership
], async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.params.id })
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

// @route   GET api/students/:id/dues
// @desc    Get student's fee dues
// @access  Private (Admin or Student for own dues)
router.get('/:id/dues', [
  protect,
  checkStudentOwnership
], async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ErrorResponse(`Student not found with id ${req.params.id}`, 404));
    }

    const fees = await Fee.find({ course: student.course });
    const payments = await Payment.find({ 
      student: student._id,
      status: 'paid'
    });

    // Calculate dues
    const dues = fees.map(fee => {
      const paidAmount = payments
        .filter(p => p.fee.toString() === fee._id.toString())
        .reduce((sum, p) => sum + p.amount, 0);
      
      return {
        fee: fee,
        totalAmount: fee.amount,
        paidAmount: paidAmount,
        dueAmount: fee.amount - paidAmount,
        isOverdue: new Date() > new Date(fee.dueDate)
      };
    });

    res.status(200).json({
      success: true,
      data: dues
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;