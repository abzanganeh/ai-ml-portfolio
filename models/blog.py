from datetime import datetime
from typing import List, Optional, Dict

class BlogPost:
    """Blog post model for AI/ML content"""
    
    def __init__(self,
                 id: str,
                 title: str,
                 content: str,
                 excerpt: str,
                 category: str,
                 tags: List[str],
                 author: str = "Alireza Barzin Zanganeh",
                 published: bool = True,
                 featured: bool = False,
                 created_at: Optional[datetime] = None,
                 updated_at: Optional[datetime] = None,
                 read_time: int = 5,
                 image_url: str = None,
                 meta_description: str = None,
                 slug: str = None):
        """
        Initialize a BlogPost object
        
        Args:
            id: Unique identifier for the post
            title: Blog post title
            content: Full blog post content (HTML or Markdown)
            excerpt: Short excerpt for listings
            category: Post category (AI, Machine Learning, Deep Learning, etc.)
            tags: List of tags for categorization
            author: Post author name
            published: Whether the post is published
            featured: Whether this is a featured post
            created_at: Creation timestamp
            updated_at: Last update timestamp
            read_time: Estimated reading time in minutes
            image_url: URL to post featured image
            meta_description: SEO meta description
            slug: URL-friendly slug
        """
        self.id = id
        self.title = title
        self.content = content
        self.excerpt = excerpt
        self.category = category
        self.tags = tags or []
        self.author = author
        self.published = published
        self.featured = featured
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()
        self.read_time = read_time
        self.image_url = image_url or f"/static/images/blog/default_image.png"
        self.meta_description = meta_description or excerpt[:160]
        self.slug = slug or self._generate_slug()
    
    def _generate_slug(self) -> str:
        """Generate URL-friendly slug from title"""
        import re
        slug = self.title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    def to_dict(self) -> dict:
        """Convert blog post to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'excerpt': self.excerpt,
            'category': self.category,
            'tags': self.tags,
            'author': self.author,
            'published': self.published,
            'featured': self.featured,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'read_time': self.read_time,
            'image_url': self.image_url,
            'meta_description': self.meta_description,
            'slug': self.slug,
            'url': f"/blog/{self.slug}"
        }
    
    def get_related_posts(self, all_posts: List['BlogPost'], limit: int = 3) -> List['BlogPost']:
        """Get related posts based on tags and category"""
        related = []
        
        for post in all_posts:
            if post.id == self.id or not post.published:
                continue
                
            score = 0
            
            # Same category gets higher score
            if post.category == self.category:
                score += 3
            
            # Shared tags get points
            shared_tags = set(self.tags) & set(post.tags)
            score += len(shared_tags) * 2
            
            if score > 0:
                related.append((post, score))
        
        # Sort by score and return top matches
        related.sort(key=lambda x: x[1], reverse=True)
        return [post for post, score in related[:limit]]
    
    def update_content(self, new_content: str, new_excerpt: str = None):
        """Update post content and timestamp"""
        self.content = new_content
        if new_excerpt:
            self.excerpt = new_excerpt
        self.updated_at = datetime.now()
    
    def add_tag(self, tag: str):
        """Add a tag if not already present"""
        if tag not in self.tags:
            self.tags.append(tag)
            self.updated_at = datetime.now()
    
    def remove_tag(self, tag: str):
        """Remove a tag if present"""
        if tag in self.tags:
            self.tags.remove(tag)
            self.updated_at = datetime.now()
    
    def toggle_featured(self):
        """Toggle featured status"""
        self.featured = not self.featured
        self.updated_at = datetime.now()
    
    def publish(self):
        """Publish the post"""
        self.published = True
        self.updated_at = datetime.now()
    
    def unpublish(self):
        """Unpublish the post"""
        self.published = False
        self.updated_at = datetime.now()
    
    def is_recent(self, days: int = 30) -> bool:
        """Check if post was created recently"""
        days_ago = datetime.now() - datetime.timedelta(days=days)
        return self.created_at > days_ago
    
    def __str__(self) -> str:
        return f"BlogPost: {self.title} ({self.category})"
    
    def __repr__(self) -> str:
        return f"BlogPost(id='{self.id}', title='{self.title}', category='{self.category}')"

# Blog post factory for common AI/ML topics
class BlogPostFactory:
    """Factory class for creating blog post instances"""
    
    @staticmethod
    def create_ai_post(id: str, title: str, content: str, excerpt: str, topic: str) -> BlogPost:
        """Create an AI-focused blog post"""
        base_tags = ["artificial-intelligence", "ai", "technology"]
        
        if topic == "machine-learning":
            base_tags.extend(["machine-learning", "ml", "algorithms", "data-science"])
            category = "Machine Learning"
        elif topic == "deep-learning":
            base_tags.extend(["deep-learning", "neural-networks", "tensorflow", "pytorch"])
            category = "Deep Learning"
        elif topic == "nlp":
            base_tags.extend(["nlp", "natural-language-processing", "transformers", "bert"])
            category = "Natural Language Processing"
        elif topic == "computer-vision":
            base_tags.extend(["computer-vision", "cv", "image-processing", "cnn"])
            category = "Computer Vision"
        elif topic == "ai-ethics":
            base_tags.extend(["ai-ethics", "responsible-ai", "bias", "fairness"])
            category = "AI Ethics"
        else:
            category = "Artificial Intelligence"
            
        return BlogPost(
            id=id,
            title=title,
            content=content,
            excerpt=excerpt,
            category=category,
            tags=base_tags
        )
    
    @staticmethod
    def create_tutorial_post(id: str, title: str, content: str, excerpt: str, difficulty: str) -> BlogPost:
        """Create a tutorial-style blog post"""
        base_tags = ["tutorial", "how-to", "guide", "programming", "python"]
        
        if difficulty == "beginner":
            base_tags.extend(["beginner", "basics", "introduction"])
        elif difficulty == "intermediate":
            base_tags.extend(["intermediate", "practical", "implementation"])
        elif difficulty == "advanced":
            base_tags.extend(["advanced", "expert", "optimization"])
            
        return BlogPost(
            id=id,
            title=title,
            content=content,
            excerpt=excerpt,
            category="Tutorial",
            tags=base_tags
        )
    
    @staticmethod
    def create_industry_post(id: str, title: str, content: str, excerpt: str, industry: str) -> BlogPost:
        """Create an industry-focused blog post"""
        base_tags = ["industry", "applications", "real-world", "business"]
        
        if industry == "healthcare":
            base_tags.extend(["healthcare", "medical", "diagnosis", "treatment"])
        elif industry == "finance":
            base_tags.extend(["finance", "fintech", "trading", "risk-management"])
        elif industry == "automotive":
            base_tags.extend(["automotive", "self-driving", "autonomous-vehicles"])
        elif industry == "retail":
            base_tags.extend(["retail", "e-commerce", "recommendation-systems"])
            
        return BlogPost(
            id=id,
            title=title,
            content=content,
            excerpt=excerpt,
            category="Industry Applications",
            tags=base_tags
        )

# Sample blog posts for your portfolio
def get_sample_blog_posts() -> List[BlogPost]:
    """Get sample blog posts for AI/ML topics"""
    return [
        BlogPost(
            id="transformer-architecture-explained",
            title="Understanding Transformer Architecture: The Foundation of Modern NLP",
            content="""
            <h2>Introduction to Transformers</h2>
            <p>The Transformer architecture, introduced in the seminal paper "Attention Is All You Need" by Vaswani et al., revolutionized the field of natural language processing and has become the backbone of modern AI language models like GPT, BERT, and many others.</p>
            
            <h3>Key Components</h3>
            <p>The Transformer consists of several key components:</p>
            <ul>
                <li><strong>Multi-Head Attention</strong>: Allows the model to focus on different parts of the input simultaneously</li>
                <li><strong>Position Encoding</strong>: Provides information about the position of tokens in the sequence</li>
                <li><strong>Feed-Forward Networks</strong>: Process the attention outputs</li>
                <li><strong>Layer Normalization</strong>: Stabilizes training</li>
            </ul>
            
            <h3>Self-Attention Mechanism</h3>
            <p>The core innovation of Transformers is the self-attention mechanism, which allows each token to attend to all other tokens in the sequence. This is computed as:</p>
            <pre><code>Attention(Q, K, V) = softmax(QK^T / √d_k)V</code></pre>
            
            <h3>Practical Applications</h3>
            <p>Transformers have enabled breakthrough applications in:</p>
            <ul>
                <li>Language translation</li>
                <li>Text summarization</li>
                <li>Question answering</li>
                <li>Code generation</li>
            </ul>
            
            <h3>Implementation Example</h3>
            <p>Here's a simplified implementation of multi-head attention in PyTorch:</p>
            <pre><code>
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        # Linear transformations
        Q = self.W_q(query)
        K = self.W_k(key)
        V = self.W_v(value)
        
        # Reshape for multi-head attention
        Q = Q.view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = K.view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = V.view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # Scaled dot-product attention
        attention = self.scaled_dot_product_attention(Q, K, V, mask)
        
        # Concatenate heads
        attention = attention.transpose(1, 2).contiguous().view(
            batch_size, -1, self.d_model)
        
        return self.W_o(attention)
            </code></pre>
            
            <h3>Conclusion</h3>
            <p>The Transformer architecture represents a paradigm shift in sequence modeling, moving away from recurrent architectures to attention-based models. Its parallel processing capabilities and superior performance have made it the foundation for the current AI revolution.</p>
            """,
            excerpt="Deep dive into the Transformer architecture that powers modern NLP models like GPT and BERT. Learn about attention mechanisms, implementation details, and practical applications.",
            category="Deep Learning",
            tags=["transformers", "attention", "nlp", "pytorch", "neural-networks"],
            featured=True,
            read_time=8
        ),
        
        BlogPost(
            id="machine-learning-pipeline-production",
            title="Building Production-Ready Machine Learning Pipelines",
            content="""
            <h2>Introduction to ML Pipelines</h2>
            <p>Building machine learning models is just the beginning. To create real business value, you need robust, scalable, and maintainable ML pipelines that can handle production workloads.</p>
            
            <h3>Components of an ML Pipeline</h3>
            <p>A production ML pipeline typically consists of:</p>
            <ol>
                <li><strong>Data Ingestion</strong>: Collecting data from various sources</li>
                <li><strong>Data Validation</strong>: Ensuring data quality and consistency</li>
                <li><strong>Data Preprocessing</strong>: Cleaning and transforming data</li>
                <li><strong>Feature Engineering</strong>: Creating meaningful features</li>
                <li><strong>Model Training</strong>: Training and validating models</li>
                <li><strong>Model Evaluation</strong>: Assessing model performance</li>
                <li><strong>Model Deployment</strong>: Serving models in production</li>
                <li><strong>Monitoring</strong>: Tracking model performance and data drift</li>
            </ol>
            
            <h3>Best Practices</h3>
            <p>Key principles for production ML pipelines:</p>
            <ul>
                <li><strong>Reproducibility</strong>: Version control for code, data, and models</li>
                <li><strong>Scalability</strong>: Handle increasing data volumes and requests</li>
                <li><strong>Monitoring</strong>: Track performance, drift, and system health</li>
                <li><strong>Testing</strong>: Comprehensive testing at every stage</li>
                <li><strong>Documentation</strong>: Clear documentation for maintenance</li>
            </ul>
            
            <h3>Tools and Technologies</h3>
            <p>Popular tools for ML pipelines:</p>
            <ul>
                <li><strong>Orchestration</strong>: Apache Airflow, Kubeflow, MLflow</li>
                <li><strong>Data Processing</strong>: Apache Spark, Pandas, Dask</li>
                <li><strong>Model Serving</strong>: TensorFlow Serving, Seldon, BentoML</li>
                <li><strong>Monitoring</strong>: Prometheus, Grafana, MLflow</li>
                <li><strong>Infrastructure</strong>: Docker, Kubernetes, AWS/GCP/Azure</li>
            </ul>
            
            <h3>Example Pipeline with Python</h3>
            <pre><code>
import pandas as pd
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class MLPipeline:
    def __init__(self, config):
        self.config = config
        self.model = None
        
    def load_data(self):
        """Load and validate data"""
        data = pd.read_csv(self.config['data_path'])
        self.validate_data(data)
        return data
        
    def validate_data(self, data):
        """Validate data quality"""
        required_columns = self.config['required_columns']
        missing_columns = set(required_columns) - set(data.columns)
        if missing_columns:
            raise ValueError(f"Missing columns: {missing_columns}")
            
    def preprocess_data(self, data):
        """Preprocess and engineer features"""
        # Handle missing values
        data = data.fillna(data.mean())
        
        # Feature engineering
        # ... custom feature engineering logic
        
        return data
        
    def train_model(self, X, y):
        """Train the model"""
        with mlflow.start_run():
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42)
            
            # Train model
            self.model = RandomForestClassifier(**self.config['model_params'])
            self.model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Log metrics
            mlflow.log_metric("accuracy", accuracy)
            mlflow.log_params(self.config['model_params'])
            mlflow.sklearn.log_model(self.model, "model")
            
            return accuracy
            
    def run_pipeline(self):
        """Execute the complete pipeline"""
        # Load data
        data = self.load_data()
        
        # Preprocess
        processed_data = self.preprocess_data(data)
        
        # Prepare features and target
        X = processed_data.drop('target', axis=1)
        y = processed_data['target']
        
        # Train model
        accuracy = self.train_model(X, y)
        
        print(f"Pipeline completed. Model accuracy: {accuracy:.3f}")
        
        return self.model
            </code></pre>
            
            <h3>Deployment Considerations</h3>
            <p>When deploying ML pipelines to production:</p>
            <ul>
                <li>Use containerization for consistency</li>
                <li>Implement proper logging and monitoring</li>
                <li>Set up automated testing and CI/CD</li>
                <li>Plan for model updates and rollbacks</li>
                <li>Consider real-time vs batch processing needs</li>
            </ul>
            
            <h3>Conclusion</h3>
            <p>Building production ML pipelines requires careful consideration of engineering best practices, monitoring, and scalability. The investment in proper pipeline infrastructure pays dividends in model reliability and business value.</p>
            """,
            excerpt="Learn how to build robust, scalable machine learning pipelines for production environments. Covers best practices, tools, and implementation strategies.",
            category="MLOps",
            tags=["mlops", "pipelines", "production", "python", "mlflow"],
            featured=True,
            read_time=12
        ),
        
        BlogPost(
            id="responsible-ai-ethics-bias",
            title="Responsible AI: Addressing Bias and Ethics in Machine Learning",
            content="""
            <h2>The Importance of Responsible AI</h2>
            <p>As AI systems become more prevalent in critical decision-making processes, ensuring they are fair, transparent, and ethical is not just a moral imperative—it's a business necessity.</p>
            
            <h3>Types of Bias in AI</h3>
            <p>Understanding different types of bias is crucial:</p>
            <ul>
                <li><strong>Historical Bias</strong>: Bias present in training data reflecting past discrimination</li>
                <li><strong>Representation Bias</strong>: Underrepresentation of certain groups in data</li>
                <li><strong>Measurement Bias</strong>: Differences in data quality across groups</li>
                <li><strong>Aggregation Bias</strong>: Assuming models work equally well for all subgroups</li>
                <li><strong>Evaluation Bias</strong>: Using inappropriate benchmarks for different populations</li>
            </ul>
            
            <h3>Detecting Bias</h3>
            <p>Methods for identifying bias in ML systems:</p>
            <ol>
                <li><strong>Statistical Parity</strong>: Equal positive prediction rates across groups</li>
                <li><strong>Equalized Odds</strong>: Equal true positive and false positive rates</li>
                <li><strong>Individual Fairness</strong>: Similar individuals receive similar predictions</li>
                <li><strong>Counterfactual Fairness</strong>: Predictions in actual vs counterfactual worlds</li>
            </ol>
            
            <h3>Mitigation Strategies</h3>
            <p>Approaches to reduce bias:</p>
            
            <h4>Pre-processing</h4>
            <ul>
                <li>Data augmentation and balancing</li>
                <li>Feature selection and transformation</li>
                <li>Synthetic data generation</li>
            </ul>
            
            <h4>In-processing</h4>
            <ul>
                <li>Fairness constraints in optimization</li>
                <li>Adversarial debiasing</li>
                <li>Multi-task learning with fairness objectives</li>
            </ul>
            
            <h4>Post-processing</h4>
            <ul>
                <li>Threshold optimization</li>
                <li>Calibration techniques</li>
                <li>Output modification</li>
            </ul>
            
            <h3>Practical Implementation</h3>
            <pre><code>
import pandas as pd
import numpy as np
from sklearn.metrics import confusion_matrix
from aif360.datasets import AdultDataset
from aif360.metrics import BinaryLabelDatasetMetric
from aif360.algorithms.preprocessing import Reweighing

def assess_fairness(dataset, predictions, protected_attribute):
    """Assess fairness metrics for a dataset and predictions"""
    
    # Calculate demographic parity
    def demographic_parity(y_true, y_pred, sensitive):
        pos_rate_protected = np.mean(y_pred[sensitive == 1])
        pos_rate_unprotected = np.mean(y_pred[sensitive == 0])
        return abs(pos_rate_protected - pos_rate_unprotected)
    
    # Calculate equalized odds
    def equalized_odds(y_true, y_pred, sensitive):
        # True positive rates
        tpr_protected = np.mean(y_pred[(y_true == 1) & (sensitive == 1)])
        tpr_unprotected = np.mean(y_pred[(y_true == 1) & (sensitive == 0)])
        
        # False positive rates
        fpr_protected = np.mean(y_pred[(y_true == 0) & (sensitive == 1)])
        fpr_unprotected = np.mean(y_pred[(y_true == 0) & (sensitive == 0)])
        
        tpr_diff = abs(tpr_protected - tpr_unprotected)
        fpr_diff = abs(fpr_protected - fpr_unprotected)
        
        return max(tpr_diff, fpr_diff)
    
    # Calculate metrics
    dp = demographic_parity(dataset.labels, predictions, dataset.protected_attributes)
    eo = equalized_odds(dataset.labels, predictions, dataset.protected_attributes)
    
    return {
        'demographic_parity_difference': dp,
        'equalized_odds_difference': eo
    }

def apply_bias_mitigation(dataset):
    """Apply bias mitigation techniques"""
    
    # Pre-processing: Reweighing
    rw = Reweighing(unprivileged_groups=[{'sex': 0}],
                   privileged_groups=[{'sex': 1}])
    
    # Transform dataset
    dataset_transformed = rw.fit_transform(dataset)
    
    return dataset_transformed

# Example usage
def fairness_pipeline():
    # Load dataset
    dataset = AdultDataset()
    
    # Assess initial bias
    metric = BinaryLabelDatasetMetric(dataset, 
                                    unprivileged_groups=[{'sex': 0}],
                                    privileged_groups=[{'sex': 1}])
    
    print(f"Initial bias - Mean difference: {metric.mean_difference()}")
    
    # Apply mitigation
    dataset_mitigated = apply_bias_mitigation(dataset)
    
    # Assess after mitigation
    metric_mitigated = BinaryLabelDatasetMetric(dataset_mitigated,
                                              unprivileged_groups=[{'sex': 0}],
                                              privileged_groups=[{'sex': 1}])
    
    print(f"After mitigation - Mean difference: {metric_mitigated.mean_difference()}")
            </code></pre>
            
            <h3>Governance and Compliance</h3>
            <p>Establishing responsible AI practices:</p>
            <ul>
                <li><strong>AI Ethics Committees</strong>: Cross-functional teams for oversight</li>
                <li><strong>Impact Assessments</strong>: Evaluate potential societal effects</li>
                <li><strong>Regular Audits</strong>: Ongoing monitoring of deployed systems</li>
                <li><strong>Transparency Reports</strong>: Public documentation of AI systems</li>
                <li><strong>Stakeholder Engagement</strong>: Include affected communities in development</li>
            </ul>
            
            <h3>Tools and Frameworks</h3>
            <p>Resources for responsible AI development:</p>
            <ul>
                <li><strong>IBM AI Fairness 360</strong>: Comprehensive bias detection and mitigation</li>
                <li><strong>Google What-If Tool</strong>: Visual interface for model analysis</li>
                <li><strong>Microsoft Fairlearn</strong>: Python package for fairness assessment</li>
                <li><strong>Aequitas</strong>: Bias audit toolkit</li>
                <li><strong>InterpretML</strong>: Machine learning interpretability</li>
            </ul>
            
            <h3>Conclusion</h3>
            <p>Responsible AI is not a one-time consideration but an ongoing commitment throughout the AI lifecycle. By proactively addressing bias and ethical concerns, we can build AI systems that benefit everyone fairly and equitably.</p>
            """,
            excerpt="Explore the critical importance of responsible AI development, including bias detection, mitigation strategies, and ethical frameworks for fair machine learning systems.",
            category="AI Ethics",
            tags=["responsible-ai", "bias", "ethics", "fairness", "ai-governance"],
            featured=False,
            read_time=10
        )
    ]
