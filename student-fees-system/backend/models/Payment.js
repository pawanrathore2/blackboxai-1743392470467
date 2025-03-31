const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: [true, 'Payment must belong to a student']
  },
  fee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Fee',
    required: [true, 'Payment must be for a fee']
  },
  amount: {
    type: Number,
    required: [true, 'Please add payment amount'],
    min: [0, 'Payment amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank transfer', 'online'],
    required: [true, 'Please specify payment method']
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster query performance
PaymentSchema.index({ student: 1, status: 1 });
PaymentSchema.index({ paymentDate: -1 });

// Virtual populate (reverse reference)
PaymentSchema.virtual('receipt', {
  ref: 'Receipt',
  localField: '_id',
  foreignField: 'payment',
  justOne: true
});

module.exports = mongoose.model('Payment', PaymentSchema);