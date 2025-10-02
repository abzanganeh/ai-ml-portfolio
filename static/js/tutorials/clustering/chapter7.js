// Chapter 7: Optimal K Selection
// Interactive Demo JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeChapter7Demos();
});

// Initialize all Chapter 7 demos
function initializeChapter7Demos() {
    // Initialize range sliders
    initializeChapter7Sliders();
    
    // Initialize demo controls
    initializeDemoControls();
}

// Initialize range sliders using shared function
function initializeChapter7Sliders() {
    initializeRangeSliders([
        { sliderId: 'elbow-max-k', displayId: 'elbow-max-k-display' },
        { sliderId: 'silhouette-k', displayId: 'silhouette-k-display' },
        { sliderId: 'demo-clusters', displayId: 'demo-clusters-display' }
    ]);
}

// Initialize demo controls
function initializeDemoControls() {
    // Auto-generate initial demos
    setTimeout(() => {
        generateElbowDemo();
        generateSilhouetteDemo();
        generateDemoData();
    }, 500);
}

// ===== ELBOW METHOD DEMO =====

function generateElbowDemo() {
    const dataset = document.getElementById('elbow-dataset')?.value || 'blobs';
    const maxK = parseInt(document.getElementById('elbow-max-k')?.value || 10);
    
    // Generate WCSS data
    const wcssData = generateWCSSData(dataset, maxK);
    
    // Draw elbow plot
    drawElbowPlot(wcssData);
    
    // Draw clustering result
    drawElbowClusters(dataset, findOptimalK(wcssData));
}

function resetElbowDemo() {
    resetDemo(['elbow-plot', 'elbow-clusters']);
    
    // Add custom placeholder text
    const elbowPlot = document.getElementById('elbow-plot');
    const elbowClusters = document.getElementById('elbow-clusters');
    
    if (elbowPlot) {
        elbowPlot.innerHTML = '<text x="200" y="150" text-anchor="middle" fill="#666">Click "Generate Elbow Plot" to start</text>';
    }
    
    if (elbowClusters) {
        elbowClusters.innerHTML = '<text x="200" y="150" text-anchor="middle" fill="#666">Clustering result will appear here</text>';
    }
}

function generateWCSSData(datasetType, maxK) {
    const wcssData = [];
    
    // Simulate realistic WCSS values that decrease with k
    let baseWCSS = 1000;
    
    for (let k = 1; k <= maxK; k++) {
        // WCSS decreases with k, with diminishing returns
        const reduction = Math.pow(k, -0.8) * 200;
        const noise = (Math.random() - 0.5) * 20;
        const wcss = Math.max(baseWCSS - reduction + noise, 50);
        
        wcssData.push({ k: k, wcss: wcss });
        baseWCSS = wcss;
    }
    
    return wcssData;
}

function drawElbowPlot(wcssData) {
    const svg = document.getElementById('elbow-plot');
    if (!svg) return;
    
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    
    // Clear previous content
    svg.innerHTML = '';
    
    // Set up scales
    const xScale = (width - margin.left - margin.right) / (wcssData.length - 1);
    const maxWCSS = Math.max(...wcssData.map(d => d.wcss));
    const minWCSS = Math.min(...wcssData.map(d => d.wcss));
    const yScale = (height - margin.top - margin.bottom) / (maxWCSS - minWCSS);
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', height - margin.bottom);
    xAxis.setAttribute('x2', width - margin.right);
    xAxis.setAttribute('y2', height - margin.bottom);
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', height - margin.bottom);
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    
    // Draw WCSS line
    const pathData = wcssData.map((d, i) => {
        const x = margin.left + i * xScale;
        const y = height - margin.bottom - (d.wcss - minWCSS) * yScale;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#1976d2');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    
    // Draw points
    wcssData.forEach((d, i) => {
        const x = margin.left + i * xScale;
        const y = height - margin.bottom - (d.wcss - minWCSS) * yScale;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#1976d2');
        svg.appendChild(circle);
        
        // Add labels
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 10);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', '#333');
        text.textContent = d.k;
        svg.appendChild(text);
    });
    
    // Highlight optimal k
    const optimalK = findOptimalK(wcssData);
    const optimalIndex = optimalK - 1;
    const optimalX = margin.left + optimalIndex * xScale;
    const optimalY = height - margin.bottom - (wcssData[optimalIndex].wcss - minWCSS) * yScale;
    
    const optimalCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    optimalCircle.setAttribute('cx', optimalX);
    optimalCircle.setAttribute('cy', optimalY);
    optimalCircle.setAttribute('r', '6');
    optimalCircle.setAttribute('fill', '#ff6b6b');
    optimalCircle.setAttribute('stroke', '#fff');
    optimalCircle.setAttribute('stroke-width', '2');
    svg.appendChild(optimalCircle);
    
    // Add labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', width / 2);
    xLabel.setAttribute('y', height - 5);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '14');
    xLabel.setAttribute('fill', '#333');
    xLabel.textContent = 'Number of Clusters (k)';
    svg.appendChild(xLabel);
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', 15);
    yLabel.setAttribute('y', height / 2);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('font-size', '14');
    yLabel.setAttribute('fill', '#333');
    yLabel.setAttribute('transform', `rotate(-90, 15, ${height / 2})`);
    yLabel.textContent = 'WCSS';
    svg.appendChild(yLabel);
}

function drawElbowClusters(datasetType, k) {
    const svg = document.getElementById('elbow-clusters');
    if (!svg) return;
    
    const width = 400;
    const height = 300;
    const margin = 20;
    
    // Clear previous content
    svg.innerHTML = '';
    
    // Generate cluster data
    const clusters = generateClusterData(datasetType, k);
    
    // Draw clusters
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    
    clusters.forEach((cluster, clusterIndex) => {
        cluster.points.forEach(point => {
            const x = margin + (point.x / 8) * (width - 2 * margin);
            const y = margin + (point.y / 8) * (height - 2 * margin);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '3');
            circle.setAttribute('fill', colors[clusterIndex % colors.length]);
            svg.appendChild(circle);
        });
        
        // Draw centroid
        const centroidX = margin + (cluster.centroid.x / 8) * (width - 2 * margin);
        const centroidY = margin + (cluster.centroid.y / 8) * (height - 2 * margin);
        
        const centroid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centroid.setAttribute('cx', centroidX);
        centroid.setAttribute('cy', centroidY);
        centroid.setAttribute('r', '6');
        centroid.setAttribute('fill', colors[clusterIndex % colors.length]);
        centroid.setAttribute('stroke', '#fff');
        centroid.setAttribute('stroke-width', '2');
        svg.appendChild(centroid);
    });
}

function findOptimalK(wcssData) {
    // Simple elbow detection: find the point with maximum second derivative
    let maxCurvature = 0;
    let optimalK = 2;
    
    for (let i = 1; i < wcssData.length - 1; i++) {
        const curvature = Math.abs(wcssData[i-1].wcss - 2*wcssData[i].wcss + wcssData[i+1].wcss);
        if (curvature > maxCurvature) {
            maxCurvature = curvature;
            optimalK = wcssData[i].k;
        }
    }
    
    return optimalK;
}

// ===== SILHOUETTE ANALYSIS DEMO =====

function generateSilhouetteDemo() {
    const dataset = document.getElementById('silhouette-dataset')?.value || 'blobs';
    const k = parseInt(document.getElementById('silhouette-k')?.value || 3);
    
    // Generate silhouette data
    const silhouetteData = generateSilhouetteData(dataset, k);
    
    // Draw silhouette plot
    drawSilhouettePlot(silhouetteData);
    
    // Draw clustering visualization
    drawSilhouetteClusters(dataset, k);
    
    // Update metrics
    updateSilhouetteMetrics(silhouetteData);
}

function resetSilhouetteDemo() {
    resetDemo(['silhouette-plot', 'silhouette-clusters'], ['avg-silhouette', 'best-cluster', 'worst-cluster']);
    
    // Add custom placeholder text
    const silhouettePlot = document.getElementById('silhouette-plot');
    const silhouetteClusters = document.getElementById('silhouette-clusters');
    
    if (silhouettePlot) {
        silhouettePlot.innerHTML = '<text x="200" y="150" text-anchor="middle" fill="#666">Click "Generate Analysis" to start</text>';
    }
    
    if (silhouetteClusters) {
        silhouetteClusters.innerHTML = '<text x="200" y="150" text-anchor="middle" fill="#666">Clustering visualization will appear here</text>';
    }
}

function generateSilhouetteData(datasetType, k) {
    const clusters = generateClusterData(datasetType, k);
    const silhouetteData = [];
    
    clusters.forEach((cluster, clusterIndex) => {
        cluster.points.forEach(point => {
            // Calculate silhouette coefficient for this point
            const silhouette = calculateSilhouetteCoefficient(point, cluster, clusters);
            silhouetteData.push({
                cluster: clusterIndex,
                silhouette: silhouette,
                point: point
            });
        });
    });
    
    return silhouetteData;
}

function calculateSilhouetteCoefficient(point, ownCluster, allClusters) {
    // Simplified silhouette calculation
    const intraClusterDist = calculateAverageDistance(point, ownCluster.points);
    const interClusterDists = allClusters
        .filter(c => c !== ownCluster)
        .map(c => calculateAverageDistance(point, c.points));
    
    const minInterClusterDist = Math.min(...interClusterDists);
    
    if (intraClusterDist === 0 && minInterClusterDist === 0) {
        return 0;
    }
    
    return (minInterClusterDist - intraClusterDist) / Math.max(intraClusterDist, minInterClusterDist);
}

function calculateAverageDistance(point, otherPoints) {
    if (otherPoints.length === 0) return 0;
    
    const totalDist = otherPoints.reduce((sum, otherPoint) => {
        return sum + Math.sqrt((point.x - otherPoint.x) ** 2 + (point.y - otherPoint.y) ** 2);
    }, 0);
    
    return totalDist / otherPoints.length;
}

function drawSilhouettePlot(silhouetteData) {
    const svg = document.getElementById('silhouette-plot');
    if (!svg) return;
    
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    
    // Clear previous content
    svg.innerHTML = '';
    
    // Group by cluster
    const clusters = {};
    silhouetteData.forEach(d => {
        if (!clusters[d.cluster]) {
            clusters[d.cluster] = [];
        }
        clusters[d.cluster].push(d);
    });
    
    // Sort each cluster by silhouette value
    Object.keys(clusters).forEach(clusterKey => {
        clusters[clusterKey].sort((a, b) => a.silhouette - b.silhouette);
    });
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    let yOffset = 0;
    
    Object.keys(clusters).forEach((clusterKey, clusterIndex) => {
        const clusterData = clusters[clusterKey];
        const barHeight = 20;
        const barSpacing = 2;
        
        clusterData.forEach((d, pointIndex) => {
            const x = margin.left + (d.silhouette + 1) * (width - margin.left - margin.right) / 2;
            const y = margin.top + yOffset + pointIndex * (barHeight + barSpacing);
            const barWidth = Math.abs(d.silhouette) * (width - margin.left - margin.right) / 2;
            
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', d.silhouette < 0 ? x - barWidth : x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', barWidth);
            rect.setAttribute('height', barHeight);
            rect.setAttribute('fill', colors[clusterIndex % colors.length]);
            rect.setAttribute('opacity', '0.7');
            svg.appendChild(rect);
        });
        
        yOffset += clusterData.length * (barHeight + barSpacing) + 10;
    });
    
    // Draw zero line
    const zeroLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    zeroLine.setAttribute('x1', margin.left + (width - margin.left - margin.right) / 2);
    zeroLine.setAttribute('y1', margin.top);
    zeroLine.setAttribute('x2', margin.left + (width - margin.left - margin.right) / 2);
    zeroLine.setAttribute('y2', height - margin.bottom);
    zeroLine.setAttribute('stroke', '#333');
    zeroLine.setAttribute('stroke-width', '2');
    zeroLine.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(zeroLine);
    
    // Add labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', width / 2);
    xLabel.setAttribute('y', height - 5);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '14');
    xLabel.setAttribute('fill', '#333');
    xLabel.textContent = 'Silhouette Coefficient';
    svg.appendChild(xLabel);
}

function drawSilhouetteClusters(datasetType, k) {
    const svg = document.getElementById('silhouette-clusters');
    if (!svg) return;
    
    const width = 400;
    const height = 300;
    const margin = 20;
    
    // Clear previous content
    svg.innerHTML = '';
    
    // Generate cluster data
    const clusters = generateClusterData(datasetType, k);
    
    // Draw clusters
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    
    clusters.forEach((cluster, clusterIndex) => {
        cluster.points.forEach((point, pointIndex) => {
            const x = margin + (point.x / 8) * (width - 2 * margin);
            const y = margin + (point.y / 8) * (height - 2 * margin);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', colors[clusterIndex % colors.length]);
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', '1');
            svg.appendChild(circle);
        });
    });
}

function updateSilhouetteMetrics(silhouetteData) {
    const avgSilhouette = silhouetteData.reduce((sum, d) => sum + d.silhouette, 0) / silhouetteData.length;
    
    // Group by cluster to find best and worst
    const clusters = {};
    silhouetteData.forEach(d => {
        if (!clusters[d.cluster]) {
            clusters[d.cluster] = [];
        }
        clusters[d.cluster].push(d.silhouette);
    });
    
    const clusterAverages = Object.keys(clusters).map(clusterKey => {
        const clusterSilhouettes = clusters[clusterKey];
        return clusterSilhouettes.reduce((sum, s) => sum + s, 0) / clusterSilhouettes.length;
    });
    
    const bestCluster = Math.max(...clusterAverages);
    const worstCluster = Math.min(...clusterAverages);
    
    document.getElementById('avg-silhouette').textContent = avgSilhouette.toFixed(3);
    document.getElementById('best-cluster').textContent = bestCluster.toFixed(3);
    document.getElementById('worst-cluster').textContent = worstCluster.toFixed(3);
}

// ===== K-MEANS DEMO =====

function generateDemoData() {
    const dataType = document.getElementById('demo-data')?.value || 'blobs';
    const k = parseInt(document.getElementById('demo-clusters')?.value || 3);
    
    // Generate raw data points (not pre-clustered)
    kmeansData = generateRawDataPoints(dataType, k);
    kmeansCentroids = [];
    kmeansAssignments = [];
    kmeansIteration = 0;
    kmeansIsRunning = false;
    
    // Display initial state (just raw points, no clusters)
    drawRawDataPoints(kmeansData);
    
    // Update status
    updateKMeansStatus();
}

// Global variables for K-means demo
let kmeansData = [];
let kmeansCentroids = [];
let kmeansAssignments = [];
let kmeansIteration = 0;
let kmeansIsRunning = false;

function runKmeansDemo() {
    const dataType = document.getElementById('demo-data')?.value || 'blobs';
    const k = parseInt(document.getElementById('demo-clusters')?.value || 3);
    const initMethod = document.getElementById('demo-init')?.value || 'random';
    
    // Generate data if not already generated
    if (kmeansData.length === 0) {
        kmeansData = generateClusterData(dataType, k);
    }
    
    // Initialize centroids
    kmeansCentroids = initializeKMeansCentroids(kmeansData, k, initMethod);
    // Initialize assignments by assigning points to closest centroids
    kmeansAssignments = assignPointsToCentroids(kmeansData, kmeansCentroids);
    kmeansIteration = 1; // Start at iteration 1 since we've done initial assignment
    
    // Run K-means to convergence
    kmeansIsRunning = true;
    const runStep = () => {
        if (kmeansIsRunning) {
            const converged = kmeansStep();
            updateKMeansStatus();
            drawKMeansDemo(kmeansData, kmeansCentroids, kmeansAssignments, true);
            
            if (!converged && kmeansIteration < 100) {
                setTimeout(runStep, 500);
            } else {
                kmeansIsRunning = false;
                updateKMeansStatus();
                updateKMeansMetrics();
            }
        }
    };
    
    runStep();
}

function stepKmeansDemo() {
    if (kmeansData.length === 0) {
        alert('Please generate data first!');
        return;
    }
    
    if (kmeansCentroids.length === 0) {
        // Initialize centroids if not done yet
        const k = parseInt(document.getElementById('demo-clusters')?.value || 3);
        const initMethod = document.getElementById('demo-init')?.value || 'random';
        kmeansCentroids = initializeKMeansCentroids(kmeansData, k, initMethod);
        kmeansAssignments = assignPointsToCentroids(kmeansData, kmeansCentroids);
        kmeansIteration = 1;
    } else {
        // Perform one K-means step
        const converged = kmeansStep();
        if (converged) {
            const status = document.getElementById('demo-status');
            if (status) {
                status.innerHTML += `<p><strong>✅ K-means converged!</strong></p>`;
            }
        }
    }
    
    updateKMeansStatus();
    drawKMeansDemo(kmeansData, kmeansCentroids, kmeansAssignments, true);
    updateKMeansMetrics();
}

function kmeansStep() {
    const oldAssignments = [...kmeansAssignments];
    
    // Assign points to centroids
    kmeansAssignments = assignPointsToCentroids(kmeansData, kmeansCentroids);
    
    // Update centroids
    kmeansCentroids = updateCentroids(kmeansData, kmeansAssignments, kmeansCentroids.length);
    
    kmeansIteration++;
    
    // Check convergence
    return checkKMeansConvergence(oldAssignments, kmeansAssignments, kmeansCentroids);
}

function initializeKMeansCentroids(data, k, method) {
    const centroids = [];
    
    if (method === 'random') {
        // Random initialization
        for (let i = 0; i < k; i++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            centroids.push({...data[randomIndex]});
        }
    } else {
        // K-means++ initialization
        // First centroid: random
        const firstIndex = Math.floor(Math.random() * data.length);
        centroids.push({...data[firstIndex]});
        
        // Remaining centroids: weighted by distance
        for (let i = 1; i < k; i++) {
            const distances = data.map(point => {
                const minDist = Math.min(...centroids.map(centroid => 
                    Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2)
                ));
                return minDist ** 2;
            });
            
            const totalDistance = distances.reduce((sum, dist) => sum + dist, 0);
            let random = Math.random() * totalDistance;
            
            for (let j = 0; j < data.length; j++) {
                random -= distances[j];
                if (random <= 0) {
                    centroids.push({...data[j]});
                    break;
                }
            }
        }
    }
    
    return centroids;
}

function assignPointsToCentroids(data, centroids) {
    return data.map(point => {
        let minDist = Infinity;
        let bestCluster = 0;
        
        centroids.forEach((centroid, i) => {
            const dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2);
            if (dist < minDist) {
                minDist = dist;
                bestCluster = i;
            }
        });
        
        return bestCluster;
    });
}

function updateCentroids(data, assignments, k) {
    const newCentroids = [];
    
    for (let i = 0; i < k; i++) {
        const clusterPoints = data.filter((_, idx) => assignments[idx] === i);
        
        if (clusterPoints.length > 0) {
            const avgX = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
            const avgY = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
            newCentroids.push({ x: avgX, y: avgY });
        } else {
            // Keep old centroid if no points assigned
            newCentroids.push({ x: 0, y: 0 });
        }
    }
    
    return newCentroids;
}

function checkKMeansConvergence(oldAssignments, newAssignments, centroids) {
    // Check if assignments changed
    for (let i = 0; i < oldAssignments.length; i++) {
        if (oldAssignments[i] !== newAssignments[i]) {
            return false;
        }
    }
    return true;
}

function updateKMeansStatus() {
    const status = document.getElementById('demo-status');
    if (status) {
        if (kmeansIteration === 0) {
            status.innerHTML = '<p>Ready to start K-means. Click "Run K-means" to begin.</p>';
        } else if (kmeansIsRunning) {
            status.innerHTML = `<p>Iteration ${kmeansIteration}: Running...</p>`;
        } else {
            status.innerHTML = `<p>Iteration ${kmeansIteration}: Converged!</p>`;
        }
    }
}

function updateKMeansMetrics() {
    if (kmeansData.length === 0) return;
    
    // Calculate WCSS
    let wcss = 0;
    kmeansData.forEach((point, i) => {
        const centroid = kmeansCentroids[kmeansAssignments[i]];
        wcss += (point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2;
    });
    
    const metrics = document.getElementById('demo-metrics');
    if (metrics) {
        metrics.innerHTML = `
            <div style="background: white; padding: 1rem; border: 1px solid #ddd; border-radius: 6px; margin: 1rem 0;">
                <h4>Clustering Metrics:</h4>
                <p><strong>Iterations:</strong> ${kmeansIteration}</p>
                <p><strong>WCSS:</strong> ${wcss.toFixed(2)}</p>
                <p><strong>Status:</strong> ${kmeansIsRunning ? 'Running' : 'Converged'}</p>
            </div>
        `;
    }
}

function resetDemo() {
    kmeansData = [];
    kmeansCentroids = [];
    kmeansAssignments = [];
    kmeansIteration = 0;
    kmeansIsRunning = false;
    
    const canvas = document.getElementById('kmeans-demo-canvas');
    const metrics = document.getElementById('demo-metrics');
    const status = document.getElementById('demo-status');
    
    if (canvas) {
        canvas.innerHTML = '<p>Click "Generate Data" to start the demo</p>';
    }
    
    if (metrics) {
        metrics.style.display = 'none';
    }
    
    if (status) {
        status.innerHTML = '<p>Click "Generate Data" to start the demo</p>';
    }
}

function drawKMeansDemo(data, centroids, assignments, showCentroids) {
    const canvas = document.getElementById('kmeans-demo-canvas');
    if (!canvas) return;
    
    const width = 400;
    const height = 300;
    const margin = 20;
    
    // Create SVG if it doesn't exist
    let svg = canvas.querySelector('svg');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        canvas.innerHTML = '';
        canvas.appendChild(svg);
    } else {
        svg.innerHTML = '';
    }
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    
    // Draw data points with cluster colors
    data.forEach((point, i) => {
        const x = margin + (point.x / 8) * (width - 2 * margin);
        const y = margin + (point.y / 8) * (height - 2 * margin);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        
        // Color based on assignment if available, otherwise gray
        if (assignments && assignments[i] !== undefined) {
            circle.setAttribute('fill', colors[assignments[i] % colors.length]);
        } else {
            circle.setAttribute('fill', '#999');
        }
        
        svg.appendChild(circle);
    });
    
    // Draw centroids if available
    if (showCentroids && centroids && centroids.length > 0) {
        centroids.forEach((centroid, i) => {
            const centroidX = margin + (centroid.x / 8) * (width - 2 * margin);
            const centroidY = margin + (centroid.y / 8) * (height - 2 * margin);
            
            const centroidCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            centroidCircle.setAttribute('cx', centroidX);
            centroidCircle.setAttribute('cy', centroidY);
            centroidCircle.setAttribute('r', '6');
            centroidCircle.setAttribute('fill', colors[i % colors.length]);
            centroidCircle.setAttribute('stroke', '#fff');
            centroidCircle.setAttribute('stroke-width', '2');
            svg.appendChild(centroidCircle);
        });
    }
}

function runKMeansAlgorithm(initialClusters, k, initMethod) {
    // Simplified K-means implementation
    let clusters = JSON.parse(JSON.stringify(initialClusters)); // Deep copy
    let iterations = 0;
    let converged = false;
    
    while (!converged && iterations < 50) {
        iterations++;
        
        // Update centroids
        clusters.forEach(cluster => {
            if (cluster.points.length > 0) {
                cluster.centroid.x = cluster.points.reduce((sum, p) => sum + p.x, 0) / cluster.points.length;
                cluster.centroid.y = cluster.points.reduce((sum, p) => sum + p.y, 0) / cluster.points.length;
            }
        });
        
        // Reassign points (simplified - just keep current assignments for demo)
        converged = true; // Simplified convergence
    }
    
    // Calculate WCSS
    let wcss = 0;
    clusters.forEach(cluster => {
        cluster.points.forEach(point => {
            const dist = Math.sqrt((point.x - cluster.centroid.x) ** 2 + (point.y - cluster.centroid.y) ** 2);
            wcss += dist ** 2;
        });
    });
    
    return { clusters, iterations, wcss };
}


// ===== UTILITY FUNCTIONS =====

function generateRawDataPoints(datasetType, k) {
    const points = [];
    
    switch (datasetType) {
        case 'blobs':
            // Generate well-separated blob clusters
            for (let i = 0; i < k; i++) {
                const centerX = 1 + (i % 3) * 3;
                const centerY = 1 + Math.floor(i / 3) * 3;
                
                for (let j = 0; j < 15; j++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * 1.5;
                    points.push({
                        x: centerX + radius * Math.cos(angle),
                        y: centerY + radius * Math.sin(angle)
                    });
                }
            }
            break;
            
        case 'random':
            // Generate random points
            for (let i = 0; i < 45; i++) {
                points.push({
                    x: Math.random() * 8,
                    y: Math.random() * 8
                });
            }
            break;
            
        case 'moons':
            // Generate moon-shaped clusters
            for (let i = 0; i < 2; i++) {
                const centerX = 2 + i * 4;
                const centerY = 4;
                const radius = 1.5;
                
                for (let j = 0; j < 22; j++) {
                    const angle = Math.random() * Math.PI;
                    const r = radius + (Math.random() - 0.5) * 0.8;
                    points.push({
                        x: centerX + r * Math.cos(angle),
                        y: centerY + r * Math.sin(angle) * (i === 0 ? -1 : 1)
                    });
                }
            }
            break;
    }
    
    return points;
}

function drawRawDataPoints(points) {
    const canvas = document.getElementById('kmeans-demo-canvas');
    if (!canvas) return;
    
    const width = 400;
    const height = 300;
    const margin = 20;
    
    // Create SVG if it doesn't exist
    let svg = canvas.querySelector('svg');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        canvas.innerHTML = '';
        canvas.appendChild(svg);
    } else {
        svg.innerHTML = '';
    }
    
    // Draw all points in gray (unassigned)
    points.forEach(point => {
        const x = margin + (point.x / 8) * (width - 2 * margin);
        const y = margin + (point.y / 8) * (height - 2 * margin);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', '#999');
        svg.appendChild(circle);
    });
}

function generateClusterData(datasetType, k) {
    const clusters = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    switch (datasetType) {
        case 'blobs':
            // Generate well-separated blob clusters
            for (let i = 0; i < k; i++) {
                const centerX = 1 + (i % 3) * 3;
                const centerY = 1 + Math.floor(i / 3) * 3;
                const points = [];
                
                for (let j = 0; j < 15; j++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * 1.5;
                    points.push({
                        x: centerX + radius * Math.cos(angle),
                        y: centerY + radius * Math.sin(angle)
                    });
                }
                
                clusters.push({
                    points: points,
                    centroid: { x: centerX, y: centerY }
                });
            }
            break;
            
        case 'random':
            // Generate random points
            const allPoints = [];
            for (let i = 0; i < 45; i++) {
                allPoints.push({
                    x: Math.random() * 8,
                    y: Math.random() * 8
                });
            }
            
            // Distribute points among clusters
            const pointsPerCluster = Math.floor(allPoints.length / k);
            for (let i = 0; i < k; i++) {
                const startIdx = i * pointsPerCluster;
                const endIdx = i === k - 1 ? allPoints.length : (i + 1) * pointsPerCluster;
                const clusterPoints = allPoints.slice(startIdx, endIdx);
                
                const centroidX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
                const centroidY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
                
                clusters.push({
                    points: clusterPoints,
                    centroid: { x: centroidX, y: centroidY }
                });
            }
            break;
            
        case 'moons':
            // Generate moon-shaped clusters
            for (let i = 0; i < k; i++) {
                const points = [];
                const centerX = 2 + i * 2;
                const centerY = 4;
                
                for (let j = 0; j < 15; j++) {
                    const angle = Math.random() * Math.PI;
                    const radius = 1 + Math.random() * 0.5;
                    points.push({
                        x: centerX + radius * Math.cos(angle),
                        y: centerY + radius * Math.sin(angle) * 0.5
                    });
                }
                
                clusters.push({
                    points: points,
                    centroid: { x: centerX, y: centerY }
                });
            }
            break;
    }
    
    return clusters;
}

// Quiz functionality
window.checkAnswer = function(questionNum, correctAnswer) {
    console.log('checkAnswer called');
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const resultDiv = document.getElementById(`q${questionNum}-result`);
    
    if (!selectedAnswer) {
        resultDiv.innerHTML = '<p style="color: orange;">Please select an answer first.</p>';
        return;
    }
    
    const isCorrect = selectedAnswer.value === correctAnswer;
    
    if (isCorrect) {
        resultDiv.innerHTML = '<p style="color: green;">✓ Correct!</p>';
    } else {
        resultDiv.innerHTML = '<p style="color: red;">✗ Incorrect. Try again!</p>';
    }
    
    updateQuizScore();
};

window.updateQuizScore = function() {
    const correct = document.querySelectorAll('[id$="-result"] p[style*="green"]').length;
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = correct;
    }
};

window.resetQuiz = function() {
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    document.querySelectorAll('[id$="-result"]').forEach(div => {
        div.innerHTML = '';
    });
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = '0';
    }
};

// Scroll to top function for navigation
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
