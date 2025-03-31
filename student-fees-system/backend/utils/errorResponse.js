class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish operational errors from programming errors
    Error.captureStackTrace(this, this.constructor);
  }

  // Format validation errors from express-validator
  static formatValidationErrors(errors) {
    return errors.array().map(err => ({
      msg: err.msg,
      param: err.param,
      location: err.location
    }));
  }

  // Standard error response format
  static sendError(res, statusCode, message, errorType = 'OperationalError') {
    return res.status(statusCode).json({
      success: false,
      error: {
        type: errorType,
        message: message
      }
    });
  }
}

module.exports = ErrorResponse;