"""
Cache Service - Handles caching for visualizations and API responses
This service will improve performance by caching generated visualizations
"""

import json
import sqlite3
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from flask import current_app


class CacheService:
    """Service for caching API responses and visualizations"""
    
    def __init__(self, db_path: str = None):
        self.db_path = db_path or 'instance/tutorials.db'
        self.default_ttl = 3600  # 1 hour default TTL
    
    def get_cache_key(self, cache_type: str, parameters: Dict[str, Any]) -> str:
        """Generate a unique cache key for given parameters"""
        # Sort parameters to ensure consistent keys
        sorted_params = json.dumps(parameters, sort_keys=True)
        # Create hash of parameters
        param_hash = hashlib.md5(sorted_params.encode()).hexdigest()
        return f"{cache_type}:{param_hash}"
    
    def get(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """Get cached data by key"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT cache_data, cache_type, expires_at
                    FROM api_cache 
                    WHERE cache_key = ? AND expires_at > CURRENT_TIMESTAMP
                """, (cache_key,))
                
                result = cursor.fetchone()
                
                if result:
                    return {
                        "data": json.loads(result['cache_data']),
                        "type": result['cache_type'],
                        "expires_at": result['expires_at']
                    }
                
                return None
                
        except Exception as e:
            current_app.logger.error(f"Error getting cache: {e}")
            return None
    
    def set(self, cache_key: str, data: Dict[str, Any], cache_type: str, 
            ttl: int = None) -> bool:
        """Set cached data with TTL"""
        try:
            ttl = ttl or self.default_ttl
            expires_at = datetime.now() + timedelta(seconds=ttl)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Insert or replace cache entry
                cursor.execute("""
                    INSERT OR REPLACE INTO api_cache 
                    (cache_key, cache_data, cache_type, expires_at)
                    VALUES (?, ?, ?, ?)
                """, (cache_key, json.dumps(data), cache_type, expires_at.isoformat()))
                
                conn.commit()
                return True
                
        except Exception as e:
            current_app.logger.error(f"Error setting cache: {e}")
            return False
    
    def delete(self, cache_key: str) -> bool:
        """Delete cached data by key"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("DELETE FROM api_cache WHERE cache_key = ?", (cache_key,))
                conn.commit()
                
                return cursor.rowcount > 0
                
        except Exception as e:
            current_app.logger.error(f"Error deleting cache: {e}")
            return False
    
    def clear_expired(self) -> int:
        """Clear expired cache entries"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("DELETE FROM api_cache WHERE expires_at < CURRENT_TIMESTAMP")
                conn.commit()
                
                return cursor.rowcount
                
        except Exception as e:
            current_app.logger.error(f"Error clearing expired cache: {e}")
            return 0
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Total cache entries
                cursor.execute("SELECT COUNT(*) as total FROM api_cache")
                total = cursor.fetchone()['total']
                
                # Expired entries
                cursor.execute("""
                    SELECT COUNT(*) as expired 
                    FROM api_cache 
                    WHERE expires_at < CURRENT_TIMESTAMP
                """)
                expired = cursor.fetchone()['expired']
                
                # Cache by type
                cursor.execute("""
                    SELECT cache_type, COUNT(*) as count
                    FROM api_cache 
                    WHERE expires_at > CURRENT_TIMESTAMP
                    GROUP BY cache_type
                """)
                by_type = {row['cache_type']: row['count'] for row in cursor.fetchall()}
                
                return {
                    "total_entries": total,
                    "expired_entries": expired,
                    "active_entries": total - expired,
                    "by_type": by_type
                }
                
        except Exception as e:
            current_app.logger.error(f"Error getting cache stats: {e}")
            return {"error": "Failed to get cache stats"}
    
    def cache_visualization(self, visualization_type: str, parameters: Dict[str, Any], 
                          result: Dict[str, Any], ttl: int = 7200) -> bool:
        """Cache visualization result"""
        cache_key = self.get_cache_key(f"visualization:{visualization_type}", parameters)
        return self.set(cache_key, result, "visualization", ttl)
    
    def get_cached_visualization(self, visualization_type: str, 
                               parameters: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Get cached visualization result"""
        cache_key = self.get_cache_key(f"visualization:{visualization_type}", parameters)
        cached = self.get(cache_key)
        return cached['data'] if cached else None
    
    def cache_api_response(self, endpoint: str, parameters: Dict[str, Any], 
                          response: Dict[str, Any], ttl: int = 1800) -> bool:
        """Cache API response"""
        cache_key = self.get_cache_key(f"api:{endpoint}", parameters)
        return self.set(cache_key, response, "api_response", ttl)
    
    def get_cached_api_response(self, endpoint: str, 
                               parameters: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Get cached API response"""
        cache_key = self.get_cache_key(f"api:{endpoint}", parameters)
        cached = self.get(cache_key)
        return cached['data'] if cached else None
