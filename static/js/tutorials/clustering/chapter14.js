// Chapter 14: Clustering Evaluation - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 14: Clustering Evaluation loaded');
    
    // Initialize demo functionality
    initializeDemo();
});

// ===== CHAPTER 14 DEMO FUNCTIONS =====

// Initialize demo when page loads
function initializeDemo() {
    console.log('Initializing Chapter 14 evaluation demo...');
    updateEvalDemo();
    updateStabilityDemo();
    updateSelectionDemo();
}

// Update evaluation demo
function updateEvalDemo() {
    const dataset = document.getElementById('eval-dataset');
    const algorithm = document.getElementById('eval-algorithm');
    const clusters = document.getElementById('eval-clusters');
    
    if (!dataset || !algorithm || !clusters) return;
    
    document.getElementById('eval-k-val').textContent = clusters.value;
    
    // Simulate metric values based on scenario
    const scenarios = {
        'wellseparated': { sil: 0.65, db: 1.23, ch: 245.7, dunn: 0.42, interp: 'Good clustering quality with well-separated, compact clusters.' },
        'overlapping': { sil: 0.35, db: 1.85, ch: 125.2, dunn: 0.22, interp: 'Moderate quality with some cluster overlap.' },
        'different-sizes': { sil: 0.48, db: 1.52, ch: 198.7, dunn: 0.31, interp: 'Good separation but unbalanced cluster sizes.' },
        'noisy': { sil: 0.25, db: 2.18, ch: 96.4, dunn: 0.18, interp: 'Lower quality due to noise interference.' }
    };
    
    const scenario = scenarios[dataset.value];
    const algEffect = algorithm.value === 'dbscan' ? 1.1 : algorithm.value === 'gmm' ? 0.95 : algorithm.value === 'hierarchical' ? 1.05 : 1.0;
    
    document.getElementById('eval-silhouette').textContent = (scenario.sil * algEffect).toFixed(2);
    document.getElementById('eval-db').textContent = (scenario.db / algEffect).toFixed(2);
    document.getElementById('eval-ch').textContent = (scenario.ch * algEffect).toFixed(1);
    document.getElementById('eval-dunn').textContent = (scenario.dunn * algEffect).toFixed(2);
    document.getElementById('eval-interpretation').textContent = scenario.interp;
    
    // Create visualization
    createEvalVisualization(dataset.value, algorithm.value, parseInt(clusters.value));
}

// Update stability demo
function updateStabilityDemo() {
    const runs = document.getElementById('stability-runs');
    const level = document.getElementById('stability-level');
    
    if (!runs || !level) return;
    
    document.getElementById('stability-runs-val').textContent = runs.value;
    document.getElementById('stability-level-val').textContent = level.value;
}

// Run stability analysis
function runStabilityAnalysis() {
    const method = document.getElementById('stability-method').value;
    const runs = parseInt(document.getElementById('stability-runs').value);
    const level = parseFloat(document.getElementById('stability-level').value);
    
    // Simulate stability analysis results
    const baseARI = 0.78;
    const variation = level * 0.5;
    
    const meanARI = baseARI + (Math.random() - 0.5) * variation;
    const stdDev = variation * 0.3;
    const minARI = Math.max(0, meanARI - stdDev * 2);
    const maxARI = Math.min(1, meanARI + stdDev * 2);
    
    document.getElementById('stability-mean').textContent = meanARI.toFixed(2);
    document.getElementById('stability-std').textContent = stdDev.toFixed(2);
    document.getElementById('stability-min').textContent = minARI.toFixed(2);
    document.getElementById('stability-max').textContent = maxARI.toFixed(2);
    
    const assessment = meanARI > 0.7 ? 'High stability - clustering is robust to perturbations.' :
                      meanARI > 0.5 ? 'Moderate stability - some sensitivity to perturbations.' :
                      'Low stability - clustering is sensitive to perturbations.';
    
    document.getElementById('stability-assessment').textContent = assessment;
    
    // Create visualization
    createStabilityVisualization();
}

// Update selection demo
function updateSelectionDemo() {
    const maxK = document.getElementById('max-k');
    const method = document.getElementById('selection-metric').value;
    const complexity = document.getElementById('selection-data').value;
    
    if (!maxK) return;
    
    document.getElementById('max-k-val').textContent = maxK.value;
    
    // Simulate parameter selection results
    const complexityFactors = {
        'simple': { optimal: 3, score: 0.85, confidence: 'High', alternatives: '2, 4' },
        'moderate': { optimal: 4, score: 0.73, confidence: 'High', alternatives: '3, 5' },
        'complex': { optimal: 6, score: 0.62, confidence: 'Medium', alternatives: '5, 7' }
    };
    
    const factor = complexityFactors[complexity];
    const methodEffect = method === 'gap' ? 1.0 : method === 'elbow' ? 0.95 : method === 'silhouette' ? 1.05 : 0.9;
    
    document.getElementById('selection-optimal').textContent = factor.optimal;
    document.getElementById('selection-score').textContent = (factor.score * methodEffect).toFixed(2);
    document.getElementById('selection-confidence').textContent = factor.confidence;
    document.getElementById('selection-alternative').textContent = factor.alternatives;
    
    // Create visualization
    createSelectionVisualization();
}

// Quiz functionality
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'b', 'q2': 'b', 'q3': 'b', 'q4': 'b', 'q5': 'b'
    };

    const explanations = {
        'q1': 'Silhouette coefficient ranges from -1 to 1, where values close to 1 indicate excellent clustering with well-separated, compact clusters.',
        'q2': 'The Davies-Bouldin Index measures cluster similarity - lower values indicate better separated, more distinct clusters.',
        'q3': 'External metrics require known ground truth labels to compare against. They provide the most reliable evaluation when available.',
        'q4': 'The Gap Statistic compares the within-cluster dispersion of actual data to that of reference (uniform) data to determine optimal cluster number.',
        'q5': 'High stability indicates that clustering results are consistent across different data samples, suggesting robust and reliable cluster structure.'
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
    let feedback = '';

    if (percentage >= 90) {
        performanceLevel = 'Excellent';
        feedback = 'Outstanding! You have mastered clustering evaluation concepts.';
    } else if (percentage >= 80) {
        performanceLevel = 'Very Good';
        feedback = 'Great job! You have strong understanding of evaluation metrics.';
    } else if (percentage >= 70) {
        performanceLevel = 'Good';
        feedback = 'Good understanding! Review the missed questions to improve.';
    } else if (percentage >= 60) {
        performanceLevel = 'Fair';
        feedback = 'Decent foundation, but review evaluation concepts.';
    } else {
        performanceLevel = 'Needs Improvement';
        feedback = 'Consider reviewing the evaluation metrics and their applications.';
    }

    const scoreColor = percentage >= 70 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336';
    
    document.getElementById('score-display').innerHTML = 
        `<div style="background: ${scoreColor}; color: white; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
            Score: ${score}/5 (${percentage}%) - ${performanceLevel}
            <br><small>${feedback}</small>
        </div>`;

    // Show detailed results
    let detailedHTML = '<h4>Detailed Answer Review:</h4>';
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

// ===== VISUALIZATION FUNCTIONS =====

// Create evaluation visualization
function createEvalVisualization(dataset, algorithm, k) {
    const container = document.getElementById('eval-visualization');
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = '1px solid #ddd';
    canvas.style.borderRadius = '8px';
    canvas.style.backgroundColor = '#fafafa';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Generate sample data based on dataset type
    const data = generateSampleData(dataset, k);
    
    // Draw the visualization
    drawClusteringVisualization(ctx, data, algorithm, k);
}

// Generate sample data for visualization
function generateSampleData(dataset, k) {
    const data = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    
    for (let i = 0; i < k; i++) {
        const cluster = [];
        const centerX = 100 + (i % 3) * 200;
        const centerY = 100 + Math.floor(i / 3) * 150;
        
        let spread = 30;
        let count = 50;
        
        // Adjust based on dataset type
        switch(dataset) {
            case 'wellseparated':
                spread = 25;
                count = 60;
                break;
            case 'overlapping':
                spread = 45;
                count = 40;
                break;
            case 'different-sizes':
                spread = 20 + i * 10;
                count = 30 + i * 20;
                break;
            case 'noisy':
                spread = 40;
                count = 35;
                break;
        }
        
        for (let j = 0; j < count; j++) {
            const x = centerX + (Math.random() - 0.5) * spread * 2;
            const y = centerY + (Math.random() - 0.5) * spread * 2;
            cluster.push({ x, y, cluster: i, color: colors[i % colors.length] });
        }
        
        data.push(...cluster);
    }
    
    // Add noise for noisy dataset
    if (dataset === 'noisy') {
        for (let i = 0; i < 20; i++) {
            data.push({
                x: Math.random() * 600,
                y: Math.random() * 400,
                cluster: -1,
                color: '#999'
            });
        }
    }
    
    return data;
}

// Draw clustering visualization
function drawClusteringVisualization(ctx, data, algorithm, k) {
    // Clear canvas
    ctx.clearRect(0, 0, 600, 400);
    
    // Draw background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, 600, 400);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 600; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 400);
        ctx.stroke();
    }
    for (let i = 0; i <= 400; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
    
    // Draw data points
    data.forEach(point => {
        ctx.fillStyle = point.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw cluster centers for k-means
    if (algorithm === 'kmeans') {
        const centers = calculateCenters(data, k);
        centers.forEach((center, i) => {
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw center label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(`C${i+1}`, center.x + 10, center.y - 10);
        });
    }
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${algorithm.toUpperCase()} Clustering (k=${k})`, 20, 30);
    
    // Draw legend
    ctx.font = '12px Arial';
    ctx.fillText('Dataset: ' + document.getElementById('eval-dataset').selectedOptions[0].text, 20, 50);
}

// Calculate cluster centers
function calculateCenters(data, k) {
    const centers = [];
    const clusters = {};
    
    // Group data by cluster
    data.forEach(point => {
        if (point.cluster >= 0) {
            if (!clusters[point.cluster]) {
                clusters[point.cluster] = [];
            }
            clusters[point.cluster].push(point);
        }
    });
    
    // Calculate centers
    for (let i = 0; i < k; i++) {
        if (clusters[i] && clusters[i].length > 0) {
            const centerX = clusters[i].reduce((sum, p) => sum + p.x, 0) / clusters[i].length;
            const centerY = clusters[i].reduce((sum, p) => sum + p.y, 0) / clusters[i].length;
            centers.push({ x: centerX, y: centerY });
        }
    }
    
    return centers;
}

// Create stability visualization
function createStabilityVisualization() {
    const container = document.getElementById('stability-visualization');
    if (!container) return;
    
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    canvas.style.border = '1px solid #ddd';
    canvas.style.borderRadius = '8px';
    canvas.style.backgroundColor = '#fafafa';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Generate stability data
    const runs = parseInt(document.getElementById('stability-runs').value);
    const level = parseFloat(document.getElementById('stability-level').value);
    
    const ariValues = [];
    for (let i = 0; i < runs; i++) {
        ariValues.push(0.6 + Math.random() * 0.3 + (Math.random() - 0.5) * level);
    }
    
    drawStabilityHistogram(ctx, ariValues);
}

// Draw stability histogram
function drawStabilityHistogram(ctx, values) {
    ctx.clearRect(0, 0, 500, 300);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, 500, 300);
    
    // Calculate histogram
    const bins = 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    const histogram = new Array(bins).fill(0);
    
    values.forEach(value => {
        const bin = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogram[bin]++;
    });
    
    const maxCount = Math.max(...histogram);
    
    // Draw histogram
    ctx.fillStyle = '#4ecdc4';
    histogram.forEach((count, i) => {
        const x = 50 + (i * 400) / bins;
        const height = (count / maxCount) * 200;
        const y = 250 - height;
        
        ctx.fillRect(x, y, 400 / bins - 2, height);
    });
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(450, 250);
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 250);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('ARI Values', 200, 290);
    
    ctx.save();
    ctx.translate(20, 150);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Frequency', 0, 0);
    ctx.restore();
    
    // Draw mean line
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const meanX = 50 + ((mean - min) / (max - min)) * 400;
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(meanX, 50);
    ctx.lineTo(meanX, 250);
    ctx.stroke();
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`Mean: ${mean.toFixed(3)}`, meanX + 5, 40);
}

// Create parameter selection visualization
function createSelectionVisualization() {
    const container = document.getElementById('selection-visualization');
    if (!container) return;
    
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    canvas.style.border = '1px solid #ddd';
    canvas.style.borderRadius = '8px';
    canvas.style.backgroundColor = '#fafafa';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    const maxK = parseInt(document.getElementById('max-k').value);
    const method = document.getElementById('selection-metric').value;
    
    drawParameterSelectionCurve(ctx, maxK, method);
}

// Draw parameter selection curve
function drawParameterSelectionCurve(ctx, maxK, method) {
    ctx.clearRect(0, 0, 500, 300);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, 500, 300);
    
    // Generate curve data
    const kValues = [];
    const scores = [];
    
    for (let k = 2; k <= maxK; k++) {
        kValues.push(k);
        let score;
        
        switch(method) {
            case 'gap':
                score = Math.exp(-Math.abs(k - 4) * 0.3) + Math.random() * 0.1;
                break;
            case 'elbow':
                score = 1 / (1 + Math.abs(k - 3) * 0.2) + Math.random() * 0.05;
                break;
            case 'silhouette':
                score = Math.exp(-Math.abs(k - 4) * 0.4) + Math.random() * 0.08;
                break;
            default:
                score = Math.random() * 0.5 + 0.3;
        }
        
        scores.push(score);
    }
    
    // Draw curve
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    kValues.forEach((k, i) => {
        const x = 50 + (i * 400) / (kValues.length - 1);
        const y = 250 - (scores[i] * 180);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#4ecdc4';
    kValues.forEach((k, i) => {
        const x = 50 + (i * 400) / (kValues.length - 1);
        const y = 250 - (scores[i] * 180);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(450, 250);
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 250);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Number of Clusters (k)', 200, 290);
    
    ctx.save();
    ctx.translate(20, 150);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${method.toUpperCase()} Score`, 0, 0);
    ctx.restore();
    
    // Highlight optimal k
    const optimalIndex = scores.indexOf(Math.max(...scores));
    const optimalX = 50 + (optimalIndex * 400) / (kValues.length - 1);
    const optimalY = 250 - (scores[optimalIndex] * 180);
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(optimalX, optimalY, 8, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`Optimal k = ${kValues[optimalIndex]}`, optimalX + 10, optimalY - 10);
}

// Make functions globally available
window.updateEvalDemo = updateEvalDemo;
window.updateStabilityDemo = updateStabilityDemo;
window.runStabilityAnalysis = runStabilityAnalysis;
window.updateSelectionDemo = updateSelectionDemo;
window.checkQuizAnswers = checkQuizAnswers;