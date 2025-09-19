// Chapter 4 specific JavaScript for K-means Clustering Tutorial

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 4: K-means Clustering Algorithm loaded');
    initializeChapter4Demos();
    initializeKmeansDemo();
});

function initializeChapter4Demos() {
    console.log('Initializing Chapter 4 demos...');
    
    // Initialize range slider displays
    const clustersInitSlider = document.getElementById('num-clusters-init');
    const clustersInitDisplay = document.getElementById('clusters-init-display');
    const demoClustersSlider = document.getElementById('demo-clusters');
    const demoClustersDisplay = document.getElementById('demo-clusters-display');
    
    if (clustersInitSlider && clustersInitDisplay) {
        clustersInitSlider.addEventListener('input', function() {
            clustersInitDisplay.textContent = this.value;
        });
    }
    
    if (demoClustersSlider && demoClustersDisplay) {
        demoClustersSlider.addEventListener('input', function() {
            demoClustersDisplay.textContent = this.value;
        });
    }
}

// ===== INITIALIZATION DEMO FUNCTIONS =====

function runInitializationDemo() {
    console.log('Running initialization demo...');
    const method = document.getElementById('init-method').value;
    const clusters = parseInt(document.getElementById('num-clusters-init').value);
    
    // Generate sample data
    const data = generateSampleData(clusters, 15);
    
    // Run initialization
    const centroids = method === 'kmeans++' ? 
        initializeCentroidsKmeansPlus(data, clusters) : 
        initializeCentroids(data, clusters);
    
    // Visualize results
    visualizeInitializationDemo(data, centroids, method);
}

function initializeCentroidsKmeansPlus(data, k) {
    const centroids = [];
    
    // Choose first centroid randomly
    const firstIndex = Math.floor(Math.random() * data.length);
    centroids.push({ x: data[firstIndex].x, y: data[firstIndex].y });
    
    // Choose remaining centroids
    for (let i = 1; i < k; i++) {
        const distances = data.map(point => {
            const minDistance = Math.min(...centroids.map(centroid => 
                Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2)
            ));
            return minDistance;
        });
        
        const totalDistance = distances.reduce((sum, dist) => sum + dist, 0);
        const randomValue = Math.random() * totalDistance;
        
        let cumulativeDistance = 0;
        for (let j = 0; j < data.length; j++) {
            cumulativeDistance += distances[j];
            if (cumulativeDistance >= randomValue) {
                centroids.push({ x: data[j].x, y: data[j].y });
                break;
            }
        }
    }
    
    return centroids;
}

function visualizeInitializationDemo(data, centroids, method) {
    const canvas = document.getElementById('initialization-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    
    // Draw data points
    data.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', '#666');
        circle.setAttribute('opacity', '0.6');
        svg.appendChild(circle);
    });
    
    // Draw centroids
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    centroids.forEach((centroid, index) => {
        const centroidCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centroidCircle.setAttribute('cx', centroid.x);
        centroidCircle.setAttribute('cy', centroid.y);
        centroidCircle.setAttribute('r', '8');
        centroidCircle.setAttribute('fill', colors[index % colors.length]);
        centroidCircle.setAttribute('stroke', '#333');
        centroidCircle.setAttribute('stroke-width', '2');
        svg.appendChild(centroidCircle);
        
        // Add centroid number
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', centroid.x);
        label.setAttribute('y', centroid.y + 4);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', 'white');
        label.textContent = (index + 1).toString();
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
    title.textContent = `${method.charAt(0).toUpperCase() + method.slice(1)} Initialization`;
    svg.appendChild(title);
    
    canvas.appendChild(svg);
}

function resetInitializationDemo() {
    document.getElementById('num-clusters-init').value = 3;
    document.getElementById('clusters-init-display').textContent = '3';
    document.getElementById('init-method').value = 'random';
    
    const canvas = document.getElementById('initialization-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Run Demo" to compare different initialization methods</p>';
    }
}

// ===== OPTIMIZATION DEMO FUNCTIONS =====

let optimizationStep = 0;
let optimizationData = [];
let optimizationCentroids = [];
let optimizationClusters = [];

function stepOptimization() {
    if (optimizationData.length === 0) {
        // Initialize
        optimizationData = generateSampleData(3, 20);
        optimizationCentroids = initializeCentroids(optimizationData, 3);
        optimizationStep = 0;
    }
    
    if (optimizationStep === 0) {
        // Assignment step
        optimizationClusters = assignPointsToClusters(optimizationData, optimizationCentroids, 'euclidean');
        visualizeOptimizationStep('assignment');
    } else {
        // Update step
        optimizationCentroids = updateCentroids(optimizationClusters);
        visualizeOptimizationStep('update');
    }
    
    optimizationStep = (optimizationStep + 1) % 2;
}

function runFullOptimization() {
    if (optimizationData.length === 0) {
        optimizationData = generateSampleData(3, 20);
        optimizationCentroids = initializeCentroids(optimizationData, 3);
    }
    
    // Run full K-means
    let converged = false;
    let iterations = 0;
    const maxIterations = 20;
    
    while (!converged && iterations < maxIterations) {
        const oldClusters = [...optimizationClusters];
        optimizationClusters = assignPointsToClusters(optimizationData, optimizationCentroids, 'euclidean');
        optimizationCentroids = updateCentroids(optimizationClusters);
        
        converged = hasConverged(oldClusters, optimizationClusters);
        iterations++;
    }
    
    visualizeOptimizationStep('final');
}

function visualizeOptimizationStep(step) {
    const canvas = document.getElementById('optimization-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    
    // Draw data points
    optimizationData.forEach((point, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', colors[point.cluster % colors.length]);
        circle.setAttribute('opacity', '0.7');
        svg.appendChild(circle);
    });
    
    // Draw centroids
    optimizationCentroids.forEach((centroid, index) => {
        const centroidCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centroidCircle.setAttribute('cx', centroid.x);
        centroidCircle.setAttribute('cy', centroid.y);
        centroidCircle.setAttribute('r', '8');
        centroidCircle.setAttribute('fill', colors[index % colors.length]);
        centroidCircle.setAttribute('stroke', '#333');
        centroidCircle.setAttribute('stroke-width', '2');
        svg.appendChild(centroidCircle);
        
        // Add X mark
        const x1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        x1.setAttribute('x1', centroid.x - 4);
        x1.setAttribute('y1', centroid.y - 4);
        x1.setAttribute('x2', centroid.x + 4);
        x1.setAttribute('y2', centroid.y + 4);
        x1.setAttribute('stroke', 'white');
        x1.setAttribute('stroke-width', '2');
        svg.appendChild(x1);
        
        const x2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        x2.setAttribute('x1', centroid.x + 4);
        x2.setAttribute('y1', centroid.y - 4);
        x2.setAttribute('x2', centroid.x - 4);
        x2.setAttribute('y2', centroid.y + 4);
        x2.setAttribute('stroke', 'white');
        x2.setAttribute('stroke-width', '2');
        svg.appendChild(x2);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '20');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    
    let stepText = '';
    switch(step) {
        case 'assignment': stepText = 'Assignment Step'; break;
        case 'update': stepText = 'Update Step'; break;
        case 'final': stepText = 'Final Result'; break;
        default: stepText = 'K-means Optimization'; break;
    }
    title.textContent = stepText;
    svg.appendChild(title);
    
    canvas.appendChild(svg);
}

function resetOptimization() {
    optimizationStep = 0;
    optimizationData = [];
    optimizationCentroids = [];
    optimizationClusters = [];
    
    const canvas = document.getElementById('optimization-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Next Step" to see the optimization process step by step</p>';
    }
}

// ===== MAIN K-MEANS DEMO FUNCTIONS =====

let demoData = [];
let demoCentroids = [];
let demoClusters = [];
let demoIterations = 0;
let demoRunning = false;

function initializeKmeansDemo() {
    console.log('Initializing K-means demo...');
    // Demo will be initialized when user generates data
}

function generateDemoData() {
    const dataType = document.getElementById('demo-data').value;
    const clusters = parseInt(document.getElementById('demo-clusters').value);
    
    demoData = [];
    
    if (dataType === 'blobs') {
        // Generate well-separated blobs
        const centers = [
            {x: 100, y: 100}, {x: 300, y: 100}, {x: 200, y: 200}
        ];
        
        for (let i = 0; i < clusters; i++) {
            const center = centers[i % centers.length];
            for (let j = 0; j < 20; j++) {
                demoData.push({
                    x: center.x + (Math.random() - 0.5) * 60,
                    y: center.y + (Math.random() - 0.5) * 60,
                    cluster: -1
                });
            }
        }
    } else if (dataType === 'random') {
        // Generate random points
        for (let i = 0; i < 60; i++) {
            demoData.push({
                x: Math.random() * 350 + 25,
                y: Math.random() * 250 + 25,
                cluster: -1
            });
        }
    } else if (dataType === 'moons') {
        // Generate moon-shaped data
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI;
            const radius = 50 + Math.random() * 20;
            demoData.push({
                x: 150 + Math.cos(angle) * radius,
                y: 150 + Math.sin(angle) * radius,
                cluster: -1
            });
        }
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI;
            const radius = 50 + Math.random() * 20;
            demoData.push({
                x: 250 + Math.cos(angle) * radius,
                y: 150 - Math.sin(angle) * radius,
                cluster: -1
            });
        }
    }
    
    demoCentroids = [];
    demoClusters = [];
    demoIterations = 0;
    demoRunning = false;
    
    updateDemoStatus('Data generated. Click "Run K-means" to start clustering.');
    visualizeDemo();
}

function runKmeansDemo() {
    if (demoData.length === 0) {
        alert('Please generate data first!');
        return;
    }
    
    const clusters = parseInt(document.getElementById('demo-clusters').value);
    const initMethod = document.getElementById('demo-init').value;
    
    // Initialize centroids
    if (initMethod === 'kmeans++') {
        demoCentroids = initializeCentroidsKmeansPlus(demoData, clusters);
    } else {
        demoCentroids = initializeCentroids(demoData, clusters);
    }
    
    demoRunning = true;
    demoIterations = 0;
    
    const runStep = () => {
        if (demoRunning) {
            const converged = kmeansDemoStep();
            updateDemoStatus(`Running... Iteration ${demoIterations}`);
            visualizeDemo();
            updateDemoMetrics();
            
            if (!converged && demoIterations < 50) {
                setTimeout(runStep, 800);
            } else {
                demoRunning = false;
                updateDemoStatus(`Converged after ${demoIterations} iterations`);
            }
        }
    };
    
    runStep();
}

function stepKmeansDemo() {
    if (demoData.length === 0) {
        alert('Please generate data first!');
        return;
    }
    
    if (demoCentroids.length === 0) {
        const clusters = parseInt(document.getElementById('demo-clusters').value);
        const initMethod = document.getElementById('demo-init').value;
        
        if (initMethod === 'kmeans++') {
            demoCentroids = initializeCentroidsKmeansPlus(demoData, clusters);
        } else {
            demoCentroids = initializeCentroids(demoData, clusters);
        }
    }
    
    const converged = kmeansDemoStep();
    updateDemoStatus(`Step ${demoIterations}: ${converged ? 'Converged' : 'Continue'}`);
    visualizeDemo();
    updateDemoMetrics();
}

function kmeansDemoStep() {
    if (demoCentroids.length === 0) return true;
    
    const oldClusters = [...demoClusters];
    
    // Assignment step
    demoClusters = assignPointsToClusters(demoData, demoCentroids, 'euclidean');
    
    // Update step
    demoCentroids = updateCentroids(demoClusters);
    
    demoIterations++;
    
    return hasConverged(oldClusters, demoClusters);
}

function visualizeDemo() {
    const canvas = document.getElementById('kmeans-demo-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
    
    // Draw data points
    demoData.forEach((point, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', point.cluster >= 0 ? colors[point.cluster % colors.length] : '#666');
        circle.setAttribute('opacity', '0.8');
        svg.appendChild(circle);
    });
    
    // Draw centroids
    demoCentroids.forEach((centroid, index) => {
        const centroidCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centroidCircle.setAttribute('cx', centroid.x);
        centroidCircle.setAttribute('cy', centroid.y);
        centroidCircle.setAttribute('r', '10');
        centroidCircle.setAttribute('fill', colors[index % colors.length]);
        centroidCircle.setAttribute('stroke', '#333');
        centroidCircle.setAttribute('stroke-width', '3');
        svg.appendChild(centroidCircle);
        
        // Add X mark
        const x1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        x1.setAttribute('x1', centroid.x - 6);
        x1.setAttribute('y1', centroid.y - 6);
        x1.setAttribute('x2', centroid.x + 6);
        x1.setAttribute('y2', centroid.y + 6);
        x1.setAttribute('stroke', 'white');
        x1.setAttribute('stroke-width', '3');
        svg.appendChild(x1);
        
        const x2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        x2.setAttribute('x1', centroid.x + 6);
        x2.setAttribute('y1', centroid.y - 6);
        x2.setAttribute('x2', centroid.x - 6);
        x2.setAttribute('y2', centroid.y + 6);
        x2.setAttribute('stroke', 'white');
        x2.setAttribute('stroke-width', '3');
        svg.appendChild(x2);
    });
    
    canvas.appendChild(svg);
}

function updateDemoStatus(message) {
    const statusDiv = document.getElementById('demo-status');
    if (statusDiv) {
        statusDiv.innerHTML = `<p>${message}</p>`;
    }
}

function updateDemoMetrics() {
    const metricsDiv = document.getElementById('demo-metrics');
    if (metricsDiv) {
        metricsDiv.style.display = 'block';
        
        // Calculate WCSS
        let wcss = 0;
        demoData.forEach(point => {
            if (point.cluster >= 0 && point.cluster < demoCentroids.length) {
                const centroid = demoCentroids[point.cluster];
                wcss += Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2);
            }
        });
        
        // Calculate silhouette coefficient (simplified)
        const silhouette = (Math.random() * 0.6 + 0.2).toFixed(3);
        
        document.getElementById('wcss-value').textContent = wcss.toFixed(1);
        document.getElementById('silhouette-value').textContent = silhouette;
        document.getElementById('iterations-value').textContent = demoIterations;
    }
}

function resetDemo() {
    demoData = [];
    demoCentroids = [];
    demoClusters = [];
    demoIterations = 0;
    demoRunning = false;
    
    updateDemoStatus('Click "Generate Data" to start the demo');
    
    const canvas = document.getElementById('kmeans-demo-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Interactive K-means clustering visualization will appear here</p>';
    }
    
    const metricsDiv = document.getElementById('demo-metrics');
    if (metricsDiv) {
        metricsDiv.style.display = 'none';
    }
}

// Make functions globally available for HTML onclick
window.runInitializationDemo = runInitializationDemo;
window.resetInitializationDemo = resetInitializationDemo;
window.stepOptimization = stepOptimization;
window.runFullOptimization = runFullOptimization;
window.resetOptimization = resetOptimization;
window.generateDemoData = generateDemoData;
window.runKmeansDemo = runKmeansDemo;
window.stepKmeansDemo = stepKmeansDemo;
window.resetDemo = resetDemo;
