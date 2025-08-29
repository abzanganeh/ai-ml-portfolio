# data/tutorials.py - Tutorial Configuration Data

TUTORIALS_DATA = [
    {
        'title': 'Natural Language Processing Fundamentals',
        'slug': 'nlp-fundamentals',
        'description': 'Learn the fundamentals of Natural Language Processing with interactive examples and hands-on exercises.',
        'category': 'NLP',
        'difficulty': 'intermediate',
        'duration': '45 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/nlp/index.html',
        'published': True,
        'excerpt': 'Master NLP concepts through 8 interactive sections covering tokenization, sentiment analysis, and more.',
        'tags': 'nlp, text-processing, sentiment-analysis, language-models'
    },
    {
        'title': 'Naive Bayes Classification Guide',
        'slug': 'naive-bayes',
        'description': 'Master Naive Bayes classification with interactive weather prediction demo and comprehensive mathematical explanations.',
        'category': 'Machine Learning',
        'difficulty': 'intermediate',
        'duration': '35 min', 
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/naive-bayes/index.html',
        'published': True,
        'excerpt': 'Learn Naive Bayes through interactive weather prediction examples, mathematical foundations, and real-world applications.',
        'tags': 'naive-bayes, classification, probability, machine-learning, bayes-theorem'
    },
    {
        'title': 'Machine Learning Fundamentals',
        'slug': 'ml-fundamentals',
        'description': 'Complete hands-on course with Python implementations and real-world examples covering introduction, regression, and classification.',
        'category': 'Machine Learning',
        'difficulty': 'beginner',
        'duration': '90 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/ml_fundamentals/index.html',
        'published': True,
        'excerpt': 'Complete ML fundamentals course with three comprehensive chapters covering introduction, regression, and classification.',
        'tags': 'machine-learning, python, regression, classification, supervised-learning'
    },
    {
    'title': 'Understanding ML Model Relationships: From Basic Models to Ensemble Methods',
    'slug': 'ml-model-relationships',
    'description': 'Interactive guide to understanding how different ML techniques connect, from basic models through regularization to ensemble methods like Random Forest and XGBoost',
    'category': 'Machine Learning',
    'difficulty': 'intermediate',
    'duration': '90 min',
    'author': 'Alireza Barzin Zanganeh',
    'has_dedicated_template': True,
    'template_path': 'tutorials/ml-model-relationships/index.html',
    'published': True,
    'excerpt': 'Master the relationships between ML algorithms through 8 interactive chapters covering the journey from linear models to advanced ensemble methods.',
    'tags': 'ensemble-methods, random-forest, xgboost, gradient-boosting, bagging, regularization, model-selection'
    },
    {
        'title': 'Decision Tree Regression',
        'slug': 'decision-tree-regression',
        'description': 'Learn how decision trees work for regression problems with practical examples.',
        'category': 'Machine Learning',
        'difficulty': 'intermediate',
        'duration': '30 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': False,
        'template_path': None,
        'published': True,
        'excerpt': 'Understand decision tree algorithms for regression with step-by-step examples.',
        'content': '''
        <h2>Introduction to Decision Tree Regression</h2>
        <p>Decision trees are powerful algorithms that can be used for both classification and regression tasks...</p>
        
        <h3>How Decision Trees Work</h3>
        <p>Decision trees make predictions by splitting the data based on feature values:</p>
        <ol>
            <li>Choose the best feature to split on</li>
            <li>Create branches for different values</li>
            <li>Repeat until stopping criteria are met</li>
        </ol>
        
        <h3>Advantages and Disadvantages</h3>
        <div class="pros-cons">
            <div class="pros">
                <h4>Pros</h4>
                <ul>
                    <li>Easy to understand and interpret</li>
                    <li>Requires little data preparation</li>
                    <li>Handles both numerical and categorical data</li>
                </ul>
            </div>
            <div class="cons">
                <h4>Cons</h4>
                <ul>
                    <li>Can overfit to training data</li>
                    <li>Unstable - small changes can result in different trees</li>
                    <li>Biased toward features with more levels</li>
                </ul>
            </div>
        </div>
        '''
    },
    {
        'title': 'Feature Engineering Essentials',
        'slug': 'feature-engineering',
        'description': 'Master the art of feature engineering to improve your machine learning models.',
        'category': 'Data Science',
        'difficulty': 'intermediate',
        'duration': '40 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': False,
        'template_path': None,
        'published': True,
        'excerpt': 'Learn essential feature engineering techniques to boost model performance.',
        'content': '''
        <h2>What is Feature Engineering?</h2>
        <p>Feature engineering is the process of creating, transforming, and selecting features to improve machine learning model performance...</p>
        
        <h3>Common Techniques</h3>
        <ul>
            <li><strong>Scaling:</strong> Normalize features to similar ranges</li>
            <li><strong>Encoding:</strong> Convert categorical variables to numerical</li>
            <li><strong>Creation:</strong> Generate new features from existing ones</li>
            <li><strong>Selection:</strong> Choose the most relevant features</li>
        </ul>
        
        <h3>Best Practices</h3>
        <ol>
            <li>Understand your data thoroughly</li>
            <li>Handle missing values appropriately</li>
            <li>Consider domain knowledge</li>
            <li>Avoid data leakage</li>
            <li>Test feature importance</li>
        </ol>
        '''
    }
]

def get_tutorial_by_slug(slug):
    """Get tutorial data by slug"""
    for tutorial in TUTORIALS_DATA:
        if tutorial['slug'] == slug:
            return tutorial
    return None

def get_tutorials_by_category(category=None):
    """Get tutorials filtered by category"""
    if category:
        return [t for t in TUTORIALS_DATA if t['category'].lower() == category.lower()]
    return TUTORIALS_DATA

def get_published_tutorials():
    """Get only published tutorials"""
    return [t for t in TUTORIALS_DATA if t.get('published', False)]

def get_tutorial_categories():
    """Get unique categories"""
    categories = set()
    for tutorial in TUTORIALS_DATA:
        categories.add(tutorial['category'])
    return sorted(list(categories))


