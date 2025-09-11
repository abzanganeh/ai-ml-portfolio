# ML/Data Science Portfolio Website

A professional Flask-based portfolio website showcasing machine learning projects, tutorials, and technical expertise with comprehensive automated testing and CI/CD pipeline.

## Overview

This website serves as a comprehensive portfolio for machine learning and data science work, featuring:

- **Interactive Project Demos**: Real-time ML predictions and visualizations
- **Educational Tutorials**: Step-by-step guides with interactive components
- **Technical Blog**: In-depth articles on machine learning and data science topics
- **Professional Presentation**: Clean, responsive design with modern UI/UX
- **Content Management**: Database-driven system with hybrid file-based blog storage
- **Automated Testing**: Comprehensive cross-browser testing with Playwright
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions

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

### Blog System
- **Understanding Transformer Architecture**: Technical deep-dive into neural network architecture
- **File-Based Content Management**: HTML content stored separately from metadata
- **Category Filtering**: Organize articles by topic (Deep Learning, Machine Learning, etc.)
- **Professional Layout**: Clean article presentation with metadata and navigation

### Technical Architecture
- **Flask Backend**: Python web framework with SQLAlchemy ORM
- **SQLite Database**: Lightweight database for development
- **Responsive Design**: Mobile-first CSS with modern layouts
- **Configuration-Driven**: Easy content management through Python configuration files

### Quality Assurance & Testing
- **Cross-Browser Testing**: Automated testing on Chromium, Firefox, and WebKit
- **Performance Monitoring**: Core Web Vitals and load time validation
- **Security Testing**: OWASP compliance and vulnerability scanning
- **Responsive Design Testing**: Multi-viewport compatibility validation
- **CI/CD Pipeline**: Automated testing on every commit and pull request
- **Test Reporting**: Professional test reports with GitHub Pages deployment

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

### Testing & Quality Assurance
- **Playwright** - Cross-browser end-to-end testing
- **Pytest** - Python testing framework
- **GitHub Actions** - CI/CD pipeline automation
- **pytest-html** - Test report generation
- **Cross-browser support**: Chromium, Firefox, WebKit engines

### Production Infrastructure
- **AWS Lightsail** - Cloud hosting platform
- **Nginx** - Web server and reverse proxy
- **Gunicorn** - Python WSGI HTTP server
- **Let's Encrypt** - SSL certificate management
- **Systemd** - Process management and auto-restart

### Development Tools
- **Virtual Environment** - Isolated Python environment
- **Git** - Version control
- **SQLite** - Database for development
- **GitHub Pages** - Test report hosting

## Testing Infrastructure

### Automated Testing Suite

The project includes a comprehensive testing suite that validates:

#### Functional Testing
- **Homepage Functionality**: Navigation, content loading, hero sections
- **Project Showcase**: Filtering, card displays, external links
- **Blog System**: Post navigation, category filtering, content rendering
- **Contact Forms**: Form validation, submission handling
- **Error Handling**: 404 pages, graceful error responses

#### Cross-Browser Compatibility
- **Chromium Engine**: Desktop browser testing with Blink engine
- **Firefox Engine**: Mozilla Gecko engine compatibility validation
- **WebKit Engine**: Safari and mobile browser compatibility testing

#### Performance Testing
- **Page Load Times**: Core Web Vitals measurement and validation
- **Resource Loading**: Efficient asset loading and caching validation
- **Mobile Performance**: Responsive design performance testing
- **API Response Times**: Backend endpoint performance validation

#### Security Testing
- **OWASP Compliance**: Security header validation and protection testing
- **Input Validation**: XSS and SQL injection protection verification
- **SSL/TLS Configuration**: HTTPS enforcement and certificate validation
- **Information Disclosure**: Sensitive data exposure prevention

#### Responsive Design Testing
- **Mobile Viewport**: 375x667 mobile device simulation
- **Tablet Viewport**: 768x1024 tablet device simulation
- **Desktop Viewport**: 1280x720 and larger screen validation
- **Navigation Testing**: Mobile menu functionality validation

### Test Report Dashboard

Comprehensive test reports are automatically generated and deployed to GitHub Pages:

**Live Test Reports**: [https://abzanganeh.github.io/flask_ml_website/](https://abzanganeh.github.io/flask_ml_website/)

Features include:
- **Interactive Dashboard**: Professional test results presentation
- **Browser-Specific Reports**: Individual reports for each browser engine
- **Historical Tracking**: Test trend analysis and regression detection
- **Failure Analysis**: Detailed error reporting with screenshots and traces
- **Performance Metrics**: Load time analysis and performance recommendations

### CI/CD Pipeline

#### Automated Testing Workflow
```yaml
Trigger Events:
├── Push to main/develop branches
├── Pull Request creation/updates
└── Manual workflow dispatch

Test Execution:
├── Multi-browser testing (Chromium, Firefox, WebKit)
├── Parallel test execution for efficiency
├── Comprehensive test suite coverage
└── Artifact generation and storage

Report Generation:
├── HTML test reports for each browser
├── Combined dashboard creation
├── GitHub Pages deployment
└── Automatic report updates
```

#### Quality Gates
- **All tests must pass** before merge to main branch
- **Cross-browser compatibility** validation required
- **Performance thresholds** must be met
- **Security scans** must pass without critical issues

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Git
- Virtual environment tool (venv)
- Node.js (for advanced testing features)

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
   pip install -r requirements-test.txt  # For testing dependencies
   ```

4. **Install Playwright browsers**
   ```bash
   playwright install
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the website**
   Open your browser and navigate to `http://localhost:8000`

### Running Tests Locally

#### Full Test Suite
```bash
# Run all tests across all browsers
pytest tests/ --browser=chromium --base-url=http://localhost:8000 -v

# Run specific test categories
pytest tests/test_homepage.py -v
pytest tests/test_performance.py -v
pytest tests/test_security.py -v
```

#### Cross-Browser Testing
```bash
# Test on specific browsers
pytest tests/ --browser=firefox --base-url=http://localhost:8000
pytest tests/ --browser=webkit --base-url=http://localhost:8000

# Generate HTML reports
pytest tests/ --html=reports/report.html --self-contained-html
```

#### Performance Testing
```bash
# Run performance tests with detailed metrics
pytest tests/test_performance.py --base-url=http://localhost:8000 -v -s
```

### Production Deployment

The website is deployed using a production-ready setup with the following components:

#### Server Configuration
- **Platform**: AWS Lightsail (512MB instance with static IP)
- **OS**: Ubuntu 22.04 LTS
- **Domain**: zanganehai.com / www.zanganehai.com
- **SSL**: Let's Encrypt certificates with automatic renewal

#### Application Stack
```bash
# Flask application served via Gunicorn
/home/ubuntu/flask_ml_website/flask_env/bin/gunicorn --workers 1 --bind unix:flask-ml.sock app:app

# Nginx reverse proxy configuration
server {
    listen 443 ssl http2;
    server_name www.zanganehai.com;
    
    location / {
        proxy_pass http://unix:/home/ubuntu/flask_ml_website/flask-ml.sock;
        # ... additional proxy headers
    }
}
```

#### Process Management
- **Systemd service**: `flask-ml.service` for automatic application startup
- **Service monitoring**: Automatic restart on failure
- **Memory optimization**: Single Gunicorn worker for resource efficiency

## CI/CD Deployment

### GitHub Actions Workflow

The project uses GitHub Actions for automated testing and deployment:

#### Workflow Features
- **Multi-browser testing** on every push and pull request
- **Parallel test execution** for faster feedback
- **Automatic report generation** and GitHub Pages deployment
- **Artifact storage** for debugging and historical analysis
- **Environment-specific configurations** for CI vs local testing

#### Workflow Triggers
```yaml
Automated Testing:
├── Push to main/develop → Full test suite + deployment
├── Pull Request → Full test suite (no deployment)
├── Manual dispatch → On-demand testing
└── Scheduled runs → Daily health checks (optional)

Report Deployment:
├── Test completion → Generate unified dashboard
├── GitHub Pages → Deploy reports automatically
└── PR Comments → Link to test results
```

### Test Report Integration

#### Automated Reporting
- **Test results** automatically deployed to GitHub Pages
- **Professional dashboard** with interactive test reports
- **Historical test data** maintained for trend analysis
- **Direct links** to specific browser test results

#### Report Features
- **Executive Summary**: High-level test status and metrics
- **Browser Breakdown**: Individual reports for Chromium, Firefox, WebKit
- **Performance Metrics**: Load times, Core Web Vitals, resource analysis
- **Security Assessment**: OWASP compliance and vulnerability status
- **Responsive Testing**: Multi-device compatibility validation

### Automated Deployment Setup

The website uses GitHub webhooks for automatic deployment:

1. **Push changes** to the main branch
2. **GitHub Actions** runs comprehensive test suite
3. **Tests pass** → Reports deployed to GitHub Pages
4. **Production deployment** triggered via webhook: `http://44.237.64.83:9000/deploy`
5. **Server automatically**:
   - Pulls latest code
   - Restarts Flask service
   - Updates live website

### Testing the Deployment

1. Make a small change to any file
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test deployment with CI/CD"
   git push origin main
   ```
3. **Monitor GitHub Actions** for test execution
4. **Check test reports** at [test dashboard](https://abzanganeh.github.io/flask_ml_website/)
5. **Verify live website** at [zanganehai.com](https://www.zanganehai.com)

### Manual Deployment (if needed)

```bash
cd /home/ubuntu/flask_ml_website
git pull
sudo systemctl restart flask-ml
```

## Project Structure

```
flask_portfolio/
├── app.py                      # Main Flask application
├── deploy.py                   # Deployment webhook service
├── requirements.txt            # Python dependencies
├── requirements-test.txt       # Testing dependencies
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── playwright-tests.yml # CI/CD pipeline configuration
├── tests/                      # Comprehensive test suite
│   ├── conftest.py             # Pytest configuration and fixtures
│   ├── test_homepage.py        # Homepage functionality tests
│   ├── test_projects.py        # Project showcase tests
│   ├── test_blog.py           # Blog system tests
│   ├── test_contact_form.py   # Contact form tests
│   ├── test_responsive_design.py # Multi-viewport tests
│   ├── test_performance.py    # Performance and Core Web Vitals
│   ├── test_security.py       # Security and OWASP compliance
│   ├── test_error_pages.py    # Error handling tests
│   └── test_api_endpoints.py  # API endpoint tests
├── models/                     # Database models
│   ├── tutorial.py
│   └── project.py
├── data/                       # Configuration files
│   ├── tutorials.py
│   ├── projects.py
│   └── blog.py                 # Blog metadata configuration
├── content/                    # File-based content storage
│   └── blog/                   # Blog article HTML files
│       └── transformer-architecture.html
├── templates/                  # HTML templates
│   ├── base.html
│   ├── index.html
│   ├── about.html              # Professional background page
│   ├── contact.html            # Contact form
│   ├── blog.html               # Blog listing page
│   ├── blog_post.html          # Individual blog post page
│   ├── projects/               # Project-specific templates
│   └── tutorials/              # Tutorial-specific templates
├── static/                     # Static assets
│   ├── css/                    # Stylesheets
│   │   ├── main.css            # Global styles with CSS custom properties
│   │   ├── blog.css            # Blog-specific styles
│   │   └── projects/           # Project-specific CSS
│   ├── js/                     # JavaScript files
│   └── images/                 # Images and media
│       ├── projects/           # Project thumbnails
│       └── blog/               # Blog post images
└── flask_venv/                 # Virtual environment
```

## Test Suite Documentation

### Test Categories

#### Functional Tests (`test_homepage.py`, `test_projects.py`, `test_blog.py`)
- **User Interface Testing**: Navigation, content display, interactive elements
- **Feature Validation**: Form submissions, filtering, search functionality
- **Content Management**: Blog posts, project displays, tutorial navigation
- **Integration Testing**: Database interactions, template rendering

#### Performance Tests (`test_performance.py`)
- **Page Load Performance**: First Contentful Paint, Largest Contentful Paint
- **Resource Optimization**: Asset loading, caching validation, compression
- **API Performance**: Response times, concurrent request handling
- **Mobile Performance**: Device-specific performance optimization

#### Security Tests (`test_security.py`)
- **OWASP Compliance**: Security headers, clickjacking protection
- **Input Validation**: XSS prevention, SQL injection protection
- **SSL/TLS Security**: Certificate validation, encryption enforcement
- **Information Disclosure**: Sensitive data exposure prevention
- **Access Control**: Authentication, authorization, session management

#### Responsive Design Tests (`test_responsive_design.py`)
- **Multi-Viewport Testing**: Mobile, tablet, desktop compatibility
- **Layout Validation**: Grid systems, flexible layouts, content reflow
- **Navigation Testing**: Mobile menus, touch interactions
- **Media Queries**: Breakpoint functionality, responsive images

#### Error Handling Tests (`test_error_pages.py`)
- **404 Error Pages**: Custom error page functionality
- **Server Error Handling**: Graceful degradation, error reporting
- **Input Validation**: Form error handling, user feedback
- **Edge Case Testing**: Boundary conditions, unexpected inputs

### Test Configuration

#### Browser Matrix
```python
browsers = ["chromium", "firefox", "webkit"]
viewports = [
    {"width": 375, "height": 667},   # Mobile
    {"width": 768, "height": 1024},  # Tablet  
    {"width": 1280, "height": 720},  # Desktop
    {"width": 1920, "height": 1080}  # Large Desktop
]
```

#### Performance Thresholds
- **Page Load Time**: < 5 seconds (local), < 10 seconds (CI)
- **API Response Time**: < 2 seconds (local), < 5 seconds (CI)
- **Core Web Vitals**: LCP < 4 seconds, FCP < 3 seconds
- **Resource Size**: Total page size < 8MB (local), < 15MB (CI)

#### Security Requirements
- **Security Headers**: X-Frame-Options, X-Content-Type-Options required
- **HTTPS Enforcement**: All traffic redirected to HTTPS
- **Input Sanitization**: XSS and SQL injection protection validated
- **Error Handling**: No sensitive information disclosure in error pages

## System Configuration Files

### GitHub Actions Workflow
```yaml
# .github/workflows/playwright-tests.yml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
    # ... full workflow configuration
```

### Flask Application Service
```ini
# /etc/systemd/system/flask-ml.service
[Unit]
Description=Gunicorn instance to serve Flask ML Website
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/flask_ml_website
Environment="PATH=/home/ubuntu/flask_ml_website/flask_env/bin"
ExecStartPre=/bin/rm -f /home/ubuntu/flask_ml_website/flask-ml.sock
ExecStart=/home/ubuntu/flask_ml_website/flask_env/bin/gunicorn --workers 1 --bind unix:flask-ml.sock -m 007 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### Deployment Webhook Service
```ini
# /etc/systemd/system/deploy-webhook.service
[Unit]
Description=Deployment Webhook Service
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/home/ubuntu/flask_ml_website/flask_env/bin/python /home/ubuntu/deploy.py
Restart=always

[Install]
WantedBy=multi-user.target
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

4. **Push to GitHub** - automated testing and deployment will validate and update the live site

### Adding New Tutorials

1. **Update configuration** in `data/tutorials.py`
2. **Create template and CSS files** (if interactive)
3. **Add tests** for new tutorial functionality
4. **Push changes** for automated testing and deployment

### Adding New Blog Posts

1. **Create content file** in `content/blog/`:
   ```bash
   touch content/blog/your-article-slug.html
   ```

2. **Write article content** in HTML format in the content file

3. **Update configuration** in `data/blog.py`:
   ```python
   {
       'id': 'your-article-slug',
       'title': 'Your Article Title',
       'excerpt': 'Brief description...',
       'category': 'Machine Learning',
       'tags': ['tag1', 'tag2'],
       'featured': False,
       'content_file': 'your-article-slug.html',
       'image_url': '/static/images/blog/your-article.jpg'
   }
   ```

4. **Add article image**: `static/images/blog/your-article.jpg`

5. **Push to GitHub** - automated testing will validate blog functionality and deployment will update the live site

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

### Quality Assurance
- Comprehensive automated testing
- Cross-browser compatibility validation
- Performance monitoring and optimization
- Security vulnerability scanning
- Professional test reporting

## Development Workflow

### Development with Testing
1. **Create feature branch** from main
2. **Develop new features** locally
3. **Run local tests** to validate changes:
   ```bash
   pytest tests/ --browser=chromium --base-url=http://localhost:8000
   ```
4. **Create pull request** - triggers full test suite
5. **Review test results** in PR comments
6. **Merge after tests pass** - triggers deployment

### Local Development
1. Make changes to code/templates
2. Test functionality locally
3. Run relevant test suites:
   ```bash
   # Test specific functionality
   pytest tests/test_projects.py -v
   
   # Test performance
   pytest tests/test_performance.py -v
   
   # Full test suite
   pytest tests/ --browser=chromium -v
   ```
4. Commit and push changes to GitHub
5. **Automated testing** validates changes in CI
6. **Automatic deployment** triggers on successful tests
7. **Test reports** updated on GitHub Pages
8. **Verify changes** on live site

### Production Deployment Process
1. **Push to main branch** on GitHub
2. **GitHub Actions** runs comprehensive test suite across browsers
3. **Test reports** generated and deployed to GitHub Pages
4. **Tests pass** → **GitHub webhook** automatically triggers deployment
5. **Server pulls latest code** and restarts Flask service
6. **Website updates** within seconds
7. **No manual intervention** required

### Database Management
- **Development**: Delete `tutorials.db` to reset database
- **Schema Changes**: Modify model files and restart application
- **Production**: Database recreated automatically on deployment

## Monitoring & Maintenance

### Service Status Monitoring
```bash
# Check Flask application
sudo systemctl status flask-ml

# Check deployment webhook
sudo systemctl status deploy-webhook

# Check Nginx
sudo systemctl status nginx

# Monitor system resources
htop
free -h
```

### Test Report Monitoring
```bash
# Monitor GitHub Actions
# Visit: https://github.com/abzanganeh/flask_ml_website/actions

# View test reports
# Visit: https://abzanganeh.github.io/flask_ml_website/

# Check test artifacts
# Download from GitHub Actions workflow runs
```

### Log Monitoring
```bash
# Flask application logs
sudo journalctl -u flask-ml -f

# Deployment webhook logs
sudo journalctl -u deploy-webhook -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Management
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates (automatic via cron)
sudo certbot renew --force-renewal
```

## Security Considerations

### Firewall Configuration
- **Port 22**: SSH access
- **Port 80**: HTTP (redirects to HTTPS)
- **Port 443**: HTTPS
- **Port 9000**: Webhook endpoint (HTTP)

### SSL/TLS Security
- **Let's Encrypt certificates** for HTTPS
- **Automatic HTTP to HTTPS redirects**
- **Security headers** configured in Nginx
- **SSL protocols**: TLSv1.2 and TLSv1.3 only

### Access Control
- **Webhook endpoint**: Basic request validation
- **Server access**: SSH key-based authentication
- **File permissions**: Restricted to ubuntu user and www-data group

### Automated Security Testing
- **OWASP compliance** validation in CI/CD
- **Security header** verification
- **Input validation** testing
- **SSL/TLS configuration** validation

## Performance Metrics

### Resource Utilization
- **Memory Usage**: ~145MB total (Flask: 127MB + Webhook: 18MB)
- **CPU Usage**: Minimal during normal operation
- **Storage**: ~500MB including virtual environment and logs
- **Network**: HTTPS with gzip compression enabled

### Response Performance
- **Average page load**: <2 seconds
- **Static assets**: Cached with long expiry headers
- **Database queries**: Optimized with proper indexing
- **SSL handshake**: Modern cipher suites for fast encryption

### Testing Performance
- **Test execution time**: ~10-15 minutes for full cross-browser suite
- **Parallel execution**: Tests run simultaneously across browsers
- **Resource efficiency**: Optimized for CI environment constraints
- **Report generation**: <2 minutes for complete dashboard deployment

## Troubleshooting

### Common Issues

#### Website Not Accessible
```bash
# Check services
sudo systemctl status flask-ml nginx

# Check DNS resolution
nslookup zanganehai.com
nslookup www.zanganehai.com

# Check SSL certificates
sudo certbot certificates
```

#### Test Failures
```bash
# View GitHub Actions logs
# Visit: https://github.com/abzanganeh/flask_ml_website/actions

# Run tests locally for debugging
pytest tests/test_failing_module.py -v -s --browser=chromium

# Check test reports for details
# Visit: https://abzanganeh.github.io/flask_ml_website/
```

#### Deployment Failures
```bash
# Check webhook service
sudo systemctl status deploy-webhook
sudo journalctl -u deploy-webhook -n 20

# Test manual deployment
cd /home/ubuntu/flask_ml_website
git pull
sudo systemctl restart flask-ml
```

#### Memory Issues
```bash
# Monitor memory usage
free -h
htop

# Restart services if needed
sudo systemctl restart flask-ml
sudo systemctl restart deploy-webhook
```

#### CI/CD Pipeline Issues
```bash
# Check GitHub Actions workflow
# Verify .github/workflows/playwright-tests.yml syntax

# Validate test dependencies
pip install -r requirements-test.txt
playwright install

# Test workflow locally (if using act)
act push
```

## Customization

### Styling
- **Global styles**: Modify `static/css/main.css`
- **Component styles**: Create specific CSS files for new content
- **Color scheme**: Update CSS custom properties in `main.css`

### Functionality
- **New routes**: Add to `app.py`
- **Interactive features**: Add JavaScript in template `extra_js` blocks
- **External APIs**: Integrate in template or route handlers

### Testing
- **New test categories**: Add test files in `tests/` directory
- **Custom assertions**: Extend `conftest.py` with custom fixtures
- **Performance thresholds**: Modify limits in `test_performance.py`
- **Security rules**: Update validation in `test_security.py`

## Deployment History & Architecture Decisions

### Infrastructure Evolution
1. **Initial Setup**: Basic Flask development server
2. **Production Migration**: Gunicorn + Nginx reverse proxy
3. **SSL Implementation**: Let's Encrypt certificate automation
4. **CI/CD Integration**: GitHub webhook deployment system
5. **Resource Optimization**: Single worker configuration for memory efficiency
6. **Testing Infrastructure**: Playwright cross-browser testing implementation
7. **Automated QA**: GitHub Actions CI/CD with comprehensive test reporting

### Performance Optimizations Made
- **Reduced Gunicorn workers** from 3 to 1 (memory constraint optimization)
- **Eliminated Jenkins CI/CD** in favor of lightweight webhook approach
- **Static IP attachment** to prevent DNS/SSL certificate issues
- **Systemd service management** for reliable process monitoring
- **GitHub Actions optimization** for efficient test execution and reporting

### Testing Architecture Decisions
- **Playwright selection** over Selenium for better performance and reliability
- **Multi-browser strategy** to ensure cross-platform compatibility
- **GitHub Pages integration** for professional test report hosting
- **Parallel test execution** to optimize CI/CD pipeline performance
- **Environment-specific thresholds** to account for CI vs local differences

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. **Add tests** for new functionality
5. **Run test suite locally**:
   ```bash
   pytest tests/ --browser=chromium --base-url=http://localhost:8000
   ```
6. Test thoroughly locally
7. Submit a pull request
8. **Automated testing** will validate your changes
9. **Review test reports** in PR comments
10. **Automatic deployment** will occur on merge to main branch

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

**Alireza Barzin Zanganeh**  
ML Engineer & Data Scientist  
- **Website**: [zanganehai.com](https://www.zanganehai.com)
- **Test Reports**: [Test Dashboard](https://abzanganeh.github.io/flask_ml_website/)
- **GitHub**: [abzanganeh](https://github.com/abzanganeh)
- **LinkedIn**: [linkedin.com/in/alireza-barzin-zanganeh](https://linkedin.com/in/alireza-barzin-zanganeh-2a9909126)
- **Email**: alireza@zanganehai.com

## Acknowledgments

- Flask community for excellent documentation
- Chart.js for visualization capabilities  
- Font Awesome for iconography
- AWS Lightsail for reliable cloud hosting
- Let's Encrypt for free SSL certificate automation
- GitHub for integrated CI/CD capabilities
- Playwright team for robust testing framework
- Modern CSS techniques and responsive design patterns
- GitHub Actions community for workflow optimization
- Open source testing and quality assurance communities