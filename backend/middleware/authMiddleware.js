import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
}

export function requireUser(req, res, next) {
  if (req.auth?.role !== "user") return res.status(403).json({ message: "User access required" });
  next();
}
