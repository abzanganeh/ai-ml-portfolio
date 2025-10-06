#!/usr/bin/env python3
"""
Create Blog Post with Template
=============================

Interactive script to create blog posts with pre-built templates.

Usage:
    python scripts/create_blog_with_template.py
"""

import os
import sys
import re
from datetime import datetime
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def create_slug(title):
    """Convert title to URL-friendly slug"""
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def create_blog_with_template():
    """Interactive blog post creation with templates"""
    print("🚀 Blog Post Creator with Templates")
    print("=" * 40)
    
    # Get blog post details
    title = input("📝 Blog Post Title: ").strip()
    if not title:
        print("❌ Title is required!")
        return
    
    # Choose template type
    print("\n📋 Choose a template type:")
    print("1. Tutorial - Step-by-step guide with interactive demos")
    print("2. Comparison - Compare different approaches/technologies")
    print("3. Case Study - Real-world problem solving example")
    print("4. Gradient Descent - Specialized ML optimization guide")
    print("5. Custom - Basic template")
    
    template_choice = input("Enter choice (1-5): ").strip()
    
    template_map = {
        '1': 'tutorial',
        '2': 'comparison', 
        '3': 'case-study',
        '4': 'gradient-descent',
        '5': 'custom'
    }
    
    template_type = template_map.get(template_choice, 'custom')
    
    # Get other details
    category = input("📂 Category (e.g., Machine Learning, Deep Learning, Data Science): ").strip()
    if not category:
        category = "Machine Learning"
    
    tags_input = input("🏷️  Tags (comma-separated): ").strip()
    tags = [tag.strip() for tag in tags_input.split(',')] if tags_input else ['machine learning']
    
    excerpt = input("📄 Excerpt (optional): ").strip()
    if not excerpt:
        excerpt = f"Learn about {title.lower()} in this comprehensive guide."
    
    featured = input("⭐ Featured post? (y/n): ").strip().lower() == 'y'
    
    read_time = input("⏱️  Read time in minutes (optional): ").strip()
    read_time = int(read_time) if read_time.isdigit() else max(5, len(title.split()) // 10)
    
    # Create slug
    slug = create_slug(title)
    
    # Check if already exists
    content_file = project_root / "content" / "blog" / f"{slug}.html"
    if content_file.exists():
        print(f"❌ Blog post with slug '{slug}' already exists!")
        return
    
    # Create directories
    content_dir = project_root / "content" / "blog"
    template_dir = project_root / "templates" / "blog" / slug
    images_dir = project_root / "static" / "images" / "blog"
    
    content_dir.mkdir(parents=True, exist_ok=True)
    template_dir.mkdir(parents=True, exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate content based on template type
    if template_type == 'tutorial':
        content = generate_tutorial_content(title)
    elif template_type == 'comparison':
        content = generate_comparison_content(title)
    elif template_type == 'case-study':
        content = generate_case_study_content(title)
    elif template_type == 'gradient-descent':
        content = generate_gradient_descent_content(title)
    else:
        content = generate_custom_content(title)
    
    # Save content file
    with open(content_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Copy default image
    default_image = images_dir / "default_image.png"
    blog_image = images_dir / f"{slug}.png"
    if default_image.exists() and not blog_image.exists():
        import shutil
        shutil.copy2(default_image, blog_image)
    
    # Add to blog data
    blog_data_file = project_root / "data" / "blog.py"
    
    # Read current content
    with open(blog_data_file, 'r', encoding='utf-8') as f:
        content_data = f.read()
    
    # Create new blog entry
    new_entry = f'''    {{
        'id': '{slug}',
        'title': '{title}', 
        'excerpt': '{excerpt}',
        'category': '{category}',
        'tags': {tags},
        'featured': {featured},
        'content_file': '{slug}.html',
        'image_url': '/static/images/blog/{slug}.png',
        'read_time': {read_time}
    }},'''
    
    # Insert after the first blog post
    start_marker = "BLOG_POSTS_DATA = ["
    start_idx = content_data.find(start_marker)
    if start_idx == -1:
        print("❌ Could not find BLOG_POSTS_DATA in blog.py")
        return
    
    first_entry_end = content_data.find('}', start_idx + len(start_marker))
    if first_entry_end == -1:
        print("❌ Could not find first blog entry")
        return
    
    insert_pos = first_entry_end + 1
    new_content = content_data[:insert_pos] + '\n' + new_entry + '\n' + content_data[insert_pos:]
    
    # Write back to file
    with open(blog_data_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n✅ Blog post '{title}' created successfully!")
    print(f"📁 Content file: content/blog/{slug}.html")
    print(f"🖼️  Image: static/images/blog/{slug}.png")
    print(f"🔗 URL: /blog/{slug}")
    print(f"📋 Template: {template_type}")
    print(f"\n📝 Next steps:")
    print(f"1. Edit content/blog/{slug}.html to customize your blog post")
    print(f"2. Replace static/images/blog/{slug}.png with your custom image")
    print(f"3. Test your blog post at http://localhost:8000/blog/{slug}")

def generate_tutorial_content(title):
    """Generate tutorial-style content"""
    return f'''<div class="blog-post-content">
    <p>Welcome to this comprehensive tutorial on {title.lower()}. By the end of this guide, you'll have a solid understanding of the concepts and be able to implement them yourself.</p>

    <h2>Prerequisites</h2>
    
    <div class="info-box">
        <h4>📚 What You'll Need</h4>
        <ul>
            <li>Basic understanding of Python</li>
            <li>Familiarity with data structures</li>
            <li>Curiosity and willingness to learn!</li>
        </ul>
    </div>

    <h2>Introduction</h2>
    
    <p>Start with a clear introduction to the topic. Explain what it is, why it's important, and what readers will learn.</p>

    <!-- Interactive Demo -->
    <div class="interactive-demo-section">
        <h2>🎯 Interactive Demo</h2>
        <div class="demo-container">
            <div class="interactive-element">
                <h3>Try It Yourself</h3>
                <p>Experiment with the parameters below to see how they affect the results:</p>
                
                <div class="demo-controls">
                    <label for="param1">Parameter 1:</label>
                    <input type="range" id="param1" min="0" max="100" value="50">
                    <span id="param1-value">50</span>
                    
                    <button onclick="updateDemo()">Update</button>
                </div>
                
                <div id="demo-plot" class="plotly-graph"></div>
            </div>
        </div>
    </div>

    <h2>Implementation</h2>
    
    <p>Provide step-by-step implementation details with code examples.</p>

    <pre><code class="language-python">
# Example implementation
def example_function(param1, param2):
    """
    Example function with proper documentation
    """
    result = param1 * param2
    return result

# Usage
result = example_function(10, 20)
print(f"Result: {{result}}")
    </code></pre>

    <h2>Conclusion</h2>
    
    <p>Summarize the key points and provide next steps for further learning.</p>
</div>'''

def generate_comparison_content(title):
    """Generate comparison-style content"""
    return f'''<div class="blog-post-content">
    <p>In this article, we'll compare different approaches to {title.lower()} and help you understand when to use each one.</p>

    <h2>Overview</h2>
    
    <p>Brief overview of what we'll be comparing and why it matters.</p>

    <h2>Comparison Table</h2>
    
    <div class="comparison-table">
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>Option A</th>
                    <th>Option B</th>
                    <th>Option C</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Performance</td>
                    <td>High</td>
                    <td>Medium</td>
                    <td>Low</td>
                </tr>
                <tr>
                    <td>Ease of Use</td>
                    <td>Medium</td>
                    <td>High</td>
                    <td>High</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h2>Detailed Analysis</h2>
    
    <p>Detailed analysis of each option, including pros and cons.</p>

    <h2>Recommendations</h2>
    
    <div class="highlight-box">
        <p><strong>When to use each option:</strong> Specific use cases and scenarios.</p>
    </div>

    <h2>Conclusion</h2>
    
    <p>Summary of the comparison and final recommendations.</p>
</div>'''

def generate_case_study_content(title):
    """Generate case study content"""
    return f'''<div class="blog-post-content">
    <p>In this case study, we'll explore how {title.lower()} was applied to solve a real-world problem.</p>

    <h2>Problem Statement</h2>
    
    <p>Describe the problem that needed to be solved, including context and constraints.</p>

    <div class="info-box">
        <h4>📋 Project Overview</h4>
        <ul>
            <li><strong>Client:</strong> [Client Name]</li>
            <li><strong>Industry:</strong> [Industry]</li>
            <li><strong>Timeline:</strong> [Duration]</li>
            <li><strong>Team Size:</strong> [Number of people]</li>
        </ul>
    </div>

    <h2>Solution Approach</h2>
    
    <p>Describe the approach taken to solve the problem.</p>

    <h2>Results</h2>
    
    <div class="success-box">
        <h4>🎯 Key Results</h4>
        <ul>
            <li>Result 1: [Specific metric]</li>
            <li>Result 2: [Specific metric]</li>
            <li>Result 3: [Specific metric]</li>
        </ul>
    </div>

    <h2>Lessons Learned</h2>
    
    <div class="info-box">
        <h4>💡 Key Takeaways</h4>
        <ul>
            <li>Lesson 1</li>
            <li>Lesson 2</li>
            <li>Lesson 3</li>
        </ul>
    </div>

    <h2>Conclusion</h2>
    
    <p>Summary of the case study and its implications.</p>
</div>'''

def generate_gradient_descent_content(title):
    """Generate gradient descent content"""
    return f'''<div class="blog-post-content">
    <p>When I first started learning machine learning, gradient descent was one of those concepts that seemed intimidating. Everyone talked about it like it was this magical thing that made models work, but nobody really explained what it actually does.</p>

    <h2>The Learning Problem</h2>
    
    <p>Let's start with a scenario. Say you're building a model to predict house prices. You feed it information like square footage, number of bedrooms, and location, and it spits out predictions. But here's the thing—at first, these predictions are awful.</p>

    <!-- Interactive Demo -->
    <div class="interactive-demo-section">
        <h2>🎯 Interactive Gradient Descent Demo</h2>
        <div class="demo-container">
            <div class="interactive-element">
                <h3>Watch Gradient Descent in Action</h3>
                <p>Adjust the parameters below to see how gradient descent finds the minimum of a loss function:</p>
                
                <div class="demo-controls">
                    <label for="learning-rate">Learning Rate:</label>
                    <input type="range" id="learning-rate" min="0.01" max="0.5" step="0.01" value="0.1">
                    <span id="learning-rate-value">0.1</span>
                    
                    <button onclick="runGradientDescent()">Run Gradient Descent</button>
                </div>
                
                <div id="gradient-descent-plot" class="plotly-graph"></div>
            </div>
        </div>
    </div>

    <h2>Breaking Down the Process</h2>
    
    <p>Let me walk you through how this actually works in practice.</p>

    <h2>Why This Matters So Much</h2>
    
    <p>The reason everyone obsesses over gradient descent is because it's the foundation of basically everything in machine learning.</p>

    <h2>Wrapping Up</h2>
    
    <p>When I finally understood gradient descent, a lot of machine learning suddenly made sense.</p>
</div>'''

def generate_custom_content(title):
    """Generate basic custom content"""
    return f'''<div class="blog-post-content">
    <p>Write your blog post content here. This is the main content that will be displayed on the blog post page.</p>
    
    <h2>Getting Started</h2>
    
    <p>Start writing your blog post content. You can use HTML tags like:</p>
    
    <ul>
        <li><strong>Bold text</strong> for emphasis</li>
        <li><em>Italic text</em> for subtle emphasis</li>
        <li><code>Code snippets</code> for technical terms</li>
        <li>Lists for organizing information</li>
    </ul>
    
    <h2>Code Examples</h2>
    
    <p>You can include code blocks:</p>
    
    <pre><code class="language-python">
# Example Python code
def hello_world():
    print("Hello, World!")
    </code></pre>
    
    <h2>Conclusion</h2>
    
    <p>Wrap up your blog post with a conclusion that summarizes the key points and provides next steps for readers.</p>
</div>'''

if __name__ == '__main__':
    create_blog_with_template()
