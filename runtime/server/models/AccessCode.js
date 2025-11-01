/**
 * Access Code Model
 * Manages premium feature access codes with encryption
 */

const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
    const AccessCode = sequelize.define('AccessCode', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        featureName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Feature name this code unlocks'
        },
        codeHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'SHA-256 hash of the access code'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        maxUses: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum number of uses (null = unlimited)'
        },
        usedCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration date (null = never expires)'
        },
        subscriptionType: {
            type: DataTypes.ENUM('premium', 'enterprise', 'lifetime'),
            defaultValue: 'premium',
            allowNull: false,
            comment: 'Type of subscription this code grants'
        },
        durationDays: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Subscription duration in days (null = lifetime)'
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            comment: 'Admin user who created this code'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional code metadata'
        }
    }, {
        tableName: 'access_codes',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['code_hash', 'feature_name']
            },
            {
                fields: ['feature_name']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['expires_at']
            }
        ]
    });

    // Hash the access code before saving
    AccessCode.hashCode = (code) => {
        return crypto.createHash('sha256').update(code).digest('hex');
    };

    // Verify an access code
    AccessCode.verifyCode = async (code, featureName) => {
        const codeHash = AccessCode.hashCode(code);
        
        const accessCode = await AccessCode.findOne({
            where: {
                codeHash,
                featureName,
                isActive: true
            }
        });

        if (!accessCode) {
            return { valid: false, reason: 'Invalid code' };
        }

        // Check expiration
        if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
            return { valid: false, reason: 'Code expired' };
        }

        // Check usage limit
        if (accessCode.maxUses && accessCode.usedCount >= accessCode.maxUses) {
            return { valid: false, reason: 'Code usage limit reached' };
        }

        return { valid: true, accessCode };
    };

    AccessCode.associate = (models) => {
        AccessCode.belongsTo(models.User, {
            foreignKey: 'createdBy',
            as: 'creator'
        });
    };

    return AccessCode;
};
