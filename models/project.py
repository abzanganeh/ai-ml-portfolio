from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import json

# Use the same db instance as tutorials
from models.tutorial import db

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)  # URL-friendly name (like tutorial slug)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    detailed_description = db.Column(db.Text, nullable=True)
    technology_stack = db.Column(db.Text, nullable=True)  # JSON string
    github_url = db.Column(db.String(300), nullable=True)
    demo_url = db.Column(db.String(300), nullable=True)
    category = db.Column(db.String(50), nullable=False)
    featured = db.Column(db.Boolean, default=False)
    published = db.Column(db.Boolean, default=True)
    status = db.Column(db.String(20), default='Completed')
    duration_months = db.Column(db.Integer, default=3)
    team_size = db.Column(db.Integer, default=1)
    challenges = db.Column(db.Text, nullable=True)  # JSON string
    results = db.Column(db.Text, nullable=True)  # JSON string
    image_url = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Template support (like tutorials)
    has_dedicated_template = db.Column(db.Boolean, default=False)
    template_path = db.Column(db.String(200), nullable=True)
    
    def __repr__(self):
        return f'<Project {self.title}>'
    
    @property
    def url(self):
        """Generate URL for this project"""
        return f'/projects/{self.name}/'
    
    @property
    def technology_list(self):
        """Convert technology stack string to list"""
        if self.technology_stack:
            try:
                return json.loads(self.technology_stack)
            except:
                return []
        return []
    
    @property
    def challenges_list(self):
        """Convert challenges string to list"""
        if self.challenges:
            try:
                return json.loads(self.challenges)
            except:
                return []
        return []
    
    @property
    def results_dict(self):
        """Convert results string to dictionary"""
        if self.results:
            try:
                return json.loads(self.results)
            except:
                return {}
        return {}
    
    @property
    def default_image_url(self):
        """Generate default image URL if none provided"""
        if self.image_url:
            return self.image_url
        return f"/static/images/projects/{self.name}.jpg"
    
    def to_dict(self):
        """Convert project to dictionary"""
        return {
            'id': self.name,  # Use name as the external ID (like tutorial slug)
            'name': self.name,
            'title': self.title,
            'description': self.description,
            'detailed_description': self.detailed_description,
            'technology_stack': self.technology_list,
            'github_url': self.github_url,
            'demo_url': self.demo_url,
            'category': self.category,
            'featured': self.featured,
            'published': self.published,
            'status': self.status,
            'duration_months': self.duration_months,
            'team_size': self.team_size,
            'challenges': self.challenges_list,
            'results': self.results_dict,
            'has_dedicated_template': self.has_dedicated_template,
            'template_path': self.template_path,
            'url': self.url,
            'image_url': self.default_image_url
        }