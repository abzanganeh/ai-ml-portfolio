from datetime import datetime

BLOG_POSTS_DATA = [
    {
        'id': 'quality-engineering-center-of-excellence',
        'slug': 'quality-engineering-center-of-excellence',
        'title': 'Quality Is an Architecture Decision, Not a Headcount Decision',
        'excerpt': 'Unweighted defect counts are noise. Why severity-weighted defect density, automation-first CI/CD gates, and design-time SDET practice are the same discipline whether it runs inside one team or scales into an organization-wide Quality Engineering Center of Excellence.',
        'category': 'Artificial Intelligence',
        'tags': ['quality engineering', 'sdet', 'test automation', 'shift left', 'ci/cd', 'engineering leadership', 'agentic ai', 'staff engineer'],
        'featured': False,
        'content_file': 'quality-engineering-center-of-excellence.html',
        'image_url': '/static/images/blog/quality-engineering-center-of-excellence.png',
        'read_time': 12,
        'created_at': datetime(2026, 7, 31)
    },
    {
        'id': 'at-least-once-idempotent-consumers',
        'slug': 'at-least-once-idempotent-consumers',
        'title': 'At-Least-Once Is the Default: Designing for Duplicate Events Without Lying to Users',
        'excerpt': 'Exactly-once delivery is a broker myth, not a system property. Why idempotent consumers, dedupe keys, and fail-closed handling are a design and quality-gate requirement — and why agentic test pipelines inherit the same duplicate-event risk they exist to catch.',
        'category': 'Artificial Intelligence',
        'tags': ['event-driven architecture', 'idempotency', 'kafka', 'quality engineering', 'agentic ai', 'distributed systems', 'staff engineer', 'test automation'],
        'featured': False,
        'content_file': 'at-least-once-idempotent-consumers.html',
        'image_url': '/static/images/blog/at-least-once-idempotent-consumers.png',
        'read_time': 12,
        'created_at': datetime(2026, 7, 30)
    },
    {
        'id': 'api-action-boundaries',
        'slug': 'api-action-boundaries',
        'title': 'When the Caller Is an Agent: Action Boundaries for AI-Driven Backends',
        'excerpt': 'A confident model output is not admission to mutate Tier‑1 state. How to design action boundaries when callers are humans or agents — proposal vs admission, risk gates, idempotency, sync vs async, and fail-closed assurance.',
        'category': 'Artificial Intelligence',
        'tags': ['agentic ai', 'system design', 'api design', 'backend', 'idempotency', 'risk gate', 'distributed systems', 'staff engineer', 'ml'],
        'featured': False,
        'content_file': 'api-action-boundaries.html',
        'image_url': '/static/images/blog/api-action-boundaries.png',
        'read_time': 13,
        'created_at': datetime(2026, 7, 10)
    },
    {
        'id': 'wire-fraud-deepfake-controls',
        'slug': 'wire-fraud-deepfake-controls',
        'title': 'When the CFO on the Call Wasn\'t Real: Wire Fraud Controls That Survive Deepfakes',
        'excerpt': 'After Hong Kong, the industry split: buy deepfake detection, or ask why a video call counted as authorization. Wire fraud after AI is an authorization design problem — dual control, out-of-band verification, step-up at the action, and custodian holds that hold when every channel is fake.',
        'category': 'Artificial Intelligence',
        'tags': ['wire fraud', 'deepfakes', 'bec', 'asset management', 'iam', 'cybersecurity', 'financial services', 'separation of duties'],
        'featured': False,
        'content_file': 'wire-fraud-deepfake-controls.html',
        'image_url': '/static/images/blog/wire-fraud-deepfake-controls.png',
        'read_time': 12,
        'created_at': datetime(2026, 6, 21)
    },
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
        'created_at': datetime(2025, 11, 15)
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
        'created_at': datetime(2026, 6, 20)
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
        'created_at': datetime(2026, 6, 17)
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
        'created_at': datetime(2025, 10, 5)
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
        'read_time': 5,
        'created_at': datetime(2025, 8, 26)
    }
]
