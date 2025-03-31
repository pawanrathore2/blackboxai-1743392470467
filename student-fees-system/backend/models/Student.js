const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated'],
    default: 'active'
  }
});

// Cascade delete payments when a student is removed
StudentSchema.pre('remove', async function(next) {
  await this.model('Payment').deleteMany({ student: this._id });
  next();
});

module.exports = mongoose.model('Student', StudentSchema);