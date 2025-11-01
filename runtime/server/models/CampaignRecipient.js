/**
 * Campaign Recipient Model
 * Junction table for Campaign and Recipient (many-to-many)
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CampaignRecipient = sequelize.define('CampaignRecipient', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        campaign_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'campaigns',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        recipient_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'recipients',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        message_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'WhatsApp message ID'
        },
        status: {
            type: DataTypes.ENUM('pending', 'sent', 'delivered', 'read', 'failed'),
            defaultValue: 'pending'
        },
        ack_code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: true
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
        tableName: 'campaign_recipients',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['campaign_id']
            },
            {
                fields: ['recipient_id']
            },
            {
                fields: ['status']
            },
            {
                unique: true,
                fields: ['campaign_id', 'recipient_id'],
                name: 'unique_campaign_recipient'
            }
        ]
    });

    return CampaignRecipient;
};
