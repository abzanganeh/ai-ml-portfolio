#!/usr/bin/env python3
"""
Script to replace visualization placeholders in clustering tutorial with Python-generated charts
This script automates the replacement of text placeholders with actual visualization containers
"""

import os
import re
from pathlib import Path

def replace_visualization_placeholders():
    """Replace all visualization placeholders in clustering tutorial templates"""
    
    # Define the clustering tutorial directory
    clustering_dir = Path("templates/tutorials/clustering")
    
    # Define placeholder patterns and their replacements
    replacements = [
        {
            'pattern': r'<div class="visualization-placeholder">\s*<h4>Visualization: Convergence Behavior</h4>\s*<p>Graph showing objective function value decreasing over iterations until convergence</p>\s*</div>',
            'replacement': '''<div class="visualization-container" id="convergence-viz">
                                <div class="chart-container" id="convergence-chart">
                                    <div class="loading-spinner">
                                        <p>Loading convergence visualization...</p>
                                    </div>
                                </div>
                            </div>''',
            'script': 'convergence'
        },
        {
            'pattern': r'<div class="visualization-placeholder">\s*<h4>Visualization: Elbow Method Example</h4>.*?</div>',
            'replacement': '''<div class="visualization-container" id="elbow-method-viz">
                                <h4>Visualization: Elbow Method Example</h4>
                                <div class="chart-container" id="elbow-chart">
                                    <div class="loading-spinner">
                                        <p>Loading elbow method visualization...</p>
                                    </div>
                                </div>
                            </div>''',
            'script': 'elbow-method'
        },
        {
            'pattern': r'<div class="visualization-placeholder">\s*<h4>Visualization: Silhouette Analysis</h4>.*?</div>',
            'replacement': '''<div class="visualization-container" id="silhouette-analysis-viz">
                                <h4>Visualization: Silhouette Analysis</h4>
                                <div class="chart-container" id="silhouette-chart">
                                    <div class="loading-spinner">
                                        <p>Loading silhouette analysis visualization...</p>
                                    </div>
                                </div>
                            </div>''',
            'script': 'silhouette-analysis'
        },
        {
            'pattern': r'<div class="visualization-placeholder">\s*<h4>Visualization: Linkage Criteria Comparison</h4>.*?</div>',
            'replacement': '''<div class="visualization-container" id="linkage-comparison-viz">
                                <h4>Visualization: Linkage Criteria Comparison</h4>
                                <div class="chart-container" id="linkage-chart">
                                    <div class="loading-spinner">
                                        <p>Loading linkage comparison visualization...</p>
                                    </div>
                                </div>
                            </div>''',
            'script': 'linkage-comparison'
        },
        {
            'pattern': r'<div class="visualization-placeholder">\s*<h4>Visualization: K-Means Variants Comparison</h4>.*?</div>',
            'replacement': '''<div class="visualization-container" id="kmeans-variants-viz">
                                <h4>Visualization: K-Means Variants Comparison</h4>
                                <div class="chart-container" id="kmeans-variants-chart">
                                    <div class="loading-spinner">
                                        <p>Loading K-means variants comparison...</p>
                                    </div>
                                </div>
                            </div>''',
            'script': 'clustering'
        }
    ]
    
    # Process each HTML file in the clustering directory
    for html_file in clustering_dir.glob("*.html"):
        print(f"Processing {html_file}...")
        
        # Read the file content
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        scripts_to_add = set()
        
        # Apply replacements
        for replacement in replacements:
            if re.search(replacement['pattern'], content, re.DOTALL):
                content = re.sub(replacement['pattern'], replacement['replacement'], content, flags=re.DOTALL)
                scripts_to_add.add(replacement['script'])
                print(f"  - Replaced {replacement['script']} placeholder")
        
        # Add visualization scripts if any replacements were made
        if scripts_to_add and content != original_content:
            # Add the visualization loading script before closing body tag
            script_content = generate_visualization_script(scripts_to_add)
            content = add_visualization_script(content, script_content)
            
            # Write the updated content back to the file
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  - Added visualization scripts: {', '.join(scripts_to_add)}")
        else:
            print(f"  - No placeholders found to replace")

def generate_visualization_script(scripts_to_add):
    """Generate the JavaScript code for loading visualizations"""
    
    script_template = '''
    <!-- Visualization Loading Script -->
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script>
    // Visualization loading functions
    document.addEventListener('DOMContentLoaded', async function() {
        const baseUrl = '/api/visualizations';
        
        // Load convergence visualization
        if (document.getElementById('convergence-chart')) {
            try {
                const response = await fetch(`${baseUrl}/convergence`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        iterations: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        objective_values: [1000, 800, 650, 550, 480, 430, 400, 385, 375, 370]
                    })
                });
                const result = await response.json();
                if (result.success && window.Plotly) {
                    const plotData = JSON.parse(result.visualization);
                    Plotly.newPlot('convergence-chart', plotData.data, plotData.layout, {responsive: true});
                }
            } catch (error) {
                console.error('Error loading convergence visualization:', error);
                showError('convergence-chart', 'Failed to load convergence visualization');
            }
        }
        
        // Load elbow method visualization
        if (document.getElementById('elbow-chart')) {
            try {
                const response = await fetch(`${baseUrl}/elbow-method`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        wcss_values: [1000, 800, 600, 450, 350, 300, 280, 270, 265, 263],
                        k_values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    })
                });
                const result = await response.json();
                if (result.success && window.Plotly) {
                    const plotData = JSON.parse(result.visualization);
                    Plotly.newPlot('elbow-chart', plotData.data, plotData.layout, {responsive: true});
                }
            } catch (error) {
                console.error('Error loading elbow method visualization:', error);
                showError('elbow-chart', 'Failed to load elbow method visualization');
            }
        }
        
        // Load silhouette analysis visualization
        if (document.getElementById('silhouette-chart')) {
            try {
                const response = await fetch(`${baseUrl}/silhouette-analysis`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        silhouette_scores: [0.2, 0.4, 0.6, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
                        k_values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    })
                });
                const result = await response.json();
                if (result.success && window.Plotly) {
                    const plotData = JSON.parse(result.visualization);
                    Plotly.newPlot('silhouette-chart', plotData.data, plotData.layout, {responsive: true});
                }
            } catch (error) {
                console.error('Error loading silhouette analysis visualization:', error);
                showError('silhouette-chart', 'Failed to load silhouette analysis visualization');
            }
        }
        
        // Load linkage comparison visualization
        if (document.getElementById('linkage-chart')) {
            try {
                const response = await fetch(`${baseUrl}/linkage-comparison`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: Array(30).fill().map(() => ({x: Math.random(), y: Math.random()})),
                        linkage_methods: ['Single Linkage', 'Complete Linkage', 'Average Linkage', 'Ward\\'s Method', 'Centroid Linkage', 'Median Linkage']
                    })
                });
                const result = await response.json();
                if (result.success && window.Plotly) {
                    const plotData = JSON.parse(result.visualization);
                    Plotly.newPlot('linkage-chart', plotData.data, plotData.layout, {responsive: true});
                }
            } catch (error) {
                console.error('Error loading linkage comparison visualization:', error);
                showError('linkage-chart', 'Failed to load linkage comparison visualization');
            }
        }
        
        // Load K-means variants visualization
        if (document.getElementById('kmeans-variants-chart')) {
            try {
                const response = await fetch(`${baseUrl}/clustering`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: Array(30).fill().map(() => ({x: Math.random(), y: Math.random(), cluster: Math.floor(Math.random() * 3)})),
                        parameters: { centroids: [{x: 0.5, y: 0.5}, {x: 2.5, y: 0.5}, {x: 1.5, y: 2.5}] }
                    })
                });
                const result = await response.json();
                if (result.success && window.Plotly) {
                    const plotData = JSON.parse(result.visualization);
                    Plotly.newPlot('kmeans-variants-chart', plotData.data, plotData.layout, {responsive: true});
                }
            } catch (error) {
                console.error('Error loading K-means variants visualization:', error);
                showError('kmeans-variants-chart', 'Failed to load K-means variants visualization');
            }
        }
    });
    
    function showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="error-message"><p>${message}</p></div>`;
        }
    }
    </script>
    
    <!-- Visualization Styles -->
    <style>
    .visualization-container {
        margin: 2rem 0;
        padding: 1.5rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #fafafa;
    }

    .chart-container {
        min-height: 400px;
        margin: 1rem 0;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
    }

    .loading-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
        color: #666;
    }

    .error-message {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
        color: #d32f2f;
        background-color: #ffebee;
        border: 1px solid #ffcdd2;
        border-radius: 4px;
    }
    </style>'''
    
    return script_template

def add_visualization_script(content, script_content):
    """Add the visualization script before the closing body tag"""
    
    # Find the closing body tag
    body_end_pattern = r'</body>'
    
    if re.search(body_end_pattern, content):
        # Insert script before closing body tag
        content = re.sub(body_end_pattern, f'{script_content}\n</body>', content)
    else:
        # If no body tag found, append at the end
        content += script_content
    
    return content

if __name__ == "__main__":
    print("Starting visualization placeholder replacement...")
    replace_visualization_placeholders()
    print("Visualization placeholder replacement completed!")

