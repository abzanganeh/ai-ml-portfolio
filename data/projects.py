# data/projects.py - Project Configuration Data

PROJECTS_DATA = [
    {
        'name': 'movie-agent-service',
        'title': 'Movie Agent Service',
        'description': 'Core library for AI-powered movie discovery and analysis. Features RAG-based semantic search, tool-calling agents (LangChain), computer vision poster analysis (BLIP), interactive quizzes, and session-based memory management. Built with Python, OpenAI embeddings, and OOP principles.',
        'category': 'AI/LLM',
        'technology_stack': [
            'Python', 'LangChain', 'OpenAI', 'FAISS', 'BLIP', 'Transformers', 
            'RAG', 'Vector Search', 'Embeddings', 'Tool-calling Agents'
        ],
        'challenges': [
            'RAG-based semantic search implementation with FAISS vector store',
            'Tool-calling agent architecture with LangChain',
            'Computer vision poster analysis using BLIP model',
            'Session-based memory management for conversational context',
            'Interactive quiz generation with multiple question types',
            'Designing production-grade tool-calling architecture over ReAct',
            'OOP principles with dependency injection and factory patterns'
        ],
        'results': {
            'architecture': 'Tool-calling agent architecture for production reliability',
            'vector_store': 'FAISS-based semantic search for movie discovery',
            'vision_model': 'BLIP for poster analysis and genre inference',
            'memory_management': 'Session-based state management',
            'quiz_system': 'Multiple quiz types with interactive questions',
            'design_patterns': 'OOP with single responsibility, dependency inversion, factory pattern'
        },
        'github_url': 'https://github.com/abzanganeh/movie-agent-service',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/movie-agent-service.png',
        'has_dedicated_template': False,
        'template_path': None,
        'published': True
    },
    {
        'name': 'bank-term-deposit-prediction',
        'title': 'Bank Term Deposit Prediction - Advanced ML Pipeline',
        'description': 'A comprehensive ML solution predicting customer term deposit subscriptions using 8+ algorithms with hyperparameter tuning, achieving 60% F1-Score improvement over baseline models.',
        'category': 'Machine Learning',
        'technology_stack': [
            'Python', 'Scikit-learn', 'XGBoost', 'LightGBM', 'Pandas', 'NumPy', 
            'Matplotlib', 'Seaborn', 'Optuna', 'Jupyter', 'Joblib'
        ],
        'challenges': [
            'Handling imbalanced dataset with ~88% customers not subscribing',
            'Feature engineering from bank marketing campaign data (51 final features)',
            'Multicollinearity handling in economic indicators',
            'Hyperparameter tuning for 8 different ML algorithms',
            'Model stacking and ensemble optimization',
            'Threshold optimization for optimal F1-scores'
        ],
        'results': {
            'dataset_size': '41,188 customers × 51 engineered features',
            'class_distribution': '88% no subscription, 12% subscription',
            'algorithms_compared': '8 models: Naive Bayes, Decision Trees, Random Forest, XGBoost, LightGBM, SVM, Logistic Regression, Voting Ensemble',
            'best_performance': 'XGBoost: 60.33% F1-Score, 94.79% ROC-AUC',
            'improvement': '58% better F1-score compared to baseline models',
            'hyperparameter_tuning': 'Automated optimization using Optuna (20 trials per model)',
            'model_stacking': 'Voting ensemble combining top 6 performers',
            'business_value': 'Identifies top 10% of prospects with 70% precision, optimizes marketing ROI'
        },
        'github_url': 'https://github.com/abzanganeh/bank-term-deposit-prediction',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/bank-term-deposit-prediction.png',
        'has_dedicated_template': True,
        'template_path': 'projects/bank-term-deposit-prediction/index.html',
        'published': True
    },
    {
        'name': 'churn-risk-intelligence',
        'title': 'Churn Risk Intelligence',
        'description': 'Production-ready machine learning solution for predicting customer churn with 84.77% ROC-AUC. Features 16 optimized models, SHAP interpretability, Optuna hyperparameter tuning, and comprehensive business insights.',
        'category': 'Machine Learning',
        'technology_stack': [
            'Python', 'Scikit-learn', 'XGBoost', 'Optuna', 'SHAP', 'Pandas', 'NumPy', 
            'Matplotlib', 'Seaborn', 'Plotly', 'imbalanced-learn', 'Jupyter', 'Joblib'
        ],
        'challenges': [
            'Handling imbalanced customer churn dataset (26.5% churn rate)',
            'Feature engineering from telecommunications data',
            'Hyperparameter optimization with Optuna for 16 models',
            'Class imbalance handling with SMOTE technique',
            'Model interpretability with SHAP for actionable insights',
            'Ensemble learning with Stacking and Voting classifiers',
            'Production-ready pipeline development'
        ],
        'results': {
            'best_roc_auc': '84.77%',
            'best_accuracy': '80.62%',
            'best_model_roc': 'XGBoost with Optuna',
            'best_model_accuracy': 'Logistic Regression',
            'best_precision': '66.78%',
            'best_recall': '77.27%',
            'total_models': '16',
            'ensemble_roc_auc': '84.71%',
            'business_value': 'Identifies high-risk customers for targeted retention campaigns with 84.77% ROC-AUC',
            'dataset_size': '7,043 customers × 21 features'
        },
        'github_url': 'https://github.com/abzanganeh/churn-risk-intelligence',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/churn-risk-intelligence.png',
        'has_dedicated_template': True,
        'template_path': 'projects/churn-risk-intelligence/index.html',
        'published': True
    },
    {
        'name': 'satellite-signal-prediction',
        'title': 'Satellite Signal Strength Prediction',
        'description': 'Advanced regression pipeline predicting satellite signal quality from weather conditions using multiple ML algorithms and real-time API data.',
        'category': 'Machine Learning',
        'technology_stack': ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'SHAP', 'OpenWeatherMap API', 'Matplotlib', 'Seaborn'],
        'challenges': [
            'Integrating real-time weather data from multiple APIs',
            'Physics-based signal attenuation modeling',
            'Feature engineering from temporal weather patterns',
            'Model interpretability with SHAP analysis',
            'Global data collection across diverse climates'
        ],
        'results': {
            'r2_score': 'TBD',
            'rmse': 'TBD dBm',
            'best_model': 'TBD',
            'global_locations': '10 cities',
            'features_engineered': '15+'
        },
        'github_url': 'https://github.com/abzanganeh/signal-strength',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/satellite-signal-prediction.png',
        'has_dedicated_template': True,
        'template_path': 'projects/satellite-signal-prediction/index.html',
        'published': True
    },
    {
        'name': 'titanic-survival',
        'title': 'Titanic Survival Prediction',
        'description': 'Machine learning project predicting passenger survival using ensemble methods and feature engineering techniques.',
        'category': 'Machine Learning',
        'technology_stack': ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Flask'],
        'challenges': [
            'Handling missing data in passenger records',
            'Feature engineering from categorical variables',
            'Balancing model complexity with interpretability',
            'Creating an interactive web demonstration'
        ],
        'results': {
            'accuracy': '84.2%',
            'precision': '82.1%',
            'recall': '78.9%',
            'f1_score': '80.4%'
        },
        'github_url': 'https://github.com/abzanganeh/titanic-survival',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/titanic-survival.png',
        'has_dedicated_template': True,
        'template_path': 'projects/titanic-survival/index.html',
        'published': True
    }
]