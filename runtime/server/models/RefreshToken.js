/**
 * Refresh Token Model
 * Manages JWT refresh tokens for secure token renewal
 */

const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Hashed refresh token'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isRevoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        replacedByToken: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Token that replaced this one (for rotation)'
        }
    }, {
        tableName: 'refresh_tokens',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['token']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['expires_at']
            },
            {
                fields: ['is_revoked']
            }
        ]
    });

    // Generate a new refresh token
    RefreshToken.generateToken = () => {
        return crypto.randomBytes(64).toString('hex');
    };

    // Hash token before saving
    RefreshToken.hashToken = (token) => {
        return crypto.createHash('sha256').update(token).digest('hex');
    };

    // Create a new refresh token
    RefreshToken.createToken = async (userId, ipAddress, userAgent) => {
        const token = RefreshToken.generateToken();
        const hashedToken = RefreshToken.hashToken(token);
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        await RefreshToken.create({
            userId,
            token: hashedToken,
            expiresAt,
            ipAddress,
            userAgent
        });

        return token; // Return unhashed token to client
    };

    // Verify and rotate refresh token
    RefreshToken.verifyAndRotate = async (token) => {
        const hashedToken = RefreshToken.hashToken(token);
        
        const refreshToken = await RefreshToken.findOne({
            where: {
                token: hashedToken,
                isRevoked: false
            }
        });

        if (!refreshToken) {
            return { valid: false, reason: 'Invalid refresh token' };
        }

        // Check expiration
        if (new Date() > refreshToken.expiresAt) {
            return { valid: false, reason: 'Refresh token expired' };
        }

        // Generate new token (rotation)
        const newToken = RefreshToken.generateToken();
        const newHashedToken = RefreshToken.hashToken(newToken);

        // Mark old token as replaced
        await refreshToken.update({
            isRevoked: true,
            replacedByToken: newHashedToken
        });

        // Create new refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await RefreshToken.create({
            userId: refreshToken.userId,
            token: newHashedToken,
            expiresAt,
            ipAddress: refreshToken.ipAddress,
            userAgent: refreshToken.userAgent
        });

        return { 
            valid: true, 
            userId: refreshToken.userId,
            newToken 
        };
    };

    // Revoke all tokens for a user
    RefreshToken.revokeAllForUser = async (userId) => {
        await RefreshToken.update(
            { isRevoked: true },
            { where: { userId, isRevoked: false } }
        );
    };

    RefreshToken.associate = (models) => {
        RefreshToken.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return RefreshToken;
};
