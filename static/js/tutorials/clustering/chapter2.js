// Chapter 2 specific JavaScript for Clustering Tutorial

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 2: Distance Metrics Fundamentals loaded');
    initializeChapter2Demos();
    initializeDistanceCalculator();
});

function initializeChapter2Demos() {
    console.log('Initializing Chapter 2 demos...');
    // Initialize any chapter-specific demos
}

// ===== DISTANCE CALCULATOR FUNCTIONS =====

function initializeDistanceCalculator() {
    console.log('Initializing distance calculator...');
    
    // Get input elements
    const inputs = ['point1-x', 'point1-y', 'point2-x', 'point2-y'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateDistances);
        }
    });
    
    // Initial calculation
    calculateDistances();
}

function calculateDistances() {
    // Get point coordinates
    const x1 = parseFloat(document.getElementById('point1-x').value) || 0;
    const y1 = parseFloat(document.getElementById('point1-y').value) || 0;
    const x2 = parseFloat(document.getElementById('point2-x').value) || 0;
    const y2 = parseFloat(document.getElementById('point2-y').value) || 0;
    
    // Calculate Euclidean distance
    const euclidean = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Calculate Manhattan distance
    const manhattan = Math.abs(x2 - x1) + Math.abs(y2 - y1);
    
    // Calculate ratio
    const ratio = manhattan / euclidean;
    
    // Update display
    document.getElementById('euclidean-value').textContent = euclidean.toFixed(2);
    document.getElementById('manhattan-value').textContent = manhattan.toFixed(2);
    document.getElementById('ratio-value').textContent = ratio.toFixed(2);
    
    // Update visualization
    drawDistanceVisualization(x1, y1, x2, y2, euclidean, manhattan);
}

function drawDistanceVisualization(x1, y1, x2, y2, euclidean, manhattan) {
    const canvas = document.getElementById('calculator-canvas');
    if (!canvas) return;
    
    // Clear previous content
    canvas.innerHTML = '';
    
    // Create SVG for visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    
    // Scale factor for visualization
    const scale = 30;
    const offsetX = 50;
    const offsetY = 150;
    
    // Convert coordinates to SVG coordinates
    const svgX1 = x1 * scale + offsetX;
    const svgY1 = -y1 * scale + offsetY; // Flip Y axis
    const svgX2 = x2 * scale + offsetX;
    const svgY2 = -y2 * scale + offsetY;
    
    // Draw grid
    for (let i = 0; i <= 10; i++) {
        // Vertical lines
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', offsetX + i * scale);
        line1.setAttribute('y1', offsetY - 5 * scale);
        line1.setAttribute('x2', offsetX + i * scale);
        line1.setAttribute('y2', offsetY + 5 * scale);
        line1.setAttribute('stroke', '#ddd');
        line1.setAttribute('stroke-width', '1');
        svg.appendChild(line1);
        
        // Horizontal lines
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', offsetX - 5 * scale);
        line2.setAttribute('y1', offsetY - i * scale);
        line2.setAttribute('x2', offsetX + 5 * scale);
        line2.setAttribute('y2', offsetY - i * scale);
        line2.setAttribute('stroke', '#ddd');
        line2.setAttribute('stroke-width', '1');
        svg.appendChild(line2);
    }
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', offsetX - 5 * scale);
    xAxis.setAttribute('y1', offsetY);
    xAxis.setAttribute('x2', offsetX + 5 * scale);
    xAxis.setAttribute('y2', offsetY);
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', offsetX);
    yAxis.setAttribute('y1', offsetY - 5 * scale);
    yAxis.setAttribute('x2', offsetX);
    yAxis.setAttribute('y2', offsetY + 5 * scale);
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    
    // Draw Manhattan path (L-shaped)
    const manhattanPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const manhattanD = `M ${svgX1} ${svgY1} L ${svgX2} ${svgY1} L ${svgX2} ${svgY2}`;
    manhattanPath.setAttribute('d', manhattanD);
    manhattanPath.setAttribute('stroke', '#e74c3c');
    manhattanPath.setAttribute('stroke-width', '3');
    manhattanPath.setAttribute('fill', 'none');
    manhattanPath.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(manhattanPath);
    
    // Draw Euclidean path (straight line)
    const euclideanPath = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    euclideanPath.setAttribute('x1', svgX1);
    euclideanPath.setAttribute('y1', svgY1);
    euclideanPath.setAttribute('x2', svgX2);
    euclideanPath.setAttribute('y2', svgY2);
    euclideanPath.setAttribute('stroke', '#3498db');
    euclideanPath.setAttribute('stroke-width', '3');
    svg.appendChild(euclideanPath);
    
    // Draw points
    const point1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point1.setAttribute('cx', svgX1);
    point1.setAttribute('cy', svgY1);
    point1.setAttribute('r', '6');
    point1.setAttribute('fill', '#2ecc71');
    point1.setAttribute('stroke', '#27ae60');
    point1.setAttribute('stroke-width', '2');
    svg.appendChild(point1);
    
    const point2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point2.setAttribute('cx', svgX2);
    point2.setAttribute('cy', svgY2);
    point2.setAttribute('r', '6');
    point2.setAttribute('fill', '#e74c3c');
    point2.setAttribute('stroke', '#c0392b');
    point2.setAttribute('stroke-width', '2');
    svg.appendChild(point2);
    
    // Add labels
    const label1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label1.setAttribute('x', svgX1 + 10);
    label1.setAttribute('y', svgY1 - 10);
    label1.setAttribute('font-size', '12');
    label1.setAttribute('fill', '#2ecc71');
    label1.textContent = `(${x1}, ${y1})`;
    svg.appendChild(label1);
    
    const label2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label2.setAttribute('x', svgX2 + 10);
    label2.setAttribute('y', svgY2 - 10);
    label2.setAttribute('font-size', '12');
    label2.setAttribute('fill', '#e74c3c');
    label2.textContent = `(${x2}, ${y2})`;
    svg.appendChild(label2);
    
    // Add legend
    const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legend.setAttribute('transform', 'translate(10, 20)');
    
    const legendEuclidean = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    legendEuclidean.setAttribute('x1', '0');
    legendEuclidean.setAttribute('y1', '0');
    legendEuclidean.setAttribute('x2', '20');
    legendEuclidean.setAttribute('y2', '0');
    legendEuclidean.setAttribute('stroke', '#3498db');
    legendEuclidean.setAttribute('stroke-width', '3');
    legend.appendChild(legendEuclidean);
    
    const legendEuclideanText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    legendEuclideanText.setAttribute('x', '25');
    legendEuclideanText.setAttribute('y', '5');
    legendEuclideanText.setAttribute('font-size', '12');
    legendEuclideanText.setAttribute('fill', '#333');
    legendEuclideanText.textContent = `Euclidean: ${euclidean.toFixed(2)}`;
    legend.appendChild(legendEuclideanText);
    
    const legendManhattan = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    legendManhattan.setAttribute('x1', '0');
    legendManhattan.setAttribute('y1', '15');
    legendManhattan.setAttribute('x2', '20');
    legendManhattan.setAttribute('y2', '15');
    legendManhattan.setAttribute('stroke', '#e74c3c');
    legendManhattan.setAttribute('stroke-width', '3');
    legendManhattan.setAttribute('stroke-dasharray', '5,5');
    legend.appendChild(legendManhattan);
    
    const legendManhattanText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    legendManhattanText.setAttribute('x', '25');
    legendManhattanText.setAttribute('y', '20');
    legendManhattanText.setAttribute('font-size', '12');
    legendManhattanText.setAttribute('fill', '#333');
    legendManhattanText.textContent = `Manhattan: ${manhattan.toFixed(2)}`;
    legend.appendChild(legendManhattanText);
    
    svg.appendChild(legend);
    canvas.appendChild(svg);
}

// ===== OPTIMIZATION DEMO FUNCTIONS =====

function runOptimization() {
    console.log('Running optimization demo...');
    const metric = document.getElementById('distance-metric').value;
    const clusters = parseInt(document.getElementById('cluster-count').value);
    
    // Generate sample data
    const data = generateSampleData(clusters);
    
    // Run clustering with selected metric
    const results = performClustering(data, clusters, metric);
    
    // Visualize results
    visualizeClusteringResults(results, metric);
}

function generateSampleData(clusterCount) {
    const data = [];
    const pointsPerCluster = 20;
    
    for (let i = 0; i < clusterCount; i++) {
        const centerX = Math.random() * 300 + 50;
        const centerY = Math.random() * 200 + 50;
        
        for (let j = 0; j < pointsPerCluster; j++) {
            data.push({
                x: centerX + (Math.random() - 0.5) * 40,
                y: centerY + (Math.random() - 0.5) * 40,
                cluster: i
            });
        }
    }
    
    return data;
}

function performClustering(data, k, metric) {
    // Simple K-means implementation
    const centroids = initializeCentroids(data, k);
    let clusters = assignPointsToClusters(data, centroids, metric);
    
    // Iterate until convergence
    for (let iter = 0; iter < 10; iter++) {
        const newCentroids = updateCentroids(clusters);
        const newClusters = assignPointsToClusters(data, newCentroids, metric);
        
        if (hasConverged(clusters, newClusters)) {
            break;
        }
        clusters = newClusters;
    }
    
    return { data, clusters, centroids };
}

function initializeCentroids(data, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        centroids.push({
            x: data[randomIndex].x,
            y: data[randomIndex].y
        });
    }
    return centroids;
}

function assignPointsToClusters(data, centroids, metric) {
    return data.map(point => {
        let minDistance = Infinity;
        let assignedCluster = 0;
        
        centroids.forEach((centroid, index) => {
            let distance;
            if (metric === 'euclidean') {
                distance = Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2));
            } else { // manhattan
                distance = Math.abs(point.x - centroid.x) + Math.abs(point.y - centroid.y);
            }
            
            if (distance < minDistance) {
                minDistance = distance;
                assignedCluster = index;
            }
        });
        
        return { ...point, cluster: assignedCluster };
    });
}

function updateCentroids(clusters) {
    const clusterGroups = {};
    clusters.forEach(point => {
        if (!clusterGroups[point.cluster]) {
            clusterGroups[point.cluster] = [];
        }
        clusterGroups[point.cluster].push(point);
    });
    
    return Object.keys(clusterGroups).map(clusterId => {
        const points = clusterGroups[clusterId];
        const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return { x: avgX, y: avgY };
    });
}

function hasConverged(oldClusters, newClusters) {
    return oldClusters.every((point, index) => 
        point.cluster === newClusters[index].cluster
    );
}

function visualizeClusteringResults(results, metric) {
    const canvas = document.getElementById('optimization-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
    
    // Draw data points
    results.data.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', colors[point.cluster % colors.length]);
        circle.setAttribute('opacity', '0.7');
        svg.appendChild(circle);
    });
    
    // Draw centroids
    results.centroids.forEach((centroid, index) => {
        const centroidCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centroidCircle.setAttribute('cx', centroid.x);
        centroidCircle.setAttribute('cy', centroid.y);
        centroidCircle.setAttribute('r', '8');
        centroidCircle.setAttribute('fill', colors[index % colors.length]);
        centroidCircle.setAttribute('stroke', '#333');
        centroidCircle.setAttribute('stroke-width', '2');
        svg.appendChild(centroidCircle);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '20');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = `Clustering with ${metric.charAt(0).toUpperCase() + metric.slice(1)} Distance`;
    svg.appendChild(title);
    
    canvas.appendChild(svg);
}

function resetOptimization() {
    document.getElementById('cluster-count').value = 3;
    document.getElementById('cluster-count-display').textContent = '3';
    document.getElementById('distance-metric').value = 'euclidean';
    
    const canvas = document.getElementById('optimization-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Run Optimization" to see how different distance metrics affect clustering results</p>';
    }
}

// Make functions globally available for HTML onclick
window.calculateDistances = calculateDistances;
window.runOptimization = runOptimization;
window.resetOptimization = resetOptimization;
