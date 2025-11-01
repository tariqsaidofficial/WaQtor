/**
 * Recipient Group Model
 * Junction table for Recipient and Group (many-to-many)
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RecipientGroup = sequelize.define('RecipientGroup', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        group_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'groups',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'recipient_groups',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                fields: ['recipient_id']
            },
            {
                fields: ['group_id']
            },
            {
                unique: true,
                fields: ['recipient_id', 'group_id'],
                name: 'unique_recipient_group'
            }
        ]
    });

    return RecipientGroup;
};
