from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from datetime import datetime
import json
import os
from flask_sqlalchemy import SQLAlchemy
from models.tutorial import db, Tutorial
from data.tutorials import TUTORIALS_DATA
from models.tutorial import Tutorial
from flask import render_template, abort, redirect, url_for, jsonify


app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'  # Change this in production

# Configuration
app.config['DEBUG'] = True

# Temporary Tutorial and Project classes (we'll import from models later)
class Tutorial:
    def __init__(self, id, title, description, category, difficulty, content, tags, estimated_read_time=5):
        self.id = id
        self.title = title
        self.description = description
        self.category = category
        self.difficulty = difficulty
        self.content = content
        self.tags = tags
        self.estimated_read_time = estimated_read_time
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'difficulty': self.difficulty,
            'content': self.content,
            'tags': self.tags,
            'estimated_read_time': self.estimated_read_time,
            'url': f"/tutorial/{self.id}"
        }

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
        return []  # Simplified for now

# Initialize data
def load_data():
    """Load tutorials, projects, and blog posts data"""
    tutorials = [
        Tutorial(
            id="data-science",
            title="Data Science Practices",
            description="End-to-end data science workflow and best practices",
            category="Data Science",
            difficulty="Intermediate", 
            content="""
            <h2>Core Skills</h2>
            <ul>
                <li>Data Collection and Cleaning</li>
                <li>Exploratory Data Analysis (EDA)</li>
                <li>Data Visualization with Matplotlib/Seaborn</li>
                <li>Feature Engineering and Transform</li>
                <li>Statistical Analysis and Hypothesis Testing</li>
            </ul>
            
            <h2>Tools & Libraries</h2>
            <p>Essential tools for data science workflow:</p>
            <ul>
                <li><strong>Pandas</strong> - Data manipulation and analysis</li>
                <li><strong>NumPy</strong> - Numerical computing</li>
                <li><strong>Matplotlib</strong> - Data visualization</li>
                <li><strong>Seaborn</strong> - Statistical data visualization</li>
                <li><strong>Jupyter</strong> - Interactive development environment</li>
            </ul>
            """,
            tags=["data-science", "pandas", "numpy", "matplotlib", "seaborn", "jupyter"],
            estimated_read_time=8
        ),
        Tutorial(
            id="prompt-engineering",
            title="Complete Prompt Engineering Course",
            description="Master the art and science of communicating with AI - From zero to expert level",
            category="AI Engineering", 
            difficulty="Beginner",
            content="""
            <h2>What is Prompt Engineering?</h2>
            <p>Prompt engineering is the systematic approach to designing, crafting, and optimizing inputs (prompts) to achieve desired outputs from AI language models. It combines art, science, and strategy to effectively communicate with artificial intelligence systems.</p>
            
            <div class="formula-box">
                <strong>Universal Prompt Formula:</strong><br>
                [Context] + [Specific Instruction] + [Examples] + [Constraints] + [Output Format] = Effective Prompt
            </div>
            
            <h2>Core Principles of Effective Prompting</h2>
            <ol>
                <li><strong>Clarity & Precision:</strong> Be specific and unambiguous in your instructions</li>
                <li><strong>Context Provision:</strong> Supply relevant background information and situational details</li>
                <li><strong>Constraint Setting:</strong> Define clear boundaries, limitations, and requirements</li>
                <li><strong>Example Demonstration:</strong> Show desired outcomes through concrete examples</li>
                <li><strong>Iterative Refinement:</strong> Continuously improve prompts based on results</li>
                <li><strong>Task Decomposition:</strong> Break complex tasks into manageable components</li>
            </ol>
            
            <div class="example-comparison">
                <div class="bad-example">
                    <strong>❌ Ineffective Prompt:</strong><br>
                    "Write about marketing"
                </div>
                <div class="good-example">
                    <strong>✅ Effective Prompt:</strong><br>
                    "As a digital marketing expert, write a 500-word comprehensive guide for small business owners about social media marketing strategies. Focus on Facebook and Instagram platforms, include 3 specific tactics with real-world examples, and format the response with clear headings and bullet points. Assume the audience has basic computer skills but limited marketing experience."
                </div>
            </div>
            
            <h2>Core Prompt Engineering Techniques</h2>
            
            <h3>1. Zero-Shot Prompting</h3>
            <p>Leveraging the AI's pre-trained knowledge without providing examples. Best for straightforward tasks where the AI has sufficient training data.</p>
            
            <div class="formula-box">
                <strong>Zero-Shot Formula:</strong><br>
                [Task Description] + [Specific Requirements] + [Output Format] + [Quality Constraints]
            </div>
            
            <h3>2. Few-Shot Prompting</h3>
            <p>Providing 2-5 examples to guide the AI's understanding. Highly effective for pattern-based tasks and consistent formatting.</p>
            
            <div class="formula-box">
                <strong>Few-Shot Formula:</strong><br>
                [Task Explanation] + [Example 1] + [Example 2] + [Example 3] + [New Task Instance]
            </div>
            
            <h3>3. Chain-of-Thought (CoT) Prompting</h3>
            <p>Encouraging step-by-step reasoning for complex problems. Essential for mathematical, logical, and analytical tasks.</p>
            
            <div class="formula-box">
                <strong>Chain-of-Thought Formula:</strong><br>
                [Complex Problem] + "Let's approach this step-by-step:" + [Reasoning Process] + [Final Answer]
            </div>
            
            <h2>Advanced Prompting Methods</h2>
            
            <h3>1. Role-Based Prompting</h3>
            <p>Assigning specific roles, expertise, or perspectives to shape the AI's responses. Creates consistent voice and specialized knowledge application.</p>
            
            <div class="formula-box">
                <strong>Role-Based Formula:</strong><br>
                "You are a [SPECIFIC ROLE] with [YEARS] of experience in [FIELD]. Your expertise includes [SKILLS]. [TASK] while maintaining a [TONE] and [STYLE]."
            </div>
            
            <h3>2. The CLEAR Framework</h3>
            <p>A systematic approach to creating effective prompts:</p>
            
            <div class="formula-box">
                <strong>CLEAR Framework:</strong><br>
                <strong>C</strong>ontext - Provide relevant background<br>
                <strong>L</strong>ength - Specify desired output length<br>
                <strong>E</strong>xamples - Include concrete demonstrations<br>
                <strong>A</strong>udience - Define target audience<br>
                <strong>R</strong>ole - Assign appropriate persona/expertise
            </div>
            
            <h2>Industry Applications</h2>
            
            <h3>Customer Service & Support</h3>
            <ul>
                <li>Support ticket classification and routing</li>
                <li>Automated response generation</li>
                <li>Escalation path recommendations</li>
            </ul>
            
            <h3>Marketing & Content Creation</h3>
            <ul>
                <li>Social media post generation</li>
                <li>Email campaign content</li>
                <li>Product description writing</li>
                <li>SEO content optimization</li>
            </ul>
            
            <h3>Code Generation</h3>
            <ul>
                <li>Function and class creation</li>
                <li>Code documentation</li>
                <li>Bug fixing assistance</li>
                <li>Code review and optimization</li>
            </ul>
            
            <h2>Best Practices & Optimization</h2>
            
            <h3>Common Pitfalls to Avoid</h3>
            <ul>
                <li><strong>Vague Instructions:</strong> Leads to inconsistent, unpredictable outputs</li>
                <li><strong>Overlong Prompts:</strong> Dilutes focus and increases costs</li>
                <li><strong>Missing Context:</strong> Results in generic, irrelevant responses</li>
                <li><strong>No Output Format:</strong> Creates unusable response structure</li>
                <li><strong>Single Attempt:</strong> Prevents optimization and refinement</li>
            </ul>
            
            <h3>Optimization Strategies</h3>
            <ol>
                <li><strong>A/B Testing:</strong> Compare different prompt versions</li>
                <li><strong>Progressive Enhancement:</strong> Start simple, add complexity gradually</li>
                <li><strong>Error Recovery:</strong> Systematically diagnose and fix issues</li>
                <li><strong>Performance Monitoring:</strong> Track quality, consistency, and efficiency</li>
            </ol>
            
            <h2>Future of Prompt Engineering</h2>
            <p>As AI models become more sophisticated, prompt engineering evolves from basic instruction-giving to sophisticated communication strategies. Key trends include:</p>
            <ul>
                <li><strong>Dynamic Prompting:</strong> Adapting prompts based on context and feedback</li>
                <li><strong>Multi-modal Prompts:</strong> Combining text, images, and other media</li>
                <li><strong>Automated Optimization:</strong> AI-powered prompt improvement</li>
                <li><strong>Domain Specialization:</strong> Industry-specific prompting frameworks</li>
            </ul>
            """,
            tags=["prompt-engineering", "ai", "llm", "gpt", "communication", "optimization"],
            estimated_read_time=20
        ),
        Tutorial(
            id="nlp",
            title="Complete Interactive NLP Course",
            description="Master Natural Language Processing from fundamentals to advanced Transformers",
            category="Natural Language Processing",
            difficulty="Intermediate",
            content="""
            <h2>Welcome to the NLP Course!</h2>
            <p>Natural Language Processing (NLP) is a machine learning technology that gives computers the ability to interpret, manipulate, and comprehend human language. It involves reading, deciphering, understanding, and making sense of human languages.</p>
            
            <h2>Key Topics Covered</h2>
            <ul>
                <li>Text Representation Techniques</li>
                <li>Word Embeddings (Word2Vec, GloVe, FastText)</li>
                <li>Sentiment Analysis</li>
                <li>Sequence-to-Sequence Models</li>
                <li>Transformers and Self-Attention</li>
                <li>Modern NLP Applications</li>
            </ul>
            
            <h2>Text Representation Techniques</h2>
            <h3>1. Bag of Words (BoW)</h3>
            <p>BoW represents text by the frequency of words within a document, ignoring grammar and word order.</p>
            
            <div class="pros-cons-grid">
                <div class="advantages">
                    <h4>Advantages</h4>
                    <ul>
                        <li>Simple and easy to implement</li>
                        <li>Works well for text classification</li>
                        <li>Computationally efficient</li>
                    </ul>
                </div>
                <div class="disadvantages">
                    <h4>Disadvantages</h4>
                    <ul>
                        <li>High dimensionality</li>
                        <li>Sparse features</li>
                        <li>Treats synonyms differently</li>
                        <li>Ignores word order</li>
                    </ul>
                </div>
            </div>
            
            <h3>2. TF-IDF</h3>
            <p>TF-IDF reflects the importance of a word in a document relative to a collection of documents.</p>
            <p><strong>Formula:</strong> TF-IDF(t,d) = TF(t,d) × IDF(t)</p>
            
            <h2>Word Embeddings</h2>
            <p>Word embeddings are dense vector representations of words that capture their semantic meaning. Unlike BoW and TF-IDF, embeddings consider the context in which words appear.</p>
            
            <h3>Word2Vec Variants</h3>
            <ul>
                <li><strong>CBOW (Continuous Bag of Words):</strong> Predicts target word from context</li>
                <li><strong>Skip-gram:</strong> Predicts context from target word</li>
            </ul>
            
            <h3>GloVe (Global Vectors)</h3>
            <p>GloVe generates word vectors based on co-occurrence statistics in a large corpus.</p>
            
            <h3>FastText</h3>
            <p>FastText extends Word2Vec by using subword representations (character n-grams), making it excellent for handling out-of-vocabulary words.</p>
            
            <h2>Sentiment Analysis</h2>
            <p>Sentiment analysis determines the emotional tone behind words, helping understand opinions, attitudes, and emotions expressed in text.</p>
            
            <h3>Applications</h3>
            <ul>
                <li>Brand reputation monitoring</li>
                <li>Product review analysis</li>
                <li>Customer feedback processing</li>
                <li>Social media monitoring</li>
            </ul>
            
            <h3>Challenges</h3>
            <ul>
                <li><strong>Sarcasm Detection:</strong> "Great job!" might be sarcastic</li>
                <li><strong>Context Dependency:</strong> Same word, different sentiments</li>
                <li><strong>Domain Specificity:</strong> Movie reviews vs. product reviews</li>
            </ul>
            
            <h2>Transformers: The Revolution</h2>
            <p>Transformers revolutionized NLP by introducing the "Attention is All You Need" paradigm, eliminating the need for recurrent connections while achieving superior performance.</p>
            
            <h3>Key Innovation: Self-Attention</h3>
            <p>Instead of processing sequences step-by-step, Transformers look at all positions simultaneously and learn which parts are most relevant to each other.</p>
            
            <h3>Why Transformers?</h3>
            <ul>
                <li><strong>Parallelization:</strong> Process entire sequences simultaneously</li>
                <li><strong>Long-term Dependencies:</strong> Better at capturing relationships</li>
                <li><strong>Scalability:</strong> Easy to scale to larger datasets</li>
                <li><strong>Transfer Learning:</strong> Pre-trained models work across tasks</li>
            </ul>
            
            <h3>Famous Transformer Models</h3>
            <ul>
                <li><strong>BERT:</strong> Bidirectional Encoder Representations from Transformers</li>
                <li><strong>GPT:</strong> Generative Pre-trained Transformer</li>
                <li><strong>T5:</strong> Text-to-Text Transfer Transformer</li>
                <li><strong>RoBERTa:</strong> Robustly Optimized BERT Pretraining Approach</li>
            </ul>
            
            <h2>Modern NLP Applications</h2>
            <ul>
                <li>Machine Translation</li>
                <li>Text Summarization</li>
                <li>Question Answering Systems</li>
                <li>Named Entity Recognition</li>
                <li>Chatbots and Virtual Assistants</li>
            </ul>
            """,
            tags=["nlp", "transformers", "bert", "gpt", "attention", "embeddings", "sentiment-analysis"],
            estimated_read_time=25
        ),
        Tutorial(
            id="ml-fundamentals",
            title="ML Fundamentals",
            description="Master the fundamentals of Machine Learning with three comprehensive chapters",
            category="Machine Learning",
            difficulty="Beginner",
            content="""
            <h2>Welcome to ML Fundamentals!</h2>
            <p>This comprehensive course covers the essential concepts of Machine Learning through three structured chapters. Each chapter builds upon the previous one, providing you with a solid foundation in ML concepts and practical applications.</p>
            
            <h2>Course Structure</h2>
            <div class="course-chapters">
                <div class="chapter-card">
                    <h3>Chapter 1: Introduction to Machine Learning</h3>
                    <p>Learn the basics of ML, types of learning, and fundamental concepts.</p>
                    <a href="/tutorials/ml-fundamentals/chapter1" class="btn btn-primary">Start Chapter 1</a>
                </div>
                
                <div class="chapter-card">
                    <h3>Chapter 2: Supervised Learning</h3>
                    <p>Master classification and regression algorithms with practical examples.</p>
                    <a href="/tutorials/ml-fundamentals/chapter2" class="btn btn-primary">Start Chapter 2</a>
                </div>
                
                <div class="chapter-card">
                    <h3>Chapter 3: Unsupervised Learning</h3>
                    <p>Explore clustering, dimensionality reduction, and pattern discovery.</p>
                    <a href="/tutorials/ml-fundamentals/chapter3" class="btn btn-primary">Start Chapter 3</a>
                </div>
            </div>
            
            <h2>What You\'ll Learn</h2>
            <ul>
                <li>Core ML concepts and terminology</li>
                <li>Different types of machine learning</li>
                <li>Popular algorithms and their applications</li>
                <li>Model evaluation and validation</li>
                <li>Practical implementation with Python</li>
                <li>Real-world case studies</li>
            </ul>
            
            <h2>Prerequisites</h2>
            <ul>
                <li>Basic Python programming knowledge</li>
                <li>Understanding of high school mathematics</li>
                <li>Familiarity with data structures</li>
            </ul>
            
            <h2>Tools You'll Use</h2>
            <ul>
                <li>Python 3.x</li>
                <li>Scikit-learn</li>
                <li>Pandas & NumPy</li>
                <li>Matplotlib & Seaborn</li>
                <li>Jupyter Notebooks</li>
            </ul>
            """,
            tags=["machine-learning", "fundamentals", "python", "scikit-learn", "supervised-learning", "unsupervised-learning"],
            estimated_read_time=45
        ),
        Tutorial(
            id="feature-engineering",
            title="Complete Guide to Feature Engineering",
            description="Data preprocessing and feature selection techniques for better model performance",
            category="Data Science",
            difficulty="Intermediate",
            content="""
            <h2>What is Feature Engineering?</h2>
            <p>Feature engineering is the process of creating, transforming, and selecting the most relevant features from raw data to improve machine learning model performance.</p>
            
            <h2>Core Techniques</h2>
            <h3>Numerical Transformations</h3>
            <ul>
                <li>Min-Max Scaling</li>
                <li>Standard Scaling (Z-score)</li>
                <li>Robust Scaling</li>
            </ul>
            
            <h3>Categorical Encoding</h3>
            <ul>
                <li>One-Hot Encoding</li>
                <li>Label Encoding</li>
                <li>Target Encoding</li>
            </ul>
            
            <h2>Best Practices</h2>
            <ul>
                <li>Start Simple</li>
                <li>Understand Your Data</li>
                <li>Iterate and Validate</li>
            </ul>
            """,
            tags=["feature-engineering", "preprocessing", "feature-selection", "data-science"],
            estimated_read_time=12
        )
    ]
    
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
    
    # Sample blog posts
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
    
    return tutorials, projects, blog_posts

# Routes
@app.route('/')
def index():
    """Main portfolio homepage"""
    tutorials, projects, blog_posts = load_data()
    featured_projects = [p for p in projects if p.featured]
    featured_posts = [p for p in blog_posts if p.featured and p.published]
    return render_template('index.html', 
                         featured_projects=featured_projects,
                         recent_tutorials=tutorials[:3],
                         featured_posts=featured_posts[:2])

@app.route('/about')
def about():
    """About page with detailed information"""
    return render_template('about.html')

@app.route('/projects')
def projects():
    """Projects showcase page"""
    tutorials, projects, blog_posts = load_data()
    categories = list(set(p.category for p in projects))
    return render_template('projects.html', 
                         projects=projects, 
                         categories=categories)

@app.route('/projects/<project_name>')
def project_detail(project_name):
    """Individual project detail page"""
    tutorials, projects, blog_posts = load_data()
    
    # Find project by name
    project = next((p for p in projects if p.name == project_name), None)
    if not project:
        return render_template('errors/404.html'), 404
    
    # Try to render the specific project template, fallback to generic
    try:
        return render_template(f'projects/{project_name}/{project_name}.html', project=project)
    except:
        return render_template('project_detail.html', project=project)

# Optional: Legacy redirect for old URLs
@app.route('/project/<project_id>')
def project_detail_legacy(project_id):
    """Legacy redirect for old project URLs"""
    tutorials, projects, blog_posts = load_data()
    project = next((p for p in projects if p.id == project_id), None)
    if not project:
        return render_template('errors/404.html'), 404
    return redirect(url_for('project_detail', project_name=project.name), code=301)

@app.route('/tutorials/')
def tutorials():
    """Tutorials and learning resources"""
    tutorials, projects, blog_posts = load_data()
    categories = list(set(t.category for t in tutorials))
    difficulties = list(set(t.difficulty for t in tutorials))
    return render_template('tutorials.html', 
                         tutorials=tutorials,
                         categories=categories,
                         difficulties=difficulties)

@app.route('/tutorials/<tutorial_id>')
def tutorial_detail(tutorial_id):
    """Individual tutorial detail page"""
    tutorials, projects, blog_posts = load_data()
    tutorial = next((t for t in tutorials if t.id == tutorial_id), None)
    if not tutorial:
        return render_template('404.html'), 404
    
    # Use special template for NLP tutorial
    if tutorial_id == 'nlp':
        return render_template('tutorials/nlp/index.html', tutorial=tutorial)
    
    # Use special template for ML Fundamentals tutorial
    if tutorial_id == 'ml-fundamentals':
        return render_template('tutorials/ml_fundamentals/index.html')
    
    return render_template('tutorial_detail.html', tutorial=tutorial)

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
    tutorials, projects, blog_posts = load_data()
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
    tutorials, projects, blog_posts = load_data()
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
    tutorials, projects, blog_posts = load_data()
    
    matching_tutorials = [
        t for t in tutorials 
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
    
    app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tutorials.db'  # SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Function to populate database with tutorial data
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
                excerpt=tutorial_data.get('excerpt')
            )
            db.session.add(tutorial)
        
        db.session.commit()
        print(f"Added {len(TUTORIALS_DATA)} tutorials to database")

# Create tables and populate data
with app.app_context():
    db.create_all()
    # Only populate if tables are empty
    if Tutorial.query.count() == 0:
        populate_tutorials()