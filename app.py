from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, abort
from datetime import datetime
import json
import os

# Database imports
from flask_sqlalchemy import SQLAlchemy
from models.tutorial import db, Tutorial
from data.tutorials import TUTORIALS_DATA

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tutorials.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = True

# Initialize database
db.init_app(app)

class Project:
    def __init__(self, id, title, description, technology_stack, github_url=None, demo_url=None, category="General", featured=False, image_url=None):
        self.id = id
        self.title = title
        self.description = description
        self.technology_stack = technology_stack
        self.github_url = github_url
        self.demo_url = demo_url
        self.category = category
        self.featured = featured
        self.image_url = image_url or f"/static/images/projects/{id}.jpg"
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'technology_stack': self.technology_stack,
            'github_url': self.github_url,
            'demo_url': self.demo_url,
            'category': self.category,
            'featured': self.featured,
            'image_url': self.image_url,
            'url': f"/project/{self.id}"
        }

class BlogPost:
    def __init__(self, id, title, content, excerpt, category, tags, author="Alireza Barzin Zanganeh", published=True, featured=False, created_at=None, read_time=5):
        self.id = id
        self.title = title
        self.content = content
        self.excerpt = excerpt
        self.category = category
        self.tags = tags
        self.author = author
        self.published = published
        self.featured = featured
        self.created_at = created_at or datetime.now()
        self.read_time = read_time
        self.slug = self._generate_slug()
        self.meta_description = excerpt[:160]
    
    def _generate_slug(self):
        import re
        slug = self.title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'excerpt': self.excerpt,
            'category': self.category,
            'tags': self.tags,
            'published': self.published,
            'featured': self.featured,
            'created_at': self.created_at.isoformat(),
            'read_time': self.read_time,
            'slug': self.slug,
            'url': f"/blog/{self.slug}"
        }
    
    def get_related_posts(self, all_posts, limit=3):
        return []

def populate_tutorials():
    """Populate database with tutorial data from data/tutorials.py"""
    with app.app_context():
        # Clear existing tutorials
        Tutorial.query.delete()
        
        # Add tutorials from TUTORIALS_DATA
        for i, tutorial_data in enumerate(TUTORIALS_DATA):
            tutorial = Tutorial(
                id=i + 1,
                title=tutorial_data['title'],
                slug=tutorial_data['slug'],
                description=tutorial_data['description'],
                content=tutorial_data.get('content'),
                category=tutorial_data['category'],
                difficulty=tutorial_data['difficulty'],
                duration=tutorial_data['duration'],
                author=tutorial_data['author'],
                has_dedicated_template=tutorial_data.get('has_dedicated_template', False),
                template_path=tutorial_data.get('template_path'),
                published=tutorial_data.get('published', False),
                excerpt=tutorial_data.get('excerpt'),
                tags=tutorial_data.get('tags', '')
            )
            db.session.add(tutorial)
        
        db.session.commit()
        print(f"Added {len(TUTORIALS_DATA)} tutorials to database")

# Initialize database
with app.app_context():
    # Force drop all tables and recreate
    db.drop_all()
    db.create_all()
    # Always populate with fresh data
    populate_tutorials()

# Helper function to load non-tutorial data
def load_projects_and_blog_data():
    """Load projects and blog posts data (keeping your existing data)"""
    projects = [
        Project(
            id="titanic-survival",
            title="Titanic Survival Prediction",
            description="Advanced ML ensemble methods for survival prediction",
            technology_stack=["Python", "Scikit-learn", "Pandas", "Flask"],
            github_url="https://github.com/abzanganeh/titanic-project",
            demo_url="/demos/titanic",
            category="Machine Learning",
            featured=True
        ),
        Project(
            id="neural-networks-implementation",
            title="Custom Neural Network Implementation",
            description="Building neural networks from scratch with Python",
            technology_stack=["Python", "NumPy", "Matplotlib", "TensorFlow"],
            github_url="https://github.com/abzanganeh/neural-networks",
            demo_url="/demos/neural-network",
            category="Deep Learning",
            featured=True
        )
    ]
    
    blog_posts = [
        BlogPost(
            id="transformer-architecture",
            title="Understanding Transformer Architecture",
            content="<p>Deep dive into the architecture that powers modern NLP models...</p>",
            excerpt="Learn about the attention mechanism and transformer architecture",
            category="Deep Learning",
            tags=["transformers", "attention", "nlp"],
            featured=True
        )
    ]
    
    return projects, blog_posts

# Routes
@app.route('/')
def index():
    """Main portfolio homepage"""
    projects, blog_posts = load_projects_and_blog_data()
    featured_projects = [p for p in projects if p.featured]
    featured_posts = [p for p in blog_posts if p.featured and p.published]
    
    # Get recent tutorials from database
    recent_tutorials = Tutorial.query.filter_by(published=True).limit(3).all()
    
    return render_template('index.html', 
                         featured_projects=featured_projects,
                         recent_tutorials=recent_tutorials,
                         featured_posts=featured_posts[:2])

@app.route('/about')
def about():
    """About page with detailed information"""
    return render_template('about.html')

@app.route('/projects')
def projects():
    """Projects showcase page"""
    projects, blog_posts = load_projects_and_blog_data()
    categories = list(set(p.category for p in projects))
    return render_template('projects.html', 
                         projects=projects, 
                         categories=categories)

@app.route('/projects/<project_name>')
def project_detail(project_name):
    """Individual project detail page"""
    projects, blog_posts = load_projects_and_blog_data()
    
    # Find project by name
    project = next((p for p in projects if p.name == project_name), None)
    if not project:
        return render_template('errors/404.html'), 404
    
    # Try to render the specific project template, fallback to generic
    try:
        return render_template(f'projects/{project_name}/{project_name}.html', project=project)
    except:
        return render_template('project_detail.html', project=project)

@app.route('/project/<project_id>')
def project_detail_legacy(project_id):
    """Legacy redirect for old project URLs"""
    projects, blog_posts = load_projects_and_blog_data()
    project = next((p for p in projects if p.id == project_id), None)
    if not project:
        return render_template('errors/404.html'), 404
    return redirect(url_for('project_detail', project_name=project.name), code=301)

# NEW DATABASE-POWERED TUTORIAL ROUTES
@app.route('/tutorials/')
def tutorials():
    """Main tutorials page showing all tutorials"""
    tutorials_list = Tutorial.query.filter_by(published=True).all()
    categories = db.session.query(Tutorial.category).distinct().all()
    categories = [cat[0] for cat in categories]
    
    return render_template('tutorials.html', 
                         tutorials=tutorials_list,
                         categories=categories)

@app.route('/tutorials/<slug>/')
def tutorial_dedicated(slug):
    """Route for dedicated tutorial templates (like Naive Bayes, NLP)"""
    tutorial = Tutorial.query.filter_by(slug=slug, published=True).first()
    
    if not tutorial:
        abort(404)
    
    if not tutorial.has_dedicated_template:
        # Redirect to generic tutorial route
        return redirect(url_for('tutorial_detail', slug=slug))
    
    # Render the dedicated template
    try:
        return render_template(tutorial.template_path, tutorial=tutorial)
    except:
        # Fallback to generic template if dedicated template not found
        return redirect(url_for('tutorial_detail', slug=slug))

@app.route('/tutorial/<slug>/')
def tutorial_detail(slug):
    """Route for generic tutorial display"""
    tutorial = Tutorial.query.filter_by(slug=slug, published=True).first()
    
    if not tutorial:
        abort(404)
    
    # Use generic tutorial template
    return render_template('tutorial_detail.html', tutorial=tutorial)

@app.route('/tutorials/category/<category>/')
def tutorials_by_category(category):
    """Show tutorials filtered by category"""
    tutorials_list = Tutorial.query.filter_by(category=category, published=True).all()
    categories = db.session.query(Tutorial.category).distinct().all()
    categories = [cat[0] for cat in categories]
    
    if not tutorials_list:
        abort(404)
    
    return render_template('tutorials.html', 
                         tutorials=tutorials_list,
                         categories=categories,
                         selected_category=category)

# Legacy ML Fundamentals routes (keep these for backward compatibility)
@app.route('/tutorials/ml-fundamentals/chapter1')
def ml_fundamentals_chapter1():
    """ML Fundamentals Chapter 1: Introduction to Machine Learning"""
    return render_template('tutorials/ml_fundamentals/chapter1.html')

@app.route('/tutorials/ml-fundamentals/chapter2')
def ml_fundamentals_chapter2():
    """ML Fundamentals Chapter 2: Supervised Learning"""
    return render_template('tutorials/ml_fundamentals/chapter2.html')

@app.route('/tutorials/ml-fundamentals/chapter3')
def ml_fundamentals_chapter3():
    """ML Fundamentals Chapter 3: Unsupervised Learning"""
    return render_template('tutorials/ml_fundamentals/chapter3.html')

@app.route('/blog')
def blog():
    """Blog listing page"""
    projects, blog_posts = load_projects_and_blog_data()
    published_posts = [p for p in blog_posts if p.published]
    categories = list(set(p.category for p in published_posts))
    featured_posts = [p for p in published_posts if p.featured]
    recent_posts = sorted(published_posts, key=lambda x: x.created_at, reverse=True)
    
    return render_template('blog.html', 
                         posts=recent_posts,
                         featured_posts=featured_posts,
                         categories=categories)

@app.route('/blog/<slug>')
def blog_post(slug):
    """Individual blog post page"""
    projects, blog_posts = load_projects_and_blog_data()
    post = next((p for p in blog_posts if p.slug == slug and p.published), None)
    if not post:
        return render_template('404.html'), 404
    
    related_posts = post.get_related_posts(blog_posts, limit=3)
    
    return render_template('blog_post.html', 
                         post=post, 
                         related_posts=related_posts)

@app.route('/skills')
def skills():
    """Skills and expertise page"""
    skills_data = {
        'technical': {
            'Machine Learning': ['Scikit-learn', 'TensorFlow', 'PyTorch', 'XGBoost'],
            'Programming': ['Python', 'R', 'SQL', 'JavaScript'],
            'Data Analysis': ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
            'Web Development': ['Flask', 'Django', 'HTML/CSS', 'React']
        },
        'soft': ['Problem Solving', 'Critical Thinking', 'Communication', 'Team Leadership']
    }
    return render_template('skills.html', skills=skills_data)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page with form handling"""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        flash(f'Thank you {name}! Your message has been received.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

# API Routes
@app.route('/api/search')
def search():
    """Search API for tutorials, projects, and blog posts"""
    query = request.args.get('q', '').lower()
    projects, blog_posts = load_projects_and_blog_data()
    
    # Search tutorials from database
    tutorials_list = Tutorial.query.filter_by(published=True).all()
    matching_tutorials = [
        t for t in tutorials_list 
        if query in t.title.lower() or query in t.description.lower()
    ]
    
    matching_projects = [
        p for p in projects 
        if query in p.title.lower() or query in p.description.lower()
    ]
    
    matching_posts = [
        p for p in blog_posts 
        if p.published and (query in p.title.lower() or query in p.excerpt.lower())
    ]
    
    results = {
        'tutorials': [t.to_dict() for t in matching_tutorials],
        'projects': [p.to_dict() for p in matching_projects],
        'blog_posts': [p.to_dict() for p in matching_posts]
    }
    
    return jsonify(results)

@app.route('/api/tutorials/')
def api_tutorials():
    """API endpoint returning tutorial data as JSON"""
    tutorials_list = Tutorial.query.filter_by(published=True).all()
    tutorials_data = [tutorial.to_dict() for tutorial in tutorials_list]
    return jsonify(tutorials_data)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

# Context processors
@app.context_processor
def inject_globals():
    """Inject global variables into all templates"""
    return {
        'site_title': 'Alireza Barzin Zanganeh - AI/ML Portfolio',
        'current_year': datetime.now().year,
        'social_links': {
            'linkedin': 'https://linkedin.com/in/alireza-barzin-zanganeh-2a9909126',
            'github': 'https://github.com/abzanganeh',
            'email': 'alireza@zanganehai.com'
        }
    }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)