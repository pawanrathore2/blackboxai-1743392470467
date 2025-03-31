const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes with JWT authentication
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Student ownership verification
exports.checkStudentOwnership = async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  
  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    return next(new ErrorResponse('No student profile found', 404));
  }

  // Check if student owns the resource
  if (req.params.studentId && req.params.studentId !== student.id) {
    return next(new ErrorResponse('Not authorized to access this student data', 403));
  }

  req.student = student;
  next();
};