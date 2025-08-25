from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Tutorial(db.Model):
    __tablename__ = 'tutorials'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=True)  # For basic tutorials
    category = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)  # beginner, intermediate, advanced
    duration = db.Column(db.String(20), nullable=False)  # e.g., "30 min"
    author = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published = db.Column(db.Boolean, default=False)
    
    # New fields for template support
    has_dedicated_template = db.Column(db.Boolean, default=False)
    template_path = db.Column(db.String(200), nullable=True)  # e.g., 'tutorials/naive_bayes/index.html'
    
    # For basic tutorials using the generic template
    excerpt = db.Column(db.Text, nullable=True)
    tags = db.Column(db.Text, nullable=True)  # Store as comma-separated string
    
    def __repr__(self):
        return f'<Tutorial {self.title}>'
    
    @property
    def difficulty_class(self):
        """Return CSS class for difficulty badge"""
        return f'difficulty-{self.difficulty.lower()}'
    
    @property
    def url(self):
        """Generate URL for this tutorial"""
        if self.has_dedicated_template:
            return f'/tutorials/{self.slug}/'
        else:
            return f'/tutorial/{self.slug}/'
    
    @property
    def tags_list(self):
        """Convert tags string to list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []
    
    def to_dict(self):
        """Convert tutorial to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'category': self.category,
            'difficulty': self.difficulty,
            'duration': self.duration,
            'author': self.author,
            'has_dedicated_template': self.has_dedicated_template,
            'template_path': self.template_path,
            'url': self.url,
            'difficulty_class': self.difficulty_class,
            'excerpt': self.excerpt,
            'content': self.content
        }