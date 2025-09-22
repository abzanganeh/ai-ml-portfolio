// Chapter 11: DBSCAN - Density-Based Clustering
// JavaScript functionality for DBSCAN interactive demos and navigation

let quizAnswers = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 11: DBSCAN loaded');
    
    // Initialize interactive demos
    initializeDBSCANDemo();
    updateParameters();
    updateLiveDemo();
});

// DBSCAN Demo Functions
function initializeDBSCANDemo() {
    console.log('DBSCAN demo initialization');
    // Demo will be initialized when user interacts with controls
}

function updateParameters() {
    const epsilon = document.getElementById('epsilon-demo')?.value;
    const minpts = document.getElementById('minpts-demo')?.value;
    
    if (epsilon && minpts) {
        document.getElementById('epsilon-value').textContent = epsilon;
        document.getElementById('minpts-value').textContent = minpts;
        
        // Simulate clustering results based on parameters
        const clusters = Math.max(1, Math.floor(4 - epsilon * 2 + minpts * 0.2));
        const noise = Math.floor(epsilon * 10 + (15 - minpts) * 2);
        const silhouette = Math.max(0.1, Math.min(0.9, 0.8 - Math.abs(epsilon - 0.5) - Math.abs(minpts - 5) * 0.05));
        
        document.getElementById('param-clusters').textContent = clusters;
        document.getElementById('param-noise').textContent = noise;
        document.getElementById('param-silhouette').textContent = silhouette.toFixed(2);
    }
}

function updateLiveDemo() {
    const epsilon = document.getElementById('live-epsilon')?.value;
    const minpts = document.getElementById('live-minpts')?.value;
    const dataset = document.getElementById('dataset-select')?.value;
    
    if (epsilon && minpts) {
        document.getElementById('live-epsilon-val').textContent = epsilon;
        document.getElementById('live-minpts-val').textContent = minpts;
        
        // Simulate live clustering updates
        const clusters = Math.max(1, Math.floor(5 - epsilon * 3 + minpts * 0.3));
        const core = Math.floor(75 - epsilon * 20 + minpts * 3);
        const border = Math.floor(30 - epsilon * 5 + minpts * 1);
        const noise = Math.floor(epsilon * 15 + (10 - minpts) * 1.5);
        
        document.getElementById('live-clusters').textContent = clusters;
        document.getElementById('live-core').textContent = Math.max(0, core);
        document.getElementById('live-border').textContent = Math.max(0, border);
        document.getElementById('live-noise').textContent = Math.max(0, noise);
        
        // Generate visualization
        generateDBSCANVisualization(dataset, parseFloat(epsilon), parseInt(minpts));
    }
}

function changeDataset() {
    const dataset = document.getElementById('dataset-select')?.value;
    if (dataset) {
        console.log('Dataset changed to:', dataset);
        updateLiveDemo();
    }
}

function generateDBSCANVisualization(dataset, epsilon, minpts) {
    const canvas = document.getElementById('dbscan-demo-canvas');
    if (!canvas) return;
    
    // Clear previous visualization
    canvas.innerHTML = '';
    
    // Create SVG for visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    svg.style.borderRadius = '8px';
    
    // Generate data points based on dataset type
    const points = generateDataset(dataset);
    
    // Simulate DBSCAN clustering
    const clusters = simulateDBSCAN(points, epsilon, minpts);
    
    // Draw points
    points.forEach((point, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', clusters[index].type === 'core' ? '6' : clusters[index].type === 'border' ? '4' : '3');
        
        if (clusters[index].type === 'noise') {
            circle.setAttribute('fill', '#ff6b6b');
            circle.setAttribute('opacity', '0.7');
        } else {
            const colors = ['#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
            circle.setAttribute('fill', colors[clusters[index].cluster % colors.length]);
            circle.setAttribute('opacity', '0.8');
        }
        
        svg.appendChild(circle);
    });
    
    // Draw epsilon circles around some core points
    clusters.forEach((cluster, index) => {
        if (cluster.type === 'core' && Math.random() < 0.3) {
            const point = points[index];
            const epsilonCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            epsilonCircle.setAttribute('cx', point.x);
            epsilonCircle.setAttribute('cy', point.y);
            epsilonCircle.setAttribute('r', epsilon * 50); // Scale epsilon for visualization
            epsilonCircle.setAttribute('fill', 'none');
            epsilonCircle.setAttribute('stroke', '#666');
            epsilonCircle.setAttribute('stroke-width', '1');
            epsilonCircle.setAttribute('stroke-dasharray', '5,5');
            epsilonCircle.setAttribute('opacity', '0.5');
            svg.appendChild(epsilonCircle);
        }
    });
    
    canvas.appendChild(svg);
}

function generateDataset(type) {
    const points = [];
    const numPoints = 80;
    
    switch (type) {
        case 'blobs':
            // Spherical clusters
            for (let i = 0; i < numPoints; i++) {
                const cluster = Math.floor(Math.random() * 3);
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * 30;
                points.push({
                    x: 100 + cluster * 100 + Math.cos(angle) * radius,
                    y: 100 + Math.sin(angle) * radius + (Math.random() - 0.5) * 20
                });
            }
            break;
        case 'moons':
            // Two moons
            for (let i = 0; i < numPoints / 2; i++) {
                const angle = Math.random() * Math.PI;
                const radius = 40 + Math.random() * 20;
                points.push({
                    x: 100 + Math.cos(angle) * radius,
                    y: 100 + Math.sin(angle) * radius
                });
                points.push({
                    x: 200 + Math.cos(angle + Math.PI) * radius,
                    y: 150 + Math.sin(angle + Math.PI) * radius
                });
            }
            break;
        case 'circles':
            // Concentric circles
            for (let i = 0; i < numPoints; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() < 0.5 ? 30 + Math.random() * 10 : 60 + Math.random() * 10;
                points.push({
                    x: 200 + Math.cos(angle) * radius,
                    y: 150 + Math.sin(angle) * radius
                });
            }
            break;
        case 'irregular':
            // Irregular shapes
            for (let i = 0; i < numPoints; i++) {
                const cluster = Math.floor(Math.random() * 2);
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * 40;
                const x = cluster === 0 ? 120 : 280;
                const y = cluster === 0 ? 120 : 180;
                points.push({
                    x: x + Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
                    y: y + Math.sin(angle) * radius + (Math.random() - 0.5) * 20
                });
            }
            break;
    }
    
    return points;
}

function simulateDBSCAN(points, epsilon, minpts) {
    const clusters = [];
    const epsilonScaled = epsilon * 50; // Scale epsilon for visualization
    
    // Simple DBSCAN simulation
    for (let i = 0; i < points.length; i++) {
        const neighbors = [];
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const dist = Math.sqrt(
                    Math.pow(points[i].x - points[j].x, 2) + 
                    Math.pow(points[i].y - points[j].y, 2)
                );
                if (dist <= epsilonScaled) {
                    neighbors.push(j);
                }
            }
        }
        
        if (neighbors.length >= minpts) {
            clusters.push({ type: 'core', cluster: Math.floor(i / 10) });
        } else if (neighbors.length > 0) {
            clusters.push({ type: 'border', cluster: Math.floor(i / 10) });
        } else {
            clusters.push({ type: 'noise', cluster: -1 });
        }
    }
    
    return clusters;
}

// Quiz Functions
function checkAnswer(questionNum, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const resultDiv = document.getElementById(`q${questionNum}-result`);
    
    if (!selectedAnswer) {
        resultDiv.innerHTML = '<p style="color: orange;">Please select an answer first.</p>';
        return;
    }
    
    const isCorrect = selectedAnswer.value === correctAnswer;
    quizAnswers[questionNum] = isCorrect;
    
    if (isCorrect) {
        resultDiv.innerHTML = '<p style="color: green;">✓ Correct!</p>';
    } else {
        resultDiv.innerHTML = '<p style="color: red;">✗ Incorrect. Try again!</p>';
    }
    
    updateQuizScore();
}

function updateQuizScore() {
    const correct = Object.values(quizAnswers).filter(answer => answer).length;
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = correct;
    }
}

function resetQuiz() {
    quizAnswers = {};
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
}

// New Quiz functionality (Chapter 15 style)
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'b',
        'q2': 'b', 
        'q3': 'c'
    };

    const explanations = {
        'q1': 'A core point must have at least MinPts points (including itself) within its ε-neighborhood. This defines the minimum density required for a point to be considered part of a dense region.',
        'q2': 'The k-distance graph method plots sorted k-distances and looks for the knee or elbow point, which represents the optimal density threshold where the curve changes from steep to flat.',
        'q3': 'While DBSCAN has many advantages, computational complexity is not always lower than K-means. DBSCAN\'s complexity is O(n log n) with spatial indexing, while K-means is O(nkdi) where k is the number of clusters and i is iterations.'
    };

    // Collect user answers
    let userAnswers = {};
    let score = 0;
    
    for (let i = 1; i <= 3; i++) {
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
    const percentage = Math.round((score / 3) * 100);
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
        `Score: ${score}/3 (${percentage}%) - ${performanceLevel}`;

    // Show detailed results
    let detailedHTML = '<h4>Detailed Results:</h4>';
    for (let i = 1; i <= 3; i++) {
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

