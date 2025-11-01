/**
 * Feature Subscription Model
 * Manages premium feature subscriptions and access codes
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FeatureSubscription = sequelize.define('FeatureSubscription', {
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
        featureName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Feature name (e.g., Campaigns, Reports, Interactive, SmartBot, Webhooks)'
        },
        status: {
            type: DataTypes.ENUM('active', 'expired', 'trial', 'suspended'),
            defaultValue: 'trial',
            allowNull: false
        },
        subscriptionType: {
            type: DataTypes.ENUM('free', 'premium', 'enterprise', 'lifetime'),
            defaultValue: 'free',
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Null for lifetime subscriptions'
        },
        trialEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Trial period end date'
        },
        usageLimit: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Usage limit for free tier (null = unlimited)'
        },
        usageCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Current usage count'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional subscription metadata'
        }
    }, {
        tableName: 'feature_subscriptions',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'feature_name']
            },
            {
                fields: ['status']
            },
            {
                fields: ['end_date']
            }
        ]
    });

    FeatureSubscription.associate = (models) => {
        FeatureSubscription.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return FeatureSubscription;
};
