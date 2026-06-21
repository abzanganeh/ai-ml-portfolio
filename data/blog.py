from datetime import datetime, timedelta

BLOG_POSTS_DATA = [
    {
        'id': 'asset-manager-security-reference-guide',
        'slug': 'asset-manager-security-reference-guide',
        'title': 'Asset Manager Security: Reference Architecture, IAM, Frameworks, and AI Risk',
        'excerpt': 'Complete reference guide for security and engineering teams at registered investment advisers — hybrid IAM, Reg S-P, attack catalog, case studies, and AI/ML threat and defense patterns.',
        'category': 'Artificial Intelligence',
        'tags': ['asset management', 'iam', 'cybersecurity', 'financial services', 'identity management', 'ai security', 'reg s-p', 'architecture'],
        'featured': False,
        'content_file': 'asset-manager-security-reference-guide.html',
        'image_url': '/static/images/blog/asset-manager-security-reference-guide.png',
        'read_time': 20,
        'created_at': datetime.now() - timedelta(days=1)
    },
    {
        'id': 'asset-manager-security-architecture',
        'slug': 'asset-manager-security-architecture',
        'title': 'The Quiet War on Asset Managers: AI, Deepfakes, and the Coming Quantum Reckoning',
        'excerpt': 'Asset managers are not just fighting yesterday\'s threats. AI has handed attackers capabilities that scale infinitely. Quantum computing is on the horizon. This is the story of what is actually changing, and what the financial industry needs to do before the window closes.',
        'category': 'Artificial Intelligence',
        'tags': ['asset management', 'cybersecurity', 'ai threats', 'quantum computing', 'deepfakes', 'financial security', 'identity', 'iam'],
        'featured': True,
        'content_file': 'asset-manager-security-architecture.html',
        'image_url': '/static/images/blog/asset-manager-security-architecture.png',
        'read_time': 18,
        'created_at': datetime.now()
    },
    {
        'id': 'deepseek-enterprise-security-analysis',
        'slug': 'deepseek-enterprise-security-analysis',
        'title': 'DeepSeek and U.S. Enterprise AI: Why Companies Are Switching, and What the Security Tradeoffs Actually Are',
        'excerpt': 'Ramp data shows U.S. firms paying DeepSeek directly for cheaper inference — but hosted API use routes data to China under PRC law. A technical breakdown of cost pressure, documented risks, self-hosting nuance, and what security claims hold up.',
        'category': 'Artificial Intelligence',
        'tags': ['deepseek', 'ai security', 'data privacy', 'enterprise ai', 'llm', 'cloud security', 'ai governance'],
        'featured': True,
        'content_file': 'deepseek-enterprise-security-analysis.html',
        'image_url': '/static/images/blog/deepseek-enterprise-security-analysis.png',
        'read_time': 14,
        'created_at': datetime.now()
    },
    {
        'id': 'gradient-descent-explained',
        'title': 'Understanding Gradient Descent: The Engine Behind Machine Learning', 
        'excerpt': 'When I first started learning machine learning, gradient descent was one of those concepts that seemed intimidating. Everyone talked about it like it was this magical thing that made models work, but nobody really explained what it actually does.',
        'category': 'Machine Learning',
        'tags': ['gradient descent', 'optimization', 'machine learning', 'algorithms', 'neural networks'],
        'featured': False,
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
