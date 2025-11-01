/**
 * Group Model
 * Represents contact groups/labels for organizing recipients
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Group = sequelize.define('Group', {
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(7),
            defaultValue: '#3B82F6',
            comment: 'Hex color code for UI'
        },
        icon: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Icon name for UI'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        tableName: 'groups',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id']
            },
            {
                unique: true,
                fields: ['user_id', 'name'],
                name: 'unique_user_group_name'
            }
        ]
    });

    return Group;
};
