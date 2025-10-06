#!/usr/bin/env python3
"""
Blog Management System
=====================

This script helps manage blog posts for the Flask portfolio website.
It provides functionality to:
- Create new blog posts
- Update existing blog posts
- Generate blog post templates
- Manage blog metadata

Usage:
    python scripts/blog_manager.py create "Blog Post Title" "Machine Learning" "tag1,tag2,tag3"
    python scripts/blog_manager.py list
    python scripts/blog_manager.py update "blog-slug"
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

class BlogManager:
    def __init__(self):
        self.project_root = project_root
        self.blog_data_file = self.project_root / "data" / "blog.py"
        self.content_dir = self.project_root / "content" / "blog"
        self.template_dir = self.project_root / "templates" / "blog"
        self.images_dir = self.project_root / "static" / "images" / "blog"
        
        # Ensure directories exist
        self.content_dir.mkdir(parents=True, exist_ok=True)
        self.template_dir.mkdir(parents=True, exist_ok=True)
        self.images_dir.mkdir(parents=True, exist_ok=True)
    
    def create_slug(self, title):
        """Convert title to URL-friendly slug"""
        import re
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    def create_blog_post(self, title, category, tags, excerpt=None, featured=False, read_time=None):
        """Create a new blog post"""
        slug = self.create_slug(title)
        
        # Check if blog post already exists
        if self.blog_post_exists(slug):
            print(f"❌ Blog post with slug '{slug}' already exists!")
            return False
        
        # Generate excerpt if not provided
        if not excerpt:
            excerpt = f"Learn about {title.lower()} in this comprehensive guide."
        
        # Estimate read time if not provided
        if not read_time:
            read_time = max(5, len(title.split()) // 10)
        
        # Create blog post data
        blog_data = {
            'id': slug,
            'title': title,
            'excerpt': excerpt,
            'category': category,
            'tags': [tag.strip() for tag in tags.split(',')],
            'featured': featured,
            'content_file': f'{slug}.html',
            'image_url': f'/static/images/blog/{slug}.png',
            'read_time': read_time
        }
        
        # Create content file
        self.create_content_file(slug, title)
        
        # Create template directory
        template_dir = self.template_dir / slug
        template_dir.mkdir(exist_ok=True)
        
        # Create index.html template
        self.create_template_file(slug, title, category, tags)
        
        # Copy default image
        default_image = self.images_dir / "default_image.png"
        blog_image = self.images_dir / f"{slug}.png"
        if default_image.exists() and not blog_image.exists():
            import shutil
            shutil.copy2(default_image, blog_image)
        
        # Add to blog data
        self.add_to_blog_data(blog_data)
        
        print(f"✅ Blog post '{title}' created successfully!")
        print(f"📁 Content file: content/blog/{slug}.html")
        print(f"📁 Template: templates/blog/{slug}/index.html")
        print(f"🖼️  Image: static/images/blog/{slug}.png")
        print(f"🔗 URL: /blog/{slug}")
        
        return True
    
    def create_content_file(self, slug, title):
        """Create the HTML content file"""
        content_file = self.content_dir / f"{slug}.html"
        
        content = f'''<div class="blog-post-content">
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
    
    <div class="highlight-box">
        <p><strong>Key Takeaways:</strong></p>
        <ul>
            <li>Point 1</li>
            <li>Point 2</li>
            <li>Point 3</li>
        </ul>
    </div>
</div>'''
        
        with open(content_file, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def create_template_file(self, slug, title, category, tags):
        """Create the template file"""
        template_file = self.template_dir / slug / "index.html"
        
        template = f'''{{% extends "base.html" %}}

{{% block title %}}{title} - {{{{ site_title }}}}{{% endblock %}}

{{% block meta_description %}}Learn about {title.lower()} in this comprehensive guide.{{% endblock %}}

{{% block og_title %}}{title}{{% endblock %}}
{{% block og_description %}}Learn about {title.lower()} in this comprehensive guide.{{% endblock %}}

{{% block extra_css %}}
<link rel="stylesheet" href="{{{{ url_for('static', filename='css/pages/blog.css') }}}}">
{{% endblock %}}

{{% block content %}}
<!-- Back to Blog Link -->
<div class="container">
    <div class="back-to-blog">
        <a href="{{{{ url_for('blog') }}}}">
            <i class="fas fa-arrow-left"></i> Back to Blog
        </a>
    </div>
</div>

<!-- Post Header -->
<header class="blog-post-header">
    <div class="container">
        <div class="post-header-content" data-bg-image="/static/images/blog/{slug}.png">
            <a href="{{{{ url_for('blog_category', category='{category}') }}}}" class="post-category-link">
                {category}
            </a>
            
            <h1>{title}</h1>
            
            <p class="post-excerpt">Learn about {title.lower()} in this comprehensive guide.</p>
            
            <div class="post-meta-info">
                <div class="post-meta-item">
                    <i class="fas fa-calendar"></i>
                    <time datetime="{{{{ post.created_at.isoformat() if post.created_at else '' }}}}">
                        {{{{ post.created_at.strftime('%B %d, %Y') if post.created_at else 'Recently' }}}}
                    </time>
                </div>
                
                <div class="post-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>{{{{ post.read_time if post.read_time else 5 }}}} min read</span>
                </div>
                
                <div class="post-meta-item">
                    <i class="fas fa-user"></i>
                    <span>{{{{ post.author if post.author else 'Alireza Barzin Zanganeh' }}}}</span>
                </div>
            </div>
            
            <div class="post-tags-header">
                {{{{ "".join([f'<span class="tag">{{{{ tag }}}}</span>' for tag in post.tags]) if post.tags else '' }}}}
            </div>
        </div>
    </div>
</header>

<!-- Post Content -->
<article class="post-content-wrapper">
    <div class="post-content">
        {{{{ post.content|safe }}}}
    </div>
</article>

<!-- Post Footer -->
<footer class="post-footer">
    <div class="post-footer-content">
        <!-- Tags -->
        <div class="post-tags-footer">
            <h3>Topics Covered</h3>
            <div class="tags-list">
                {{{{ "".join([f'<a href="{{{{ url_for("blog") }}}}?tag={{{{ tag }}}}" class="tag">{{{{ tag }}}}</a>' for tag in post.tags]) if post.tags else '' }}}}
            </div>
        </div>
        
        <!-- Share -->
        <div class="post-share">
            <h3>Share This Article</h3>
            <div class="share-buttons">
                <a href="https://twitter.com/intent/tweet?url={{{{ request.url }}}}&text={title}" 
                   target="_blank" class="share-btn twitter" aria-label="Share on Twitter">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url={{{{ request.url }}}}" 
                   target="_blank" class="share-btn linkedin" aria-label="Share on LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u={{{{ request.url }}}}" 
                   target="_blank" class="share-btn facebook" aria-label="Share on Facebook">
                    <i class="fab fa-facebook"></i>
                </a>
                <a href="mailto:?subject={title}&body=Check out this article: {{{{ request.url }}}}" 
                   class="share-btn email" aria-label="Share via Email">
                    <i class="fas fa-envelope"></i>
                </a>
            </div>
        </div>
    </div>
</footer>
{{% endblock %}}

{{% block extra_js %}}
<script>
document.addEventListener('DOMContentLoaded', function() {{
    const headerContent = document.querySelector('.post-header-content');
    if (headerContent) {{
        const bgImage = headerContent.getAttribute('data-bg-image');
        if (bgImage) {{
            headerContent.style.backgroundImage = `linear-gradient(rgba(167, 218, 248, 0.85), rgba(240, 236, 255, 0.75)), url('${{bgImage}}')`;
        }}
    }}
    
    // Reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--primary-color);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {{
        const article = document.querySelector('.post-content');
        if (article) {{
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const articleBottom = articleTop + articleHeight - windowHeight;
            const progress = Math.min(Math.max((scrollTop - articleTop) / (articleBottom - articleTop), 0), 1);
            
            progressBar.style.width = (progress * 100) + '%';
        }}
    }});
}});
</script>
{{% endblock %}}'''
        
        with open(template_file, 'w', encoding='utf-8') as f:
            f.write(template)
    
    def blog_post_exists(self, slug):
        """Check if a blog post with the given slug already exists"""
        content_file = self.content_dir / f"{slug}.html"
        return content_file.exists()
    
    def add_to_blog_data(self, blog_data):
        """Add blog post data to the blog.py file"""
        # Read current blog data
        with open(self.blog_data_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the BLOG_POSTS_DATA list
        start_marker = "BLOG_POSTS_DATA = ["
        end_marker = "]"
        
        start_idx = content.find(start_marker)
        if start_idx == -1:
            print("❌ Could not find BLOG_POSTS_DATA in blog.py")
            return False
        
        # Find the end of the list
        bracket_count = 0
        end_idx = start_idx + len(start_marker)
        for i, char in enumerate(content[start_idx + len(start_marker):]):
            if char == '[':
                bracket_count += 1
            elif char == ']':
                if bracket_count == 0:
                    end_idx = start_idx + len(start_marker) + i
                    break
                bracket_count -= 1
        
        # Create the new blog post entry
        new_entry = f'''    {{
        'id': '{blog_data['id']}',
        'title': '{blog_data['title']}', 
        'excerpt': '{blog_data['excerpt']}',
        'category': '{blog_data['category']}',
        'tags': {blog_data['tags']},
        'featured': {blog_data['featured']},
        'content_file': '{blog_data['content_file']}',
        'image_url': '{blog_data['image_url']}',
        'read_time': {blog_data['read_time']}
    }},'''
        
        # Insert the new entry
        new_content = content[:end_idx] + '\n' + new_entry + '\n' + content[end_idx:]
        
        # Write back to file
        with open(self.blog_data_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    
    def list_blog_posts(self):
        """List all blog posts"""
        print("📝 Blog Posts:")
        print("=" * 50)
        
        # Read blog data
        with open(self.blog_data_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract blog posts (simple parsing)
        import re
        posts = re.findall(r"'id':\s*'([^']+)'.*?'title':\s*'([^']+)'", content, re.DOTALL)
        
        for i, (slug, title) in enumerate(posts, 1):
            content_file = self.content_dir / f"{slug}.html"
            template_file = self.template_dir / slug / "index.html"
            image_file = self.images_dir / f"{slug}.png"
            
            status = "✅" if content_file.exists() else "❌"
            template_status = "✅" if template_file.exists() else "❌"
            image_status = "✅" if image_file.exists() else "❌"
            
            print(f"{i}. {title}")
            print(f"   Slug: {slug}")
            print(f"   Content: {status} Template: {template_status} Image: {image_status}")
            print(f"   URL: /blog/{slug}")
            print()
    
    def update_blog_post(self, slug):
        """Update an existing blog post"""
        if not self.blog_post_exists(slug):
            print(f"❌ Blog post with slug '{slug}' does not exist!")
            return False
        
        content_file = self.content_dir / f"{slug}.html"
        print(f"📝 Opening content file: {content_file}")
        print("Edit the content file and save it to update the blog post.")
        
        return True

def main():
    parser = argparse.ArgumentParser(description='Blog Management System')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Create command
    create_parser = subparsers.add_parser('create', help='Create a new blog post')
    create_parser.add_argument('title', help='Blog post title')
    create_parser.add_argument('category', help='Blog post category')
    create_parser.add_argument('tags', help='Comma-separated tags')
    create_parser.add_argument('--excerpt', help='Blog post excerpt')
    create_parser.add_argument('--featured', action='store_true', help='Mark as featured post')
    create_parser.add_argument('--read-time', type=int, help='Estimated read time in minutes')
    
    # List command
    subparsers.add_parser('list', help='List all blog posts')
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Update an existing blog post')
    update_parser.add_argument('slug', help='Blog post slug')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    manager = BlogManager()
    
    if args.command == 'create':
        manager.create_blog_post(
            title=args.title,
            category=args.category,
            tags=args.tags,
            excerpt=args.excerpt,
            featured=args.featured,
            read_time=args.read_time
        )
    elif args.command == 'list':
        manager.list_blog_posts()
    elif args.command == 'update':
        manager.update_blog_post(args.slug)

if __name__ == '__main__':
    main()
