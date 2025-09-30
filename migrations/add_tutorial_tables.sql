-- Migration: Add tutorial progress and demo state tables
-- This migration adds new tables without affecting existing functionality

-- Tutorial progress tracking
CREATE TABLE IF NOT EXISTS tutorial_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(100) NOT NULL,
    tutorial_id VARCHAR(50) NOT NULL,
    chapter_id VARCHAR(50) NOT NULL,
    progress_percentage FLOAT DEFAULT 0.0,
    completed_at TIMESTAMP NULL,
    quiz_scores JSON,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tutorial_id, chapter_id)
);

-- Demo states for interactive tutorials
CREATE TABLE IF NOT EXISTS demo_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(100) NOT NULL,
    demo_type VARCHAR(50) NOT NULL,
    tutorial_id VARCHAR(50),
    chapter_id VARCHAR(50),
    parameters JSON,
    results JSON,
    visualization_data TEXT, -- Base64 encoded or JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(100) NOT NULL,
    theme VARCHAR(20) DEFAULT 'light',
    tutorial_preferences JSON,
    notification_settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- API cache for visualizations and responses
CREATE TABLE IF NOT EXISTS api_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key VARCHAR(255) NOT NULL UNIQUE,
    cache_data TEXT NOT NULL, -- JSON or base64 encoded data
    cache_type VARCHAR(50) NOT NULL, -- 'visualization', 'api_response', 'demo_state'
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tutorial_progress_user_tutorial ON tutorial_progress(user_id, tutorial_id);
CREATE INDEX IF NOT EXISTS idx_demo_states_session ON demo_states(session_id);
CREATE INDEX IF NOT EXISTS idx_demo_states_type ON demo_states(demo_type);
CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires ON api_cache(expires_at);

-- Clean up expired cache entries (can be run periodically)
-- DELETE FROM api_cache WHERE expires_at < CURRENT_TIMESTAMP;

