/**
 * WhatsApp Session Model
 * Represents WhatsApp accounts/sessions
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WhatsAppSession = sequelize.define('WhatsAppSession', {
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
        client_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Friendly name for the session (e.g., "Main Account", "Support Line")'
        },
        phone_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_ready: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        qr_code: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        session_data: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Store session metadata (platform, pushname, etc.)'
        },
        last_active_at: {
            type: DataTypes.DATE,
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
        tableName: 'whatsapp_sessions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id']
            },
            {
                unique: true,
                fields: ['client_id']
            },
            {
                fields: ['is_active']
            }
        ]
    });

    return WhatsAppSession;
};
