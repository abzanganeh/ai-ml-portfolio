# ML/Data Science Portfolio Website

A professional Flask-based portfolio website showcasing machine learning projects, tutorials, and technical expertise.

## Overview

This website serves as a comprehensive portfolio for machine learning and data science work, featuring:

- **Interactive Project Demos**: Real-time ML predictions and visualizations
- **Educational Tutorials**: Step-by-step guides with interactive components
- **Technical Blog**: Articles on machine learning and data science topics
- **Professional Presentation**: Clean, responsive design
- **Automated Testing**: Cross-browser testing with Playwright

## Features

### Project Showcase
- **Titanic Survival Prediction**: Interactive ML demo with ensemble methods
- **Satellite Signal Strength Prediction**: Advanced regression pipeline with weather data integration
- **Filterable Categories**: Organize projects by domain (Machine Learning, Data Science, Deep Learning)
- **GitHub Integration**: Direct links to source code repositories

### Tutorial System
- **Comprehensive Clustering Analysis**: Complete 15-chapter course covering all clustering algorithms and techniques
- **NLP Fundamentals**: Complete natural language processing course
- **Naive Bayes Classification**: Interactive weather prediction demo
- **ML Fundamentals**: Machine learning course with examples
- **Complete EDA LeetCode**: Data analysis and exploration techniques
- **ML Model Relationships**: Understanding model connections and comparisons

### Blog System
- **Understanding Transformer Architecture**: Technical deep-dive into neural network architecture
- **File-Based Content Management**: HTML content stored separately from metadata
- **Category Filtering**: Organize articles by topic
- **Professional Layout**: Clean article presentation with metadata and navigation

## Comprehensive Clustering Analysis Tutorial

### Overview
A complete 15-chapter educational course covering all aspects of clustering algorithms and techniques, from basic concepts to advanced implementations.

### Course Structure
1. **Chapter 1**: Introduction to Clustering and Unsupervised Learning
2. **Chapter 2**: Distance Metrics and Similarity Measures
3. **Chapter 3**: Minkowski Distance and Parameter Selection
4. **Chapter 4**: K-means Algorithm Fundamentals
5. **Chapter 5**: K-means Optimization and Convergence
6. **Chapter 6**: K-means Initialization Methods
7. **Chapter 7**: Optimal K Selection (Elbow Method & Silhouette Analysis)
8. **Chapter 8**: Hierarchical Clustering - Dendrograms
9. **Chapter 9**: Linkage Methods in Hierarchical Clustering
10. **Chapter 10**: Cutting Strategies and Cluster Formation
11. **Chapter 11**: DBSCAN - Density-Based Clustering
12. **Chapter 12**: Gaussian Mixture Models
13. **Chapter 13**: Clustering Evaluation Metrics
14. **Chapter 14**: Advanced Clustering Techniques
15. **Chapter 15**: Final Assessment and Review

### Interactive Features
- **Real-time Visualizations**: SVG-based clustering demonstrations
- **Step-by-step Algorithms**: Manual stepping through clustering iterations
- **Parameter Controls**: Interactive sliders for algorithm parameters
- **Multiple Datasets**: Various data types (random, blobs, moons, etc.)
- **Evaluation Metrics**: Automatic calculation of clustering quality measures
- **Responsive Design**: Optimized for desktop and mobile devices

### Technical Implementation
- **Modular JavaScript**: Shared functions across chapters for consistency
- **SVG Visualizations**: Dynamic, interactive clustering plots
- **Quiz System**: Standardized assessment across all chapters
- **Smart Navigation**: Sub-chapter navigation with optimal scroll positioning
- **Error Handling**: Robust error management and user feedback
- **Performance Optimization**: Efficient algorithms and smooth animations

### Educational Value
- **Progressive Learning**: Concepts build upon each other systematically
- **Hands-on Experience**: Interactive demos for every major concept
- **Mathematical Foundations**: Clear explanations of underlying mathematics
- **Real-world Applications**: Practical examples and use cases
- **Assessment Tools**: Quizzes and evaluations to test understanding

## Recent Updates & Improvements

### Clustering Tutorial Development (2024)
- **Complete 15-Chapter Course**: Comprehensive clustering analysis tutorial
- **Interactive Demos**: Real-time SVG visualizations for all clustering algorithms
- **Standardized Quiz System**: Consistent assessment across all chapters
- **Smart Navigation**: Optimized sub-chapter navigation with proper scroll positioning
- **Modular Architecture**: Shared JavaScript functions for maintainability
- **Error Handling**: Robust error management and user feedback systems
- **Performance Optimization**: Efficient algorithms and smooth animations
- **Responsive Design**: Mobile-optimized interface for all devices

### Technical Enhancements
- **SVG-Based Visualizations**: Dynamic, interactive clustering plots
- **Shared Component Library**: Reusable functions across chapters
- **Automated Metrics Display**: Automatic calculation and display of clustering quality measures
- **Step-by-Step Learning**: Manual algorithm stepping for educational purposes
- **Real-time Parameter Control**: Interactive sliders for algorithm parameters
- **Multiple Dataset Support**: Various data types (random, blobs, moons, etc.)

## Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **Jinja2** - Template engine

### Frontend
- **HTML5/CSS3** - Modern web standards
- **JavaScript** - Interactive functionality
- **SVG** - Dynamic data visualizations
- **Chart.js** - Data visualizations
- **Font Awesome** - Icon library

### Testing & Deployment
- **Playwright** - Cross-browser end-to-end testing
- **GitHub Actions** - CI/CD pipeline automation
- **AWS Lightsail** - Cloud hosting platform
- **Nginx** - Web server and reverse proxy

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Git
- Virtual environment tool (venv)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abzanganeh/flask_ml_website.git
   cd flask_ml_website
   ```

2. **Create virtual environment**
   ```bash
   python -m venv flask_venv
   source flask_venv/bin/activate  # On Windows: flask_venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the website**
   Open your browser and navigate to `http://localhost:8000`

### Running Tests

```bash
# Install test dependencies
pip install -r requirements-test.txt
playwright install

# Run tests
pytest tests/ --browser=chromium --base-url=http://localhost:8000 -v
```

## Project Structure

```
flask_portfolio/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── requirements-test.txt       # Testing dependencies
├── .github/workflows/          # GitHub Actions CI/CD
├── tests/                      # Test suite
├── models/                     # Database models
├── data/                       # Configuration files
├── content/blog/               # Blog article HTML files
├── templates/                  # HTML templates
│   └── tutorials/
│       └── clustering/         # Clustering tutorial chapters (1-15)
├── static/                     # Static assets (CSS, JS, images)
│   ├── css/tutorials/clustering/  # Clustering tutorial styles
│   ├── js/tutorials/clustering/   # Clustering tutorial JavaScript
│   └── images/tutorials/clustering/ # Clustering tutorial images
└── flask_venv/                 # Virtual environment
```

## Live Website

**Production Website**: [zanganehai.com](https://www.zanganehai.com)  
**Test Reports**: [Test Dashboard](https://abzanganeh.github.io/flask_ml_website/)

## Features in Detail

### Interactive Demos
- Real-time ML model predictions
- Data visualization with Chart.js
- Form-based input systems
- Result interpretation and explanation

### Clustering Tutorial Features
- **Interactive Algorithm Demos**: Step-by-step visualization of clustering algorithms
- **Real-time Parameter Control**: Dynamic adjustment of algorithm parameters
- **Multiple Visualization Types**: K-means, hierarchical clustering, dendrograms, and more
- **Educational Quizzes**: Standardized assessment system across all chapters
- **Smart Navigation**: Optimized sub-chapter navigation with proper scroll positioning
- **Automated Metrics**: Automatic calculation and display of clustering quality measures
- **Responsive Visualizations**: SVG-based plots that work on all devices

### Responsive Design
- Mobile-first CSS approach
- Flexible grid layouts
- Touch-friendly interactions
- Cross-device compatibility

## Deployment

The website is automatically deployed using GitHub Actions. Push changes to the main branch to trigger:
1. Automated testing across multiple browsers
2. Test report generation
3. Automatic deployment to production server

## Contact

**Alireza Barzin Zanganeh**  
ML Engineer & Data Scientist  
- **Website**: [zanganehai.com](https://www.zanganehai.com)
- **GitHub**: [abzanganeh](https://github.com/abzanganeh)
- **LinkedIn**: [linkedin.com/in/alireza-barzin-zanganeh](https://linkedin.com/in/alireza-barzin-zanganeh-2a9909126)
- **Email**: alireza@zanganehai.com