from datetime import datetime, timedelta

BLOG_POSTS_DATA = [
    {
        'id': 'deepseek-enterprise-security-analysis',
        'slug': 'deepseek-enterprise-security-analysis',
        'title': 'DeepSeek and U.S. Enterprise AI: Why Companies Are Switching, and What the Security Tradeoffs Actually Are',
        'excerpt': 'Ramp data shows U.S. firms paying DeepSeek directly for cheaper inference — but hosted API use routes data to China under PRC law. A technical breakdown of cost pressure, documented risks, self-hosting nuance, and what security claims hold up.',
        'category': 'Artificial Intelligence',
        'tags': ['deepseek', 'ai security', 'data privacy', 'enterprise ai', 'llm', 'cloud security', 'ai governance'],
        'featured': True,
        'content_file': 'deepseek-enterprise-security-analysis.html',
        'image_url': '/static/images/blog/default_image.png',
        'read_time': 14,
        'created_at': datetime.now()
    },
    {
        'id': 'gradient-descent-explained',
        'title': 'Understanding Gradient Descent: The Engine Behind Machine Learning', 
        'excerpt': 'When I first started learning machine learning, gradient descent was one of those concepts that seemed intimidating. Everyone talked about it like it was this magical thing that made models work, but nobody really explained what it actually does.',
        'category': 'Machine Learning',
        'tags': ['gradient descent', 'optimization', 'machine learning', 'algorithms', 'neural networks'],
        'featured': True,
        'content_file': 'gradient-descent-explained.html',
        'image_url': '/static/images/blog/gradient-descent.png',
        'read_time': 8,
        'created_at': datetime.now()
    },
    {
        'id': 'transformer-architecture',
        'title': 'Understanding Transformer Architecture', 
        'excerpt': 'Learn about the attention mechanism and transformer architecture',
        'category': 'Deep Learning',
        'tags': ['transformers', 'attention', 'nlp'],
        'featured': False,
        'content_file': 'transformer-architecture.html',
        'image_url': '/static/images/blog/transformer-architecture.png',
        'created_at': datetime.now() - timedelta(days=30)  # About a month ago
    }
]
