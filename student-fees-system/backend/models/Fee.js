const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  course: {
    type: String,
    required: [true, 'Please specify the course name'],
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add the fee amount'],
    min: [0, 'Fee amount cannot be negative']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent deletion if fees have payments
FeeSchema.pre('remove', async function(next) {
  const payments = await this.model('Payment').find({ fee: this._id });
  if (payments.length > 0) {
    next(new Error('Cannot delete fee with existing payments'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Fee', FeeSchema);