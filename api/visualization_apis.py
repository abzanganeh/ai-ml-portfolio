"""
Visualization API endpoints to replace JavaScript visualization functionality
These endpoints will generate charts and visualizations using Python libraries
"""

from flask import Blueprint, request, jsonify, current_app
from services.api_service import ApiService

# Create blueprint for visualization APIs
viz_bp = Blueprint('visualization', __name__, url_prefix='/visualizations')

# Initialize API service
api_service = ApiService()


@viz_bp.route('/clustering', methods=['POST'])
def clustering_visualization():
    """
    Clustering visualization API endpoint
    Replaces: JavaScript K-means clustering demos
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'data' not in data:
            return jsonify({
                "error": "Data points are required"
            }), 400
        
        # Generate clustering visualization
        result = api_service.handle_visualization_request('clustering', data)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Clustering visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate clustering visualization"
        }), 500


@viz_bp.route('/matrix-vector', methods=['POST'])
def matrix_vector_visualization():
    """
    Matrix-vector multiplication visualization API endpoint
    Replaces: JavaScript matrix demo functionality
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'matrix' not in data or 'vector' not in data:
            return jsonify({
                "error": "Matrix and vector are required"
            }), 400
        
        # Generate matrix-vector visualization
        result = api_service.handle_visualization_request('matrix_vector', data)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Matrix-vector visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate matrix-vector visualization"
        }), 500


@viz_bp.route('/decision-tree', methods=['POST'])
def decision_tree_visualization():
    """
    Decision tree visualization API endpoint
    Replaces: JavaScript decision tree demos
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'tree_data' not in data:
            return jsonify({
                "error": "Tree data is required"
            }), 400
        
        # Generate decision tree visualization
        result = api_service.handle_visualization_request('decision_tree', data)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Decision tree visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate decision tree visualization"
        }), 500


@viz_bp.route('/dendrogram', methods=['POST'])
def dendrogram_visualization():
    """
    Dendrogram visualization API endpoint
    Replaces: JavaScript hierarchical clustering demos
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'data' not in data:
            return jsonify({
                "error": "Data points are required"
            }), 400
        
        # Generate dendrogram visualization
        result = api_service.handle_visualization_request('dendrogram', data)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Dendrogram visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate dendrogram visualization"
        }), 500


@viz_bp.route('/eda/<chart_type>', methods=['POST'])
def eda_visualization(chart_type):
    """
    EDA visualization API endpoint
    Replaces: JavaScript Chart.js visualizations in EDA tutorial
    """
    try:
        data = request.get_json() or {}
        
        # Validate chart type
        valid_types = ['missing_data', 'correlation_heatmap', 'distribution', 'outlier_boxplot']
        if chart_type not in valid_types:
            return jsonify({
                "error": f"Invalid chart type. Must be one of: {', '.join(valid_types)}"
            }), 400
        
        # Generate EDA visualization
        result = api_service.handle_visualization_request(chart_type, data)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"EDA visualization API error: {e}")
        return jsonify({
            "error": f"Failed to generate {chart_type} visualization"
        }), 500


@viz_bp.route('/custom', methods=['POST'])
def custom_visualization():
    """
    Custom visualization API endpoint
    Replaces: JavaScript custom visualization functionality
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'chart_type' not in data:
            return jsonify({
                "error": "Chart type is required"
            }), 400
        
        chart_type = data['chart_type']
        
        # Generate custom visualization based on type
        if chart_type in ['bar', 'line', 'scatter', 'pie', 'histogram']:
            result = api_service.handle_visualization_request('custom', data)
        else:
            return jsonify({
                "error": f"Unsupported chart type: {chart_type}"
            }), 400
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Custom visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate custom visualization"
        }), 500


@viz_bp.route('/preview/<preview_type>', methods=['GET'])
def preview_visualization(preview_type):
    """
    Preview visualization API endpoint
    Replaces: JavaScript preview chart functionality
    """
    try:
        # Generate preview data based on type
        preview_data = {
            'difficulty': {
                'labels': ['Easy', 'Medium', 'Hard'],
                'data': [45, 35, 20],
                'type': 'doughnut'
            },
            'acceptance': {
                'labels': ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
                'data': [15, 25, 35, 20, 5],
                'type': 'bar'
            },
            'likes': {
                'labels': ['Low', 'Med', 'High'],
                'data': [25, 45, 15],
                'type': 'bar'
            },
            'companies': {
                'labels': ['Amazon', 'Google', 'Microsoft'],
                'data': [156, 142, 128],
                'type': 'bar'
            }
        }
        
        if preview_type not in preview_data:
            return jsonify({
                "error": f"Unknown preview type: {preview_type}"
            }), 400
        
        # Generate preview visualization
        result = api_service.handle_visualization_request('preview', {
            'preview_type': preview_type,
            'data': preview_data[preview_type]
        })
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Preview visualization API error: {e}")
        return jsonify({
            "error": f"Failed to generate {preview_type} preview"
        }), 500


@viz_bp.route('/export/<viz_id>', methods=['GET'])
def export_visualization(viz_id):
    """
    Export visualization API endpoint
    Replaces: JavaScript export functionality
    """
    try:
        export_format = request.args.get('format', 'png')
        
        # Validate export format
        valid_formats = ['png', 'svg', 'pdf', 'html']
        if export_format not in valid_formats:
            return jsonify({
                "error": f"Invalid export format. Must be one of: {', '.join(valid_formats)}"
            }), 400
        
        # This would typically retrieve the visualization from cache or regenerate it
        # For now, return a mock response
        
        return jsonify({
            "success": True,
            "visualization_id": viz_id,
            "format": export_format,
            "download_url": f"/api/visualizations/download/{viz_id}.{export_format}",
            "message": f"Visualization exported as {export_format.upper()}"
        })
        
    except Exception as e:
        current_app.logger.error(f"Export visualization API error: {e}")
        return jsonify({
            "error": "Failed to export visualization"
        }), 500


@viz_bp.route('/cache/clear', methods=['POST'])
def clear_visualization_cache():
    """
    Clear visualization cache API endpoint
    """
    try:
        from services.cache_service import CacheService
        cache_service = CacheService()
        
        # Clear expired cache entries
        cleared_count = cache_service.clear_expired()
        
        return jsonify({
            "success": True,
            "cleared_entries": cleared_count,
            "message": f"Cleared {cleared_count} expired cache entries"
        })
        
    except Exception as e:
        current_app.logger.error(f"Clear cache API error: {e}")
        return jsonify({
            "error": "Failed to clear cache"
        }), 500


@viz_bp.route('/cache/stats', methods=['GET'])
def visualization_cache_stats():
    """
    Get visualization cache statistics
    """
    try:
        from services.cache_service import CacheService
        cache_service = CacheService()
        
        stats = cache_service.get_cache_stats()
        
        return jsonify({
            "success": True,
            "cache_stats": stats
        })
        
    except Exception as e:
        current_app.logger.error(f"Cache stats API error: {e}")
        return jsonify({
            "error": "Failed to get cache statistics"
        }), 500


@viz_bp.route('/elbow-method', methods=['POST'])
def elbow_method_visualization():
    """
    Elbow method visualization API endpoint
    Replaces: JavaScript elbow method placeholders in clustering tutorial
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'wcss_values' not in data or 'k_values' not in data:
            return jsonify({
                "error": "wcss_values and k_values are required"
            }), 400
        
        # Generate elbow method visualization
        result = api_service.visualization_service.generate_elbow_method_plot(
            data['wcss_values'], data['k_values']
        )
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Elbow method visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate elbow method visualization"
        }), 500


@viz_bp.route('/silhouette-analysis', methods=['POST'])
def silhouette_analysis_visualization():
    """
    Silhouette analysis visualization API endpoint
    Replaces: JavaScript silhouette analysis placeholders in clustering tutorial
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'silhouette_scores' not in data or 'k_values' not in data:
            return jsonify({
                "error": "silhouette_scores and k_values are required"
            }), 400
        
        # Generate silhouette analysis visualization
        result = api_service.visualization_service.generate_silhouette_analysis(
            data['silhouette_scores'], 
            data['k_values'],
            data.get('sample_silhouette_values')
        )
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Silhouette analysis visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate silhouette analysis visualization"
        }), 500


@viz_bp.route('/linkage-comparison', methods=['POST'])
def linkage_comparison_visualization():
    """
    Linkage methods comparison visualization API endpoint
    Replaces: JavaScript linkage comparison placeholders in clustering tutorial
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'data' not in data or 'linkage_methods' not in data:
            return jsonify({
                "error": "data and linkage_methods are required"
            }), 400
        
        # Generate linkage comparison visualization
        result = api_service.visualization_service.generate_linkage_comparison(
            data['data'], data['linkage_methods']
        )
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Linkage comparison visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate linkage comparison visualization"
        }), 500


@viz_bp.route('/convergence', methods=['POST'])
def convergence_visualization():
    """
    K-means convergence visualization API endpoint
    Replaces: JavaScript convergence plot placeholders in clustering tutorial
    """
    try:
        data = request.get_json() or {}
        
        # Validate required parameters
        if 'iterations' not in data or 'objective_values' not in data:
            return jsonify({
                "error": "iterations and objective_values are required"
            }), 400
        
        # Generate convergence visualization
        result = api_service.visualization_service.generate_convergence_plot(
            data['iterations'], data['objective_values']
        )
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Convergence visualization API error: {e}")
        return jsonify({
            "error": "Failed to generate convergence visualization"
        }), 500
