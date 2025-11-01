/**
 * JWT Authentication Middleware
 * Verify JWT tokens and attach user to request
 * Supports refresh tokens stored in PostgreSQL
 */

const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

/**
 * Generate JWT token
 * @param {object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };

    return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * JWT Authentication Middleware
 * Checks for valid JWT token in Authorization header
 */
async function jwtAuth(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        // Get user from database
        const user = await User.findByPk(decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                error: 'User account is disabled'
            });
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;

        next();
    } catch (error) {
        logger.error('JWT Auth error:', error);
        res.status(401).json({
            success: false,
            error: 'Authentication failed'
        });
    }
}

/**
 * Optional JWT Auth
 * Attaches user if token is valid, but doesn't fail if no token
 */
async function optionalJwtAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyToken(token);
            
            if (decoded) {
                const user = await User.findByPk(decoded.id);
                if (user && user.is_active) {
                    req.user = user;
                    req.userId = user.id;
                }
            }
        }
        
        next();
    } catch (error) {
        // Silently fail for optional auth
        next();
    }
}

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Allowed roles
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
        }

        next();
    };
}

/**
 * Generate refresh token and store in database
 * @param {object} user - User object
 * @param {string} ipAddress - Client IP address
 * @param {string} userAgent - Client user agent
 * @returns {string} Refresh token
 */
async function generateRefreshToken(user, ipAddress, userAgent) {
    try {
        const token = await RefreshToken.createToken(user.id, ipAddress, userAgent);
        return token;
    } catch (error) {
        logger.error('Error generating refresh token:', error);
        throw error;
    }
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {object} New access token and refresh token
 */
async function refreshAccessToken(refreshToken) {
    try {
        const verification = await RefreshToken.verifyAndRotate(refreshToken);
        
        if (!verification.valid) {
            return { success: false, error: verification.reason };
        }

        // Get user
        const user = await User.findByPk(verification.userId);
        
        if (!user || !user.is_active) {
            return { success: false, error: 'User not found or inactive' };
        }

        // Generate new access token
        const accessToken = generateToken(user);

        return {
            success: true,
            accessToken,
            refreshToken: verification.newToken
        };
    } catch (error) {
        logger.error('Error refreshing token:', error);
        return { success: false, error: 'Failed to refresh token' };
    }
}

/**
 * Revoke all refresh tokens for a user (logout from all devices)
 * @param {string} userId - User ID
 */
async function revokeAllTokens(userId) {
    try {
        await RefreshToken.revokeAllForUser(userId);
    } catch (error) {
        logger.error('Error revoking tokens:', error);
        throw error;
    }
}

module.exports = {
    jwtAuth,
    optionalJwtAuth,
    requireRole,
    generateToken,
    verifyToken,
    generateRefreshToken,
    refreshAccessToken,
    revokeAllTokens
};
