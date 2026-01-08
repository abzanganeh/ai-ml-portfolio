from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, abort
from datetime import datetime
import json
import os

# Database imports
from flask_sqlalchemy import SQLAlchemy
from models.tutorial import db, Tutorial
from models.project import Project  
from data.tutorials import TUTORIALS_DATA
from data.projects import PROJECTS_DATA

# Import new API blueprint for JS-to-Python migration
from api import api_bp 

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tutorials.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = True
app.config['GA_MEASUREMENT_ID'] = os.getenv('GA_MEASUREMENT_ID', 'G-L61S9JFG77')
app.config['PLAUSIBLE_DOMAIN'] = os.getenv('PLAUSIBLE_DOMAIN')
app.config['PLAUSIBLE_API_HOST'] = os.getenv('PLAUSIBLE_API_HOST', 'https://plausible.io')

# Initialize database
db.init_app(app)

# Register API blueprint for JS-to-Python migration
app.register_blueprint(api_bp)

class BlogPost:
    def __init__(self, id, title, excerpt, category, tags, author="Alireza Barzin Zanganeh", published=True, featured=False, created_at=None, read_time=5, content=None, content_file=None, image_url=None):
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
        self.image_url = self._get_image_url(image_url)
        if content_file:
            self.content = self.load_content_from_file(content_file)
        
    def _get_image_url(self, image_url):
        """Get image URL with fallback to default_image.png"""
        if image_url:
            # Check if the specific image file exists
            # Remove leading slash and 'static/' properly
            if image_url.startswith('/static/'):
                image_path = image_url[1:]  # Remove leading slash
            else:
                image_path = os.path.join('static', image_url)
            
            if os.path.exists(image_path):
                return image_url
        
        # Fall back to default image
        return '/static/images/blog/default_image.png'
    
    def load_content_from_file(self, content_file):
        """Load article content from HTML file"""
        content_path = os.path.join('content', 'blog', content_file)
        try:
            with open(content_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return "<p>Content not found</p>"


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


def populate_projects():
    """Populate database with project data from data/projects.py"""
    with app.app_context():
        # Clear existing projects
        Project.query.delete()
        
        # Add projects from PROJECTS_DATA
        for project_data in PROJECTS_DATA:
            project = Project(
                name=project_data['name'],  # This is the main identifier now
                title=project_data['title'],
                description=project_data['description'],
                category=project_data['category'],
                technology_stack=json.dumps(project_data['technology_stack']),
                challenges=json.dumps(project_data.get('challenges', [])),
                results=json.dumps(project_data.get('results', {})),
                github_url=project_data.get('github_url'),
                demo_url=project_data.get('demo_url'),
                featured=project_data.get('featured', False),
                published=project_data.get('published', True),
                image_url=project_data.get('image_url'),
                has_dedicated_template=project_data.get('has_dedicated_template', False),
                template_path=project_data.get('template_path'),
                duration_months=project_data.get('duration_months', 3),
                team_size=project_data.get('team_size', 1)
            )
            db.session.add(project)
        
        db.session.commit()
        print(f"Added {len(PROJECTS_DATA)} projects to database")

# Initialize database
with app.app_context():
    # Create tables if they don't exist
    # db.drop_all()
    db.create_all()
    # Always populate with fresh data for now
    populate_tutorials()
    populate_projects() 

# Helper function to load non-tutorial data
def load_blog_data():
    """Load blog posts data from configuration and content files"""
    from data.blog import BLOG_POSTS_DATA
    
    blog_posts = []
    for post_data in BLOG_POSTS_DATA:
        blog_posts.append(BlogPost(**post_data))
    
    return blog_posts


# Routes
@app.route('/')
def index():
    """Main portfolio homepage"""
    blog_posts = load_blog_data()
    featured_posts = [p for p in blog_posts if p.featured and p.published]
    
    # Get featured projects from database
    featured_projects = Project.query.filter_by(featured=True, published=True).all()
    
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

@app.route('/projects/')  
def projects():
    """Projects showcase page"""
    projects_list = Project.query.filter_by(published=True).all()
    categories = db.session.query(Project.category).distinct().all()
    categories = [cat[0] for cat in categories]
    return render_template('projects.html', 
                         projects=projects_list, 
                         categories=categories)

@app.route('/projects/<project_name>/')  
def project_detail(project_name):
    """Individual project detail page"""
    # Find project by name in database
    project = Project.query.filter_by(name=project_name, published=True).first()
    if not project:
        abort(404)
    
    if project.has_dedicated_template:
        # Try to render the dedicated template
        try:
            return render_template(project.template_path, project=project)
        except:
            # Fallback to generic template if dedicated template not found
            return render_template('project_detail.html', project=project)
    else:
        # Use generic template
        return render_template('project_detail.html', project=project)

@app.route('/project/<project_id>')
def project_detail_legacy(project_id):
    """Legacy redirect for old project URLs"""
    project = Project.query.filter_by(name=project_id, published=True).first()
    if not project:
        abort(404)
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

# ML Model Relationships tutorial chapter routes
@app.route('/tutorials/ml-model-relationships/chapter<int:chapter_num>')
def ml_relationships_chapter(chapter_num):
    """ML Model Relationships tutorial chapters"""
    if chapter_num < 1 or chapter_num > 8:
        abort(404)
    
    template_path = f'tutorials/ml-model-relationships/chapter{chapter_num}.html'
    
    # Check if template exists, otherwise 404
    try:
        return render_template(template_path)
    except:
        abort(404)

# Clustering Course tutorial chapter routes
@app.route('/tutorials/clustering-course/chapter<int:chapter_num>')
def clustering_course_chapter(chapter_num):
    """Clustering Course tutorial chapters"""
    if chapter_num < 1 or chapter_num > 15:
        abort(404)
    
    template_path = f'tutorials/clustering-course/chapter{chapter_num}.html'
    
    # Check if template exists, otherwise 404
    try:
        return render_template(template_path)
    except:
        abort(404)

# New Clustering tutorial chapter routes
@app.route('/tutorials/clustering/chapter<int:chapter_num>')
def clustering_chapter(chapter_num):
    """New Clustering tutorial chapters"""
    if chapter_num < 1 or chapter_num > 15:
        abort(404)
    
    template_path = f'tutorials/clustering/chapter{chapter_num}.html'
    
    # Check if template exists, otherwise 404
    try:
        return render_template(template_path)
    except:
        abort(404)

# Decision Trees tutorial chapter routes
@app.route('/tutorials/decision-trees/chapter<int:chapter_num>')
def decision_trees_chapter(chapter_num):
    """Decision Trees tutorial chapters"""
    if chapter_num < 1 or chapter_num > 5:
        abort(404)
    
    template_path = f'tutorials/decision_trees/chapter{chapter_num}.html'
    
    # Check if template exists, otherwise 404
    try:
        return render_template(template_path)
    except:
        abort(404)

# Coding Interview Algorithms tutorial chapter routes
@app.route('/tutorials/coding-interview-algorithms/chapter<int:chapter_num>')
def coding_algorithms_chapter(chapter_num):
    """Coding Interview Algorithms tutorial chapters"""
    if chapter_num < 1 or chapter_num > 10:
        abort(404)
    
    template_path = f'tutorials/coding-interview-algorithms/chapter{chapter_num}.html'
    
    # Check if template exists, otherwise 404
    try:
        return render_template(template_path)
    except:
        abort(404)

# Neural Networks tutorial chapter routes
@app.route('/tutorials/neural-networks/chapter<int:chapter_num>')
def neural_networks_chapter(chapter_num):
    """Neural Networks tutorial chapters"""
    if chapter_num < 1 or chapter_num > 8:
        abort(404)
    
    template_path = f'tutorials/neural-networks/chapter{chapter_num}.html'
    
    # Check if template exists, otherwise 404
    try:
        return render_template(template_path)
    except:
        abort(404)

# Transformers tutorial chapter routes
@app.route('/tutorials/transformers/chapter<int:chapter_num>')
def transformers_chapter(chapter_num):
    """Transformer Architecture tutorial chapters"""
    if chapter_num < 1 or chapter_num > 10:
        abort(404)
    
    template_path = f'tutorials/transformers/chapter{chapter_num}.html'
    
    try:
        return render_template(template_path)
    except:
        abort(404)

# LLMs tutorial chapter routes
@app.route('/tutorials/llms/chapter<int:chapter_num>')
def llms_chapter(chapter_num):
    """Large Language Models tutorial chapters"""
    if chapter_num < 1 or chapter_num > 8:
        abort(404)
    
    template_path = f'tutorials/llms/chapter{chapter_num}.html'
    
    try:
        return render_template(template_path)
    except:
        abort(404)

# RAG tutorial chapter routes
@app.route('/tutorials/rag/chapter<int:chapter_num>')
def rag_chapter(chapter_num):
    """RAG & Retrieval Systems tutorial chapters"""
    if chapter_num < 1 or chapter_num > 7:
        abort(404)
    
    template_path = f'tutorials/rag/chapter{chapter_num}.html'
    
    try:
        return render_template(template_path)
    except:
        abort(404)

# Agentic AI tutorial chapter routes
@app.route('/tutorials/agentic-ai/chapter<int:chapter_num>')
def agentic_ai_chapter(chapter_num):
    """Agentic AI & LLM Agents tutorial chapters"""
    if chapter_num < 1 or chapter_num > 8:
        abort(404)
    
    template_path = f'tutorials/agentic-ai/chapter{chapter_num}.html'
    
    try:
        return render_template(template_path)
    except:
        abort(404)


@app.route('/blog')
def blog():
    """Blog listing page"""
    blog_posts = load_blog_data()
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
    blog_posts = load_blog_data()
    post = next((p for p in blog_posts if p.slug == slug and p.published), None)
    if not post:
        return render_template('404.html'), 404
    
    related_posts = post.get_related_posts(blog_posts, limit=3)
    
    return render_template('blog_post.html', 
                         post=post, 
                         related_posts=related_posts)

@app.route('/blog/category/<category>')
def blog_category(category):
    blog_posts = load_blog_data()
    filtered_posts = [p for p in blog_posts if p.category == category and p.published]
    return render_template('blog.html', posts=filtered_posts, selected_category=category)

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
@app.route('/search')
def search():
    """Search page for tutorials, projects, and blog posts with enhanced tag-based search"""
    query = request.args.get('q', '').strip()
    results = {'tutorials': [], 'projects': [], 'blog_posts': []}
    
    if query:
        query_lower = query.lower()
        blog_posts = load_blog_data()
        
        # Enhanced search function
        def search_in_content(text, query):
            """Check if query matches in text content"""
            if not text:
                return False
            return query in text.lower()
        
        def search_in_tags(tags, query):
            """Check if query matches any tag"""
            if not tags:
                return False
            if isinstance(tags, str):
                tags = [tag.strip() for tag in tags.split(',')]
            return any(query in tag.lower() for tag in tags)
        
        # Search tutorials from database with enhanced matching
        tutorials_list = Tutorial.query.filter_by(published=True).all()
        matching_tutorials = []
        for t in tutorials_list:
            # Check title, description, and tags
            if (search_in_content(t.title, query_lower) or 
                search_in_content(t.description, query_lower) or
                search_in_tags(t.tags, query_lower)):
                matching_tutorials.append(t)
        
        # Search projects from database with enhanced matching
        projects_list = Project.query.filter_by(published=True).all()
        matching_projects = []
        for p in projects_list:
            # Check title, description, and technology stack
            tech_stack_text = ', '.join(p.technology_list) if p.technology_list else ''
            if (search_in_content(p.title, query_lower) or 
                search_in_content(p.description, query_lower) or
                search_in_content(tech_stack_text, query_lower)):
                matching_projects.append(p)
        
        # Search blog posts with enhanced matching
        matching_posts = []
        for p in blog_posts:
            if p.published:
                # Check title, excerpt, content, and tags
                if (search_in_content(p.title, query_lower) or 
                    search_in_content(p.excerpt, query_lower) or
                    search_in_content(p.content, query_lower) or
                    search_in_tags(p.tags, query_lower)):
                    matching_posts.append(p)
        
        results = {
            'tutorials': matching_tutorials,
            'projects': matching_projects,
            'blog_posts': matching_posts
        }
    
    return render_template('search_results.html', 
                         results=results, 
                         query=query,
                         total_results=len(results['tutorials']) + len(results['projects']) + len(results['blog_posts']))

@app.route('/api/search')
def search_api():
    """Search API for tutorials, projects, and blog posts with enhanced tag-based search"""
    query = request.args.get('q', '').lower().strip()
    blog_posts = load_blog_data()
    
    if not query:
        return jsonify({
            'tutorials': [],
            'projects': [],
            'blog_posts': []
        })
    
    # Enhanced search function
    def search_in_content(text, query):
        """Check if query matches in text content"""
        if not text:
            return False
        return query in text.lower()
    
    def search_in_tags(tags, query):
        """Check if query matches any tag"""
        if not tags:
            return False
        if isinstance(tags, str):
            tags = [tag.strip() for tag in tags.split(',')]
        return any(query in tag.lower() for tag in tags)
    
    # Search tutorials from database with enhanced matching
    tutorials_list = Tutorial.query.filter_by(published=True).all()
    matching_tutorials = []
    for t in tutorials_list:
        # Check title, description, and tags
        if (search_in_content(t.title, query) or 
            search_in_content(t.description, query) or
            search_in_tags(t.tags, query)):
            matching_tutorials.append(t)
    
    # Search projects from database with enhanced matching
    projects_list = Project.query.filter_by(published=True).all()
    matching_projects = []
    for p in projects_list:
        # Check title, description, and technology stack
        tech_stack_text = ', '.join(p.technology_list) if p.technology_list else ''
        if (search_in_content(p.title, query) or 
            search_in_content(p.description, query) or
            search_in_content(tech_stack_text, query)):
            matching_projects.append(p)
    
    # Search blog posts with enhanced matching
    matching_posts = []
    for p in blog_posts:
        if p.published:
            # Check title, excerpt, content, and tags
            if (search_in_content(p.title, query) or 
                search_in_content(p.excerpt, query) or
                search_in_content(p.content, query) or
                search_in_tags(p.tags, query)):
                matching_posts.append(p)
    
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

@app.route('/api/projects/')  
def api_projects():
    """API endpoint returning project data as JSON"""
    projects_list = Project.query.filter_by(published=True).all()
    projects_data = [project.to_dict() for project in projects_list]
    return jsonify(projects_data)

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
        'site_title': 'Alireza Barzin Zanganeh - ML/Data Science Portfolio',
        'current_year': datetime.now().year,
        'social_links': {
            'linkedin': 'https://linkedin.com/in/alireza-barzin-zanganeh-2a9909126',
            'github': 'https://github.com/abzanganeh',
            'email': 'alireza@zanganehai.com'
        },
        'google_analytics_id': app.config.get('GA_MEASUREMENT_ID'),
        'plausible_domain': app.config.get('PLAUSIBLE_DOMAIN'),
        'plausible_api_host': app.config.get('PLAUSIBLE_API_HOST'),
        'canonical_url': request.base_url.rstrip('/') if request.base_url else None
    }

if __name__ == '__main__':
    # For HTTPS testing (optional)
    # app.run(debug=True, host='0.0.0.0', port=8000, ssl_context='adhoc')
    
    # For HTTP (recommended for development)
    app.run(debug=True, host='0.0.0.0', port=8000)
