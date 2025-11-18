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
    },
    {
        'title': 'Interactive Linear Algebra: Matrix-Vector Multiplication',
        'slug': 'matrix-vector-multiplication',
        'description': 'Visualize 2D matrix-vector multiplication with interactive animations. Understand linear transformations through drag-and-drop vector manipulation and real-time matrix operations.',
        'category': 'Linear Algebra',
        'difficulty': 'beginner',
        'duration': '25 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/matrix-vector-multiplication/index.html',
        'published': True,
        'excerpt': 'Interactive 2D visualization of matrix-vector multiplication with drag-and-drop vectors, real-time transformations, and 3Blue1Brown-inspired animations.',
        'tags': 'linear-algebra,matrix-multiplication,visualization,interactive,2d-transformations,vectors'
    },
    {
        'title': 'Coding Interview Algorithms: Complete Guide',
        'slug': 'coding-interview-algorithms',
        'description': 'Master all essential coding interview algorithms with detailed explanations, step-by-step implementations, and real-world examples. Learn when and where to use each algorithm.',
        'category': 'Algorithms',
        'difficulty': 'intermediate',
        'duration': '600 minutes',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/coding-interview-algorithms/index.html',
        'published': True,
        'excerpt': 'Comprehensive guide to coding interview algorithms covering Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and more with step-by-step code explanations.',
        'tags': 'algorithms,data-structures,coding-interviews,leetcode,problem-solving,arrays,trees,graphs,dynamic-programming'
    },
    {
        'title': 'Neural Networks Fundamentals',
        'slug': 'neural-networks',
        'description': 'Master the foundations of neural networks from mathematical principles to practical implementations. 8 comprehensive chapters covering feedforward networks, backpropagation, activation functions, CNNs, RNNs, and LSTMs.',
        'category': 'Deep Learning',
        'difficulty': 'intermediate',
        'duration': '180 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/neural-networks/index.html',
        'published': True,
        'excerpt': 'Complete neural networks course with detailed explanations, formulas, and code examples covering feedforward networks, backpropagation, CNNs, RNNs, and LSTMs.',
        'tags': 'neural-networks,deep-learning,backpropagation,cnn,rnn,lstm,activation-functions,gradient-descent'
    },
    {
        'title': 'Transformer Architecture Deep Dive',
        'slug': 'transformers',
        'description': 'Master the Transformer architecture that revolutionized NLP. 10 comprehensive chapters covering attention mechanisms, self-attention, multi-head attention, positional encoding, encoder-decoder architecture, and implementation details.',
        'category': 'Deep Learning',
        'difficulty': 'advanced',
        'duration': '240 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/transformers/index.html',
        'published': True,
        'excerpt': 'Deep dive into Transformer architecture with extensive formulas, code examples, and visual explanations covering attention, self-attention, multi-head attention, and complete implementation.',
        'tags': 'transformers,attention,self-attention,multi-head-attention,encoder-decoder,positional-encoding,bert,gpt'
    },
    {
        'title': 'Large Language Models (LLMs)',
        'slug': 'llms',
        'description': 'Master Large Language Models from pre-training to fine-tuning. 8 comprehensive chapters covering BERT, GPT, transfer learning, fine-tuning strategies, prompt engineering, and practical applications.',
        'category': 'Deep Learning',
        'difficulty': 'advanced',
        'duration': '200 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/llms/index.html',
        'published': True,
        'excerpt': 'Complete LLM course covering BERT, GPT, pre-training, fine-tuning, LoRA, prompt engineering, and practical applications with detailed explanations and code examples.',
        'tags': 'llm,bert,gpt,pre-training,fine-tuning,lora,prompt-engineering,transfer-learning'
    },
    {
        'title': 'RAG & Retrieval Systems',
        'slug': 'rag',
        'description': 'Master Retrieval-Augmented Generation (RAG) systems from vector databases to production deployment. 7 comprehensive chapters covering embeddings, retrieval strategies, RAG architecture, and building production systems.',
        'category': 'Deep Learning',
        'difficulty': 'advanced',
        'duration': '180 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/rag/index.html',
        'published': True,
        'excerpt': 'Complete RAG tutorial covering embeddings, vector databases, retrieval strategies, RAG architecture, and production deployment with detailed explanations and code examples.',
        'tags': 'rag,retrieval-augmented-generation,vector-databases,embeddings,semantic-search,pinecone,chroma'
    },
    {
        'title': 'Agentic AI & LLM Agents',
        'slug': 'agentic-ai',
        'description': 'Master AI Agents and Agentic AI systems. 8 comprehensive chapters covering agent architectures, tool-using agents, ReAct framework, multi-agent systems, agent orchestration, and building production agents.',
        'category': 'Deep Learning',
        'difficulty': 'advanced',
        'duration': '200 min',
        'author': 'Alireza Barzin Zanganeh',
        'has_dedicated_template': True,
        'template_path': 'tutorials/agentic-ai/index.html',
        'published': True,
        'excerpt': 'Complete agentic AI course covering agent architectures, tool-using agents, ReAct, multi-agent systems, orchestration, and production deployment with detailed explanations and code examples.',
        'tags': 'agents,agentic-ai,react,langchain,multi-agent,tool-using,orchestration,autogpt'
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


