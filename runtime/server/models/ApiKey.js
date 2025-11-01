/**
 * API Key Model
 * Manages API keys with bcrypt encryption
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const ApiKey = sequelize.define('ApiKey', {
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Descriptive name for the API key'
        },
        keyHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'bcrypt hash of the API key'
        },
        prefix: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: 'First 8 characters of the key for identification'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        lastUsedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration date (null = never expires)'
        },
        permissions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'API key permissions and scopes'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata'
        }
    }, {
        tableName: 'api_keys',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['prefix']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['expires_at']
            }
        ]
    });

    // Hash the API key before saving
    ApiKey.hashKey = async (key) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(key, salt);
    };

    // Verify an API key
    ApiKey.verifyKey = async (key) => {
        const prefix = key.substring(0, 8);
        
        const apiKey = await ApiKey.findOne({
            where: {
                prefix,
                isActive: true
            }
        });

        if (!apiKey) {
            return { valid: false, reason: 'Invalid API key' };
        }

        // Check expiration
        if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
            return { valid: false, reason: 'API key expired' };
        }

        // Verify hash
        const isValid = await bcrypt.compare(key, apiKey.keyHash);
        
        if (!isValid) {
            return { valid: false, reason: 'Invalid API key' };
        }

        // Update last used
        await apiKey.update({ lastUsedAt: new Date() });

        return { valid: true, apiKey };
    };

    // Generate a new API key
    ApiKey.generateKey = () => {
        const crypto = require('crypto');
        return 'waq_' + crypto.randomBytes(32).toString('hex');
    };

    ApiKey.associate = (models) => {
        ApiKey.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return ApiKey;
};
