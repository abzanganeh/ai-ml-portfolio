// Chapter 6: Clustering Evaluation
// Interactive Demo JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEvaluationDemo();
});

// Demo functions for HTML onclick compatibility
function runInitializationDemo() {
    const canvas = document.getElementById('initialization-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Initialization comparison demo would appear here</p>';
    }
}

function resetInitializationDemo() {
    const canvas = document.getElementById('initialization-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Run Demo" to see initialization comparison</p>';
    }
}

function generateInitDemo() {
    const canvas = document.getElementById('init-plot');
    const convergenceCanvas = document.getElementById('init-convergence');
    
    if (!canvas || !convergenceCanvas) return;
    
    // Clear previous content
    canvas.innerHTML = '';
    convergenceCanvas.innerHTML = '';
    
    // Get demo parameters
    const dataset = document.getElementById('init-dataset')?.value || 'blobs';
    const method = document.getElementById('init-method')?.value || 'random';
    const runs = parseInt(document.getElementById('init-runs')?.value || '5');
    
    // Generate sample data
    const data = generateSampleData(dataset);
    const numClusters = 3;
    
    // Run initialization comparison
    const results = compareInitializationMethods(data, numClusters, runs);
    
    // Draw clustering results
    drawInitClusteringResults(canvas, data, results, method);
    
    // Draw convergence comparison
    drawInitConvergenceComparison(convergenceCanvas, results);
    
    // Update metrics display
    updateInitMetrics(results, method);
}

function resetInitDemo() {
    const canvas = document.getElementById('init-plot');
    if (canvas) {
        canvas.innerHTML = '<text x="200" y="150" text-anchor="middle">Click "Compare Methods" to see demo</text>';
    }
}


// Initialize clustering evaluation demo
function initializeEvaluationDemo() {
    const generateBtn = document.getElementById('generate-evaluation-demo');
    const metricSelect = document.getElementById('evaluation-metric');
    const datasetSelect = document.getElementById('dataset-type');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateEvaluationVisualization();
        });
    }

    if (metricSelect) {
        metricSelect.addEventListener('change', function() {
            generateEvaluationVisualization();
        });
    }

    if (datasetSelect) {
        datasetSelect.addEventListener('change', function() {
            generateEvaluationVisualization();
        });
    }

    // Generate initial visualization
    generateEvaluationVisualization();
}

// Generate clustering evaluation visualization
function generateEvaluationVisualization() {
    const metric = document.getElementById('evaluation-metric')?.value || 'silhouette';
    const datasetType = document.getElementById('dataset-type')?.value || 'blobs';
    
    // Generate data points
    const dataPoints = generateDataset(datasetType);
    
    // Draw data points
    drawDataPoints(dataPoints);
    
    // Calculate and display evaluation metrics
    calculateAndDisplayMetrics(dataPoints, metric);
}

// Generate different types of datasets
function generateDataset(type) {
    switch (type) {
        case 'blobs':
            return generateBlobClusters();
        case 'moons':
            return generateMoonClusters();
        case 'circles':
            return generateCircleClusters();
        case 'random':
            return generateRandomPoints();
        default:
            return generateBlobClusters();
    }
}

function generateBlobClusters() {
    const points = [];
    const centers = [
        { x: 2, y: 2 },
        { x: 6, y: 3 },
        { x: 4, y: 6 }
    ];
    
    centers.forEach((center, i) => {
        for (let j = 0; j < 20; j++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * 1.5;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            points.push({ x, y, cluster: i, trueCluster: i });
        }
    });
    
    return points;
}

function generateMoonClusters() {
    const points = [];
    
    // First moon
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI;
        const radius = 1 + Math.random() * 0.5;
        const x = 2 + radius * Math.cos(angle);
        const y = 2 + radius * Math.sin(angle);
        points.push({ x, y, cluster: 0, trueCluster: 0 });
    }
    
    // Second moon
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI;
        const radius = 1 + Math.random() * 0.5;
        const x = 6 + radius * Math.cos(angle + Math.PI);
        const y = 2 + radius * Math.sin(angle + Math.PI);
        points.push({ x, y, cluster: 1, trueCluster: 1 });
    }
    
    return points;
}

function generateCircleClusters() {
    const points = [];
    
    // Outer circle
    for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * 2 * Math.PI;
        const x = 4 + 2.5 * Math.cos(angle);
        const y = 4 + 2.5 * Math.sin(angle);
        points.push({ x, y, cluster: 0, trueCluster: 0 });
    }
    
    // Inner circle
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * 2 * Math.PI;
        const x = 4 + 1 * Math.cos(angle);
        const y = 4 + 1 * Math.sin(angle);
        points.push({ x, y, cluster: 1, trueCluster: 1 });
    }
    
    return points;
}

function generateRandomPoints() {
    const points = [];
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 8;
        const y = Math.random() * 8;
        points.push({ x, y, cluster: 0, trueCluster: 0 });
    }
    return points;
}

// Draw data points on canvas
function drawDataPoints(points) {
    const canvas = document.getElementById('data-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up scaling
    const margin = 40;
    const scaleX = (width - 2 * margin) / 8;
    const scaleY = (height - 2 * margin) / 8;
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // Draw points
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    points.forEach((point, index) => {
        const x = margin + point.x * scaleX;
        const y = height - margin - point.y * scaleY;
        
        ctx.fillStyle = colors[point.cluster % colors.length];
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Calculate and display evaluation metrics
function calculateAndDisplayMetrics(points, metric) {
    const metricsContainer = document.getElementById('metrics-results');
    if (!metricsContainer) return;
    
    let html = '<h4>Evaluation Metrics:</h4>';
    html += '<div class="metrics-grid">';
    
    // Calculate different metrics
    const silhouetteScore = calculateSilhouetteScore(points);
    const daviesBouldinScore = calculateDaviesBouldinScore(points);
    const calinskiHarabaszScore = calculateCalinskiHarabaszScore(points);
    const adjustedRandScore = calculateAdjustedRandScore(points);
    
    html += `
        <div class="metric-item">
            <span class="metric-label">Silhouette Score:</span>
            <span class="metric-value">${silhouetteScore.toFixed(3)}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Davies-Bouldin Score:</span>
            <span class="metric-value">${daviesBouldinScore.toFixed(3)}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Calinski-Harabasz Score:</span>
            <span class="metric-value">${calinskiHarabaszScore.toFixed(3)}</span>
        </div>
        <div class="metric-item">
            <span class="metric-label">Adjusted Rand Score:</span>
            <span class="metric-value">${adjustedRandScore.toFixed(3)}</span>
        </div>
    `;
    
    html += '</div>';
    
    // Add metric interpretation
    html += `<div class="metric-interpretation">
        <h5>Interpretation:</h5>
        <p>${getMetricInterpretation(metric, silhouetteScore, daviesBouldinScore, calinskiHarabaszScore, adjustedRandScore)}</p>
    </div>`;
    
    metricsContainer.innerHTML = html;
}

// Calculate silhouette score
function calculateSilhouetteScore(points) {
    const clusters = {};
    points.forEach(point => {
        if (!clusters[point.cluster]) {
            clusters[point.cluster] = [];
        }
        clusters[point.cluster].push(point);
    });
    
    let totalSilhouette = 0;
    points.forEach(point => {
        const a = calculateIntraClusterDistance(point, clusters[point.cluster]);
        const b = calculateNearestClusterDistance(point, clusters, point.cluster);
        const silhouette = (b - a) / Math.max(a, b);
        totalSilhouette += silhouette;
    });
    
    return totalSilhouette / points.length;
}

// Calculate intra-cluster distance
function calculateIntraClusterDistance(point, cluster) {
    if (cluster.length <= 1) return 0;
    
    let totalDistance = 0;
    cluster.forEach(otherPoint => {
        if (otherPoint !== point) {
            totalDistance += calculateDistance(point, otherPoint);
        }
    });
    
    return totalDistance / (cluster.length - 1);
}

// Calculate nearest cluster distance
function calculateNearestClusterDistance(point, clusters, currentCluster) {
    let minDistance = Infinity;
    
    Object.keys(clusters).forEach(clusterId => {
        if (clusterId !== currentCluster.toString()) {
            const distance = calculateIntraClusterDistance(point, clusters[clusterId]);
            minDistance = Math.min(minDistance, distance);
        }
    });
    
    return minDistance;
}

// Calculate Davies-Bouldin score
function calculateDaviesBouldinScore(points) {
    const clusters = {};
    points.forEach(point => {
        if (!clusters[point.cluster]) {
            clusters[point.cluster] = [];
        }
        clusters[point.cluster].push(point);
    });
    
    const clusterIds = Object.keys(clusters);
    let totalScore = 0;
    
    clusterIds.forEach(clusterId => {
        let maxRatio = 0;
        const currentCluster = clusters[clusterId];
        const currentCentroid = calculateCentroid(currentCluster);
        const currentSpread = calculateClusterSpread(currentCluster, currentCentroid);
        
        clusterIds.forEach(otherClusterId => {
            if (otherClusterId !== clusterId) {
                const otherCluster = clusters[otherClusterId];
                const otherCentroid = calculateCentroid(otherCluster);
                const otherSpread = calculateClusterSpread(otherCluster, otherCentroid);
                const centroidDistance = calculateDistance(currentCentroid, otherCentroid);
                
                const ratio = (currentSpread + otherSpread) / centroidDistance;
                maxRatio = Math.max(maxRatio, ratio);
            }
        });
        
        totalScore += maxRatio;
    });
    
    return totalScore / clusterIds.length;
}

// Calculate Calinski-Harabasz score
function calculateCalinskiHarabaszScore(points) {
    const clusters = {};
    points.forEach(point => {
        if (!clusters[point.cluster]) {
            clusters[point.cluster] = [];
        }
        clusters[point.cluster].push(point);
    });
    
    const globalCentroid = calculateCentroid(points);
    const k = Object.keys(clusters).length;
    const n = points.length;
    
    let betweenClusterSum = 0;
    let withinClusterSum = 0;
    
    Object.values(clusters).forEach(cluster => {
        const centroid = calculateCentroid(cluster);
        betweenClusterSum += cluster.length * Math.pow(calculateDistance(centroid, globalCentroid), 2);
        
        cluster.forEach(point => {
            withinClusterSum += Math.pow(calculateDistance(point, centroid), 2);
        });
    });
    
    return (betweenClusterSum / (k - 1)) / (withinClusterSum / (n - k));
}

// Calculate Adjusted Rand Score
function calculateAdjustedRandScore(points) {
    const clusters = {};
    const trueClusters = {};
    
    points.forEach(point => {
        if (!clusters[point.cluster]) {
            clusters[point.cluster] = [];
        }
        if (!trueClusters[point.trueCluster]) {
            trueClusters[point.trueCluster] = [];
        }
        clusters[point.cluster].push(point);
        trueClusters[point.trueCluster].push(point);
    });
    
    // Calculate contingency table
    const contingencyTable = {};
    Object.keys(clusters).forEach(clusterId => {
        contingencyTable[clusterId] = {};
        Object.keys(trueClusters).forEach(trueClusterId => {
            const intersection = clusters[clusterId].filter(point => 
                trueClusters[trueClusterId].includes(point)
            ).length;
            contingencyTable[clusterId][trueClusterId] = intersection;
        });
    });
    
    // Calculate ARI
    let sumCombinations = 0;
    let sumRowCombinations = 0;
    let sumColCombinations = 0;
    
    Object.values(contingencyTable).forEach(row => {
        Object.values(row).forEach(cell => {
            sumCombinations += cell * (cell - 1) / 2;
        });
    });
    
    Object.values(contingencyTable).forEach(row => {
        const rowSum = Object.values(row).reduce((sum, cell) => sum + cell, 0);
        sumRowCombinations += rowSum * (rowSum - 1) / 2;
    });
    
    Object.keys(trueClusters).forEach(trueClusterId => {
        const colSum = Object.values(contingencyTable).reduce((sum, row) => 
            sum + (row[trueClusterId] || 0), 0);
        sumColCombinations += colSum * (colSum - 1) / 2;
    });
    
    const n = points.length;
    const totalCombinations = n * (n - 1) / 2;
    
    const ari = (sumCombinations - (sumRowCombinations * sumColCombinations) / totalCombinations) /
                ((sumRowCombinations + sumColCombinations) / 2 - (sumRowCombinations * sumColCombinations) / totalCombinations);
    
    return ari;
}

// Helper functions
function calculateDistance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

function calculateCentroid(points) {
    const sumX = points.reduce((sum, point) => sum + point.x, 0);
    const sumY = points.reduce((sum, point) => sum + point.y, 0);
    return { x: sumX / points.length, y: sumY / points.length };
}

function calculateClusterSpread(cluster, centroid) {
    return cluster.reduce((sum, point) => sum + calculateDistance(point, centroid), 0) / cluster.length;
}

function getMetricInterpretation(metric, silhouette, daviesBouldin, calinskiHarabasz, adjustedRand) {
    let interpretation = '';
    
    if (silhouette > 0.7) {
        interpretation += 'Strong clustering structure (Silhouette > 0.7). ';
    } else if (silhouette > 0.5) {
        interpretation += 'Reasonable clustering structure (Silhouette > 0.5). ';
    } else if (silhouette > 0.25) {
        interpretation += 'Weak clustering structure (Silhouette > 0.25). ';
    } else {
        interpretation += 'No clear clustering structure (Silhouette ≤ 0.25). ';
    }
    
    if (daviesBouldin < 1.0) {
        interpretation += 'Good cluster separation (Davies-Bouldin < 1.0). ';
    } else {
        interpretation += 'Poor cluster separation (Davies-Bouldin ≥ 1.0). ';
    }
    
    if (adjustedRand > 0.8) {
        interpretation += 'Excellent agreement with true labels (ARI > 0.8).';
    } else if (adjustedRand > 0.5) {
        interpretation += 'Good agreement with true labels (ARI > 0.5).';
    } else {
        interpretation += 'Poor agreement with true labels (ARI ≤ 0.5).';
    }
    
    return interpretation;
}

// Quiz functionality
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'b',
        'q2': 'c', 
        'q3': 'a',
        'q4': 'b',
        'q5': 'c'
    };

    const explanations = {
        'q1': 'Internal metrics evaluate clustering quality without ground truth labels, using only the data and cluster assignments.',
        'q2': 'External metrics compare clustering results against known ground truth labels to measure agreement.',
        'q3': 'Silhouette score ranges from -1 to 1, where values closer to 1 indicate better clustering quality.',
        'q4': 'Davies-Bouldin score measures the ratio of within-cluster scatter to between-cluster separation, with lower values indicating better clustering.',
        'q5': 'The Adjusted Rand Index (ARI) measures the agreement between two clusterings, accounting for chance agreement.'
    };

    // Collect user answers
    let userAnswers = {};
    let score = 0;
    
    for (let i = 1; i <= 5; i++) {
        const questionName = 'q' + i;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        if (selectedOption) {
            userAnswers[questionName] = selectedOption.value;
            if (selectedOption.value === correctAnswers[questionName]) {
                score++;
            }
        }
    }

    // Display results
    const percentage = Math.round((score / 5) * 100);
    let performanceLevel = '';
    
    if (percentage >= 90) {
        performanceLevel = 'Excellent';
    } else if (percentage >= 80) {
        performanceLevel = 'Very Good';
    } else if (percentage >= 70) {
        performanceLevel = 'Good';
    } else if (percentage >= 60) {
        performanceLevel = 'Fair';
    } else {
        performanceLevel = 'Needs Improvement';
    }

    document.getElementById('score-display').innerHTML = 
        `Score: ${score}/5 (${percentage}%) - ${performanceLevel}`;

    // Show detailed results
    let detailedHTML = '<h4>Detailed Results:</h4>';
    for (let i = 1; i <= 5; i++) {
        const questionName = 'q' + i;
        const userAnswer = userAnswers[questionName] || 'Not answered';
        const correctAnswer = correctAnswers[questionName];
        const isCorrect = userAnswer === correctAnswer;
        
        detailedHTML += `
            <div style="background: ${isCorrect ? '#e8f5e8' : '#ffebee'}; border: 1px solid ${isCorrect ? '#4caf50' : '#f44336'}; border-radius: 6px; padding: 1rem; margin: 0.5rem 0;">
                <strong>Question ${i}:</strong> ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                <br><small>Your answer: ${userAnswer} | Correct answer: ${correctAnswer}</small>
                <br><em>${explanations[questionName]}</em>
            </div>
        `;
    }

    document.getElementById('detailed-results').innerHTML = detailedHTML;
    document.getElementById('quiz-results').style.display = 'block';
    
    // Scroll to results
    document.getElementById('quiz-results').scrollIntoView({ behavior: 'smooth' });
}

// ===== ACCELERATION TECHNIQUES DEMO FUNCTIONS =====

function generateAccelDemo() {
    const datasetSize = document.getElementById('accel-dataset-size')?.value || 'medium';
    const method = document.getElementById('accel-method')?.value || 'standard';
    
    // Generate performance data based on method and dataset size
    const performanceData = generateAccelPerformanceData(datasetSize, method);
    const qualityData = generateAccelQualityData(datasetSize, method);
    
    // Draw performance visualization
    drawAccelPerformanceChart(performanceData);
    
    // Draw quality visualization
    drawAccelQualityChart(qualityData);
    
    // Update metrics
    updateAccelMetrics(performanceData, qualityData);
}

function resetAccelDemo() {
    // Clear visualizations
    const performanceSvg = document.getElementById('accel-performance');
    const qualitySvg = document.getElementById('accel-quality');
    
    if (performanceSvg) performanceSvg.innerHTML = '';
    if (qualitySvg) qualitySvg.innerHTML = '';
    
    // Reset metrics
    const metrics = ['exec-time', 'memory-usage', 'iterations', 'silhouette-score', 'inertia'];
    metrics.forEach(metricId => {
        const element = document.getElementById(metricId);
        if (element) element.textContent = '-';
    });
}

function generateAccelPerformanceData(datasetSize, method) {
    const sizeMultipliers = {
        'small': 1,
        'medium': 10,
        'large': 50,
        'xlarge': 100
    };
    
    const baseTime = {
        'standard': 100,
        'triangle': 60,
        'minibatch': 40,
        'approximate': 20
    };
    
    const multiplier = sizeMultipliers[datasetSize] || 10;
    const methodTime = baseTime[method] || 100;
    
    return {
        executionTime: methodTime * multiplier,
        memoryUsage: Math.round(50 * multiplier / 10),
        iterations: Math.round(15 - (method === 'approximate' ? 5 : 0)),
        datasetSize: datasetSize
    };
}

function generateAccelQualityData(datasetSize, method) {
    const qualityScores = {
        'standard': 0.85,
        'triangle': 0.84,
        'minibatch': 0.80,
        'approximate': 0.75
    };
    
    return {
        silhouetteScore: qualityScores[method] || 0.85,
        inertia: Math.round(1000 * (1.2 - (qualityScores[method] || 0.85))),
        method: method
    };
}

function drawAccelPerformanceChart(data) {
    const svg = document.getElementById('accel-performance');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    // Create a simple bar chart
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    
    const methods = ['Standard', 'Triangle', 'Mini-batch', 'Approximate'];
    const times = [100, 60, 40, 20].map(t => t * (data.datasetSize === 'small' ? 1 : data.datasetSize === 'medium' ? 10 : data.datasetSize === 'large' ? 50 : 100));
    
    const xScale = (width - margin.left - margin.right) / methods.length;
    const yScale = (height - margin.top - margin.bottom) / Math.max(...times);
    
    methods.forEach((method, i) => {
        const barHeight = times[i] * yScale;
        const x = margin.left + i * xScale + xScale * 0.1;
        const y = height - margin.bottom - barHeight;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', xScale * 0.8);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', i === 0 ? '#4ECDC4' : '#FF6B6B');
        rect.setAttribute('opacity', '0.7');
        svg.appendChild(rect);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + xScale * 0.4);
        text.setAttribute('y', height - margin.bottom + 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '10px');
        text.textContent = method;
        svg.appendChild(text);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 15);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14px');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Execution Time Comparison';
    svg.appendChild(title);
}

function drawAccelQualityChart(data) {
    const svg = document.getElementById('accel-quality');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 400;
    const height = 300;
    
    // Create a simple quality indicator
    const score = data.silhouetteScore;
    const radius = 80;
    const cx = width / 2;
    const cy = height / 2;
    
    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', cx);
    bgCircle.setAttribute('cy', cy);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#ddd');
    bgCircle.setAttribute('stroke-width', '10');
    svg.appendChild(bgCircle);
    
    // Score circle
    const scoreCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    scoreCircle.setAttribute('cx', cx);
    scoreCircle.setAttribute('cy', cy);
    scoreCircle.setAttribute('r', radius);
    scoreCircle.setAttribute('fill', 'none');
    scoreCircle.setAttribute('stroke', score > 0.8 ? '#4ECDC4' : score > 0.7 ? '#FFEAA7' : '#FF6B6B');
    scoreCircle.setAttribute('stroke-width', '10');
    scoreCircle.setAttribute('stroke-dasharray', `${2 * Math.PI * radius * score} ${2 * Math.PI * radius * (1 - score)}`);
    scoreCircle.setAttribute('stroke-dashoffset', `${2 * Math.PI * radius * 0.25}`);
    svg.appendChild(scoreCircle);
    
    // Score text
    const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scoreText.setAttribute('x', cx);
    scoreText.setAttribute('y', cy + 5);
    scoreText.setAttribute('text-anchor', 'middle');
    scoreText.setAttribute('font-size', '24px');
    scoreText.setAttribute('font-weight', 'bold');
    scoreText.textContent = score.toFixed(2);
    svg.appendChild(scoreText);
    
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', cx);
    title.setAttribute('y', cy + 50);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14px');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Silhouette Score';
    svg.appendChild(title);
}

function updateAccelMetrics(performanceData, qualityData) {
    const metrics = {
        'exec-time': `${performanceData.executionTime} ms`,
        'memory-usage': `${performanceData.memoryUsage} MB`,
        'iterations': performanceData.iterations,
        'silhouette-score': qualityData.silhouetteScore.toFixed(3),
        'inertia': qualityData.inertia
    };
    
    Object.entries(metrics).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Helper functions for initialization demo
function generateSampleData(type) {
    const data = [];
    const numPoints = 100;
    
    switch (type) {
        case 'blobs':
            // Generate blob clusters
            for (let i = 0; i < 3; i++) {
                const centerX = 100 + i * 150;
                const centerY = 150 + (i % 2) * 100;
                for (let j = 0; j < numPoints / 3; j++) {
                    data.push({
                        x: centerX + (Math.random() - 0.5) * 60,
                        y: centerY + (Math.random() - 0.5) * 60
                    });
                }
            }
            break;
        case 'moons':
            // Generate moon shapes
            for (let i = 0; i < numPoints / 2; i++) {
                const angle = Math.PI * i / (numPoints / 2);
                data.push({
                    x: 100 + Math.cos(angle) * 50,
                    y: 150 + Math.sin(angle) * 30
                });
                data.push({
                    x: 200 + Math.cos(angle) * 50,
                    y: 200 + Math.sin(angle) * 30
                });
            }
            break;
        case 'circles':
            // Generate concentric circles
            for (let i = 0; i < numPoints / 2; i++) {
                const angle = Math.PI * 2 * i / (numPoints / 2);
                data.push({
                    x: 150 + Math.cos(angle) * 40,
                    y: 150 + Math.sin(angle) * 40
                });
                data.push({
                    x: 150 + Math.cos(angle) * 80,
                    y: 150 + Math.sin(angle) * 80
                });
            }
            break;
        default: // random
            for (let i = 0; i < numPoints; i++) {
                data.push({
                    x: Math.random() * 300,
                    y: Math.random() * 300
                });
            }
    }
    
    return data;
}

function compareInitializationMethods(data, numClusters, runs) {
    const methods = ['random', 'kmeans++', 'furthest', 'kmeans++_improved'];
    const results = {};
    
    methods.forEach(method => {
        results[method] = {
            convergence: [],
            finalWCSS: 0,
            iterations: 0,
            stability: 0,
            centroids: []
        };
        
        const wcssValues = [];
        let bestResult = null;
        
        for (let run = 0; run < runs; run++) {
            const result = runKMeansWithMethod(data, numClusters, method);
            wcssValues.push(result.finalWCSS);
            results[method].convergence.push(result.convergence);
            
            // Keep the best result for visualization
            if (!bestResult || result.finalWCSS < bestResult.finalWCSS) {
                bestResult = result;
            }
        }
        
        // Calculate average metrics
        results[method].finalWCSS = wcssValues.reduce((a, b) => a + b, 0) / runs;
        results[method].iterations = results[method].convergence[0].length;
        results[method].stability = calculateStability(wcssValues);
        results[method].centroids = bestResult.centroids;
    });
    
    return results;
}

function runKMeansWithMethod(data, numClusters, method) {
    // Initialize centroids based on method
    const centroids = initializeCentroids(data, numClusters, method);
    const convergence = [];
    
    let currentCentroids = [...centroids];
    let prevWCSS = Infinity;
    let iterations = 0;
    const maxIterations = 50;
    
    while (iterations < maxIterations) {
        // Assign points to clusters
        const assignments = assignPointsToClusters(data, currentCentroids);
        
        // Calculate WCSS
        const wcss = calculateWCSS(data, assignments, currentCentroids);
        convergence.push(wcss);
        
        // Check convergence
        if (Math.abs(prevWCSS - wcss) < 0.01) break;
        prevWCSS = wcss;
        
        // Update centroids
        currentCentroids = updateCentroids(data, assignments, numClusters);
        iterations++;
    }
    
    return {
        centroids: currentCentroids,
        finalWCSS: convergence[convergence.length - 1],
        convergence: convergence
    };
}

function initializeCentroids(data, numClusters, method) {
    const centroids = [];
    
    switch (method) {
        case 'random':
            // Random initialization
            for (let i = 0; i < numClusters; i++) {
                const randomIndex = Math.floor(Math.random() * data.length);
                centroids.push({ ...data[randomIndex] });
            }
            break;
            
        case 'kmeans++':
            // K-means++ initialization
            const firstIndex = Math.floor(Math.random() * data.length);
            centroids.push({ ...data[firstIndex] });
            
            for (let i = 1; i < numClusters; i++) {
                const distances = data.map(point => {
                    const minDist = Math.min(...centroids.map(c => 
                        Math.sqrt((point.x - c.x) ** 2 + (point.y - c.y) ** 2)
                    ));
                    return minDist ** 2;
                });
                
                const sumDistances = distances.reduce((a, b) => a + b, 0);
                const probabilities = distances.map(d => d / sumDistances);
                
                let cumulative = 0;
                const random = Math.random();
                for (let j = 0; j < data.length; j++) {
                    cumulative += probabilities[j];
                    if (random <= cumulative) {
                        centroids.push({ ...data[j] });
                        break;
                    }
                }
            }
            break;
            
        case 'furthest':
            // Furthest-first initialization
            const firstIndex2 = Math.floor(Math.random() * data.length);
            centroids.push({ ...data[firstIndex2] });
            
            for (let i = 1; i < numClusters; i++) {
                let maxDist = 0;
                let furthestPoint = null;
                
                data.forEach(point => {
                    const minDist = Math.min(...centroids.map(c => 
                        Math.sqrt((point.x - c.x) ** 2 + (point.y - c.y) ** 2)
                    ));
                    if (minDist > maxDist) {
                        maxDist = minDist;
                        furthestPoint = point;
                    }
                });
                
                if (furthestPoint) {
                    centroids.push({ ...furthestPoint });
                }
            }
            break;
            
        case 'kmeans++_improved':
            // Improved K-means++ with multiple attempts
            let bestCentroids = null;
            let bestScore = Infinity;
            
            for (let attempt = 0; attempt < 5; attempt++) {
                const attemptCentroids = initializeCentroids(data, numClusters, 'kmeans++');
                const score = calculateInitializationScore(data, attemptCentroids);
                
                if (score < bestScore) {
                    bestScore = score;
                    bestCentroids = attemptCentroids;
                }
            }
            
            centroids.push(...bestCentroids);
            break;
    }
    
    return centroids;
}

function calculateInitializationScore(data, centroids) {
    return data.reduce((sum, point) => {
        const minDist = Math.min(...centroids.map(c => 
            Math.sqrt((point.x - c.x) ** 2 + (point.y - c.y) ** 2)
        ));
        return sum + minDist ** 2;
    }, 0);
}

function assignPointsToClusters(data, centroids) {
    return data.map(point => {
        let minDist = Infinity;
        let closestCluster = 0;
        
        centroids.forEach((centroid, index) => {
            const dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2);
            if (dist < minDist) {
                minDist = dist;
                closestCluster = index;
            }
        });
        
        return closestCluster;
    });
}

function updateCentroids(data, assignments, numClusters) {
    const newCentroids = [];
    
    for (let i = 0; i < numClusters; i++) {
        const clusterPoints = data.filter((_, index) => assignments[index] === i);
        
        if (clusterPoints.length > 0) {
            const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
            const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
            newCentroids.push({ x: avgX, y: avgY });
        } else {
            // Keep existing centroid if no points assigned
            newCentroids.push({ x: 0, y: 0 });
        }
    }
    
    return newCentroids;
}

function calculateWCSS(data, assignments, centroids) {
    return data.reduce((sum, point, index) => {
        const clusterIndex = assignments[index];
        const centroid = centroids[clusterIndex];
        const dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2);
        return sum + dist ** 2;
    }, 0);
}

function calculateStability(wcssValues) {
    if (wcssValues.length <= 1) return 0;
    
    const mean = wcssValues.reduce((a, b) => a + b, 0) / wcssValues.length;
    const variance = wcssValues.reduce((sum, val) => sum + (val - mean) ** 2, 0) / wcssValues.length;
    const stdDev = Math.sqrt(variance);
    
    return mean > 0 ? (1 - stdDev / mean) : 0; // Higher is more stable
}

function drawInitClusteringResults(canvas, data, results, selectedMethod) {
    const width = 400;
    const height = 300;
    const margin = 40;
    
    // Clear canvas
    canvas.innerHTML = '';
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    
    // Draw data points
    data.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', '#666');
        circle.setAttribute('opacity', 0.6);
        svg.appendChild(circle);
    });
    
    // Draw centroids for selected method
    const methodResult = results[selectedMethod];
    if (methodResult && methodResult.centroids) {
        methodResult.centroids.forEach((centroid, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', centroid.x);
            circle.setAttribute('cy', centroid.y);
            circle.setAttribute('r', 8);
            circle.setAttribute('fill', `hsl(${index * 120}, 70%, 50%)`);
            circle.setAttribute('stroke', '#000');
            circle.setAttribute('stroke-width', 2);
            svg.appendChild(circle);
            
            // Add centroid label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', centroid.x);
            text.setAttribute('y', centroid.y - 15);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = `C${index + 1}`;
            svg.appendChild(text);
        });
    }
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 20);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.textContent = `${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Initialization`;
    svg.appendChild(title);
    
    canvas.appendChild(svg);
}

function drawInitConvergenceComparison(canvas, results) {
    const width = 400;
    const height = 300;
    const margin = 40;
    
    // Clear canvas
    canvas.innerHTML = '';
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    
    // Get all convergence data
    const methods = Object.keys(results);
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
    
    // Find global max/min for scaling
    let maxIterations = 0;
    let maxWCSS = 0;
    let minWCSS = Infinity;
    
    methods.forEach(method => {
        const convergence = results[method].convergence[0];
        if (convergence && convergence.length > 0) {
            maxIterations = Math.max(maxIterations, convergence.length);
            maxWCSS = Math.max(maxWCSS, ...convergence);
            minWCSS = Math.min(minWCSS, ...convergence);
        }
    });
    
    // Draw convergence lines
    methods.forEach((method, methodIndex) => {
        const convergence = results[method].convergence[0];
        if (!convergence || convergence.length === 0) return;
        
        // Draw convergence line
        let pathData = '';
        convergence.forEach((wcss, iteration) => {
            const x = margin + (iteration / Math.max(convergence.length - 1, 1)) * (width - 2 * margin);
            const y = height - margin - ((wcss - minWCSS) / (maxWCSS - minWCSS)) * (height - 2 * margin);
            
            if (iteration === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        });
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', colors[methodIndex % colors.length]);
        path.setAttribute('stroke-width', 2);
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
        
        // Add legend
        const legendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        legendText.setAttribute('x', width - 100);
        legendText.setAttribute('y', 40 + methodIndex * 20);
        legendText.setAttribute('font-size', '12');
        legendText.setAttribute('fill', colors[methodIndex % colors.length]);
        legendText.textContent = method;
        svg.appendChild(legendText);
    });
    
    // Add axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin);
    xAxis.setAttribute('y1', height - margin);
    xAxis.setAttribute('x2', width - margin);
    xAxis.setAttribute('y2', height - margin);
    xAxis.setAttribute('stroke', '#000');
    xAxis.setAttribute('stroke-width', 1);
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin);
    yAxis.setAttribute('y1', margin);
    yAxis.setAttribute('x2', margin);
    yAxis.setAttribute('y2', height - margin);
    yAxis.setAttribute('stroke', '#000');
    yAxis.setAttribute('stroke-width', 1);
    svg.appendChild(yAxis);
    
    // Add labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', width / 2);
    xLabel.setAttribute('y', height - 10);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '12');
    xLabel.textContent = 'Iterations';
    svg.appendChild(xLabel);
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', 15);
    yLabel.setAttribute('y', height / 2);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('font-size', '12');
    yLabel.setAttribute('transform', `rotate(-90, 15, ${height / 2})`);
    yLabel.textContent = 'WCSS';
    svg.appendChild(yLabel);
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 20);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Convergence Comparison';
    svg.appendChild(title);
    
    canvas.appendChild(svg);
}

function updateInitMetrics(results, selectedMethod) {
    const methodResult = results[selectedMethod];
    if (!methodResult) return;
    
    // Update metric displays if they exist
    const wcssElement = document.getElementById('init-wcss');
    const iterationsElement = document.getElementById('init-iterations');
    const stabilityElement = document.getElementById('init-stability');
    
    if (wcssElement) {
        wcssElement.textContent = methodResult.finalWCSS.toFixed(2);
    }
    
    if (iterationsElement) {
        iterationsElement.textContent = methodResult.iterations;
    }
    
    if (stabilityElement) {
        stabilityElement.textContent = (methodResult.stability * 100).toFixed(1) + '%';
    }
}

