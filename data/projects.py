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
        'image_url': '/static/images/projects/titanic-survival.jpg',
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
    }
]