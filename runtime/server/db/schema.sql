-- Waqtor Database Schema
-- SQLite Database for Campaign Management

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    recipients TEXT NOT NULL, -- JSON array of phone numbers
    scheduled_at DATETIME,
    status TEXT DEFAULT 'pending', -- pending, running, completed, failed, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
);

-- Campaign Messages Table (tracking individual messages)
CREATE TABLE IF NOT EXISTS campaign_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    phone TEXT NOT NULL,
    message_id TEXT, -- WhatsApp message ID
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    error_message TEXT,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Message Logs Table
CREATE TABLE IF NOT EXISTS message_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text', -- text, media, document
    status TEXT DEFAULT 'sent',
    message_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API Keys Table (for authentication)
CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_campaign ON campaign_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_status ON campaign_messages(status);
CREATE INDEX IF NOT EXISTS idx_message_logs_phone ON message_logs(phone);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Insert default API key (change this in production!)
INSERT OR IGNORE INTO api_keys (key, name) 
VALUES ('waqtor_default_key_change_me', 'Default API Key');
