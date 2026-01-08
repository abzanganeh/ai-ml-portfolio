# data/projects.py - Project Configuration Data

PROJECTS_DATA = [
    {
        'name': 'movie-agent-demo',
        'title': 'Movie Agent Demo',
        'description': 'Production-ready Flask web application providing comprehensive REST API and interactive UI for the Movie Agent Service. Features intelligent movie discovery through natural language queries, real-time chat interface with conversation history, movie poster image analysis using computer vision, interactive movie quizzes, and formatted statistics display. Implements encrypted API key storage with local configuration management, session-based memory isolation for multi-user support, and automatic query classification for seamless routing.',
        'category': 'AI/LLM',
        'technology_stack': [
            'Flask', 'Python', 'REST API', 'HTML/CSS', 'JavaScript', 
            'Encrypted Storage', 'Session Management', 'Web UI', 'File Upload',
            'Multipart Form Data', 'JSON API', 'AJAX', 'Template Engine'
        ],
        'challenges': [
            'Integrating Movie Agent Service core library with Flask web framework for seamless communication',
            'Designing RESTful API endpoints (/chat, /poster, /reset-config) with proper error handling and status codes',
            'Implementing secure encrypted API key storage using local configuration files (config.encrypted, .master_key)',
            'Creating session-based state management for conversation history, quiz state, and poster context per user',
            'Building interactive chat UI with real-time message display and conversation history preservation',
            'Handling file uploads for movie poster images (JPG, PNG, JPEG) with validation and processing',
            'Implementing automatic query classification to route natural language queries to appropriate agent tools',
            'Formatting statistics responses (top-rated movies, genre distributions, rating comparisons) for web display',
            'Managing quiz state and interactive question-answer flow with score tracking',
            'Ensuring configuration files remain gitignored and never exposed in logs or API responses'
        ],
        'results': {
            'api_endpoints': 'Three main endpoints: POST /chat (natural language queries), POST /poster (image analysis), POST /reset-config (configuration management)',
            'chat_features': 'Natural language movie search, similarity search, year-specific queries, recommendations, actor/director searches with intelligent filtering and deduplication',
            'poster_analysis': 'Upload movie posters to identify titles, analyze visual mood/themes, infer genres, and get confidence scores using BLIP model',
            'web_ui': 'Interactive chat interface with message history, image upload support, quiz interactions, and statistics visualization',
            'security': 'Encrypted configuration storage with master key encryption, preventing API key exposure in logs or responses',
            'session_management': 'Flask sessions provide unique session IDs, conversation history, quiz state, and poster context isolation per browser session',
            'query_classification': 'Automatic routing to movie_search, get_similar_movies, get_movie_statistics, and other tools based on query intent',
            'statistics_display': 'Formatted output for top-rated movies, highest/lowest ratings, average ratings with counts, and genre distributions',
            'similarity_search': 'Automatic exclusion of original movie when finding similar movies, using actual database genres for accurate matching',
            'setup_wizard': 'First-time configuration wizard for choosing LLM provider (Groq/OpenAI) and entering API keys securely'
        },
        'github_url': 'https://github.com/abzanganeh/movie-agent-demo',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/movie-agent-demo.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': 1,
        'team_size': 1,
        'published': True
    },
    {
        'name': 'movie-agent-service',
        'title': 'Movie Agent Service',
        'description': 'Production-grade core library for AI-powered movie discovery and analysis. Implements RAG-based semantic search using FAISS vector store, tool-calling agent architecture with LangChain (chosen over ReAct for reliability), computer vision poster analysis with BLIP model, interactive quiz generation, and session-based memory management. Built with Python following SOLID principles, dependency injection, and factory patterns for maintainability and extensibility. Designed for production use with proper error handling, logging, and modular architecture.',
        'category': 'AI/LLM',
        'technology_stack': [
            'Python', 'LangChain', 'OpenAI', 'FAISS', 'BLIP', 'Transformers', 
            'RAG', 'Vector Search', 'Embeddings', 'Tool-calling Agents',
            'Pandas', 'NumPy', 'Sentence Transformers', 'Hugging Face',
            'OOP Design Patterns', 'Dependency Injection', 'Factory Pattern'
        ],
        'challenges': [
            'Implementing RAG (Retrieval-Augmented Generation) pipeline with FAISS vector store for semantic movie search across large datasets',
            'Designing and implementing tool-calling agent architecture using LangChain, evaluating against ReAct pattern for production reliability',
            'Integrating BLIP (Bootstrapping Language-Image Pre-training) model for computer vision-based movie poster analysis and genre inference',
            'Creating session-based memory management system to maintain conversational context and quiz state across interactions',
            'Building interactive quiz generation system with multiple question types (multiple choice, true/false, fill-in-the-blank)',
            'Implementing semantic similarity search using OpenAI embeddings to find movies similar to user queries or uploaded posters',
            'Designing modular OOP architecture with dependency injection for flexible LLM provider switching (Groq, OpenAI)',
            'Creating factory pattern for agent initialization with configurable tools and memory systems',
            'Handling edge cases: year-specific queries with intelligent filtering, genre-based recommendations, actor/director searches',
            'Ensuring proper separation of concerns: vector store operations, agent reasoning, tool execution, and memory management',
            'Optimizing vector search performance for fast retrieval from large movie databases',
            'Implementing automatic deduplication and filtering of search results to match exact user criteria'
        ],
        'results': {
            'architecture_decision': 'Chose tool-calling agent architecture over ReAct for production-grade reliability and deterministic tool execution',
            'vector_store': 'FAISS-based semantic search enables fast similarity search for movie discovery using OpenAI embeddings',
            'rag_implementation': 'RAG pipeline combines vector search with LLM reasoning for accurate and contextual movie recommendations',
            'vision_capabilities': 'BLIP model provides poster analysis, title identification, mood detection, and genre inference from visual elements',
            'memory_system': 'Session-based state management maintains conversation history, quiz progress, and poster context across user interactions',
            'quiz_system': 'Multiple interactive quiz types with question generation, answer validation, and score tracking',
            'search_features': 'Natural language queries support year filters, genre searches, actor/director lookups, and similarity recommendations',
            'tool_system': 'Modular tool architecture includes movie_search, get_similar_movies, get_movie_statistics, and poster_analysis tools',
            'design_patterns': 'SOLID principles with single responsibility, dependency inversion, factory pattern, and interface segregation',
            'extensibility': 'Clean architecture allows easy addition of new tools, LLM providers, and search capabilities',
            'production_readiness': 'Comprehensive error handling, logging, and configuration management for deployment scenarios'
        },
        'github_url': 'https://github.com/abzanganeh/movie-agent-service',
        'demo_url': None,
        'featured': True,
        'image_url': '/static/images/projects/movie-agent-service.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': 1,
        'team_size': 1,
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