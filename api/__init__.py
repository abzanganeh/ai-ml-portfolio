# API package for JS-to-Python migration
# This package contains all the new API endpoints that will replace JavaScript functionality

from flask import Blueprint

# Create API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import all API modules
from . import core_apis
from . import tutorial_apis
from . import visualization_apis

# Register blueprints
api_bp.register_blueprint(core_apis.core_bp)
api_bp.register_blueprint(tutorial_apis.tutorial_bp)
api_bp.register_blueprint(visualization_apis.viz_bp)

