// Chapter 3 specific JavaScript for Clustering Tutorial

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 3: Minkowski Distance and Generalized Formulas loaded');
    initializeChapter3Demos();
    initializeMinkowskiCalculator();
});

function initializeChapter3Demos() {
    console.log('Initializing Chapter 3 demos...');
    // Initialize any chapter-specific demos
}

// ===== MINKOWSKI DISTANCE CALCULATOR FUNCTIONS =====

function initializeMinkowskiCalculator() {
    console.log('Initializing Minkowski distance calculator...');
    
    // Get input elements
    const inputs = ['p-value', 'point1-x', 'point1-y', 'point2-x', 'point2-y'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateMinkowskiDistance);
        }
    });
    
    // Initial calculation
    calculateMinkowskiDistance();
}

function calculateMinkowskiDistance() {
    // Get parameters
    const p = parseFloat(document.getElementById('p-value').value) || 2;
    const x1 = parseFloat(document.getElementById('point1-x').value) || 0;
    const y1 = parseFloat(document.getElementById('point1-y').value) || 0;
    const x2 = parseFloat(document.getElementById('point2-x').value) || 0;
    const y2 = parseFloat(document.getElementById('point2-y').value) || 0;
    
    // Calculate Minkowski distance
    let minkowski;
    if (p === Infinity || p > 100) {
        // Chebyshev distance (p = ∞)
        minkowski = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    } else {
        // Regular Minkowski distance
        const sum = Math.pow(Math.abs(x2 - x1), p) + Math.pow(Math.abs(y2 - y1), p);
        minkowski = Math.pow(sum, 1/p);
    }
    
    // Calculate comparison distances
    const manhattan = Math.abs(x2 - x1) + Math.abs(y2 - y1);
    const euclidean = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const chebyshev = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    
    // Update display
    document.getElementById('current-p').textContent = p.toFixed(1);
    document.getElementById('minkowski-value').textContent = minkowski.toFixed(2);
    document.getElementById('manhattan-value').textContent = manhattan.toFixed(2);
    document.getElementById('euclidean-value').textContent = euclidean.toFixed(2);
    document.getElementById('chebyshev-value').textContent = chebyshev.toFixed(2);
    document.getElementById('p-value-display').textContent = p.toFixed(1);
    
    // Update visualization
    drawMinkowskiVisualization(x1, y1, x2, y2, p, minkowski);
}

function drawMinkowskiVisualization(x1, y1, x2, y2, p, minkowski) {
    const canvas = document.getElementById('minkowski-canvas');
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
    
    // Draw Minkowski unit circle around point 1
    const unitCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    unitCircle.setAttribute('cx', svgX1);
    unitCircle.setAttribute('cy', svgY1);
    unitCircle.setAttribute('r', 30); // Fixed radius for visualization
    unitCircle.setAttribute('fill', 'none');
    unitCircle.setAttribute('stroke', '#3498db');
    unitCircle.setAttribute('stroke-width', '2');
    unitCircle.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(unitCircle);
    
    // Draw connection line
    const connectionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    connectionLine.setAttribute('x1', svgX1);
    connectionLine.setAttribute('y1', svgY1);
    connectionLine.setAttribute('x2', svgX2);
    connectionLine.setAttribute('y2', svgY2);
    connectionLine.setAttribute('stroke', '#e74c3c');
    connectionLine.setAttribute('stroke-width', '3');
    svg.appendChild(connectionLine);
    
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
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '20');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = `Minkowski Distance (p=${p.toFixed(1)})`;
    svg.appendChild(title);
    
    canvas.appendChild(svg);
}

// ===== MINKOWSKI CLUSTERING DEMO FUNCTIONS =====

function generateMinkowskiSampleData(numClusters) {
    const data = [];
    const pointsPerCluster = 20;
    
    // Define cluster centers
    const centers = [
        { x: 80, y: 80 },
        { x: 200, y: 100 },
        { x: 320, y: 200 },
        { x: 150, y: 250 },
        { x: 280, y: 150 },
        { x: 100, y: 200 }
    ];
    
    for (let clusterId = 0; clusterId < numClusters; clusterId++) {
        const center = centers[clusterId];
        
        for (let i = 0; i < pointsPerCluster; i++) {
            // Add some randomness around the center
            const x = center.x + (Math.random() - 0.5) * 60;
            const y = center.y + (Math.random() - 0.5) * 60;
            
            data.push({ x, y, cluster: clusterId });
        }
    }
    
    return data;
}

function runMinkowskiClustering() {
    console.log('Running Minkowski clustering demo...');
    const pSelect = document.getElementById('clustering-p');
    const pValue = pSelect.value === 'infinity' ? Infinity : parseFloat(pSelect.value);
    const numClusters = parseInt(document.getElementById('cluster-count').value);
    
    // Generate sample data with proper structure
    const data = generateMinkowskiSampleData(numClusters);
    
    // Run clustering with selected p-value
    const results = performMinkowskiClustering(data, numClusters, pValue);
    
    // Visualize results
    visualizeMinkowskiClustering(results, pValue);
}


function performMinkowskiClustering(data, k, p) {
    // Initialize centroids randomly from data points
    const centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        centroids.push({ x: data[randomIndex].x, y: data[randomIndex].y });
    }
    
    let assignments = new Array(data.length).fill(-1);
    let prevAssignments = new Array(data.length).fill(-1);
    
    // Iterate until convergence
    for (let iter = 0; iter < 15; iter++) {
        // Assign points to closest centroid
        for (let i = 0; i < data.length; i++) {
            let minDistance = Infinity;
            let closestCentroid = 0;
            
            for (let j = 0; j < centroids.length; j++) {
                const distance = calculateMinkowskiDistanceBetweenPoints(data[i], centroids[j], p);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCentroid = j;
                }
            }
            assignments[i] = closestCentroid;
        }
        
        // Check for convergence
        if (JSON.stringify(assignments) === JSON.stringify(prevAssignments)) {
            break;
        }
        
        // Update centroids
        for (let j = 0; j < centroids.length; j++) {
            const clusterPoints = data.filter((_, i) => assignments[i] === j);
            if (clusterPoints.length > 0) {
                centroids[j].x = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
                centroids[j].y = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
            }
        }
        
        prevAssignments = [...assignments];
    }
    
    // Group points by cluster
    const clusters = [];
    for (let j = 0; j < k; j++) {
        clusters[j] = data.filter((_, i) => assignments[i] === j);
    }
    
    return { data, clusters, centroids, assignments };
}


function calculateMinkowskiDistanceBetweenPoints(point1, point2, p) {
    if (p === Infinity) {
        // Chebyshev distance
        return Math.max(Math.abs(point1.x - point2.x), Math.abs(point1.y - point2.y));
    } else {
        // Minkowski distance
        const sum = Math.pow(Math.abs(point1.x - point2.x), p) + Math.pow(Math.abs(point1.y - point2.y), p);
        return Math.pow(sum, 1/p);
    }
}



function visualizeMinkowskiClustering(results, p) {
    const canvas = document.getElementById('clustering-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    
    // Draw data points with correct cluster assignments
    results.data.forEach((point, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', colors[results.assignments[index] % colors.length]);
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
        
        // Add centroid label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', centroid.x + 12);
        label.setAttribute('y', centroid.y - 12);
        label.setAttribute('font-size', '12');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', '#333');
        label.textContent = `C${index + 1}`;
        svg.appendChild(label);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '20');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    const pLabel = p === Infinity ? '∞' : p.toString();
    title.textContent = `Minkowski Clustering (p=${pLabel})`;
    svg.appendChild(title);
    
    canvas.appendChild(svg);
}

function resetClustering() {
    document.getElementById('cluster-count').value = 3;
    document.getElementById('cluster-count-display').textContent = '3';
    document.getElementById('clustering-p').value = '2';
    
    const canvas = document.getElementById('clustering-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Run Clustering" to see how different p-values affect clustering results</p>';
    }
}

// Make functions globally available for HTML onclick
window.calculateMinkowskiDistance = calculateMinkowskiDistance;
window.runMinkowskiClustering = runMinkowskiClustering;
window.resetClustering = resetClustering;
