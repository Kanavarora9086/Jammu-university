import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";
import { httpError } from "../utils/httpError.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return next(httpError(401, "Unauthorized"));

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.auth = payload;
    return next();
  } catch {
    return next(httpError(401, "Unauthorized"));
  }
}

export function requireRole(roles) {
  return (req, _res, next) => {
    if (!req.auth?.role) return next(httpError(401, "Unauthorized"));
    if (!roles.includes(req.auth.role)) return next(httpError(403, "Forbidden"));
    return next();
  };
}

