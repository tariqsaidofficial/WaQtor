/**
 * Recipient Model
 * Represents contact list / recipients
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Recipient = sequelize.define('Recipient', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        company: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
            comment: 'Tags for categorization'
        },
        custom_fields: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Custom fields for personalization'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'recipients',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['phone']
            },
            {
                unique: true,
                fields: ['user_id', 'phone'],
                name: 'unique_user_phone'
            }
        ]
    });

    return Recipient;
};
