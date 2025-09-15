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

## Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **Jinja2** - Template engine

### Frontend
- **HTML5/CSS3** - Modern web standards
- **JavaScript** - Interactive functionality
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
├── static/                     # Static assets (CSS, JS, images)
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