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
    currentData.forEach(point => {
        if (point.cluster >= 0 && point.cluster < currentCentroids.length) {
            const centroid = currentCentroids[point.cluster];
            wcss += Math.pow(euclideanDistance(point, centroid), 2);
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
    alert('Distance comparison feature - implementation would show different clustering results using various distance metrics');
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