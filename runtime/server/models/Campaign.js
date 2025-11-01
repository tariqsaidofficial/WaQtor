/**
 * Campaign Model
 * Represents message campaigns
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Campaign = sequelize.define('Campaign', {
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        message_template: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('draft', 'scheduled', 'running', 'completed', 'paused', 'failed'),
            defaultValue: 'draft'
        },
        total_recipients: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sent_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        delivered_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        read_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        failed_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        has_media: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        media_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        delay_seconds: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
            comment: 'Delay between messages in seconds'
        },
        scheduled_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        started_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        completed_at: {
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
        tableName: 'campaigns',
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
                fields: ['scheduled_at']
            }
        ]
    });

    return Campaign;
};
