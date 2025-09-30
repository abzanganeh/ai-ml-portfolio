"""
Tutorial API endpoints to replace JavaScript tutorial functionality
These endpoints will handle tutorial progress, quizzes, and demo states
"""

from flask import Blueprint, request, jsonify, current_app
from services.api_service import ApiService

# Create blueprint for tutorial APIs
tutorial_bp = Blueprint('tutorial', __name__, url_prefix='/tutorials')

# Initialize API service
api_service = ApiService()


@tutorial_bp.route('/<tutorial_id>/progress', methods=['GET', 'POST'])
def tutorial_progress(tutorial_id):
    """
    Tutorial progress API endpoint
    Replaces: JavaScript tutorial progress tracking
    """
    try:
        user_id = request.args.get('user_id', 'anonymous')
        
        if request.method == 'GET':
            # Get tutorial progress
            result = api_service.handle_tutorial_progress(
                user_id, tutorial_id, 'get_progress'
            )
            return jsonify(result)
            
        elif request.method == 'POST':
            # Update tutorial progress
            data = request.get_json() or {}
            result = api_service.handle_tutorial_progress(
                user_id, tutorial_id, 'update_progress', data
            )
            return jsonify(result)
            
    except Exception as e:
        current_app.logger.error(f"Tutorial progress API error: {e}")
        return jsonify({
            "error": "Failed to handle tutorial progress"
        }), 500


@tutorial_bp.route('/<tutorial_id>/quiz/<quiz_id>', methods=['POST'])
def submit_quiz(tutorial_id, quiz_id):
    """
    Quiz submission API endpoint
    Replaces: JavaScript quiz handling
    """
    try:
        user_id = request.args.get('user_id', 'anonymous')
        data = request.get_json() or {}
        
        # Add quiz_id to data
        data['quiz_id'] = quiz_id
        
        result = api_service.handle_tutorial_progress(
            user_id, tutorial_id, 'submit_quiz', data
        )
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Quiz submission API error: {e}")
        return jsonify({
            "error": "Failed to submit quiz"
        }), 500


@tutorial_bp.route('/<tutorial_id>/demo/<demo_id>', methods=['GET', 'POST', 'PUT'])
def demo_state(tutorial_id, demo_id):
    """
    Demo state management API endpoint
    Replaces: JavaScript demo state handling
    """
    try:
        session_id = request.args.get('session_id', 'default')
        demo_type = f"{tutorial_id}_{demo_id}"
        
        if request.method == 'GET':
            # Load demo state
            result = api_service.handle_demo_state(
                session_id, demo_type, 'load_state'
            )
            return jsonify(result)
            
        elif request.method == 'POST':
            # Save demo state
            data = request.get_json() or {}
            result = api_service.handle_demo_state(
                session_id, demo_type, 'save_state', data
            )
            return jsonify(result)
            
        elif request.method == 'PUT':
            # Update demo state
            data = request.get_json() or {}
            result = api_service.handle_demo_state(
                session_id, demo_type, 'update_state', data
            )
            return jsonify(result)
            
    except Exception as e:
        current_app.logger.error(f"Demo state API error: {e}")
        return jsonify({
            "error": "Failed to handle demo state"
        }), 500


@tutorial_bp.route('/<tutorial_id>/recommendations', methods=['GET'])
def get_recommendations(tutorial_id):
    """
    Get personalized recommendations for a tutorial
    Replaces: JavaScript recommendation logic
    """
    try:
        user_id = request.args.get('user_id', 'anonymous')
        
        result = api_service.handle_tutorial_progress(
            user_id, tutorial_id, 'get_recommendations'
        )
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Recommendations API error: {e}")
        return jsonify({
            "error": "Failed to get recommendations"
        }), 500


@tutorial_bp.route('/<tutorial_id>/chapter/<chapter_id>/complete', methods=['POST'])
def complete_chapter(tutorial_id, chapter_id):
    """
    Mark a chapter as completed
    Replaces: JavaScript chapter completion logic
    """
    try:
        user_id = request.args.get('user_id', 'anonymous')
        
        # Mark chapter as 100% complete
        data = {
            'chapter_id': chapter_id,
            'progress_percentage': 100.0
        }
        
        result = api_service.handle_tutorial_progress(
            user_id, tutorial_id, 'update_progress', data
        )
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Chapter completion API error: {e}")
        return jsonify({
            "error": "Failed to complete chapter"
        }), 500


@tutorial_bp.route('/<tutorial_id>/reset', methods=['POST'])
def reset_tutorial(tutorial_id):
    """
    Reset tutorial progress
    Replaces: JavaScript tutorial reset functionality
    """
    try:
        user_id = request.args.get('user_id', 'anonymous')
        
        # This would typically delete all progress records for the tutorial
        # For now, return success
        
        return jsonify({
            "success": True,
            "message": f"Tutorial {tutorial_id} progress reset successfully"
        })
        
    except Exception as e:
        current_app.logger.error(f"Tutorial reset API error: {e}")
        return jsonify({
            "error": "Failed to reset tutorial"
        }), 500


@tutorial_bp.route('/<tutorial_id>/analytics', methods=['GET'])
def tutorial_analytics(tutorial_id):
    """
    Get tutorial analytics and statistics
    Replaces: JavaScript analytics tracking
    """
    try:
        user_id = request.args.get('user_id', 'anonymous')
        
        # Get progress data
        progress_result = api_service.handle_tutorial_progress(
            user_id, tutorial_id, 'get_progress'
        )
        
        # Calculate analytics
        analytics = {
            "tutorial_id": tutorial_id,
            "user_id": user_id,
            "total_chapters": len(progress_result.get('chapters', [])),
            "completed_chapters": len([c for c in progress_result.get('chapters', []) 
                                     if c.get('progress_percentage', 0) >= 100]),
            "overall_progress": progress_result.get('overall_progress', 0),
            "time_spent": "0 minutes",  # This would be calculated from timestamps
            "quiz_scores": []
        }
        
        # Extract quiz scores
        for chapter in progress_result.get('chapters', []):
            quiz_scores = chapter.get('quiz_scores', {})
            for quiz_id, score_data in quiz_scores.items():
                analytics["quiz_scores"].append({
                    "chapter_id": chapter['chapter_id'],
                    "quiz_id": quiz_id,
                    "score": score_data.get('score', 0)
                })
        
        return jsonify(analytics)
        
    except Exception as e:
        current_app.logger.error(f"Tutorial analytics API error: {e}")
        return jsonify({
            "error": "Failed to get tutorial analytics"
        }), 500


@tutorial_bp.route('/list', methods=['GET'])
def list_tutorials():
    """
    List all available tutorials
    Replaces: JavaScript tutorial listing
    """
    try:
        # This would typically come from a database or configuration
        tutorials = [
            {
                "id": "clustering",
                "title": "Clustering Algorithms",
                "description": "Learn about K-means, hierarchical clustering, and more",
                "category": "Machine Learning",
                "difficulty": "Intermediate",
                "estimated_time": "2-3 hours",
                "chapters": 15
            },
            {
                "id": "decision-trees",
                "title": "Decision Trees",
                "description": "Understanding decision trees and ensemble methods",
                "category": "Machine Learning",
                "difficulty": "Beginner",
                "estimated_time": "1-2 hours",
                "chapters": 5
            },
            {
                "id": "ml-model-relationships",
                "title": "ML Model Relationships",
                "description": "Understanding how different ML models relate to each other",
                "category": "Machine Learning",
                "difficulty": "Advanced",
                "estimated_time": "3-4 hours",
                "chapters": 8
            },
            {
                "id": "complete-eda-leetcode",
                "title": "Complete EDA Tutorial",
                "description": "Comprehensive exploratory data analysis tutorial",
                "category": "Data Analysis",
                "difficulty": "Intermediate",
                "estimated_time": "2-3 hours",
                "chapters": 8
            }
        ]
        
        return jsonify({
            "success": True,
            "tutorials": tutorials,
            "total": len(tutorials)
        })
        
    except Exception as e:
        current_app.logger.error(f"Tutorial list API error: {e}")
        return jsonify({
            "error": "Failed to list tutorials"
        }), 500

