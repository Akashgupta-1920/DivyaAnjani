const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Enhanced token generation function
const generateToken = (user, isAdmin = false) => {
  const payload = {
    userId: user._id,
    email: user.email,
    name: user.name,
    role: isAdmin ? 'admin' : 'user',
    iss: 'your-app-name', // Token issuer
    aud: 'your-app-client' // Token audience
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: isAdmin ? '8h' : '7d', // Shorter expiry for admin tokens
    algorithm: 'HS256'
  });
};

// Main authentication middleware
const authenticateToken = (req, res, next) => {
  // Check for Authorization header in multiple possible locations
  const authHeader = req.headers['authorization'] || 
                    req.headers['Authorization'] || 
                    req.cookies?.token;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "AUTH_REQUIRED",
      timestamp: new Date().toISOString()
    });
  }

  // Extract token from header
  let token;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  } else {
    token = authHeader;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
      code: "INVALID_TOKEN_FORMAT",
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Verify token with additional security checks
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      ignoreExpiration: false,
      issuer: 'your-app-name',
      audience: 'your-app-client'
    });

    // Token blacklist check could be added here
    // if (await isTokenRevoked(decoded.jti)) {
    //   return res.status(401).json({...});
    // }

    // Attach user to request with minimal necessary data
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      tokenIssuedAt: decoded.iat,
      tokenExpires: decoded.exp
    };

    // Set last activity timestamp
    req.user.lastActivity = Date.now();

    next();
  } catch (error) {
    console.error(`JWT Error: ${error.message}`, {
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString()
    });

    let status = 401;
    let message = "Invalid token";
    let code = "INVALID_TOKEN";

    if (error instanceof jwt.TokenExpiredError) {
      status = 403;
      message = "Session expired. Please log in again.";
      code = "TOKEN_EXPIRED";
    } else if (error instanceof jwt.JsonWebTokenError) {
      if (error.message.includes("signature")) {
        message = "Invalid token signature";
        code = "INVALID_SIGNATURE";
      } else if (error.message.includes("algorithm")) {
        message = "Unsupported token algorithm";
        code = "UNSUPPORTED_ALGORITHM";
      }
    }

    return res.status(status).json({
      success: false,
      message,
      code,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { debug: error.message })
    });
  }
};

// Admin middleware with enhanced checks
const admin = (req, res, next) => {
  // First verify standard authentication
  authenticateToken(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    // Additional admin-specific checks
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Administrator privileges required",
        code: "ADMIN_ACCESS_REQUIRED",
        requiredRole: "admin",
        currentRole: req.user.role
      });
    }

    // Optional: Verify admin secret for sensitive operations
    if (req.method !== 'GET' && req.headers['x-admin-secret'] !== ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Admin verification failed",
        code: "ADMIN_SECRET_REQUIRED"
      });
    }

    // Audit log for admin actions
    console.log(`Admin action by ${req.user.email}`, {
      action: req.method + ' ' + req.originalUrl,
      params: req.params,
      body: req.body,
      timestamp: new Date().toISOString(),
      ip: req.ip
    });

    next();
  });
};

// Optional: Role-based access control middleware
const requireRole = (role) => {
  return (req, res, next) => {
    authenticateToken(req, res, () => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          code: "AUTH_REQUIRED"
        });
      }

      if (req.user.role !== role && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: `Insufficient permissions. Required role: ${role}`,
          code: "ROLE_REQUIRED",
          requiredRole: role,
          currentRole: req.user.role
        });
      }

      next();
    });
  };
};

module.exports = {
  generateToken,
  authenticateToken,
  admin,
  requireRole
};