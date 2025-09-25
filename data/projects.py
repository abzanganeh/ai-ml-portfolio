# data/projects.py - Project Configuration Data

PROJECTS_DATA = [
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
        'github_url': 'https://github.com/abzanganeh/signal_strength',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/satellite-signal-prediction.png',
        'has_dedicated_template': True,
        'template_path': 'projects/satellite-signal-prediction/index.html',
        'published': True
    },
    {
        'name': 'churn-risk-intelligence',
        'title': 'Churn Risk Intelligence',
        'description': 'Customer churn prediction using machine learning. Achieves 82% accuracy with comprehensive analytics pipeline for proactive retention strategies.',
        'category': 'Machine Learning',
        'technology_stack': [
            'Python', 'Scikit-learn', 'Pandas', 'NumPy', 
            'Matplotlib', 'Seaborn', 'Jupyter', 'Joblib'
        ],
        'challenges': [
            'Handling imbalanced customer churn dataset (26.5% churn rate)',
            'Feature engineering from telecommunications data',
            'Model selection and hyperparameter optimization',
            'Class imbalance handling with SMOTE technique',
            'Business impact interpretation and actionable insights'
        ],
        'results': {
            'best_accuracy': '82.19%',
            'best_model': 'Logistic Regression',
            'precision_churn': '69%',
            'recall_churn': '60%',
            'business_value': 'Identifies high-risk customers for targeted retention',
            'dataset_size': '7,043 customers × 21 features'
        },
        'github_url': 'https://github.com/abzanganeh/churn_risk_intelligence',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/churn-risk-intelligence.png',
        'has_dedicated_template': True,
        'template_path': 'projects/churn-risk-intelligence/index.html',
        'published': True
    },
    {
        'name': 'bank-term-deposit-prediction',
        'title': 'Bank Term Deposit Prediction',
        'description': 'Machine learning solution for predicting bank term deposit subscriptions. Optimizes marketing campaigns through predictive analytics with comprehensive binary classification pipeline.',
        'category': 'Machine Learning',
        'technology_stack': [
            'Python', 'Scikit-learn', 'Pandas', 'NumPy', 
            'Matplotlib', 'Seaborn', 'Jupyter', 'Joblib'
        ],
        'challenges': [
            'Handling imbalanced dataset with ~88% customers not subscribing',
            'Feature engineering from bank marketing campaign data',
            'Multicollinearity handling in economic indicators',
            'Optimizing marketing spend through predictive targeting',
            'Creating interpretable models for business stakeholders'
        ],
        'results': {
            'dataset_size': '~41,000 customers × 20+ features',
            'class_distribution': '88% no subscription, 12% subscription',
            'algorithms_compared': 'Naive Bayes, Decision Tree (Gini), Decision Tree (Entropy)',
            'business_value': 'Optimizes marketing campaigns and improves ROI',
            'modular_architecture': 'Clean, reusable code structure'
        },
        'github_url': 'https://github.com/abzanganeh/bank-term-deposit-prediction',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/bank-term-deposit-prediction.png',
        'has_dedicated_template': True,
        'template_path': 'projects/bank-term-deposit-prediction/index.html',
        'published': True
    }
]