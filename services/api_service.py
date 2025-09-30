"""
API Service - Main service for handling API requests
This service coordinates between different services and provides a unified API interface
"""

import json
from typing import Dict, Any, Optional
from flask import current_app, request
from .tutorial_service import TutorialService
from .visualization_service import VisualizationService
from .cache_service import CacheService


class ApiService:
    """Main API service that coordinates all other services"""
    
    def __init__(self):
        self.tutorial_service = TutorialService()
        self.visualization_service = VisualizationService()
        self.cache_service = CacheService()
    
    def handle_search_request(self, query: str, search_type: str = 'all') -> Dict[str, Any]:
        """Handle search API requests"""
        try:
            # Check cache first
            cache_params = {"query": query, "type": search_type}
            cached_result = self.cache_service.get_cached_api_response("search", cache_params)
            if cached_result:
                return cached_result
            
            # Perform search (this would integrate with your existing search logic)
            results = self._perform_search(query, search_type)
            
            # Cache the result
            self.cache_service.cache_api_response("search", cache_params, results)
            
            return results
            
        except Exception as e:
            current_app.logger.error(f"Error handling search request: {e}")
            return {"error": "Search failed", "details": str(e)}
    
    def handle_contact_form(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle contact form submission"""
        try:
            # Validate form data
            if not self._validate_contact_form(form_data):
                return {"error": "Invalid form data"}
            
            # Process contact form (send email, save to database, etc.)
            result = self._process_contact_form(form_data)
            
            return {
                "success": True,
                "message": "Message sent successfully",
                "result": result
            }
            
        except Exception as e:
            current_app.logger.error(f"Error handling contact form: {e}")
            return {"error": "Failed to send message", "details": str(e)}
    
    def handle_visualization_request(self, viz_type: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle visualization generation requests"""
        try:
            # Check cache first
            cached_result = self.cache_service.get_cached_visualization(viz_type, parameters)
            if cached_result:
                return cached_result
            
            # Generate visualization based on type
            if viz_type == 'clustering':
                result = self.visualization_service.generate_clustering_plot(
                    parameters.get('data', []), parameters
                )
            elif viz_type == 'matrix_vector':
                result = self.visualization_service.generate_matrix_visualization(
                    parameters.get('matrix', []), parameters.get('vector', [])
                )
            elif viz_type == 'decision_tree':
                result = self.visualization_service.generate_decision_tree_plot(
                    parameters.get('tree_data', {})
                )
            elif viz_type == 'dendrogram':
                result = self.visualization_service.generate_dendrogram(
                    parameters.get('data', []), parameters.get('method', 'average')
                )
            elif viz_type in ['missing_data', 'correlation_heatmap', 'distribution', 'outlier_boxplot']:
                result = self.visualization_service.generate_eda_charts(viz_type, parameters)
            else:
                return {"error": f"Unknown visualization type: {viz_type}"}
            
            # Cache the result if successful
            if result.get('success'):
                self.cache_service.cache_visualization(viz_type, parameters, result)
            
            return result
            
        except Exception as e:
            current_app.logger.error(f"Error handling visualization request: {e}")
            return {"error": "Visualization generation failed", "details": str(e)}
    
    def handle_tutorial_progress(self, user_id: str, tutorial_id: str, 
                               action: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Handle tutorial progress requests"""
        try:
            if action == 'get_progress':
                return self.tutorial_service.get_progress(user_id, tutorial_id)
            elif action == 'update_progress':
                chapter_id = data.get('chapter_id')
                progress = data.get('progress_percentage', 0)
                quiz_scores = data.get('quiz_scores')
                
                success = self.tutorial_service.update_progress(
                    user_id, tutorial_id, chapter_id, progress, quiz_scores
                )
                return {"success": success}
            elif action == 'submit_quiz':
                chapter_id = data.get('chapter_id')
                quiz_id = data.get('quiz_id')
                answers = data.get('answers', {})
                
                return self.tutorial_service.submit_quiz(
                    user_id, tutorial_id, chapter_id, quiz_id, answers
                )
            elif action == 'get_recommendations':
                return {"recommendations": self.tutorial_service.get_recommendations(user_id)}
            else:
                return {"error": f"Unknown action: {action}"}
                
        except Exception as e:
            current_app.logger.error(f"Error handling tutorial progress: {e}")
            return {"error": "Tutorial operation failed", "details": str(e)}
    
    def handle_demo_state(self, session_id: str, demo_type: str, 
                         action: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Handle demo state management"""
        try:
            if action == 'save_state':
                return self._save_demo_state(session_id, demo_type, data)
            elif action == 'load_state':
                return self._load_demo_state(session_id, demo_type)
            elif action == 'update_state':
                return self._update_demo_state(session_id, demo_type, data)
            else:
                return {"error": f"Unknown demo action: {action}"}
                
        except Exception as e:
            current_app.logger.error(f"Error handling demo state: {e}")
            return {"error": "Demo state operation failed", "details": str(e)}
    
    def _perform_search(self, query: str, search_type: str) -> Dict[str, Any]:
        """Perform search across tutorials, projects, and blog posts"""
        # This would integrate with your existing search logic
        # For now, return mock results
        
        results = {
            "query": query,
            "type": search_type,
            "tutorials": [],
            "projects": [],
            "blog_posts": []
        }
        
        # Mock search results - replace with actual search logic
        if 'clustering' in query.lower():
            results["tutorials"].append({
                "id": "clustering",
                "title": "Clustering Algorithms Tutorial",
                "description": "Learn about K-means, hierarchical clustering, and more",
                "category": "Machine Learning",
                "difficulty": "Intermediate"
            })
        
        if 'decision' in query.lower():
            results["tutorials"].append({
                "id": "decision-trees",
                "title": "Decision Trees Tutorial",
                "description": "Understanding decision trees and ensemble methods",
                "category": "Machine Learning",
                "difficulty": "Beginner"
            })
        
        return results
    
    def _validate_contact_form(self, form_data: Dict[str, Any]) -> bool:
        """Validate contact form data"""
        required_fields = ['name', 'email', 'message']
        
        for field in required_fields:
            if not form_data.get(field):
                return False
        
        # Basic email validation
        email = form_data.get('email', '')
        if '@' not in email or '.' not in email:
            return False
        
        return True
    
    def _process_contact_form(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process contact form submission"""
        # This would integrate with your existing contact form logic
        # For now, return mock processing result
        
        return {
            "submission_id": f"contact_{hash(form_data['email']) % 10000}",
            "processed_at": "2024-01-01T00:00:00Z",
            "status": "received"
        }
    
    def _save_demo_state(self, session_id: str, demo_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save demo state to database"""
        try:
            import sqlite3
            
            with sqlite3.connect(self.tutorial_service.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT OR REPLACE INTO demo_states 
                    (session_id, demo_type, parameters, results, updated_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, (session_id, demo_type, json.dumps(data.get('parameters', {})), 
                      json.dumps(data.get('results', {}))))
                
                conn.commit()
                
                return {"success": True, "message": "Demo state saved"}
                
        except Exception as e:
            current_app.logger.error(f"Error saving demo state: {e}")
            return {"error": "Failed to save demo state"}
    
    def _load_demo_state(self, session_id: str, demo_type: str) -> Dict[str, Any]:
        """Load demo state from database"""
        try:
            import sqlite3
            
            with sqlite3.connect(self.tutorial_service.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT parameters, results, created_at, updated_at
                    FROM demo_states 
                    WHERE session_id = ? AND demo_type = ?
                    ORDER BY updated_at DESC
                    LIMIT 1
                """, (session_id, demo_type))
                
                result = cursor.fetchone()
                
                if result:
                    return {
                        "success": True,
                        "parameters": json.loads(result['parameters']),
                        "results": json.loads(result['results']),
                        "created_at": result['created_at'],
                        "updated_at": result['updated_at']
                    }
                else:
                    return {"success": False, "message": "No demo state found"}
                    
        except Exception as e:
            current_app.logger.error(f"Error loading demo state: {e}")
            return {"error": "Failed to load demo state"}
    
    def _update_demo_state(self, session_id: str, demo_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update existing demo state"""
        # This is similar to save_demo_state but for updates
        return self._save_demo_state(session_id, demo_type, data)

