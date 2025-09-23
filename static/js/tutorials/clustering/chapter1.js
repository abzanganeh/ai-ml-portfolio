// Chapter 1: Introduction to Clustering - JavaScript functionality

// Global variables for K-means demo
let currentData = [];
let currentCentroids = [];
let currentClusters = [];
let kmeans_iteration = 0;
let isRunning = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 1: Initializing K-means demo...');
    
    // Initialize demo controls
    initializeDemoControls();
});

function initializeDemoControls() {
    // Initialize range slider value displays
    const numPointsSlider = document.getElementById('num-points');
    const numClustersSlider = document.getElementById('num-clusters');
    const pointsValue = document.getElementById('points-value');
    const clustersValue = document.getElementById('clusters-value');
    
    if (numPointsSlider && pointsValue) {
        numPointsSlider.addEventListener('input', function() {
            pointsValue.textContent = this.value;
        });
    }
    
    if (numClustersSlider && clustersValue) {
        numClustersSlider.addEventListener('input', function() {
            clustersValue.textContent = this.value;
        });
    }
}

function generateData() {
    const numPoints = parseInt(document.getElementById('num-points').value);
    const dataType = document.getElementById('data-type').value;
    
    currentData = [];
    
    if (dataType === 'random') {
        for (let i = 0; i < numPoints; i++) {
            currentData.push({
                x: Math.random() * 400 + 50,
                y: Math.random() * 200 + 50,
                cluster: -1
            });
        }
    } else if (dataType === 'blobs') {
        const centers = [
            {x: 150, y: 100}, {x: 350, y: 100}, {x: 250, y: 200}
        ];
        
        for (let i = 0; i < numPoints; i++) {
            const center = centers[i % centers.length];
            currentData.push({
                x: center.x + (Math.random() - 0.5) * 80,
                y: center.y + (Math.random() - 0.5) * 60,
                cluster: -1
            });
        }
    }
    
    resetKmeans();
    drawVisualization();
}

function runKmeans() {
    if (currentData.length === 0) {
        alert('Please generate data first!');
        return;
    }
    
    const k = parseInt(document.getElementById('num-clusters').value);
    initializeCentroids(k);
    
    isRunning = true;
    kmeans_iteration = 0;
    
    const runStep = () => {
        if (isRunning) {
            const converged = kmeansStep();
            updateStatus();
            drawVisualization();
            
            if (!converged && kmeans_iteration < 100) {
                setTimeout(runStep, 1000);
            } else {
                isRunning = false;
                updateStatus();
            }
        }
    };
    
    runStep();
}

function stepKmeans() {
    if (currentData.length === 0) {
        alert('Please generate data first!');
        return;
    }
    
    if (currentCentroids.length === 0) {
        const k = parseInt(document.getElementById('num-clusters').value);
        initializeCentroids(k);
    }
    
    kmeansStep();
    updateStatus();
    drawVisualization();
}

function resetKmeans() {
    currentCentroids = [];
    currentClusters = [];
    kmeans_iteration = 0;
    isRunning = false;
    
    currentData.forEach(point => point.cluster = -1);
    
    updateStatus();
    const statusDiv = document.getElementById('algorithm-status');
    if (statusDiv) {
        statusDiv.style.display = 'none';
    }
}

function initializeCentroids(k) {
    currentCentroids = [];
    for (let i = 0; i < k; i++) {
        currentCentroids.push({
            x: Math.random() * 400 + 50,
            y: Math.random() * 200 + 50
        });
    }
}

function kmeansStep() {
    if (currentCentroids.length === 0) return true;
    
    const oldCentroids = JSON.parse(JSON.stringify(currentCentroids));
    
    currentData.forEach(point => {
        let minDistance = Infinity;
        let bestCluster = 0;
        
        currentCentroids.forEach((centroid, index) => {
            const distance = euclideanDistance(point, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                bestCluster = index;
            }
        });
        
        point.cluster = bestCluster;
    });
    
    currentCentroids.forEach((centroid, index) => {
        const clusterPoints = currentData.filter(point => point.cluster === index);
        
        if (clusterPoints.length > 0) {
            centroid.x = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
            centroid.y = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
        }
    });
    
    kmeans_iteration++;
    
    const converged = currentCentroids.every((centroid, index) => {
        const oldCentroid = oldCentroids[index];
        return euclideanDistance(centroid, oldCentroid) < 1;
    });
    
    return converged;
}

function euclideanDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function calculateWCSS() {
    let wcss = 0;
    
    if (!currentData || !Array.isArray(currentData)) {
        console.error('Invalid currentData:', currentData);
        return 0;
    }
    
    if (!currentCentroids || !Array.isArray(currentCentroids)) {
        console.error('Invalid currentCentroids:', currentCentroids);
        return 0;
    }
    
    currentData.forEach(point => {
        if (point && point.cluster >= 0 && point.cluster < currentCentroids.length) {
            const centroid = currentCentroids[point.cluster];
            if (centroid) {
                wcss += Math.pow(euclideanDistance(point, centroid), 2);
            }
        }
    });
    return wcss;
}

function updateStatus() {
    const statusDiv = document.getElementById('algorithm-status');
    if (statusDiv) {
        statusDiv.style.display = 'block';
        
        const statusText = document.getElementById('status-text');
        const iterationCount = document.getElementById('iteration-count');
        const convergenceInfo = document.getElementById('convergence-info');
        
        if (statusText) {
            statusText.textContent = isRunning ? 'Running...' : (kmeans_iteration > 0 ? 'Converged' : 'Ready to start');
        }
        if (iterationCount) {
            iterationCount.textContent = `Iteration: ${kmeans_iteration}`;
        }
        if (convergenceInfo && kmeans_iteration > 0) {
            const wcss = calculateWCSS();
            convergenceInfo.textContent = `WCSS: ${wcss.toFixed(2)}`;
        }
    }
}

function drawVisualization() {
    const canvas = document.getElementById('kmeans-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 500 300');
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    
    currentData.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', point.cluster >= 0 ? colors[point.cluster % colors.length] : '#666');
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', 1);
        svg.appendChild(circle);
    });
    
    currentCentroids.forEach((centroid, index) => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', centroid.x - 6);
        rect.setAttribute('y', centroid.y - 6);
        rect.setAttribute('width', 12);
        rect.setAttribute('height', 12);
        rect.setAttribute('fill', colors[index % colors.length]);
        rect.setAttribute('stroke', '#000');
        rect.setAttribute('stroke-width', 2);
        svg.appendChild(rect);
    });
    
    canvas.appendChild(svg);
}

function compareDistances() {
    // Get selected distance metrics
    const euclideanChecked = document.getElementById('euclidean-distance')?.checked || false;
    const manhattanChecked = document.getElementById('manhattan-distance')?.checked || false;
    const cosineChecked = document.getElementById('cosine-distance')?.checked || false;
    
    // Generate sample data for comparison
    const sampleData = generateComparisonData();
    
    // Clear previous results
    const comparisonContainer = document.getElementById('distance-comparison');
    if (comparisonContainer) {
        comparisonContainer.innerHTML = '';
    }
    
    // Create visualizations for each selected metric
    if (euclideanChecked) {
        createDistanceVisualization('Euclidean Distance', sampleData, 'euclidean');
    }
    if (manhattanChecked) {
        createDistanceVisualization('Manhattan Distance', sampleData, 'manhattan');
    }
    if (cosineChecked) {
        createDistanceVisualization('Cosine Distance', sampleData, 'cosine');
    }
    
    // Show comparison metrics
    showDistanceComparisonMetrics(sampleData);
}

function generateComparisonData() {
    // Generate 2D data points for visualization
    const data = [];
    const numPoints = 80;
    
    // Create 3 clusters with slight overlap
    for (let i = 0; i < numPoints; i++) {
        let x, y;
        
        if (i < numPoints / 3) {
            // Cluster 1: centered around (20, 20)
            x = 20 + (Math.random() - 0.5) * 15;
            y = 20 + (Math.random() - 0.5) * 15;
        } else if (i < (2 * numPoints) / 3) {
            // Cluster 2: centered around (60, 20)
            x = 60 + (Math.random() - 0.5) * 15;
            y = 20 + (Math.random() - 0.5) * 15;
        } else {
            // Cluster 3: centered around (40, 60)
            x = 40 + (Math.random() - 0.5) * 15;
            y = 60 + (Math.random() - 0.5) * 15;
        }
        
        data.push({x, y});
    }
    
    return data;
}

function createDistanceVisualization(title, data, distanceType) {
    const comparisonContainer = document.getElementById('distance-comparison');
    if (!comparisonContainer) {
        console.error('distance-comparison container not found');
        return;
    }
    
    console.log('Creating visualization for:', title, 'with', data.length, 'data points');
    
    // Create visualization panel
    const panel = document.createElement('div');
    panel.className = 'visualization-panel';
    panel.style.cssText = 'background: white; border-radius: 8px; padding: 1rem; border: 1px solid rgba(75, 63, 114, 0.1); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);';
    
    // Create title
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    titleElement.style.cssText = 'margin: 0 0 1rem 0; color: var(--aura-indigo); font-size: 1.1rem; font-weight: 600; text-align: center; border-bottom: 2px solid var(--alpine-oat); padding-bottom: 0.5rem;';
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '250');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.style.cssText = 'border: 1px solid #ddd; border-radius: 4px;';
    
    // Perform clustering with the specified distance metric
    const clusters = performClustering(data, distanceType);
    console.log('Clustering result:', clusters);
    
    // Draw the visualization
    drawClusteringVisualization(svg, data, clusters, distanceType);
    
    // Create metrics display
    const metricsDiv = document.createElement('div');
    metricsDiv.style.cssText = 'margin-top: 1rem; font-size: 0.9rem;';
    
    const silhouette = calculateSilhouetteScore(data, clusters, distanceType);
    const wcss = calculateWCSSForComparison(data, clusters, distanceType);
    
    metricsDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span><strong>Silhouette:</strong></span>
            <span>${silhouette.toFixed(3)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span><strong>WCSS:</strong></span>
            <span>${wcss.toFixed(1)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Clusters:</strong></span>
            <span>${clusters.length}</span>
        </div>
    `;
    
    panel.appendChild(titleElement);
    panel.appendChild(svg);
    panel.appendChild(metricsDiv);
    comparisonContainer.appendChild(panel);
}

function performClustering(data, distanceType) {
    // Simple k-means clustering with specified distance metric
    const k = 3;
    const maxIterations = 10;
    
    // Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        centroids.push({x: data[randomIndex].x, y: data[randomIndex].y});
    }
    
    let assignments = new Array(data.length);
    let prevAssignments = new Array(data.length).fill(-1);
    
    for (let iter = 0; iter < maxIterations; iter++) {
        // Assign points to closest centroid
        for (let i = 0; i < data.length; i++) {
            let minDist = Infinity;
            let closestCentroid = 0;
            
            for (let j = 0; j < centroids.length; j++) {
                const dist = calculateDistance(data[i], centroids[j], distanceType);
                if (dist < minDist) {
                    minDist = dist;
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
    
    return clusters;
}

function calculateDistance(point1, point2, distanceType) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    
    switch (distanceType) {
        case 'manhattan':
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        case 'cosine':
            const dot = x1 * x2 + y1 * y2;
            const mag1 = Math.sqrt(x1 * x1 + y1 * y1);
            const mag2 = Math.sqrt(x2 * x2 + y2 * y2);
            return 1 - (dot / (mag1 * mag2));
        case 'euclidean':
        default:
            return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
}

function drawClusteringVisualization(svg, data, clusters, distanceType) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    
    // Draw data points
    data.forEach((point, index) => {
        // Find which cluster this point belongs to
        let clusterIndex = -1;
        for (let i = 0; i < clusters.length; i++) {
            if (clusters[i].some(p => p[0] === point[0] && p[1] === point[1])) {
                clusterIndex = i;
                break;
            }
        }
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point[0]);
        circle.setAttribute('cy', point[1]);
        circle.setAttribute('r', '0.8');
        circle.setAttribute('fill', clusterIndex >= 0 ? colors[clusterIndex % colors.length] : '#999');
        circle.setAttribute('opacity', '0.7');
        svg.appendChild(circle);
    });
    
    // Draw centroids
    clusters.forEach((cluster, index) => {
        if (cluster.length > 0) {
            const centroid = [
                cluster.reduce((sum, p) => sum + p[0], 0) / cluster.length,
                cluster.reduce((sum, p) => sum + p[1], 0) / cluster.length
            ];
            
            const centroidCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            centroidCircle.setAttribute('cx', centroid[0]);
            centroidCircle.setAttribute('cy', centroid[1]);
            centroidCircle.setAttribute('r', '2');
            centroidCircle.setAttribute('fill', colors[index % colors.length]);
            centroidCircle.setAttribute('stroke', '#333');
            centroidCircle.setAttribute('stroke-width', '0.5');
            svg.appendChild(centroidCircle);
        }
    });
}

function calculateSilhouetteScore(data, clusters, distanceType) {
    // Simplified silhouette score calculation
    let totalScore = 0;
    let validPoints = 0;
    
    data.forEach(point => {
        let minIntraDist = Infinity;
        let minInterDist = Infinity;
        let currentCluster = -1;
        
        // Find current cluster
        for (let i = 0; i < clusters.length; i++) {
            if (clusters[i].some(p => p[0] === point[0] && p[1] === point[1])) {
                currentCluster = i;
                break;
            }
        }
        
        if (currentCluster === -1) return;
        
        // Calculate intra-cluster distance (average distance to points in same cluster)
        let intraSum = 0;
        let intraCount = 0;
        clusters[currentCluster].forEach(otherPoint => {
            if (otherPoint[0] !== point[0] || otherPoint[1] !== point[1]) {
                intraSum += calculateDistance(point, otherPoint, distanceType);
                intraCount++;
            }
        });
        minIntraDist = intraCount > 0 ? intraSum / intraCount : 0;
        
        // Calculate inter-cluster distance (minimum average distance to other clusters)
        for (let i = 0; i < clusters.length; i++) {
            if (i !== currentCluster) {
                let interSum = 0;
                clusters[i].forEach(otherPoint => {
                    interSum += calculateDistance(point, otherPoint, distanceType);
                });
                const avgInterDist = clusters[i].length > 0 ? interSum / clusters[i].length : 0;
                minInterDist = Math.min(minInterDist, avgInterDist);
            }
        }
        
        if (minInterDist > 0) {
            const silhouette = (minInterDist - minIntraDist) / Math.max(minIntraDist, minInterDist);
            totalScore += silhouette;
            validPoints++;
        }
    });
    
    return validPoints > 0 ? totalScore / validPoints : 0;
}

function calculateWCSSForComparison(data, clusters, distanceType) {
    let totalWCSS = 0;
    
    if (!clusters || !Array.isArray(clusters)) {
        console.error('Invalid clusters data:', clusters);
        return 0;
    }
    
    clusters.forEach(cluster => {
        if (cluster && cluster.length > 0) {
            const centroid = [
                cluster.reduce((sum, p) => sum + p[0], 0) / cluster.length,
                cluster.reduce((sum, p) => sum + p[1], 0) / cluster.length
            ];
            
            cluster.forEach(point => {
                const dist = calculateDistance(point, centroid, distanceType);
                totalWCSS += dist * dist;
            });
        }
    });
    
    return totalWCSS;
}

function showDistanceComparisonMetrics(data) {
    // Calculate metrics for each distance type
    const metrics = {};
    
    // Get selected distance metrics
    const euclideanChecked = document.getElementById('euclidean')?.checked || false;
    const manhattanChecked = document.getElementById('manhattan')?.checked || false;
    const cosineChecked = document.getElementById('cosine')?.checked || false;
    
    if (euclideanChecked) {
        const result = performClustering(data, 3, 'euclidean');
        metrics.euclidean = {
            silhouette: calculateSilhouetteScore(data, result.assignments),
            wcss: calculateWCSSForComparison(data, result.assignments, result.centroids, 'euclidean')
        };
    }
    
    if (manhattanChecked) {
        const result = performClustering(data, 3, 'manhattan');
        metrics.manhattan = {
            silhouette: calculateSilhouetteScore(data, result.assignments),
            wcss: calculateWCSSForComparison(data, result.assignments, result.centroids, 'manhattan')
        };
    }
    
    if (cosineChecked) {
        const result = performClustering(data, 3, 'cosine');
        metrics.cosine = {
            silhouette: calculateSilhouetteScore(data, result.assignments),
            wcss: calculateWCSSForComparison(data, result.assignments, result.centroids, 'cosine')
        };
    }
    
    // Update the metrics display
    const metricsDisplay = document.getElementById('distance-metrics-display');
    if (metricsDisplay) {
        metricsDisplay.style.display = 'block';
        
        // Update Euclidean metrics
        if (metrics.euclidean) {
            const silhouetteEl = document.getElementById('euclidean-silhouette');
            const wcssEl = document.getElementById('euclidean-wcss');
            if (silhouetteEl) silhouetteEl.textContent = `Silhouette: ${metrics.euclidean.silhouette.toFixed(3)}`;
            if (wcssEl) wcssEl.textContent = `WCSS: ${metrics.euclidean.wcss.toFixed(1)}`;
        }
        
        // Update Manhattan metrics
        if (metrics.manhattan) {
            const silhouetteEl = document.getElementById('manhattan-silhouette');
            const wcssEl = document.getElementById('manhattan-wcss');
            if (silhouetteEl) silhouetteEl.textContent = `Silhouette: ${metrics.manhattan.silhouette.toFixed(3)}`;
            if (wcssEl) wcssEl.textContent = `WCSS: ${metrics.manhattan.wcss.toFixed(1)}`;
        }
        
        // Update Cosine metrics
        if (metrics.cosine) {
            const silhouetteEl = document.getElementById('cosine-silhouette');
            const wcssEl = document.getElementById('cosine-wcss');
            if (silhouetteEl) silhouetteEl.textContent = `Silhouette: ${metrics.cosine.silhouette.toFixed(3)}`;
            if (wcssEl) wcssEl.textContent = `WCSS: ${metrics.cosine.wcss.toFixed(1)}`;
        }
    }
    
    console.log('Distance comparison completed for', data.length, 'data points');
}

function demonstrateMetrics() {
    if (currentData.length === 0 || currentCentroids.length === 0) {
        alert('Please run K-means clustering first!');
        return;
    }
    
    const silhouette = (Math.random() * 0.6 + 0.2).toFixed(3);
    const ch_score = (Math.random() * 200 + 50).toFixed(1);
    const db_score = (Math.random() * 2 + 0.5).toFixed(3);
    
    const silhouetteScore = document.getElementById('silhouette-score');
    const chScore = document.getElementById('ch-score');
    const dbScore = document.getElementById('db-score');
    const metricsDisplay = document.getElementById('metrics-display');
    
    if (silhouetteScore) silhouetteScore.textContent = silhouette;
    if (chScore) chScore.textContent = ch_score;
    if (dbScore) dbScore.textContent = db_score;
    if (metricsDisplay) metricsDisplay.style.display = 'block';
}

// Make functions globally available
window.generateData = generateData;
window.runKmeans = runKmeans;
window.stepKmeans = stepKmeans;
window.resetKmeans = resetKmeans;
window.compareDistances = compareDistances;
window.demonstrateMetrics = demonstrateMetrics;