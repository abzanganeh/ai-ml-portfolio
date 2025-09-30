"""
Tutorial Service - Handles tutorial progress, quizzes, and recommendations
This service will replace JavaScript tutorial functionality with Python APIs
"""

import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional, Any
from flask import current_app


class TutorialService:
    """Service for managing tutorial progress and interactions"""
    
    def __init__(self, db_path: str = None):
        self.db_path = db_path or 'instance/tutorials.db'
    
    def get_progress(self, user_id: str, tutorial_id: str) -> Dict[str, Any]:
        """Get user's progress for a specific tutorial"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT chapter_id, progress_percentage, completed_at, quiz_scores
                    FROM tutorial_progress 
                    WHERE user_id = ? AND tutorial_id = ?
                    ORDER BY chapter_id
                """, (user_id, tutorial_id))
                
                chapters = cursor.fetchall()
                
                if not chapters:
                    return {"tutorial_id": tutorial_id, "chapters": [], "overall_progress": 0}
                
                chapter_data = []
                total_progress = 0
                
                for chapter in chapters:
                    quiz_scores = json.loads(chapter['quiz_scores']) if chapter['quiz_scores'] else {}
                    chapter_data.append({
                        "chapter_id": chapter['chapter_id'],
                        "progress_percentage": chapter['progress_percentage'],
                        "completed_at": chapter['completed_at'],
                        "quiz_scores": quiz_scores
                    })
                    total_progress += chapter['progress_percentage']
                
                overall_progress = total_progress / len(chapters) if chapters else 0
                
                return {
                    "tutorial_id": tutorial_id,
                    "chapters": chapter_data,
                    "overall_progress": overall_progress
                }
                
        except Exception as e:
            current_app.logger.error(f"Error getting tutorial progress: {e}")
            return {"error": "Failed to get progress"}
    
    def update_progress(self, user_id: str, tutorial_id: str, chapter_id: str, 
                       progress_percentage: float, quiz_scores: Dict = None) -> bool:
        """Update user's progress for a specific chapter"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Check if record exists
                cursor.execute("""
                    SELECT id FROM tutorial_progress 
                    WHERE user_id = ? AND tutorial_id = ? AND chapter_id = ?
                """, (user_id, tutorial_id, chapter_id))
                
                existing = cursor.fetchone()
                
                if existing:
                    # Update existing record
                    cursor.execute("""
                        UPDATE tutorial_progress 
                        SET progress_percentage = ?, quiz_scores = ?, 
                            completed_at = ?, last_accessed = CURRENT_TIMESTAMP
                        WHERE user_id = ? AND tutorial_id = ? AND chapter_id = ?
                    """, (progress_percentage, json.dumps(quiz_scores or {}), 
                          datetime.now().isoformat() if progress_percentage >= 100 else None,
                          user_id, tutorial_id, chapter_id))
                else:
                    # Insert new record
                    cursor.execute("""
                        INSERT INTO tutorial_progress 
                        (user_id, tutorial_id, chapter_id, progress_percentage, quiz_scores, completed_at)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (user_id, tutorial_id, chapter_id, progress_percentage, 
                          json.dumps(quiz_scores or {}),
                          datetime.now().isoformat() if progress_percentage >= 100 else None))
                
                conn.commit()
                return True
                
        except Exception as e:
            current_app.logger.error(f"Error updating tutorial progress: {e}")
            return False
    
    def submit_quiz(self, user_id: str, tutorial_id: str, chapter_id: str, 
                   quiz_id: str, answers: Dict[str, Any]) -> Dict[str, Any]:
        """Submit quiz answers and calculate score"""
        try:
            # This would integrate with your existing quiz logic
            # For now, return a mock response
            score = self._calculate_quiz_score(answers)
            
            # Update progress with quiz scores
            quiz_scores = {quiz_id: {"score": score, "answers": answers}}
            self.update_progress(user_id, tutorial_id, chapter_id, 100, quiz_scores)
            
            return {
                "quiz_id": quiz_id,
                "score": score,
                "correct_answers": self._get_correct_answers(quiz_id),
                "feedback": self._get_quiz_feedback(score)
            }
            
        except Exception as e:
            current_app.logger.error(f"Error submitting quiz: {e}")
            return {"error": "Failed to submit quiz"}
    
    def get_recommendations(self, user_id: str) -> List[Dict[str, Any]]:
        """Get personalized learning recommendations based on progress"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                # Get user's progress across all tutorials
                cursor.execute("""
                    SELECT tutorial_id, AVG(progress_percentage) as avg_progress,
                           COUNT(*) as chapters_completed
                    FROM tutorial_progress 
                    WHERE user_id = ?
                    GROUP BY tutorial_id
                """, (user_id,))
                
                progress_data = cursor.fetchall()
                
                recommendations = []
                
                # Simple recommendation logic - can be enhanced
                for row in progress_data:
                    tutorial_id = row['tutorial_id']
                    avg_progress = row['avg_progress']
                    
                    if avg_progress < 30:
                        recommendations.append({
                            "tutorial_id": tutorial_id,
                            "recommendation": "start",
                            "priority": "high",
                            "message": f"Start with {tutorial_id} - you haven't begun yet"
                        })
                    elif avg_progress < 70:
                        recommendations.append({
                            "tutorial_id": tutorial_id,
                            "recommendation": "continue",
                            "priority": "medium",
                            "message": f"Continue with {tutorial_id} - you're making good progress"
                        })
                    elif avg_progress < 100:
                        recommendations.append({
                            "tutorial_id": tutorial_id,
                            "recommendation": "finish",
                            "priority": "low",
                            "message": f"Almost done with {tutorial_id} - finish it up!"
                        })
                
                return recommendations
                
        except Exception as e:
            current_app.logger.error(f"Error getting recommendations: {e}")
            return []
    
    def _calculate_quiz_score(self, answers: Dict[str, Any]) -> float:
        """Calculate quiz score based on answers"""
        # Mock implementation - replace with actual quiz logic
        total_questions = len(answers)
        if total_questions == 0:
            return 0.0
        
        # Simple scoring - can be enhanced with actual answer validation
        correct_answers = sum(1 for answer in answers.values() if answer is not None)
        return (correct_answers / total_questions) * 100
    
    def _get_correct_answers(self, quiz_id: str) -> Dict[str, Any]:
        """Get correct answers for a quiz"""
        # Mock implementation - replace with actual quiz data
        return {"question_1": "A", "question_2": "B", "question_3": "C"}
    
    def _get_quiz_feedback(self, score: float) -> str:
        """Get feedback based on quiz score"""
        if score >= 90:
            return "Excellent! You have a strong understanding of this topic."
        elif score >= 70:
            return "Good job! You understand most of the concepts."
        elif score >= 50:
            return "Not bad, but consider reviewing the material again."
        else:
            return "Consider going through the tutorial again before taking the quiz."
