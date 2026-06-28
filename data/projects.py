# data/projects.py - Project Configuration Data
#
# HOW TO ADD A PROJECT
# --------------------
# 1. Copy PROJECT_TEMPLATE below, fill in the fields, append to PROJECTS_DATA.
# 2. Drop a thumbnail at static/images/projects/<name>.png (or .svg).
# 3. For a rich detail page: set has_dedicated_template=True, create
#    templates/projects/<name>/index.html, and optionally
#    static/css/projects/<name>.css.
# 4. Restart Flask — populate_projects() reseeds the DB on every startup.

PROJECT_TEMPLATE = {
    # ---- identity --------------------------------------------------------
    'name': '',            # URL slug  →  /projects/<name>/  (unique, kebab-case)
    'title': '',           # Display name shown in cards and page headers
    'description': '',     # 1-3 sentence summary used on the card and generic detail page
    'category': '',        # One of: 'Machine Learning' | 'AI/LLM' | 'Web' | 'Systems' | ...
    # ---- tech stack ------------------------------------------------------
    'technology_stack': [],  # List of technology/library names (shown as tags)
    # ---- content ---------------------------------------------------------
    'challenges': [],      # List of challenge strings (shown on generic detail page)
    'results': {},         # Dict of metric_name → value (shown as result grid)
    # ---- links -----------------------------------------------------------
    'github_url': None,    # Full GitHub URL or None
    'demo_url': None,      # Live demo URL or None
    # ---- media -----------------------------------------------------------
    'image_url': None,     # Path like '/static/images/projects/<name>.png'; None = auto-derive
    # ---- flags -----------------------------------------------------------
    'featured': False,     # True → appears on homepage featured section
    'published': True,     # False → hidden everywhere
    'has_dedicated_template': False,  # True → renders templates/projects/<name>/index.html
    'template_path': None,            # e.g. 'projects/<name>/index.html'
    # ---- metadata --------------------------------------------------------
    'status': 'Completed',  # 'Completed' | 'Ongoing'
    'duration_months': 1,  # None on private pre-commercial projects → detail page shows Ongoing
    'team_size': 1,  # None on private pre-commercial projects → detail page shows N/A (see PRIVATE_PORTFOLIO_PROJECTS)
}

PROJECTS_DATA = [
    # -----------------------------------------------------------------------
    # 1. Asar — Identity Platform (private)
    # -----------------------------------------------------------------------
    {
        'name': 'asar',
        'title': 'Asar — Identity Platform',
        'description': 'Go-based identity and access management platform for enterprise authentication flows. Provides OAuth2/OIDC/SAML protocol surfaces, MFA orchestration, device trust and fingerprinting, session and token lifecycle, and hardened credential handling — designed as a modular IdP foundation for workforce and client identity.',
        'category': 'Identity & Security',
        'technology_stack': [
            'Go', 'TypeScript', 'React', 'OAuth2', 'OpenID Connect', 'SAML', 'JWT', 'JWKS',
            'WebAuthn', 'MFA', 'RBAC', 'Microservices', 'REST/OpenAPI',
            'Argon2id', 'Device Trust', 'Anomaly Scoring',
        ],
        'challenges': [
            'Designing a multi-protocol IdP foundation (OAuth2/OIDC/SAML) with consistent token and session semantics',
            'Integrating device fingerprinting and trust signals into authentication and step-up decisions',
            'Shipping a TypeScript browser SDK and React admin surfaces alongside Go IdP services',
            'Building secure credential storage with modern password hashing and account lockout policies',
            'Orchestrating MFA routes across push, inline, and fallback factors without weakening assurance',
            'Publishing discovery documents, JWKS rotation, and internal token issuance for service-to-service trust',
            'Structuring microservices for fingerprint collection, matching, and risk scoring with clear API boundaries',
        ],
        'results': {
            'protocols': 'OAuth2, OpenID Connect, SAML, JWKS',
            'assurance': 'MFA orchestration, device trust, anomaly scoring',
            'security': 'Argon2id credentials, RBAC, hardened login flows',
            'architecture': 'Modular IdP microservices with OpenAPI contracts',
            'release_stage': 'Pre-commercial (private)',
        },
        'github_url': None,
        'demo_url': None,
        'featured': True,
        'published': True,
        'status': 'Ongoing',
        'image_url': '/static/images/projects/asar-hero.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': None,
        'team_size': None,
    },
    # -----------------------------------------------------------------------
    # 2. Rai — Agentic AI for Identity (private)
    # -----------------------------------------------------------------------
    {
        'name': 'rai',
        'title': 'Rai — Agentic AI for Identity',
        'description': 'Production-oriented agentic AI service for identity, assurance, and admin workflows. Combines domain-specialist agents, RBAC-scoped tools, retrieval-augmented generation, and fail-closed safety gates — including step-up authentication, citation enforcement, and versioned prompts — to augment identity platforms through HTTP adapters.',
        'category': 'AI/LLM',
        'technology_stack': [
            'Python', 'FastAPI', 'LangChain', 'FAISS', 'RAG',
            'OpenAI', 'Groq', 'Kubernetes', 'Helm',
            'OAuth2', 'MFA', 'Eval Harnesses', 'CI/CD',
        ],
        'challenges': [
            'Grounding agent responses in identity context without treating user content as system instructions',
            'Enforcing fail-closed assurance: step-up MFA, tenant isolation, and audit trails on tool execution',
            'Designing RBAC-scoped tools so agents can only act within the caller\'s authorized identity scope',
            'Building eval harnesses and CI release gates for LLM behavior in security-critical workflows',
            'Integrating with identity gateways via trusted headers and same-origin proxy patterns',
            'Versioning prompts and measuring regression across golden eval cases before production release',
        ],
        'results': {
            'architecture': 'Domain-specialist agents with tool-calling and structured action flows',
            'safety': 'Fail-closed gates, step-up auth, citation enforcement',
            'retrieval': 'RAG pipeline with versioned prompts',
            'quality': 'Golden eval suites with CI-gated releases',
            'integration': 'HTTP adapters for identity and admin platforms',
            'release_stage': 'Pre-commercial (private)',
        },
        'github_url': None,
        'demo_url': None,
        'featured': True,
        'published': True,
        'status': 'Ongoing',
        'image_url': '/static/images/projects/rai-hero.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': None,
        'team_size': None,
    },
    # -----------------------------------------------------------------------
    # 3. TrustMobile — Mobile Authenticator (private)
    # -----------------------------------------------------------------------
    {
        'name': 'trust-mobile',
        'title': 'TrustMobile — Mobile Authenticator',
        'description': 'Cross-platform Flutter mobile authenticator for enterprise MFA and device-bound identity. Supports EC P-256 device key generation, push and inline MFA approval flows, offline TOTP, secure pairing with backend identity services, and release hardening including TLS pinning — extending workforce authentication to mobile endpoints.',
        'category': 'Identity & Security',
        'technology_stack': [
            'Flutter', 'Dart', 'EC P-256', 'TOTP', 'Push MFA',
            'TLS Pinning', 'Mobile Crypto', 'REST APIs',
            'OAuth2', 'Device Pairing', 'Offline MFA',
        ],
        'challenges': [
            'Generating and protecting device-bound cryptographic keys on iOS and Android',
            'Implementing secure device pairing and refresh flows with backend identity services',
            'Delivering push and inline MFA experiences with clear user trust signals',
            'Supporting offline TOTP when network connectivity is unavailable',
            'Applying TLS pinning and release hardening for enterprise mobile deployment',
            'Keeping mobile client behavior aligned with IdP token and session policies',
        ],
        'results': {
            'platforms': 'Cross-platform Flutter (iOS & Android)',
            'crypto': 'EC P-256 device keys, secure pairing',
            'mfa_modes': 'Push, inline approval, offline TOTP',
            'security': 'TLS pinning and mobile release hardening',
            'integration': 'Pairs with enterprise IdP and workforce identity APIs',
            'release_stage': 'Pre-commercial (private)',
        },
        'github_url': None,
        'demo_url': None,
        'featured': True,
        'published': True,
        'status': 'Ongoing',
        'image_url': '/static/images/projects/trust-mobile-hero.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': None,
        'team_size': None,
    },
    # -----------------------------------------------------------------------
    # 4. Flint
    # -----------------------------------------------------------------------
    {
        'name': 'flint',
        'title': 'Flint — Live Meeting Co-Pilot',
        'description': 'Real-time AI co-pilot desktop app for high-stakes live conversations — client consulting calls, discovery meetings, negotiations, and other professional dialogue where you need private, in-the-moment guidance. Captures remote participant audio from the call, transcribes locally with Whisper and RNNoise, and fires parallel directional, depth, and clarifying LLM threads in a stealth overlay invisible to screen-share. RAG over session context via sqlite-vec keeps guidance grounded in your brief, notes, and domain material. Phase 1 ships the job-interview domain (mock sessions, rehearsal, preferred answers) as the first vertical.',
        'category': 'AI/LLM',
        'technology_stack': [
            'Rust', 'Tokio', 'Tauri 2', 'React 18', 'TypeScript', 'Tailwind CSS',
            'Whisper', 'RNNoise', 'VAD', 'RAG', 'sqlite-vec', 'fastembed',
            'Groq', 'Ollama', 'Supabase',
        ],
        'challenges': [
            'Capturing system audio without touching the microphone to isolate the remote participant in live calls',
            'Running Whisper transcription and RNNoise suppression in real time with sub-second latency',
            'Firing parallel directional, depth, and clarifying LLM threads per detected question without blocking the UI',
            'Building a stealth overlay with Tauri that stays on top, is transparent, and is excluded from screen-capture APIs',
            'Local RAG over session context using sqlite-vec and bge-small-en-v1.5 embeddings fully on device',
            'Designing a domain-agnostic conversation engine whose first shipped vertical is job interviews',
            'Graceful failover from Groq cloud inference to a local Ollama model when the network is unavailable',
            'Storing API keys only in the OS keychain — never in config files or environment variables',
        ],
        'results': {
            'product_scope': 'Live meeting co-pilot for consulting and professional calls; Phase 1 = interview vertical',
            'transcription': 'Local Whisper — zero audio leaves the device',
            'inference': 'Groq cloud with Ollama fallback; sub-second P95 response time',
            'context_store': 'sqlite-vec + bge-small-en-v1.5 — fully on-device RAG',
            'stealth': 'Overlay excluded from screen-share capture via Tauri OS compositor hints',
            'parallel_threads': '3 LLM threads (directional, depth, clarifying) fired simultaneously per question',
            'keychain': 'API keys stored in OS keychain only — never on disk or in env',
        },
        'github_url': 'https://github.com/abzanganeh/flint',
        'demo_url': None,
        'featured': True,
        'published': True,
        'status': 'Ongoing',
        'image_url': '/static/images/projects/flint-hero-meeting.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': 2,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 2. Smart Resume Agent
    # -----------------------------------------------------------------------
    {
        'name': 'smart-resume',
        'title': 'Smart Resume Agent',
        'description': 'AI-powered job-search platform. Build a persistent master resume by voice (Story Mode + coached interview) or upload, tailor it to any job description through a four-phase agent pipeline, generate cover letters, check job-fit scores, search for matching listings, and track every application — all in one place.',
        'category': 'AI/LLM',
        'technology_stack': [
            'Python', 'FastAPI', 'Next.js 14', 'TypeScript', 'React',
            'PostgreSQL', 'pgvector', 'LangChain', 'Pydantic',
            'Whisper', 'Google OAuth', 'NextAuth.js',
            'Docker', 'RAG', 'Semantic Search',
        ],
        'challenges': [
            'Four-phase agentic pipeline: JD keyword extraction → gap audit → resume rewrite → QA checklist, each with structured Pydantic output',
            'RAG over user-owned master resume chunks stored in pgvector to ground every rewrite in real experience',
            'Story Mode: 30 × 60-second voice segments transcribed by Whisper and optionally coached by AI follow-up questions per segment',
            'Coached Interview mode: AI asks up to 15 structured career questions with dynamic follow-ups, answered by voice or text',
            'BYOK (bring-your-own-key) model tier switcher — Standard / Better / Best — with per-request API key routing',
            'Session TTL management (24-hour tailoring sessions) with frontend warning banners and server-side cleanup',
            'Semantic job-fit score before spending a credit, preventing wasted tailoring runs on poor-match listings',
            'Export pipeline producing ATS-clean PDF and DOCX from structured resume data without visual templates',
        ],
        'results': {
            'resume_inputs': '3 paths — upload (PDF/DOCX/text), Story Mode voice, Coached Interview',
            'agent_phases': '4 sequential phases with Pydantic-validated structured output at each step',
            'vector_store': 'pgvector chunks — every rewrite is evidence-sourced, no hallucinations',
            'voice_segments': 'Up to 30 × 60-second segments; optional AI coaching per segment',
            'export': 'ATS-clean PDF and DOCX download',
            'application_tracker': 'Applied → Interview → Offer → Closed pipeline with notes',
            'model_tiers': 'Standard / Better / Best + BYOK API key support',
            'session_ttl': '24-hour tailoring sessions with persistent master resume across sessions',
        },
        'github_url': 'https://github.com/abzanganeh/smart-resume',
        'demo_url': None,
        'featured': True,
        'published': True,
        'status': 'Ongoing',
        'image_url': '/static/images/projects/smart-resume-photo-03.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': 3,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 3. Fraud Shield AI
    # -----------------------------------------------------------------------
    {
        'name': 'fraud-shield-ai',
        'title': 'Fraud Shield AI',
        'description': 'End-to-end fraud detection pipeline for credit card transactions. Covers EDA with timezone-aware feature engineering, scalable PySpark preprocessing, supervised ML, deep learning (MLP/ResNet/LSTM), transformer-based models (FT-Transformer), hybrid ensemble stacking, and a real-time Streamlit inference app with a two-stage risk-tiering system (Auto-Block / Review / Cleared).',
        'category': 'Machine Learning',
        'technology_stack': [
            'Python', 'PySpark', 'Spark MLlib', 'XGBoost', 'Optuna',
            'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
            'Streamlit', 'Jupyter', 'Matplotlib', 'Seaborn',
        ],
        'challenges': [
            'Handling extreme class imbalance (0.58% fraud rate) — SMOTE and all variants degraded performance; baseline outperformed all synthetic sampling methods',
            'Preventing temporal data leakage: time-aware train/val split and point-in-time backward velocity features',
            'Timezone-aware feature engineering: resolving merchant local time from lat/lon coordinates across global locations',
            'Scalable preprocessing with PySpark for a 1M+ transaction dataset with card-level velocity windows',
            'Temporal distribution shift: test fraud rate dropped to 0.39% vs 0.58% in training, causing val→test F1 gap (~0.81 → 0.64)',
            'Combining XGBoost, MLP, and FT-Transformer in a soft-voting ensemble for a ~5% lift over the best single model',
            'Two-stage risk tiering: calibrating Auto-Block (≥0.90) and Review Queue (0.14–0.90) thresholds for operational precision targets',
        ],
        'results': {
            'best_single_model': 'XGBoost (Optuna) — Test F1: 0.607, Test ROC-AUC: 0.988',
            'best_ensemble': 'Soft Voting / Weighted Ensemble — Test F1: 0.639, Test PR-AUC: 0.651',
            'auto_block_precision': '~0.82 at prob ≥ 0.90',
            'review_queue': '~0.5% of transactions flagged for human analyst review',
            'models_trained': 'Logistic Regression, Random Forest, XGBoost, MLP, ResNet, LSTM, FT-Transformer, SA-MLP, 3× ensemble variants',
            'dataset': '1M+ credit card transactions, 30 leak-free engineered features',
            'sampling_finding': 'All SMOTE variants degraded Test F1 vs no-resampling baseline (best SMOTE: 0.265 vs baseline 0.290)',
            'deployment': 'Streamlit app — CSV upload → real-time two-stage risk prediction',
        },
        'github_url': None,
        'demo_url': None,
        'featured': True,
        'published': True,
        'image_url': '/static/images/projects/fraud-shield-ai-hero.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': 2,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 4. Bank Term Deposit Prediction
    # -----------------------------------------------------------------------
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
        'published': True,
        'image_url': '/static/images/projects/bank-term-deposit-prediction.png',
        'has_dedicated_template': True,
        'template_path': 'projects/bank-term-deposit-prediction/index.html',
        'duration_months': 2,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 5. Churn Risk Intelligence
    # -----------------------------------------------------------------------
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
        'published': True,
        'image_url': '/static/images/projects/churn-risk-intelligence.png',
        'has_dedicated_template': True,
        'template_path': 'projects/churn-risk-intelligence/index.html',
        'duration_months': 3,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 6. Movie Agent Demo
    # -----------------------------------------------------------------------
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
        'published': True,
        'image_url': '/static/images/projects/movie-agent-demo.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': 1,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 7. Movie Agent Service
    # -----------------------------------------------------------------------
    {
        'name': 'movie-agent-service',
        'title': 'Movie Agent Service',
        'description': 'Production-grade core library for AI-powered movie discovery and analysis. Implements RAG-based semantic search using FAISS vector store, tool-calling agent architecture with LangChain (chosen over ReAct for reliability), computer vision poster analysis with BLIP model, interactive quiz generation, and session-based memory management. Built with Python following SOLID principles, dependency injection, and factory patterns for maintainability and extensibility.',
        'category': 'AI/LLM',
        'technology_stack': [
            'Python', 'LangChain', 'OpenAI', 'FAISS', 'BLIP', 'Transformers',
            'RAG', 'Vector Search', 'Embeddings', 'Tool-calling Agents',
            'Pandas', 'NumPy', 'Sentence Transformers', 'Hugging Face',
            'OOP Design Patterns', 'Dependency Injection', 'Factory Pattern'
        ],
        'challenges': [
            'Implementing RAG pipeline with FAISS vector store for semantic movie search across large datasets',
            'Designing tool-calling agent architecture using LangChain, evaluating against ReAct pattern for production reliability',
            'Integrating BLIP model for computer vision-based movie poster analysis and genre inference',
            'Creating session-based memory management system to maintain conversational context and quiz state',
            'Building interactive quiz generation system with multiple question types (multiple choice, true/false, fill-in-the-blank)',
            'Implementing semantic similarity search using OpenAI embeddings to find movies similar to queries or uploaded posters',
            'Designing modular OOP architecture with dependency injection for flexible LLM provider switching (Groq, OpenAI)',
            'Creating factory pattern for agent initialization with configurable tools and memory systems',
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
            'tool_system': 'Modular tool architecture includes movie_search, get_similar_movies, get_movie_statistics, and poster_analysis tools',
            'design_patterns': 'SOLID principles with single responsibility, dependency inversion, factory pattern, and interface segregation',
            'production_readiness': 'Comprehensive error handling, logging, and configuration management for deployment scenarios'
        },
        'github_url': 'https://github.com/abzanganeh/movie-agent-service',
        'demo_url': None,
        'featured': True,
        'published': True,
        'image_url': '/static/images/projects/movie-agent-service.png',
        'has_dedicated_template': False,
        'template_path': None,
        'duration_months': 1,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 8. Satellite Signal Strength Prediction
    # -----------------------------------------------------------------------
    {
        'name': 'satellite-signal-prediction',
        'title': 'Satellite Signal Strength Prediction',
        'description': 'Advanced regression pipeline predicting satellite signal quality from weather conditions using multiple ML algorithms and real-time API data.',
        'category': 'Machine Learning',
        'technology_stack': [
            'Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'SHAP',
            'OpenWeatherMap API', 'Matplotlib', 'Seaborn'
        ],
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
        'published': True,
        'image_url': '/static/images/projects/satellite-signal-prediction.png',
        'has_dedicated_template': True,
        'template_path': 'projects/satellite-signal-prediction/index.html',
        'duration_months': 2,
        'team_size': 1,
    },
    # -----------------------------------------------------------------------
    # 9. Titanic Survival Prediction
    # -----------------------------------------------------------------------
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
        'github_url': None,
        'demo_url': None,
        'featured': True,
        'published': True,
        'image_url': '/static/images/projects/titanic-survival.png',
        'has_dedicated_template': True,
        'template_path': 'projects/titanic-survival/index.html',
        'duration_months': 1,
        'team_size': 1,
    },
]
