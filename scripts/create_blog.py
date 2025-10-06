#!/usr/bin/env python3
"""
Simple Blog Post Creator
========================

Quick script to create new blog posts with minimal input.

Usage:
    python scripts/create_blog.py
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

def create_blog_post():
    """Interactive blog post creation"""
    print("🚀 Blog Post Creator")
    print("=" * 30)
    
    # Get blog post details
    title = input("📝 Blog Post Title: ").strip()
    if not title:
        print("❌ Title is required!")
        return
    
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
    
    # Create content file
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
        content = f.read()
    
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
    
    # Insert after the first blog post (after the opening bracket)
    start_marker = "BLOG_POSTS_DATA = ["
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("❌ Could not find BLOG_POSTS_DATA in blog.py")
        return
    
    # Find the end of the first entry to insert after it
    first_entry_end = content.find('}', start_idx + len(start_marker))
    if first_entry_end == -1:
        print("❌ Could not find first blog entry")
        return
    
    # Insert the new entry
    insert_pos = first_entry_end + 1
    new_content = content[:insert_pos] + '\n' + new_entry + '\n' + content[insert_pos:]
    
    # Write back to file
    with open(blog_data_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n✅ Blog post '{title}' created successfully!")
    print(f"📁 Content file: content/blog/{slug}.html")
    print(f"🖼️  Image: static/images/blog/{slug}.png")
    print(f"🔗 URL: /blog/{slug}")
    print(f"\n📝 Next steps:")
    print(f"1. Edit content/blog/{slug}.html to write your blog post")
    print(f"2. Replace static/images/blog/{slug}.png with your custom image")
    print(f"3. Test your blog post at http://localhost:8000/blog/{slug}")

if __name__ == '__main__':
    create_blog_post()
