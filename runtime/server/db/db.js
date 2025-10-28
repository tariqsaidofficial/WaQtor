/**
 * Database Module
 * SQLite wrapper for Waqtor
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const DB_PATH = path.join(__dirname, 'waqtor.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

class Database {
    constructor() {
        this.db = null;
    }

    /**
     * Initialize database
     */
    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    logger.error('Error opening database:', err);
                    reject(err);
                    return;
                }
                
                logger.info('Database connected');
                this.createTables()
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    /**
     * Create tables from schema
     */
    async createTables() {
        return new Promise((resolve, reject) => {
            const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
            
            this.db.exec(schema, (err) => {
                if (err) {
                    logger.error('Error creating tables:', err);
                    reject(err);
                    return;
                }
                
                logger.info('Database tables ready');
                resolve();
            });
        });
    }

    /**
     * Run a query
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    /**
     * Get a single row
     */
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    /**
     * Get all rows
     */
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    /**
     * Create a campaign
     */
    async createCampaign(data) {
        const result = await this.run(
            `INSERT INTO campaigns (name, message, recipients, scheduled_at, status)
             VALUES (?, ?, ?, ?, ?)`,
            [data.name, data.message, data.recipients, data.scheduledAt, data.status]
        );

        return this.get('SELECT * FROM campaigns WHERE id = ?', [result.id]);
    }

    /**
     * Get all campaigns
     */
    async getAllCampaigns() {
        return this.all('SELECT * FROM campaigns ORDER BY created_at DESC');
    }

    /**
     * Get campaign by ID
     */
    async getCampaignById(id) {
        return this.get('SELECT * FROM campaigns WHERE id = ?', [id]);
    }

    /**
     * Update campaign status
     */
    async updateCampaignStatus(id, status) {
        const completedAt = status === 'completed' ? new Date().toISOString() : null;
        
        return this.run(
            `UPDATE campaigns 
             SET status = ?, updated_at = CURRENT_TIMESTAMP, completed_at = ?
             WHERE id = ?`,
            [status, completedAt, id]
        );
    }

    /**
     * Delete campaign
     */
    async deleteCampaign(id) {
        return this.run('DELETE FROM campaigns WHERE id = ?', [id]);
    }

    /**
     * Log a message
     */
    async logMessage(data) {
        return this.run(
            `INSERT INTO message_logs (phone, message, message_type, status, message_id)
             VALUES (?, ?, ?, ?, ?)`,
            [data.phone, data.message, data.messageType, data.status, data.messageId]
        );
    }

    /**
     * Verify API key
     */
    async verifyApiKey(key) {
        const apiKey = await this.get(
            'SELECT * FROM api_keys WHERE key = ? AND is_active = 1',
            [key]
        );

        if (apiKey) {
            // Update last used timestamp
            await this.run(
                'UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?',
                [apiKey.id]
            );
        }

        return apiKey;
    }

    /**
     * Close database connection
     */
    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else {
                    logger.info('Database connection closed');
                    resolve();
                }
            });
        });
    }
}

// Create singleton instance
const db = new Database();

// Initialize database
db.initialize().catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
});

module.exports = db;
