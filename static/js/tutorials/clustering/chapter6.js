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
    if (canvas) {
        canvas.innerHTML = '<text x="200" y="150" text-anchor="middle">Initialization methods comparison</text>';
    }
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

