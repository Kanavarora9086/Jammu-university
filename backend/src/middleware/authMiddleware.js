import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { env } from "../utils/env.js"; // Import env for consistent secret access

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

      // Attach the user object to the request
      if (decoded.role === "admin") {
        // Ensure we check 'sub' as defined in auth.routes.js payload
        req.user = await Admin.findById(decoded.sub || decoded.id).select("-passwordHash");
      } else {
        req.user = await User.findById(decoded.sub || decoded.id).select("-passwordHash");
      }

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};