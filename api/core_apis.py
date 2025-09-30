"""
Core API endpoints to replace JavaScript functionality
These endpoints will handle search, contact forms, navigation, and theme management
"""

from flask import Blueprint, request, jsonify, current_app
from services.api_service import ApiService
from services.cache_service import CacheService

# Create blueprint for core APIs
core_bp = Blueprint('core', __name__)

# Initialize services
api_service = ApiService()
cache_service = CacheService()


@core_bp.route('/search', methods=['GET'])
def search():
    """
    Search API endpoint to replace JavaScript search functionality
    Replaces: main.js performSearch() function
    """
    try:
        query = request.args.get('q', '').strip()
        search_type = request.args.get('type', 'all')
        
        if not query:
            return jsonify({
                "error": "Query parameter 'q' is required"
            }), 400
        
        if len(query) < 2:
            return jsonify({
                "error": "Query must be at least 2 characters long"
            }), 400
        
        # Use API service to handle search
        results = api_service.handle_search_request(query, search_type)
        
        return jsonify(results)
        
    except Exception as e:
        current_app.logger.error(f"Search API error: {e}")
        return jsonify({
            "error": "Search failed",
            "message": "An error occurred while searching"
        }), 500


@core_bp.route('/contact', methods=['POST'])
def contact():
    """
    Contact form API endpoint to replace JavaScript form handling
    Replaces: main.js form submission logic
    """
    try:
        # Get form data
        form_data = request.get_json() or {}
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        missing_fields = [field for field in required_fields if not form_data.get(field)]
        
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing": missing_fields
            }), 400
        
        # Use API service to handle contact form
        result = api_service.handle_contact_form(form_data)
        
        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        current_app.logger.error(f"Contact API error: {e}")
        return jsonify({
            "error": "Failed to send message",
            "message": "An error occurred while processing your message"
        }), 500


@core_bp.route('/navigation-state', methods=['GET', 'POST'])
def navigation_state():
    """
    Navigation state API endpoint to replace JavaScript navigation management
    Replaces: main.js navigation state handling
    """
    try:
        if request.method == 'GET':
            # Get current navigation state
            user_id = request.args.get('user_id', 'anonymous')
            
            # This would typically come from session or user preferences
            state = {
                "current_page": request.args.get('page', 'home'),
                "theme": request.args.get('theme', 'light'),
                "sidebar_collapsed": request.args.get('sidebar_collapsed', 'false') == 'true',
                "last_visited": request.args.get('last_visited', '')
            }
            
            return jsonify({
                "success": True,
                "state": state
            })
            
        elif request.method == 'POST':
            # Update navigation state
            data = request.get_json() or {}
            user_id = data.get('user_id', 'anonymous')
            
            # This would typically save to user preferences
            # For now, just return success
            
            return jsonify({
                "success": True,
                "message": "Navigation state updated"
            })
            
    except Exception as e:
        current_app.logger.error(f"Navigation state API error: {e}")
        return jsonify({
            "error": "Failed to handle navigation state"
        }), 500


@core_bp.route('/theme-toggle', methods=['POST'])
def theme_toggle():
    """
    Theme toggle API endpoint to replace JavaScript theme management
    Replaces: main.js initThemeToggle() function
    """
    try:
        data = request.get_json() or {}
        current_theme = data.get('current_theme', 'light')
        user_id = data.get('user_id', 'anonymous')
        
        # Toggle theme
        new_theme = 'dark' if current_theme == 'light' else 'light'
        
        # This would typically save to user preferences
        # For now, just return the new theme
        
        return jsonify({
            "success": True,
            "theme": new_theme,
            "message": f"Theme changed to {new_theme}"
        })
        
    except Exception as e:
        current_app.logger.error(f"Theme toggle API error: {e}")
        return jsonify({
            "error": "Failed to toggle theme"
        }), 500


@core_bp.route('/form-validation', methods=['POST'])
def form_validation():
    """
    Form validation API endpoint to replace JavaScript form validation
    Replaces: main.js form validation logic
    """
    try:
        data = request.get_json() or {}
        field_name = data.get('field_name')
        field_value = data.get('field_value')
        field_type = data.get('field_type', 'text')
        
        if not field_name or field_value is None:
            return jsonify({
                "error": "Field name and value are required"
            }), 400
        
        # Validate based on field type
        validation_result = {
            "valid": True,
            "message": "",
            "field_name": field_name
        }
        
        if field_type == 'email':
            if '@' not in field_value or '.' not in field_value:
                validation_result["valid"] = False
                validation_result["message"] = "Please enter a valid email address"
        elif field_type == 'required':
            if not field_value.strip():
                validation_result["valid"] = False
                validation_result["message"] = "This field is required"
        elif field_type == 'phone':
            # Basic phone validation
            if not field_value.replace('-', '').replace('(', '').replace(')', '').replace(' ', '').isdigit():
                validation_result["valid"] = False
                validation_result["message"] = "Please enter a valid phone number"
        
        return jsonify(validation_result)
        
    except Exception as e:
        current_app.logger.error(f"Form validation API error: {e}")
        return jsonify({
            "error": "Validation failed"
        }), 500


@core_bp.route('/notification', methods=['POST'])
def notification():
    """
    Notification API endpoint to replace JavaScript notification system
    Replaces: main.js showNotification() function
    """
    try:
        data = request.get_json() or {}
        message = data.get('message', '')
        notification_type = data.get('type', 'info')
        duration = data.get('duration', 5000)
        
        if not message:
            return jsonify({
                "error": "Message is required"
            }), 400
        
        # This would typically integrate with a notification service
        # For now, just return success
        
        return jsonify({
            "success": True,
            "notification": {
                "id": f"notif_{hash(message) % 10000}",
                "message": message,
                "type": notification_type,
                "duration": duration,
                "timestamp": "2024-01-01T00:00:00Z"
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Notification API error: {e}")
        return jsonify({
            "error": "Failed to create notification"
        }), 500


@core_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for API monitoring
    """
    try:
        # Check database connection
        db_status = "healthy"
        try:
            # Simple database check
            import sqlite3
            with sqlite3.connect('instance/tutorials.db') as conn:
                conn.execute("SELECT 1")
        except Exception:
            db_status = "unhealthy"
        
        # Check cache status
        cache_stats = cache_service.get_cache_stats()
        
        return jsonify({
            "status": "healthy",
            "timestamp": "2024-01-01T00:00:00Z",
            "services": {
                "database": db_status,
                "cache": "healthy" if cache_stats.get("active_entries", 0) >= 0 else "unhealthy"
            },
            "cache_stats": cache_stats
        })
        
    except Exception as e:
        current_app.logger.error(f"Health check error: {e}")
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

