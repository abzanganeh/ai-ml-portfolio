// Chapter 12: Gaussian Mixture Models - Interactive Demo and Quiz Functions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chapter 12 specific functionality
    initializeChapter12();
});

function initializeChapter12() {
    // Initialize GMM demo
    updateGMMDemo();
    
    // Initialize quiz
    resetQuiz();
}

// GMM Demo Functions
function updateGMMDemo() {
    const components = document.getElementById('gmm-components').value;
    const dataset = document.getElementById('gmm-dataset').value;
    const covType = document.getElementById('covariance-type').value;
    
    if (document.getElementById('gmm-comp-val')) {
        document.getElementById('gmm-comp-val').textContent = components;
    }
    
    // Simulate model metrics based on parameters
    const loglik = -1200 - (parseInt(components) - 3) * 50 + Math.random() * 100;
    const params = calculateGMMParams(parseInt(components), 2, covType);
    const aic = -2 * loglik + 2 * params;
    const bic = -2 * loglik + params * Math.log(500);
    
    if (document.getElementById('gmm-loglik')) {
        document.getElementById('gmm-loglik').textContent = loglik.toFixed(1);
    }
    if (document.getElementById('gmm-aic')) {
        document.getElementById('gmm-aic').textContent = aic.toFixed(1);
    }
    if (document.getElementById('gmm-bic')) {
        document.getElementById('gmm-bic').textContent = bic.toFixed(1);
    }
    if (document.getElementById('gmm-params')) {
        document.getElementById('gmm-params').textContent = params;
    }
}

function calculateGMMParams(K, d, covType) {
    const mixingWeights = K - 1;
    const means = K * d;
    let covariances;
    
    switch(covType) {
        case 'full': covariances = K * d * (d + 1) / 2; break;
        case 'diagonal': covariances = K * d; break;
        case 'spherical': covariances = K; break;
        case 'tied': covariances = d * (d + 1) / 2; break;
        default: covariances = K * d * (d + 1) / 2;
    }
    
    return mixingWeights + means + covariances;
}

// EM Algorithm Demo Functions
function startEM() {
    if (document.getElementById('em-status')) {
        document.getElementById('em-status').textContent = 'Running';
    }
    if (document.getElementById('em-iteration')) {
        document.getElementById('em-iteration').textContent = '1';
    }
    if (document.getElementById('em-loglik')) {
        document.getElementById('em-loglik').textContent = '-1456.2';
    }
    if (document.getElementById('em-change')) {
        document.getElementById('em-change').textContent = 'N/A';
    }
    
    // Create initial EM visualization
    createEMVisualization(1, -1456.2);
}

function stepEM() {
    const current = parseInt(document.getElementById('em-iteration').textContent) || 0;
    const newIter = current + 1;
    const loglik = -1500 + newIter * 10 + Math.random() * 5;
    const change = current > 0 ? (Math.random() * 10).toFixed(2) : 'N/A';
    
    if (document.getElementById('em-iteration')) {
        document.getElementById('em-iteration').textContent = newIter;
    }
    if (document.getElementById('em-loglik')) {
        document.getElementById('em-loglik').textContent = loglik.toFixed(1);
    }
    if (document.getElementById('em-change')) {
        document.getElementById('em-change').textContent = change;
    }
    if (document.getElementById('em-status')) {
        document.getElementById('em-status').textContent = newIter > 15 ? 'Converged' : 'Running';
    }
    
    // Update EM visualization
    createEMVisualization(newIter, loglik);
}

function resetEM() {
    if (document.getElementById('em-iteration')) {
        document.getElementById('em-iteration').textContent = '0';
    }
    if (document.getElementById('em-loglik')) {
        document.getElementById('em-loglik').textContent = '-';
    }
    if (document.getElementById('em-change')) {
        document.getElementById('em-change').textContent = '-';
    }
    if (document.getElementById('em-status')) {
        document.getElementById('em-status').textContent = 'Ready';
    }
    
    // Reset EM visualization to placeholder
    const container = document.getElementById('em-demo-canvas');
    if (container) {
        container.innerHTML = `
            <h4>EM Algorithm Progress</h4>
            <p>Watch clusters evolve through iterations</p>
        `;
    }
}

// Quiz Functions
let quizAnswers = {};

function checkAnswer(questionNum, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const resultDiv = document.getElementById(`q${questionNum}-result`);
    
    if (!selectedAnswer) {
        if (resultDiv) {
            resultDiv.innerHTML = '<p style="color: #ff6b6b;">Please select an answer first.</p>';
        }
        return;
    }
    
    const isCorrect = selectedAnswer.value === correctAnswer;
    quizAnswers[questionNum] = isCorrect;
    
    if (resultDiv) {
        if (isCorrect) {
            resultDiv.innerHTML = '<p style="color: #51cf66;">✓ Correct! Well done.</p>';
        } else {
            resultDiv.innerHTML = '<p style="color: #ff6b6b;">✗ Incorrect. The correct answer is ' + correctAnswer.toUpperCase() + '.</p>';
        }
    }
    
    updateQuizScore();
}

function updateQuizScore() {
    const score = Object.values(quizAnswers).filter(Boolean).length;
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

function resetQuiz() {
    // Clear all radio button selections
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Clear all result messages
    for (let i = 1; i <= 5; i++) {
        const resultDiv = document.getElementById(`q${i}-result`);
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    }
    
    // Reset quiz answers and score
    quizAnswers = {};
    updateQuizScore();
}

// Generate GMM visualization
window.generateGMMVisualization = function() {
    console.log('generateGMMVisualization called');
    const components = document.getElementById('gmm-components').value;
    const dataset = document.getElementById('gmm-dataset').value;
    const covType = document.getElementById('covariance-type').value;
    
    createGMMVisualization(parseInt(components), dataset, covType);
};

// Reset GMM demo
window.resetGMMDemo = function() {
    console.log('resetGMMDemo called');
    // Reset to default values
    document.getElementById('gmm-components').value = '3';
    document.getElementById('gmm-dataset').value = 'blobs';
    document.getElementById('covariance-type').value = 'full';
    
    // Update display
    window.updateGMMDemo();
    
    // Reset visualization to placeholder
    const container = document.getElementById('gmm-demo-canvas');
    if (container) {
        container.innerHTML = `
            <h4>Interactive GMM Visualization</h4>
            <p>Shows probability contours, data points with soft assignments</p>
            <p><em>Ellipses show 1σ, 2σ confidence regions • Point transparency indicates membership probability</em></p>
        `;
    }
};

// Create GMM visualization
function createGMMVisualization(components, dataset, covType) {
    const container = document.getElementById('gmm-demo-canvas');
    if (!container) {
        console.log('GMM demo container not found');
        return;
    }
    
    console.log('Creating GMM visualization for:', components, dataset, covType);
    
    // Generate sample data points
    const dataResult = generateGMMData(dataset, components);
    const dataPoints = dataResult.points;
    const gaussians = dataResult.gaussians;
    
    // Create SVG visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    svg.style.borderRadius = '8px';
    
    // Draw data points with soft assignments
    dataPoints.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x * 400);
        circle.setAttribute('cy', point.y * 300);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', point.color);
        circle.setAttribute('opacity', point.opacity);
        svg.appendChild(circle);
    });
    
    // Draw Gaussian ellipses
    gaussians.forEach(gaussian => {
        const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ellipse.setAttribute('cx', gaussian.center[0] * 400);
        ellipse.setAttribute('cy', gaussian.center[1] * 300);
        ellipse.setAttribute('rx', gaussian.radius[0] * 400);
        ellipse.setAttribute('ry', gaussian.radius[1] * 300);
        ellipse.setAttribute('fill', 'none');
        ellipse.setAttribute('stroke', gaussian.color);
        ellipse.setAttribute('stroke-width', '2');
        ellipse.setAttribute('opacity', '0.6');
        svg.appendChild(ellipse);
    });
    
    // Replace container content with SVG
    container.innerHTML = '';
    container.appendChild(svg);
    
    console.log('GMM visualization created with', dataPoints.length, 'data points');
}

// Generate sample data for GMM
function generateGMMData(dataset, components) {
    const points = [];
    const gaussians = [];
    
    if (dataset === 'blobs') {
        // Well-separated Gaussian blobs
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < components; i++) {
            const center = [
                0.2 + (i * 0.6 / Math.max(1, components - 1)),
                0.3 + Math.sin(i * Math.PI / components) * 0.3
            ];
            const radius = [0.08, 0.06];
            
            gaussians.push({
                center: center,
                radius: radius,
                color: colors[i % colors.length]
            });
            
            // Generate points for this component
            for (let j = 0; j < 20; j++) {
                const x = center[0] + (Math.random() - 0.5) * radius[0] * 2;
                const y = center[1] + (Math.random() - 0.5) * radius[1] * 2;
                const opacity = 0.6 + Math.random() * 0.4; // Soft assignment
                
                points.push({
                    x: x,
                    y: y,
                    color: colors[i % colors.length],
                    opacity: opacity
                });
            }
        }
    } else if (dataset === 'overlapping') {
        // Overlapping clusters
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
        
        for (let i = 0; i < Math.min(components, 3); i++) {
            const center = [0.3 + i * 0.2, 0.4 + i * 0.1];
            const radius = [0.1, 0.08];
            
            gaussians.push({
                center: center,
                radius: radius,
                color: colors[i]
            });
            
            for (let j = 0; j < 25; j++) {
                const x = center[0] + (Math.random() - 0.5) * radius[0] * 2;
                const y = center[1] + (Math.random() - 0.5) * radius[1] * 2;
                const opacity = 0.4 + Math.random() * 0.6; // More uncertainty
                
                points.push({
                    x: x,
                    y: y,
                    color: colors[i],
                    opacity: opacity
                });
            }
        }
    } else { // noisy
        // Noisy scattered data
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
        
        for (let i = 0; i < components; i++) {
            const center = [
                0.1 + Math.random() * 0.8,
                0.1 + Math.random() * 0.8
            ];
            const radius = [0.05 + Math.random() * 0.05, 0.05 + Math.random() * 0.05];
            
            gaussians.push({
                center: center,
                radius: radius,
                color: colors[i % colors.length]
            });
            
            for (let j = 0; j < 15; j++) {
                const x = center[0] + (Math.random() - 0.5) * radius[0] * 3;
                const y = center[1] + (Math.random() - 0.5) * radius[1] * 3;
                const opacity = 0.3 + Math.random() * 0.7; // High uncertainty
                
                points.push({
                    x: x,
                    y: y,
                    color: colors[i % colors.length],
                    opacity: opacity
                });
            }
        }
    }
    
    return { points: points, gaussians: gaussians };
}

// Global variable to store fixed data points for EM demo
let emDemoData = null;

// Create EM Algorithm Visualization
function createEMVisualization(iteration, loglikelihood) {
    const container = document.getElementById('em-demo-canvas');
    if (!container) {
        console.log('EM demo container not found');
        return;
    }
    
    console.log('Creating EM visualization for iteration:', iteration, 'loglikelihood:', loglikelihood);
    
    // Create SVG visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    svg.style.borderRadius = '8px';
    
    // Generate fixed data points only once (on first call or reset)
    if (!emDemoData) {
        emDemoData = generateFixedEMData();
    }
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    
    // Draw the same data points with evolving cluster assignments
    emDemoData.forEach((point, i) => {
        // Simulate EM convergence - cluster assignments become clearer over iterations
        const clusterId = point.trueCluster;
        
        // Simulate uncertainty reduction as EM converges
        const uncertainty = Math.max(0.1, 0.8 - (iteration * 0.05));
        const opacity = Math.min(0.3 + (iteration * 0.05), 0.9);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', colors[clusterId]);
        circle.setAttribute('opacity', opacity);
        svg.appendChild(circle);
    });
    
    // Draw cluster centers that move during EM iterations
    const centerPositions = [
        [100, 100],
        [200, 120],
        [300, 100]
    ];
    
    centerPositions.forEach((center, index) => {
        // Simulate center movement during EM
        const offsetX = Math.sin(iteration * 0.3) * 10;
        const offsetY = Math.cos(iteration * 0.2) * 5;
        
        const centerX = center[0] + offsetX;
        const centerY = center[1] + offsetY;
        
        // Draw cluster center
        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', centerX);
        centerCircle.setAttribute('cy', centerY);
        centerCircle.setAttribute('r', '8');
        centerCircle.setAttribute('fill', colors[index]);
        centerCircle.setAttribute('stroke', '#333');
        centerCircle.setAttribute('stroke-width', '2');
        svg.appendChild(centerCircle);
        
        // Draw center label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', centerX);
        text.setAttribute('y', centerY - 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', '#333');
        text.textContent = `μ${index + 1}`;
        svg.appendChild(text);
    });
    
    // Add iteration and loglikelihood info
    const infoText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    infoText.setAttribute('x', '20');
    infoText.setAttribute('y', '30');
    infoText.setAttribute('font-size', '14');
    infoText.setAttribute('font-weight', 'bold');
    infoText.setAttribute('fill', '#333');
    infoText.textContent = `Iteration ${iteration} | Log-likelihood: ${loglikelihood.toFixed(1)}`;
    svg.appendChild(infoText);
    
    // Replace container content with SVG
    container.innerHTML = '';
    container.appendChild(svg);
    
    console.log('EM visualization created for iteration', iteration);
}

// Export functions to global scope for onclick handlers
window.updateGMMDemo = updateGMMDemo;
window.startEM = startEM;
window.stepEM = stepEM;
window.resetEM = resetEM;
window.checkAnswer = checkAnswer;
window.resetQuiz = resetQuiz;
