/**
 * Database Configuration
 * PostgreSQL connection using Sequelize ORM
 */

const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Database configuration
const config = {
    development: {
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'waqtor_dev',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        logging: (msg) => logger.debug(msg),
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    production: {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: false,
        pool: {
            max: 20,
            min: 5,
            acquire: 60000,
            idle: 10000
        },
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        }
    }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
        dialectOptions: dbConfig.dialectOptions || {},
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

// Test connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        logger.info('✅ Database connection established successfully');
        logger.info(`📊 Connected to: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
        return true;
    } catch (error) {
        logger.error('❌ Unable to connect to database:', error);
        return false;
    }
}

// Sync database (create tables)
async function syncDatabase(force = false) {
    try {
        await sequelize.sync({ force, alter: !force });
        logger.info(`✅ Database synchronized ${force ? '(force)' : '(alter)'}`);
        return true;
    } catch (error) {
        logger.error('❌ Database sync failed:', error);
        return false;
    }
}

// Close connection
async function closeConnection() {
    try {
        await sequelize.close();
        logger.info('Database connection closed');
    } catch (error) {
        logger.error('Error closing database connection:', error);
    }
}

module.exports = {
    sequelize,
    Sequelize,
    testConnection,
    syncDatabase,
    closeConnection
};
