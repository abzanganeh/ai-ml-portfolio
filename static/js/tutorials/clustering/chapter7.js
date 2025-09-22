// Chapter 7: Distance Metrics and Similarity
// Interactive Demo JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDistanceDemo();
});

// Demo functions for HTML onclick compatibility
function runInitializationDemo() {
    const canvas = document.getElementById('distance-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Distance metrics demo would appear here</p>';
    }
}

function resetInitializationDemo() {
    const canvas = document.getElementById('distance-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Run Demo" to see distance comparison</p>';
    }
}

// Initialize distance metrics demo
function initializeDistanceDemo() {
    const generateBtn = document.getElementById('generate-distance-demo');
    const metricSelect = document.getElementById('distance-metric');
    const datasetSelect = document.getElementById('dataset-type');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateDistanceVisualization();
        });
    }

    if (metricSelect) {
        metricSelect.addEventListener('change', function() {
            generateDistanceVisualization();
        });
    }

    if (datasetSelect) {
        datasetSelect.addEventListener('change', function() {
            generateDistanceVisualization();
        });
    }

    // Generate initial visualization
    generateDistanceVisualization();
}

// Generate distance metrics visualization
function generateDistanceVisualization() {
    const metric = document.getElementById('distance-metric')?.value || 'euclidean';
    const datasetType = document.getElementById('dataset-type')?.value || 'blobs';
    
    // Generate data points
    const dataPoints = generateDataset(datasetType);
    
    // Draw data points
    drawDataPoints(dataPoints);
    
    // Calculate and display distances
    calculateAndDisplayDistances(dataPoints, metric);
}

// Generate different types of datasets
function generateDataset(type) {
    switch (type) {
        case 'blobs':
            return generateBlobClusters();
        case 'linear':
            return generateLinearData();
        case 'categorical':
            return generateCategoricalData();
        case 'mixed':
            return generateMixedData();
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
        for (let j = 0; j < 15; j++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * 1.5;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            points.push({ x, y, cluster: i, label: `Point ${points.length + 1}` });
        }
    });
    
    return points;
}

function generateLinearData() {
    const points = [];
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 8;
        const y = 0.5 * x + Math.random() * 2 - 1; // Linear relationship with noise
        points.push({ x, y, cluster: 0, label: `Point ${i + 1}` });
    }
    return points;
}

function generateCategoricalData() {
    const points = [];
    const categories = ['A', 'B', 'C'];
    for (let i = 0; i < 30; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const x = Math.random() * 8;
        const y = Math.random() * 8;
        points.push({ x, y, category, cluster: 0, label: `Point ${i + 1}` });
    }
    return points;
}

function generateMixedData() {
    const points = [];
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 8;
        const y = Math.random() * 8;
        const category = Math.random() > 0.5 ? 'Type1' : 'Type2';
        points.push({ x, y, category, cluster: 0, label: `Point ${i + 1}` });
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
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.fillText(point.label, x + 6, y - 6);
    });
}

// Calculate and display distances
function calculateAndDisplayDistances(points, metric) {
    const distanceContainer = document.getElementById('distance-results');
    if (!distanceContainer) return;
    
    let html = '<h4>Distance Calculations:</h4>';
    html += '<div class="distance-grid">';
    
    // Calculate distances between first few points
    const numPoints = Math.min(5, points.length);
    for (let i = 0; i < numPoints; i++) {
        for (let j = i + 1; j < numPoints; j++) {
            const distance = calculateDistance(points[i], points[j], metric);
            html += `
                <div class="distance-item">
                    <strong>${points[i].label} ↔ ${points[j].label}:</strong>
                    <span class="distance-value">${distance.toFixed(3)}</span>
                </div>
            `;
        }
    }
    
    html += '</div>';
    
    // Add metric information
    html += `<div class="metric-info">
        <h5>Metric: ${getMetricName(metric)}</h5>
        <p>${getMetricDescription(metric)}</p>
    </div>`;
    
    distanceContainer.innerHTML = html;
}

// Calculate distance between two points
function calculateDistance(point1, point2, metric) {
    switch (metric) {
        case 'euclidean':
            return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
        case 'manhattan':
            return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
        case 'minkowski':
            const p = 3; // Minkowski parameter
            return Math.pow(Math.pow(Math.abs(point1.x - point2.x), p) + Math.pow(Math.abs(point1.y - point2.y), p), 1/p);
        case 'cosine':
            const dotProduct = point1.x * point2.x + point1.y * point2.y;
            const magnitude1 = Math.sqrt(point1.x ** 2 + point1.y ** 2);
            const magnitude2 = Math.sqrt(point2.x ** 2 + point2.y ** 2);
            return 1 - (dotProduct / (magnitude1 * magnitude2));
        case 'chebyshev':
            return Math.max(Math.abs(point1.x - point2.x), Math.abs(point1.y - point2.y));
        default:
            return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    }
}

// Get metric name
function getMetricName(metric) {
    const names = {
        'euclidean': 'Euclidean Distance',
        'manhattan': 'Manhattan Distance',
        'minkowski': 'Minkowski Distance (p=3)',
        'cosine': 'Cosine Distance',
        'chebyshev': 'Chebyshev Distance'
    };
    return names[metric] || 'Unknown Metric';
}

// Get metric description
function getMetricDescription(metric) {
    const descriptions = {
        'euclidean': 'Straight-line distance between two points. Most common for continuous numerical data.',
        'manhattan': 'Sum of absolute differences. Good for data with outliers and categorical-like behavior.',
        'minkowski': 'Generalization of Euclidean and Manhattan distances. Parameter p controls the shape.',
        'cosine': 'Measures the angle between vectors. Good for high-dimensional data and text analysis.',
        'chebyshev': 'Maximum difference across all dimensions. Useful for chess-like movements.'
    };
    return descriptions[metric] || 'No description available.';
}

// Quiz functionality
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'a',
        'q2': 'b', 
        'q3': 'c',
        'q4': 'a',
        'q5': 'b'
    };

    const explanations = {
        'q1': 'Euclidean distance is calculated as the square root of the sum of squared differences between corresponding coordinates.',
        'q2': 'Manhattan distance is calculated as the sum of absolute differences between corresponding coordinates.',
        'q3': 'Cosine similarity measures the angle between vectors, making it useful for high-dimensional data and text analysis.',
        'q4': 'Minkowski distance is a generalization that includes Euclidean (p=2) and Manhattan (p=1) as special cases.',
        'q5': 'The choice of distance metric significantly affects clustering results, as different metrics capture different notions of similarity.'
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

