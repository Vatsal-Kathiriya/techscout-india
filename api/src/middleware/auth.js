import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }
    req.admin = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Your admin session has expired." });
  }
}
