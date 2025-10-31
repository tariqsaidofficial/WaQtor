/**
 * Message Model
 * Represents sent/received WhatsApp messages
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        session_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'whatsapp_sessions',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        message_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'WhatsApp message ID'
        },
        to_phone: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        from_phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'sent', 'delivered', 'read', 'failed'),
            defaultValue: 'pending'
        },
        ack_code: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '-1=failed, 0=pending, 1=sent, 2=delivered, 3=read, 4=played'
        },
        direction: {
            type: DataTypes.ENUM('outgoing', 'incoming'),
            defaultValue: 'outgoing'
        },
        has_media: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        media_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Custom fields, variables, etc.'
        },
        sent_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        delivered_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        read_at: {
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
        tableName: 'messages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['session_id']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['status']
            },
            {
                fields: ['to_phone']
            },
            {
                fields: ['sent_at']
            }
        ]
    });

    return Message;
};
