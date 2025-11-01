/**
 * Feature Access Log Model
 * Tracks access attempts to premium features for analytics
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FeatureAccessLog = sequelize.define('FeatureAccessLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        featureName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        accessType: {
            type: DataTypes.ENUM('view', 'unlock_attempt', 'unlock_success', 'unlock_failed', 'usage'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('allowed', 'blocked', 'trial', 'expired'),
            allowNull: false
        },
        accessCodeUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: true,
            comment: 'IPv4 or IPv6 address'
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional access metadata'
        }
    }, {
        tableName: 'feature_access_logs',
        timestamps: true,
        underscored: true,
        updatedAt: false, // Only track creation time
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['feature_name']
            },
            {
                fields: ['access_type']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    FeatureAccessLog.associate = (models) => {
        FeatureAccessLog.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return FeatureAccessLog;
};
