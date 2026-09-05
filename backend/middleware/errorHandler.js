export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.code === 11000) {
    if (error.keyPattern?.email) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    return res.status(409).json({ message: "A bug with this ID already exists" });
  }

  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
}
