# ML/Data Science Portfolio Website

A professional Flask-based portfolio website showcasing machine learning projects, tutorials, and technical expertise.

## Overview

This website serves as a comprehensive portfolio for machine learning and data science work, featuring:

- **Interactive Project Demos**: Real-time ML predictions and visualizations
- **Educational Tutorials**: Step-by-step guides with interactive components
- **Technical Blog**: In-depth articles on machine learning and data science topics
- **Professional Presentation**: Clean, responsive design with modern UI/UX
- **Content Management**: Database-driven system with hybrid file-based blog storage

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

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Git
- Virtual environment tool (venv)

### Local Development Setup

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

## Deployment

### Automated Deployment Setup

The website uses GitHub webhooks for automatic deployment:

1. **Push changes** to the main branch
2. **GitHub triggers** webhook: `http://44.237.64.83:9000/deploy`
3. **Server automatically**:
   - Pulls latest code
   - Restarts Flask service
   - Updates live website

### Testing the Deployment

1. Make a small change to any file
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Check the live website at [zanganehai.com](https://www.zanganehai.com)

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

## System Configuration Files

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

4. **Push to GitHub** - automatic deployment will update the live site

### Adding New Tutorials

1. **Update configuration** in `data/tutorials.py`
2. **Create template and CSS files** (if interactive)
3. **Push changes** for automatic deployment

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

5. **Push to GitHub** - automatic deployment will update the live site

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
2. Test functionality locally
3. Commit and push changes to GitHub
4. **Automatic deployment** triggers via webhook
5. Verify changes on live site

### Production Deployment Process
1. **Push to main branch** on GitHub
2. **GitHub webhook** automatically triggers deployment
3. **Server pulls latest code** and restarts Flask service
4. **Website updates** within seconds
5. **No manual intervention** required

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

## Customization

### Styling
- **Global styles**: Modify `static/css/main.css`
- **Component styles**: Create specific CSS files for new content
- **Color scheme**: Update CSS custom properties in `main.css`

### Functionality
- **New routes**: Add to `app.py`
- **Interactive features**: Add JavaScript in template `extra_js` blocks
- **External APIs**: Integrate in template or route handlers

## Deployment History & Architecture Decisions

### Infrastructure Evolution
1. **Initial Setup**: Basic Flask development server
2. **Production Migration**: Gunicorn + Nginx reverse proxy
3. **SSL Implementation**: Let's Encrypt certificate automation
4. **CI/CD Integration**: GitHub webhook deployment system
5. **Resource Optimization**: Single worker configuration for memory efficiency

### Performance Optimizations Made
- **Reduced Gunicorn workers** from 3 to 1 (memory constraint optimization)
- **Eliminated Jenkins CI/CD** in favor of lightweight webhook approach
- **Static IP attachment** to prevent DNS/SSL certificate issues
- **Systemd service management** for reliable process monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly locally
5. Submit a pull request
6. **Automatic deployment** will occur on merge to main branch

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

**Alireza Barzin Zanganeh**  
ML Engineer & Data Scientist  
- **Website**: [zanganehai.com](https://www.zanganehai.com)
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
- Modern CSS techniques and responsive design patterns