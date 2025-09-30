"""
Visualization Service - Generates charts and visualizations to replace JavaScript
This service will replace JavaScript canvas/Chart.js functionality with Python
"""

import json
import base64
import io
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder
from typing import Dict, List, Any, Optional
from flask import current_app


class VisualizationService:
    """Service for generating visualizations to replace JavaScript charts"""
    
    def __init__(self):
        # Set matplotlib backend to avoid GUI issues
        plt.switch_backend('Agg')
    
    def generate_clustering_plot(self, data: List[Dict], parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Generate clustering visualization to replace JavaScript K-means demo"""
        try:
            # Extract data points
            points = [(point['x'], point['y']) for point in data]
            clusters = [point.get('cluster', 0) for point in data]
            
            # Create plotly scatter plot
            fig = go.Figure()
            
            # Get unique clusters and colors
            unique_clusters = list(set(clusters))
            colors = px.colors.qualitative.Set1[:len(unique_clusters)]
            
            for i, cluster_id in enumerate(unique_clusters):
                cluster_points = [points[j] for j, c in enumerate(clusters) if c == cluster_id]
                if cluster_points:
                    x_coords = [p[0] for p in cluster_points]
                    y_coords = [p[1] for p in cluster_points]
                    
                    fig.add_trace(go.Scatter(
                        x=x_coords,
                        y=y_coords,
                        mode='markers',
                        marker=dict(
                            color=colors[i % len(colors)],
                            size=8,
                            line=dict(width=1, color='black')
                        ),
                        name=f'Cluster {cluster_id}',
                        showlegend=True
                    ))
            
            # Add centroids if provided
            if 'centroids' in parameters:
                centroids = parameters['centroids']
                centroid_x = [c['x'] for c in centroids]
                centroid_y = [c['y'] for c in centroids]
                
                fig.add_trace(go.Scatter(
                    x=centroid_x,
                    y=centroid_y,
                    mode='markers',
                    marker=dict(
                        color='red',
                        size=15,
                        symbol='x',
                        line=dict(width=3, color='black')
                    ),
                    name='Centroids',
                    showlegend=True
                ))
            
            # Update layout
            fig.update_layout(
                title='K-Means Clustering Visualization',
                xaxis_title='X Coordinate',
                yaxis_title='Y Coordinate',
                showlegend=True,
                width=600,
                height=400,
                margin=dict(l=50, r=50, t=50, b=50)
            )
            
            # Convert to JSON
            graph_json = json.dumps(fig, cls=PlotlyJSONEncoder)
            
            return {
                "success": True,
                "visualization": graph_json,
                "type": "clustering",
                "parameters": parameters
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating clustering plot: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_matrix_visualization(self, matrix: List[List[float]], vector: List[float]) -> Dict[str, Any]:
        """Generate matrix-vector multiplication visualization"""
        try:
            # Create a heatmap for the matrix
            fig = go.Figure(data=go.Heatmap(
                z=matrix,
                colorscale='Viridis',
                showscale=True
            ))
            
            fig.update_layout(
                title='Matrix Visualization',
                xaxis_title='Columns',
                yaxis_title='Rows',
                width=400,
                height=300
            )
            
            # Create vector visualization
            vector_fig = go.Figure(data=go.Bar(
                x=[f'v{i}' for i in range(len(vector))],
                y=vector,
                marker_color='lightblue'
            ))
            
            vector_fig.update_layout(
                title='Vector Visualization',
                xaxis_title='Vector Elements',
                yaxis_title='Values',
                width=400,
                height=300
            )
            
            # Combine both visualizations
            combined_fig = go.Figure()
            
            # Add matrix heatmap
            combined_fig.add_trace(go.Heatmap(
                z=matrix,
                colorscale='Viridis',
                showscale=True,
                name='Matrix'
            ))
            
            # Add vector as bars
            combined_fig.add_trace(go.Bar(
                x=[f'v{i}' for i in range(len(vector))],
                y=vector,
                marker_color='lightblue',
                name='Vector',
                yaxis='y2'
            ))
            
            # Update layout for combined plot
            combined_fig.update_layout(
                title='Matrix-Vector Multiplication',
                xaxis_title='Matrix Columns / Vector Elements',
                yaxis=dict(title='Matrix Rows', side='left'),
                yaxis2=dict(title='Vector Values', side='right', overlaying='y'),
                width=600,
                height=400
            )
            
            graph_json = json.dumps(combined_fig, cls=PlotlyJSONEncoder)
            
            return {
                "success": True,
                "visualization": graph_json,
                "type": "matrix_vector",
                "matrix": matrix,
                "vector": vector
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating matrix visualization: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_decision_tree_plot(self, tree_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate decision tree visualization"""
        try:
            # Create a simple decision tree visualization
            # This is a simplified version - can be enhanced with actual tree structure
            
            fig = go.Figure()
            
            # Add nodes (simplified tree structure)
            nodes = tree_data.get('nodes', [])
            edges = tree_data.get('edges', [])
            
            # Create node positions (simplified layout)
            node_positions = {}
            for i, node in enumerate(nodes):
                level = node.get('level', 0)
                position_in_level = node.get('position', 0)
                node_positions[node['id']] = {
                    'x': position_in_level * 2,
                    'y': -level * 2
                }
            
            # Add edges
            for edge in edges:
                start_pos = node_positions.get(edge['from'])
                end_pos = node_positions.get(edge['to'])
                
                if start_pos and end_pos:
                    fig.add_trace(go.Scatter(
                        x=[start_pos['x'], end_pos['x']],
                        y=[start_pos['y'], end_pos['y']],
                        mode='lines',
                        line=dict(color='black', width=2),
                        showlegend=False
                    ))
            
            # Add nodes
            for node in nodes:
                pos = node_positions.get(node['id'])
                if pos:
                    fig.add_trace(go.Scatter(
                        x=[pos['x']],
                        y=[pos['y']],
                        mode='markers+text',
                        marker=dict(
                            size=30,
                            color='lightblue',
                            line=dict(width=2, color='black')
                        ),
                        text=[node.get('label', node['id'])],
                        textposition='middle center',
                        showlegend=False
                    ))
            
            fig.update_layout(
                title='Decision Tree Visualization',
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                width=600,
                height=400,
                margin=dict(l=50, r=50, t=50, b=50)
            )
            
            graph_json = json.dumps(fig, cls=PlotlyJSONEncoder)
            
            return {
                "success": True,
                "visualization": graph_json,
                "type": "decision_tree",
                "tree_data": tree_data
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating decision tree plot: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_dendrogram(self, data: List[Dict], method: str = 'average') -> Dict[str, Any]:
        """Generate dendrogram visualization for hierarchical clustering"""
        try:
            # This would integrate with scipy.cluster.hierarchy
            # For now, create a simplified dendrogram
            
            fig = go.Figure()
            
            # Create a simple dendrogram structure
            # In a real implementation, this would use scipy.cluster.hierarchy.dendrogram
            
            # Mock dendrogram data
            dendrogram_data = self._create_mock_dendrogram(data)
            
            # Add dendrogram lines
            for line in dendrogram_data['lines']:
                fig.add_trace(go.Scatter(
                    x=line['x'],
                    y=line['y'],
                    mode='lines',
                    line=dict(color='black', width=2),
                    showlegend=False
                ))
            
            # Add leaf labels
            for leaf in dendrogram_data['leaves']:
                fig.add_trace(go.Scatter(
                    x=[leaf['x']],
                    y=[leaf['y']],
                    mode='markers+text',
                    marker=dict(size=8, color='blue'),
                    text=[leaf['label']],
                    textposition='bottom center',
                    showlegend=False
                ))
            
            fig.update_layout(
                title=f'Hierarchical Clustering Dendrogram ({method})',
                xaxis_title='Data Points',
                yaxis_title='Distance',
                width=600,
                height=400
            )
            
            graph_json = json.dumps(fig, cls=PlotlyJSONEncoder)
            
            return {
                "success": True,
                "visualization": graph_json,
                "type": "dendrogram",
                "method": method
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating dendrogram: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_eda_charts(self, chart_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate EDA charts to replace JavaScript Chart.js visualizations"""
        try:
            if chart_type == 'missing_data':
                return self._generate_missing_data_chart(data)
            elif chart_type == 'correlation_heatmap':
                return self._generate_correlation_heatmap(data)
            elif chart_type == 'distribution':
                return self._generate_distribution_chart(data)
            elif chart_type == 'outlier_boxplot':
                return self._generate_outlier_boxplot(data)
            else:
                return {"success": False, "error": f"Unknown chart type: {chart_type}"}
                
        except Exception as e:
            current_app.logger.error(f"Error generating EDA chart: {e}")
            return {"success": False, "error": str(e)}
    
    def _create_mock_dendrogram(self, data: List[Dict]) -> Dict[str, Any]:
        """Create mock dendrogram data for demonstration"""
        # This is a simplified mock - real implementation would use scipy
        lines = []
        leaves = []
        
        # Create simple dendrogram structure
        for i, point in enumerate(data[:10]):  # Limit to 10 points for demo
            leaves.append({
                'x': i * 2,
                'y': 0,
                'label': f'P{i+1}'
            })
        
        # Add some connecting lines
        for i in range(0, len(leaves)-1, 2):
            if i+1 < len(leaves):
                lines.append({
                    'x': [leaves[i]['x'], leaves[i+1]['x']],
                    'y': [leaves[i]['y'], leaves[i+1]['y']]
                })
        
        return {'lines': lines, 'leaves': leaves}
    
    def _generate_missing_data_chart(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate missing data bar chart"""
        fig = go.Figure(data=go.Bar(
            x=data.get('labels', []),
            y=data.get('values', []),
            marker_color='lightcoral'
        ))
        
        fig.update_layout(
            title='Missing Data Analysis',
            xaxis_title='Columns',
            yaxis_title='Percentage Missing',
            width=600,
            height=400
        )
        
        return {
            "success": True,
            "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
            "type": "missing_data"
        }
    
    def _generate_correlation_heatmap(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate correlation heatmap"""
        correlation_matrix = data.get('correlation_matrix', [])
        labels = data.get('labels', [])
        
        fig = go.Figure(data=go.Heatmap(
            z=correlation_matrix,
            x=labels,
            y=labels,
            colorscale='RdBu',
            zmid=0
        ))
        
        fig.update_layout(
            title='Correlation Matrix',
            width=600,
            height=500
        )
        
        return {
            "success": True,
            "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
            "type": "correlation_heatmap"
        }
    
    def _generate_distribution_chart(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate distribution histogram"""
        fig = go.Figure(data=go.Histogram(
            x=data.get('values', []),
            nbinsx=data.get('bins', 20),
            marker_color='lightblue'
        ))
        
        fig.update_layout(
            title='Distribution Analysis',
            xaxis_title='Values',
            yaxis_title='Frequency',
            width=600,
            height=400
        )
        
        return {
            "success": True,
            "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
            "type": "distribution"
        }
    
    def _generate_outlier_boxplot(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate outlier box plot"""
        fig = go.Figure()
        
        for i, (label, values) in enumerate(data.get('datasets', {}).items()):
            fig.add_trace(go.Box(
                y=values,
                name=label,
                boxpoints='outliers'
            ))
        
        fig.update_layout(
            title='Outlier Detection - Box Plot',
            yaxis_title='Values',
            width=600,
            height=400
        )
        
        return {
            "success": True,
            "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
            "type": "outlier_boxplot"
        }
    
    def generate_elbow_method_plot(self, wcss_values: List[float], k_values: List[int]) -> Dict[str, Any]:
        """Generate elbow method plot for optimal k selection"""
        try:
            fig = go.Figure()
            
            # Main elbow plot
            fig.add_trace(go.Scatter(
                x=k_values,
                y=wcss_values,
                mode='lines+markers',
                name='WCSS',
                line=dict(color='blue', width=3),
                marker=dict(size=8, color='blue')
            ))
            
            # Find elbow point (simplified - can be enhanced)
            if len(wcss_values) >= 3:
                # Calculate second derivative to find elbow
                second_deriv = []
                for i in range(1, len(wcss_values) - 1):
                    second_deriv.append(wcss_values[i-1] - 2*wcss_values[i] + wcss_values[i+1])
                
                if second_deriv:
                    elbow_idx = second_deriv.index(max(second_deriv)) + 1
                    optimal_k = k_values[elbow_idx]
                    
                    # Highlight elbow point
                    fig.add_trace(go.Scatter(
                        x=[optimal_k],
                        y=[wcss_values[elbow_idx]],
                        mode='markers',
                        name=f'Optimal k={optimal_k}',
                        marker=dict(size=15, color='red', symbol='x'),
                        showlegend=True
                    ))
            
            fig.update_layout(
                title='Elbow Method for Optimal k Selection',
                xaxis_title='Number of Clusters (k)',
                yaxis_title='Within-Cluster Sum of Squares (WCSS)',
                width=600,
                height=400,
                showlegend=True
            )
            
            return {
                "success": True,
                "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
                "type": "elbow_method",
                "optimal_k": optimal_k if 'optimal_k' in locals() else None
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating elbow method plot: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_silhouette_analysis(self, silhouette_scores: List[float], k_values: List[int], 
                                   sample_silhouette_values: Dict[int, List[float]] = None) -> Dict[str, Any]:
        """Generate silhouette analysis visualization"""
        try:
            from plotly.subplots import make_subplots
            
            # Create subplots
            fig = make_subplots(
                rows=1, cols=2,
                subplot_titles=('Silhouette Scores vs k', 'Silhouette Plot (k=3)'),
                specs=[[{"secondary_y": False}, {"secondary_y": False}]]
            )
            
            # Silhouette scores plot
            fig.add_trace(go.Scatter(
                x=k_values,
                y=silhouette_scores,
                mode='lines+markers',
                name='Average Silhouette Score',
                line=dict(color='blue', width=3),
                marker=dict(size=8, color='blue')
            ), row=1, col=1)
            
            # Find optimal k
            optimal_k_idx = silhouette_scores.index(max(silhouette_scores))
            optimal_k = k_values[optimal_k_idx]
            
            # Highlight optimal k
            fig.add_trace(go.Scatter(
                x=[optimal_k],
                y=[silhouette_scores[optimal_k_idx]],
                mode='markers',
                name=f'Optimal k={optimal_k}',
                marker=dict(size=15, color='red', symbol='x'),
                showlegend=True
            ), row=1, col=1)
            
            # Silhouette plot for k=3 (example)
            if sample_silhouette_values and 3 in sample_silhouette_values:
                y_lower = 10
                silhouette_vals = sample_silhouette_values[3]
                
                for i in range(3):  # Assuming 3 clusters
                    cluster_silhouette_vals = silhouette_vals[i*10:(i+1)*10]  # Sample data
                    cluster_silhouette_vals.sort()
                    
                    size_cluster_i = len(cluster_silhouette_vals)
                    y_upper = y_lower + size_cluster_i
                    
                    color = ['red', 'green', 'blue'][i]
                    fig.add_trace(go.Bar(
                        x=cluster_silhouette_vals,
                        y=list(range(y_lower, y_upper)),
                        orientation='h',
                        name=f'Cluster {i}',
                        marker_color=color,
                        showlegend=False
                    ), row=1, col=2)
                    
                    y_lower = y_upper + 10
            
            fig.update_layout(
                title='Silhouette Analysis',
                width=800,
                height=400,
                showlegend=True
            )
            
            fig.update_xaxes(title_text="k", row=1, col=1)
            fig.update_yaxes(title_text="Silhouette Score", row=1, col=1)
            fig.update_xaxes(title_text="Silhouette Coefficient", row=1, col=2)
            fig.update_yaxes(title_text="Cluster", row=1, col=2)
            
            return {
                "success": True,
                "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
                "type": "silhouette_analysis",
                "optimal_k": optimal_k
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating silhouette analysis: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_linkage_comparison(self, data: List[Dict], linkage_methods: List[str]) -> Dict[str, Any]:
        """Generate linkage methods comparison visualization"""
        try:
            from plotly.subplots import make_subplots
            
            # Create subplots for different linkage methods
            fig = make_subplots(
                rows=2, cols=3,
                subplot_titles=linkage_methods,
                specs=[[{"type": "scatter"}, {"type": "scatter"}, {"type": "scatter"}],
                       [{"type": "scatter"}, {"type": "scatter"}, {"type": "scatter"}]]
            )
            
            colors = ['red', 'green', 'blue', 'orange', 'purple', 'brown']
            
            for i, method in enumerate(linkage_methods):
                row = (i // 3) + 1
                col = (i % 3) + 1
                
                # Generate mock cluster data for each method
                # In real implementation, this would use actual clustering results
                cluster_data = self._generate_mock_cluster_data(method, len(data))
                
                for cluster_id, points in cluster_data.items():
                    fig.add_trace(go.Scatter(
                        x=[p[0] for p in points],
                        y=[p[1] for p in points],
                        mode='markers',
                        name=f'Cluster {cluster_id}',
                        marker=dict(color=colors[cluster_id % len(colors)], size=6),
                        showlegend=False
                    ), row=row, col=col)
            
            fig.update_layout(
                title='Linkage Methods Comparison',
                width=900,
                height=600,
                showlegend=False
            )
            
            return {
                "success": True,
                "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
                "type": "linkage_comparison",
                "methods": linkage_methods
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating linkage comparison: {e}")
            return {"success": False, "error": str(e)}
    
    def generate_convergence_plot(self, iterations: List[int], objective_values: List[float]) -> Dict[str, Any]:
        """Generate K-means convergence plot"""
        try:
            fig = go.Figure()
            
            fig.add_trace(go.Scatter(
                x=iterations,
                y=objective_values,
                mode='lines+markers',
                name='Objective Function',
                line=dict(color='blue', width=3),
                marker=dict(size=6, color='blue')
            ))
            
            # Add convergence line
            if len(objective_values) > 1:
                final_value = objective_values[-1]
                fig.add_hline(
                    y=final_value,
                    line_dash="dash",
                    line_color="red",
                    annotation_text=f"Converged at {final_value:.2f}",
                    annotation_position="bottom right"
                )
            
            fig.update_layout(
                title='K-means Convergence Behavior',
                xaxis_title='Iteration',
                yaxis_title='Objective Function Value',
                width=600,
                height=400,
                showlegend=True
            )
            
            return {
                "success": True,
                "visualization": json.dumps(fig, cls=PlotlyJSONEncoder),
                "type": "convergence_plot",
                "converged_at": len(iterations)
            }
            
        except Exception as e:
            current_app.logger.error(f"Error generating convergence plot: {e}")
            return {"success": False, "error": str(e)}
    
    def _generate_mock_cluster_data(self, method: str, num_points: int) -> Dict[int, List[tuple]]:
        """Generate mock cluster data for different linkage methods"""
        import random
        
        # Different methods produce different cluster shapes
        if method == "Single Linkage":
            # Elongated clusters
            return {
                0: [(random.uniform(0, 2), random.uniform(0, 1)) for _ in range(num_points//3)],
                1: [(random.uniform(3, 5), random.uniform(0, 1)) for _ in range(num_points//3)],
                2: [(random.uniform(1, 4), random.uniform(2, 3)) for _ in range(num_points//3)]
            }
        elif method == "Complete Linkage":
            # Compact spherical clusters
            return {
                0: [(random.uniform(0, 1), random.uniform(0, 1)) for _ in range(num_points//3)],
                1: [(random.uniform(3, 4), random.uniform(0, 1)) for _ in range(num_points//3)],
                2: [(random.uniform(1.5, 2.5), random.uniform(2, 3)) for _ in range(num_points//3)]
            }
        else:
            # Balanced clusters
            return {
                0: [(random.uniform(0, 1.5), random.uniform(0, 1.5)) for _ in range(num_points//3)],
                1: [(random.uniform(2.5, 4), random.uniform(0, 1.5)) for _ in range(num_points//3)],
                2: [(random.uniform(1, 3), random.uniform(2, 3.5)) for _ in range(num_points//3)]
            }
