from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import json

# Use the same db instance as tutorials
from models.tutorial import db

DISABLED_CODE_PROJECTS: set[str] = {
    "titanic-survival",
    "asar",
    "rai",
    "trust-mobile",
}

# Pre-commercial identity work — non-disclosing stats on the detail page.
PRIVATE_PORTFOLIO_PROJECTS: set[str] = {
    "asar",
    "rai",
    "trust-mobile",
}

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

    @property
    def code_repository_disabled(self) -> bool:
        return self.name in DISABLED_CODE_PROJECTS

    @property
    def has_code_repository(self) -> bool:
        return bool(self.github_url) and not self.code_repository_disabled

    @property
    def show_team_size_stat(self) -> bool:
        return self.name in PRIVATE_PORTFOLIO_PROJECTS or self.team_size is not None

    @property
    def team_size_display(self) -> str | None:
        if self.name in PRIVATE_PORTFOLIO_PROJECTS:
            return "N/A"
        if self.team_size is None:
            return None
        return str(self.team_size)

    @property
    def team_size_label(self) -> str:
        if self.name in PRIVATE_PORTFOLIO_PROJECTS:
            return "Team"
        if self.team_size == 1:
            return "Team Member"
        return "Team Members"

    @property
    def show_duration_in_meta(self) -> bool:
        if self.name in PRIVATE_PORTFOLIO_PROJECTS:
            return False
        return bool(self.duration_months)

    @property
    def show_duration_stat(self) -> bool:
        return self.duration_display is not None

    @property
    def duration_display(self) -> str | None:
        if self.name in PRIVATE_PORTFOLIO_PROJECTS:
            return "Ongoing"
        if self.duration_months is None:
            return None
        return str(self.duration_months)

    @property
    def duration_label(self) -> str:
        if self.name in PRIVATE_PORTFOLIO_PROJECTS:
            return "Duration"
        if self.duration_months == 1:
            return "Month"
        return "Months"

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
            'image_url': self.default_image_url,
            'code_repository_disabled': self.code_repository_disabled,
            'has_code_repository': self.has_code_repository
        }
