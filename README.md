# ML/Data Science Portfolio Website

A professional Flask-based portfolio website showcasing machine learning projects, tutorials, and technical expertise.

## Overview

This website serves as a comprehensive portfolio for machine learning and data science work, featuring:

- **Interactive Project Demos**: Real-time ML predictions and visualizations
- **Educational Tutorials**: Step-by-step guides with interactive components
- **Professional Presentation**: Clean, responsive design with modern UI/UX
- **Content Management**: Database-driven system for easy content updates

## Features

### Project Showcase
- **Titanic Survival Prediction**: Interactive ML demo with ensemble methods
- **Satellite Signal Strength Prediction**: Advanced regression pipeline with weather data integration
- **Filterable Categories**: Organize projects by domain (Machine Learning, Data Science, Deep Learning)
- **GitHub Integration**: Direct links to source code repositories

### Tutorial System
- **NLP Fundamentals**: Complete natural language processing course
- **Naive Bayes Classification**: Interactive weather prediction demo
- **ML Fundamentals**: Multi-chapter machine learning course
- **Decision Trees & Feature Engineering**: Educational content with examples

### Technical Architecture
- **Flask Backend**: Python web framework with SQLAlchemy ORM
- **SQLite Database**: Lightweight database for development
- **Responsive Design**: Mobile-first CSS with modern layouts
- **Configuration-Driven**: Easy content management through Python configuration files

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

### Development Tools
- **Virtual Environment** - Isolated Python environment
- **Git** - Version control
- **SQLite** - Database for development

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Git
- Virtual environment tool (venv)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flask_ml_website.git
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

## Project Structure

```
flask_portfolio/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── models/                     # Database models
│   ├── tutorial.py
│   └── project.py
├── data/                       # Configuration files
│   ├── tutorials.py
│   └── projects.py
├── templates/                  # HTML templates
│   ├── base.html
│   ├── index.html
│   ├── projects/               # Project-specific templates
│   └── tutorials/              # Tutorial-specific templates
├── static/                     # Static assets
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   └── images/                 # Images and media
└── flask_venv/                 # Virtual environment
```

## Content Management

### Adding New Projects

1. **Update configuration** in `data/projects.py`:
   ```python
   {
       'name': 'your-project-name',
       'title': 'Your Project Title',
       'description': 'Project description...',
       'technology_stack': ['Python', 'Scikit-learn', 'Flask'],
       'has_dedicated_template': True,  # For custom templates
       'template_path': 'projects/your-project/index.html'
   }
   ```

2. **Create template files** (if using dedicated template):
   - HTML: `templates/projects/your-project/index.html`
   - CSS: `static/css/projects/your-project/your-project.css`

3. **Add project image**: `static/images/projects/your-project.jpg`

4. **Restart the application** to reload the database

### Adding New Tutorials

1. **Update configuration** in `data/tutorials.py`
2. **Create template and CSS files** (if interactive)
3. **Restart the application**

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
- Consistent cross-device experience

### Performance Optimizations
- Efficient database queries
- Static asset optimization
- Template caching support
- Responsive image loading

## Development Workflow

### Local Development
1. Make changes to code/templates
2. Restart Flask app if needed (for database changes)
3. Test functionality across different screen sizes
4. Commit changes to version control

### Adding Content
1. Update configuration files (`data/tutorials.py` or `data/projects.py`)
2. Create any necessary template/CSS files
3. Add images to appropriate directories
4. Delete existing database file if schema changed: `rm tutorials.db`
5. Restart application to repopulate database

### Database Management
- **Development**: Delete `tutorials.db` to reset database
- **Schema Changes**: Modify model files and restart application
- **Production**: Use Flask-Migrate for database evolution

## Customization

### Styling
- **Global styles**: Modify `static/css/main.css`
- **Component styles**: Create specific CSS files for new content
- **Color scheme**: Update CSS custom properties in `main.css`

### Functionality
- **New routes**: Add to `app.py`
- **Interactive features**: Add JavaScript in template `extra_js` blocks
- **External APIs**: Integrate in template or route handlers

## Deployment Considerations

### Production Setup
- Use production WSGI server (Gunicorn, uWSGI)
- Configure environment variables
- Use PostgreSQL or MySQL for production database
- Set up static file serving (nginx)
- Enable HTTPS and security headers

### Environment Variables
- `SECRET_KEY`: Flask secret key for sessions
- `DATABASE_URL`: Production database connection string
- `DEBUG`: Set to `False` for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

**Alireza Barzin Zanganeh**  
ML Engineer & Data Scientist  
- GitHub: [abzanganeh](https://github.com/abzanganeh)
- LinkedIn: [linkedin.com/in/alireza-barzin-zanganeh](https://linkedin.com/in/alireza-barzin-zanganeh-2a9909126)
- Email: alireza@zanganehai.com

## Acknowledgments

- Flask community for excellent documentation
- Chart.js for visualization capabilities
- Font Awesome for iconography
- Modern CSS techniques and responsive design patterns