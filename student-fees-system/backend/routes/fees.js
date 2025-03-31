const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Fee = require('../models/Fee');
const { protect, authorize } = require('../middleware/authMiddleware');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET api/fees
// @desc    Get all fees
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST api/fees
// @desc    Create new fee
// @access  Private (Admin)
router.post('/', [
  protect,
  authorize('admin'),
  check('course', 'Course name is required').not().isEmpty(),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
  check('dueDate', 'Valid due date is required').isISO8601()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation Error', 400, errors.array()));
  }

  try {
    const fee = await Fee.create(req.body);
    res.status(201).json({
      success: true,
      data: fee
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/fees/:id
// @desc    Get single fee
// @access  Private (Admin)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return next(new ErrorResponse(`Fee not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT api/fees/:id
// @desc    Update fee
// @access  Private (Admin)
router.put('/:id', [
  protect,
  authorize('admin'),
  check('amount', 'Amount must be a positive number').optional().isFloat({ min: 0 }),
  check('dueDate', 'Valid due date is required').optional().isISO8601()
], async (req, res, next) => {
  try {
    let fee = await Fee.findById(req.params.id);
    if (!fee) {
      return next(new ErrorResponse(`Fee not found with id ${req.params.id}`, 404));
    }

    // Update only provided fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        fee[key] = req.body[key];
      }
    });

    await fee.save();
    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE api/fees/:id
// @desc    Delete fee
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return next(new ErrorResponse(`Fee not found with id ${req.params.id}`, 404));
    }

    await fee.remove();
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;