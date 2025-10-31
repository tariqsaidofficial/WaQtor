/**
 * User Model
 * Represents system users (not WhatsApp accounts)
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'user', 'viewer'),
            defaultValue: 'user',
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        last_login_at: {
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
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    });

    // Instance methods
    User.prototype.validatePassword = async function(password) {
        return await bcrypt.compare(password, this.password_hash);
    };

    User.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        delete values.password_hash;
        return values;
    };

    // Class methods
    User.hashPassword = async function(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    };

    return User;
};
