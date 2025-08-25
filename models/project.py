from datetime import datetime
from typing import List, Optional, Dict

class Project:
    """Project model for portfolio projects"""
    
    def __init__(self,
                 id: str,
                 title: str,
                 description: str,
                 technology_stack: List[str],
                 github_url: str = None,
                 demo_url: str = None,
                 category: str = "General",
                 featured: bool = False,
                 image_url: str = None,
                 name: str = None, 
                 created_at: Optional[datetime] = None,
                 status: str = "Completed",
                 challenges: List[str] = None,
                 results: Dict = None,
                 team_size: int = 1,
                 duration_months: int = 3,
                 detailed_description: str = None):
        """
        Initialize a Project object
        
        Args:
            id: Unique identifier for the project
            title: Project title
            description: Short description of the project
            technology_stack: List of technologies used
            github_url: GitHub repository URL
            demo_url: Live demo URL
            category: Project category
            featured: Whether this is a featured project
            image_url: URL to project image/screenshot
            created_at: Project creation date
            status: Project status (Completed, In Progress, Planned)
            challenges: List of challenges faced
            results: Dictionary of project results/metrics
            team_size: Number of team members
            duration_months: Project duration in months
            detailed_description: Extended project description
        """
        self.id = id
        self.title = title
        self.description = description
        self.name = name or id.lower().replace(' ', '_').replace('-', '_')
        self.technology_stack = technology_stack or []
        self.github_url = github_url
        self.demo_url = demo_url
        self.category = category
        self.featured = featured
        self.image_url = image_url or f"/static/images/projects/{id}.jpg"
        self.created_at = created_at or datetime.now()
        self.status = status
        self.challenges = challenges or []
        self.results = results or {}
        self.team_size = team_size
        self.duration_months = duration_months
        self.detailed_description = detailed_description or description
    
    def to_dict(self) -> dict:
        """Convert project to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'description': self.description,
            'detailed_description': self.detailed_description,
            'technology_stack': self.technology_stack,
            'github_url': self.github_url,
            'demo_url': self.demo_url,
            'category': self.category,
            'featured': self.featured,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat(),
            'status': self.status,
            'challenges': self.challenges,
            'results': self.results,
            'team_size': self.team_size,
            'duration_months': self.duration_months,
            'url': f"/projects/{self.name}" 
        }
    
    def get_technology_categories(self) -> Dict[str, List[str]]:
        """Categorize technologies by type"""
        categories = {
            'Programming Languages': [],
            'Frameworks/Libraries': [],
            'Databases': [],
            'Tools/Platforms': [],
            'Other': []
        }
        
        # Technology categorization mapping
        tech_mapping = {
            'Programming Languages': ['Python', 'R', 'JavaScript', 'Java', 'C++', 'SQL', 'TypeScript'],
            'Frameworks/Libraries': ['Flask', 'Django', 'React', 'TensorFlow', 'PyTorch', 'Scikit-learn', 
                                   'Pandas', 'NumPy', 'Express.js', 'Vue.js', 'Angular'],
            'Databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase'],
            'Tools/Platforms': ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Jenkins', 
                              'Git', 'Jupyter', 'Streamlit', 'Heroku']
        }
        
        for tech in self.technology_stack:
            categorized = False
            for category, tech_list in tech_mapping.items():
                if tech in tech_list:
                    categories[category].append(tech)
                    categorized = True
                    break
            
            if not categorized:
                categories['Other'].append(tech)
        
        # Remove empty categories
        return {k: v for k, v in categories.items() if v}
    
    def get_complexity_score(self) -> int:
        """Calculate project complexity score based on various factors"""
        score = 0
        
        # Technology stack diversity
        score += len(self.technology_stack) * 2
        
        # Duration
        score += self.duration_months * 3
        
        # Team size (collaborative projects are more complex)
        if self.team_size > 1:
            score += self.team_size * 2
        
        # Number of challenges faced
        score += len(self.challenges) * 5
        
        # Category complexity
        category_weights = {
            'Machine Learning': 15,
            'Deep Learning': 20,
            'MLOps': 18,
            'Data Science': 12,
            'Web Development': 8,
            'Mobile Development': 10,
            'NLP': 16,
            'Computer Vision': 17,
            'General': 5
        }
        score += category_weights.get(self.category, 5)
        
        return score
    
    def get_related_projects(self, all_projects: List['Project'], limit: int = 3) -> List['Project']:
        """Get related projects based on technology stack and category"""
        related = []
        
        for project in all_projects:
            if project.id == self.id:
                continue
                
            score = 0
            
            # Same category
            if project.category == self.category:
                score += 5
                
            # Shared technologies
            shared_tech = set(self.technology_stack) & set(project.technology_stack)
            score += len(shared_tech) * 3
            
            # Similar complexity
            complexity_diff = abs(self.get_complexity_score() - project.get_complexity_score())
            if complexity_diff < 20:
                score += 2
                
            if score > 0:
                related.append((project, score))
        
        # Sort by score and return top matches
        related.sort(key=lambda x: x[1], reverse=True)
        return [project for project, score in related[:limit]]
    
    def add_technology(self, technology: str):
        """Add a technology to the stack"""
        if technology not in self.technology_stack:
            self.technology_stack.append(technology)
    
    def remove_technology(self, technology: str):
        """Remove a technology from the stack"""
        if technology in self.technology_stack:
            self.technology_stack.remove(technology)
    
    def add_challenge(self, challenge: str):
        """Add a project challenge"""
        if challenge not in self.challenges:
            self.challenges.append(challenge)
    
    def add_result(self, metric: str, value):
        """Add a project result/metric"""
        self.results[metric] = value
    
    def update_status(self, new_status: str):
        """Update project status"""
        valid_statuses = ["Planned", "In Progress", "Completed", "On Hold", "Cancelled"]
        if new_status in valid_statuses:
            self.status = new_status
    
    def is_recent(self, days: int = 90) -> bool:
        """Check if project was created recently"""
        days_ago = datetime.now() - datetime.timedelta(days=days)
        return self.created_at > days_ago
    
    def __str__(self) -> str:
        return f"Project: {self.title} ({self.category})"
    
    def __repr__(self) -> str:
        return f"Project(id='{self.id}', title='{self.title}', category='{self.category}')"

# Example project data factory
class ProjectFactory:
    """Factory class for creating project instances"""
    
    @staticmethod
    def create_ml_project(id: str, title: str, description: str, ml_type: str) -> Project:
        """Create a machine learning project with appropriate tech stack"""
        base_tech = ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-learn"]
        
        if ml_type == "deep_learning":
            base_tech.extend(["TensorFlow", "Keras"])
            category = "Deep Learning"
        elif ml_type == "nlp":
            base_tech.extend(["NLTK", "spaCy", "Transformers"])
            category = "NLP"
        elif ml_type == "computer_vision":
            base_tech.extend(["OpenCV", "PIL", "TensorFlow"])
            category = "Computer Vision"
        else:
            category = "Machine Learning"
            
        return Project(
            id=id,
            title=title,
            description=description,
            technology_stack=base_tech,
            category=category,
            duration_months=4
        )
    
    @staticmethod
    def create_web_project(id: str, title: str, description: str, framework: str) -> Project:
        """Create a web development project"""
        base_tech = ["HTML", "CSS", "JavaScript"]
        
        if framework == "flask":
            base_tech.extend(["Python", "Flask", "Jinja2", "SQLite"])
        elif framework == "react":
            base_tech.extend(["React", "Node.js", "Express.js", "MongoDB"])
        elif framework == "django":
            base_tech.extend(["Python", "Django", "PostgreSQL"])
        elif framework == "vue":
            base_tech.extend(["Vue.js", "Node.js", "Express.js"])
            
        return Project(
            id=id,
            title=title,
            description=description,
            technology_stack=base_tech,
            category="Web Development",
            duration_months=2
        )
    
    @staticmethod
    def create_data_science_project(id: str, title: str, description: str, focus_area: str) -> Project:
        """Create a data science project"""
        base_tech = ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"]
        
        if focus_area == "analysis":
            base_tech.extend(["Scipy", "Statsmodels"])
        elif focus_area == "visualization":
            base_tech.extend(["Plotly", "Bokeh", "D3.js"])
        elif focus_area == "big_data":
            base_tech.extend(["Apache Spark", "Hadoop", "Kafka"])
        elif focus_area == "time_series":
            base_tech.extend(["Prophet", "ARIMA", "Statsmodels"])
            
        return Project(
            id=id,
            title=title,
            description=description,
            technology_stack=base_tech,
            category="Data Science",
            duration_months=3
        )