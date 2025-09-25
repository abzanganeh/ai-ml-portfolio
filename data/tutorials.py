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
        'title': 'Decision Trees Tutorial',
        'slug': 'decision-trees',
        'description': 'Master decision tree algorithms from basics to advanced techniques. 5 comprehensive chapters covering introduction, mathematics, Python implementation, overfitting prevention, and ensemble methods.',
        'category': 'Machine Learning',
        'difficulty': 'intermediate',
        'duration': '95 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/decision_trees/index.html',
        'published': True,
        'excerpt': 'Interactive decision tree tutorial with Python demos, mathematical foundations, and practical applications across 5 focused chapters.',
        'tags': 'decision-trees,classification,regression,entropy,gini-impurity,pruning,ensemble-methods,python'
    },
    {
        'title': 'Complete Exploratory Data Analysis: LeetCode Dataset',
        'slug': 'complete-eda-leetcode',
        'description': 'Master the complete EDA workflow from data loading to insights, using a real LeetCode dataset with 1825 coding problems.',
        'category': 'Data Science',
        'difficulty': 'intermediate',
        'duration': '90 minutes',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/complete-eda-leetcode/index.html',
        'published': True,
        'excerpt': 'Learn the complete EDA process: missing data strategies, outlier detection, visualization techniques, and statistical insights.',
        'tags': 'eda,pandas,matplotlib,seaborn,data-cleaning,statistics,visualization'
    },
    {
        'title': 'Comprehensive Clustering Analysis',
        'slug': 'clustering',
        'description': 'Master clustering algorithms from mathematical foundations to advanced applications. 15 comprehensive chapters covering distance metrics, K-means, hierarchical clustering, DBSCAN, and evaluation techniques.',
        'category': 'Machine Learning',
        'difficulty': 'advanced',
        'duration': '300 minutes',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/clustering/index.html',
        'published': True,
        'excerpt': 'Clean, interactive clustering tutorial with mathematical foundations, algorithm implementations, and real-world applications across 15 detailed chapters.',
        'tags': 'clustering,k-means,hierarchical-clustering,dbscan,distance-metrics,unsupervised-learning,interactive'
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


