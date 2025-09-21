// Chapter 13: Mean Shift Clustering - JavaScript functionality

// Make functions globally available immediately
window.updateKernelDemo = function() {
    console.log('updateKernelDemo called');
    const kernelType = document.getElementById('kernel-type');
    const bandwidth = document.getElementById('kernel-bandwidth');
    
    if (!kernelType || !bandwidth) return;
    
    document.getElementById('kernel-bw-val').textContent = bandwidth.value;
    
    // Simulate kernel visualization based on type and bandwidth
    const kernelEffects = {
        'gaussian': { smoothness: 1.0, peak: 1.0 },
        'epanechnikov': { smoothness: 0.8, peak: 1.2 },
        'uniform': { smoothness: 0.6, peak: 1.5 },
        'triangular': { smoothness: 0.9, peak: 1.1 }
    };
    
    const effect = kernelEffects[kernelType.value];
    const bw = parseFloat(bandwidth.value);
    
    // Update visualization description
    const description = `Kernel: ${kernelType.value}, Bandwidth: ${bw}. ` +
        `Smoothness: ${(effect.smoothness * bw).toFixed(2)}, Peak: ${(effect.peak / bw).toFixed(2)}`;
    
    const vizElement = document.querySelector('#kernel-demo .visualization-placeholder p');
    if (vizElement) {
        vizElement.textContent = description;
    }
};

window.updateMeanShiftDemo = function() {
    console.log('updateMeanShiftDemo called');
    const bandwidth = document.getElementById('demo-bandwidth');
    const kernel = document.getElementById('demo-kernel');
    const dataset = document.getElementById('demo-dataset');
    
    if (!bandwidth || !kernel || !dataset) return;
    
    document.getElementById('demo-bw-val').textContent = bandwidth.value;
    
    // Simulate Mean Shift results based on parameters
    const datasetEffects = {
        'blobs': { modes: 3, iterations: 12, converged: 98, quality: 0.85 },
        'moons': { modes: 2, iterations: 18, converged: 85, quality: 0.72 },
        'aniso': { modes: 4, iterations: 25, converged: 78, quality: 0.68 },
        'varied': { modes: 5, iterations: 15, converged: 92, quality: 0.79 }
    };
    
    const bw = parseFloat(bandwidth.value);
    const effect = datasetEffects[dataset.value] || datasetEffects['blobs'];
    
    // Adjust based on bandwidth
    const modes = Math.max(1, Math.round(effect.modes * (2 - bw)));
    const iterations = Math.round(effect.iterations * (1 + bw));
    const converged = Math.max(60, effect.converged - (bw - 0.3) * 20);
    const quality = Math.max(0.3, effect.quality - Math.abs(bw - 0.5) * 0.3);
    
    document.getElementById('demo-modes').textContent = modes;
    document.getElementById('demo-iterations').textContent = iterations;
    document.getElementById('demo-converged').textContent = converged.toFixed(0) + '%';
    document.getElementById('demo-quality').textContent = quality.toFixed(2);
};

// Generate visualization button function
window.generateMeanShiftVisualization = function() {
    console.log('generateMeanShiftVisualization called');
    const bandwidth = document.getElementById('demo-bandwidth');
    const kernel = document.getElementById('demo-kernel');
    const dataset = document.getElementById('demo-dataset');
    
    if (!bandwidth || !kernel || !dataset) return;
    
    const bw = parseFloat(bandwidth.value);
    createMeanShiftVisualization(dataset.value, kernel.value, bw);
};

// Reset demo function
window.resetMeanShiftDemo = function() {
    console.log('resetMeanShiftDemo called');
    // Reset to default values
    document.getElementById('demo-bandwidth').value = '0.3';
    document.getElementById('demo-kernel').value = 'gaussian';
    document.getElementById('demo-dataset').value = 'blobs';
    
    // Update display
    window.updateMeanShiftDemo();
    
    // Reset visualization to placeholder
    const container = document.querySelector('.interactive-demo div[style*="border: 2px dashed"]');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center;">
                <p><strong>Interactive Mean Shift Visualization</strong></p>
                <p>Shows density surface, convergence paths, and final clusters</p>
                <p><em>Data points • Convergence trajectories • Final modes (★) • Cluster boundaries</em></p>
            </div>
        `;
    }
};

window.updateBandwidthDemo = function() {
    console.log('updateBandwidthDemo called');
    const method = document.getElementById('bandwidth-method');
    const dataType = document.getElementById('data-type');
    const noise = document.getElementById('data-noise');
    
    if (!method || !dataType || !noise) return;
    
    // Simulate bandwidth selection results
    const methodEffects = {
        'silverman': { bandwidth: 0.3, confidence: 'High', note: 'Silverman\'s rule of thumb' },
        'crossvalidation': { bandwidth: 0.25, confidence: 'Very High', note: 'Cross-validation optimized' },
        'scott': { bandwidth: 0.35, confidence: 'Medium', note: 'Scott\'s rule' },
        'manual': { bandwidth: 0.4, confidence: 'Low', note: 'Manual selection' }
    };
    
    const effect = methodEffects[method.value];
    const noiseEffect = noise.value === 'low' ? 1.0 : noise.value === 'medium' ? 0.9 : 0.8;
    
    const finalBandwidth = (effect.bandwidth * noiseEffect).toFixed(2);
    
    document.getElementById('bandwidth-result').textContent = finalBandwidth;
    document.getElementById('bandwidth-confidence').textContent = effect.confidence;
    document.getElementById('bandwidth-note').textContent = effect.note;
};

window.updateBandwidthAssist = function() {
    console.log('updateBandwidthAssist called');
    const dataType = document.getElementById('assist-data');
    const goal = document.getElementById('assist-goal');
    const noise = document.getElementById('assist-noise');
    
    if (!dataType || !goal || !noise) return;
    
    // Simulate bandwidth recommendation
    const baseBandwidths = {
        'clustered': 0.3,
        'scattered': 0.5,
        'hierarchical': 0.2,
        'noisy': 0.4
    };
    
    const goalEffects = {
        'balanced': 1.0,
        'coarse': 1.3,
        'fine': 0.7
    };
    
    const noiseEffects = {
        'low': 1.0,
        'medium': 1.1,
        'high': 1.2
    };
    
    const base = baseBandwidths[dataType.value];
    const goalEffect = goalEffects[goal.value];
    const noiseEffect = noiseEffects[noise.value];
    
    const h = (base * goalEffect * noiseEffect).toFixed(2);
    
    document.getElementById('assist-bandwidth').textContent = h;
    
    // Update advice text
    const adviceMap = {
        'clustered-balanced-medium': 'For well-clustered data with balanced goals, the suggested bandwidth should provide clear separation between natural groups.',
        'scattered-coarse-high': 'With scattered, noisy data, use larger bandwidth to find major groupings while avoiding noise sensitivity.',
        'hierarchical-fine-low': 'For hierarchical structures with low noise, smaller bandwidth reveals fine-grained cluster hierarchy.',
        'noisy-balanced-high': 'High noise requires cross-validation to find robust bandwidth that balances detail with stability.'
    };
    
    const key = `${dataType.value}-${goal.value}-${noise.value}`;
    const defaultAdvice = `For ${goal.value} clustering with ${noise.value} noise, try bandwidth around ${h}. This should provide good separation without oversegmentation.`;
    document.getElementById('assist-advice').textContent = adviceMap[key] || defaultAdvice;
    
    // Create bandwidth assistant visualization
    createBandwidthAssistantVisualization(dataType.value, goal.value, noise.value, h);
};

window.initializeMeanShift = function() {
    console.log('initializeMeanShift called');
    document.getElementById('step-number').textContent = '0';
    document.getElementById('active-point').textContent = 'None';
    document.getElementById('current-pos').textContent = '-';
    document.getElementById('mean-shift-vec').textContent = '-';
    document.getElementById('movement-size').textContent = '-';
    
    // Create step-by-step visualization
    createStepByStepVisualization();
    
    // Initialize convergence tracking
    createConvergenceTracking();
};

window.stepMeanShift = function() {
    console.log('stepMeanShift called');
    const stepNumber = parseInt(document.getElementById('step-number').textContent) + 1;
    document.getElementById('step-number').textContent = stepNumber;

    // Simulate algorithm step
    const activePoint = `Point ${Math.floor(Math.random() * 10) + 1}`;
    const currentPos = `(${(Math.random() * 2 - 1).toFixed(2)}, ${(Math.random() * 2 - 1).toFixed(2)})`;
    const meanShiftVec = `(${(Math.random() * 0.1).toFixed(3)}, ${(Math.random() * 0.1).toFixed(3)})`;
    const movementSize = (Math.random() * 0.05).toFixed(4);

    document.getElementById('active-point').textContent = activePoint;
    document.getElementById('current-pos').textContent = currentPos;
    document.getElementById('mean-shift-vec').textContent = meanShiftVec;
    document.getElementById('movement-size').textContent = movementSize;
    
    // Update convergence tracking
    updateConvergenceTracking(stepNumber, parseFloat(movementSize));
};

window.runMeanShift = function() {
    console.log('runMeanShift called');
    // This would typically start an animation loop
    // For now, just simulate completion
    setTimeout(() => {
        document.getElementById('step-number').textContent = '15';
        document.getElementById('active-point').textContent = 'Converged';
        document.getElementById('current-pos').textContent = 'Final positions';
        document.getElementById('mean-shift-vec').textContent = '(0.000, 0.000)';
        document.getElementById('movement-size').textContent = '0.0000';
    }, 2000);
};

window.resetMeanShift = function() {
    console.log('resetMeanShift called');
    window.initializeMeanShift();
};

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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 13: Mean Shift Clustering loaded');
    
    // Initialize demo functionality
    setTimeout(() => {
        window.updateKernelDemo();
        window.updateMeanShiftDemo();
        window.updateBandwidthDemo();
        window.updateBandwidthAssist();
    }, 100);
});

// Create Mean Shift visualization (like Chapter 7's approach)
function createMeanShiftVisualization(dataset, kernel, bandwidth) {
    // Find the visualization container by ID (same as Chapter 7)
    const container = document.getElementById('kmeans-demo-canvas');
    if (!container) {
        console.log('Visualization container not found');
        return;
    }
    
    console.log('Found container:', container);
    console.log('Creating Mean Shift visualization for:', dataset, kernel, bandwidth);
    
    // Generate sample data points
    const dataPoints = generateMeanShiftData(dataset);
    
    // Create SVG visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    svg.style.borderRadius = '8px';
    
    // Draw data points
    dataPoints.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x * 400);
        circle.setAttribute('cy', point.y * 300);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', point.color);
        circle.setAttribute('opacity', '0.8');
        svg.appendChild(circle);
    });
    
    // Replace container content with SVG
    container.innerHTML = '';
    container.appendChild(svg);
    
    console.log('Visualization created with', dataPoints.length, 'data points');
    console.log('SVG added to container:', container);
}

// Generate sample data for Mean Shift based on dataset type
function generateMeanShiftData(dataset) {
    const points = [];
    
    if (dataset === 'blobs') {
        // Gaussian blobs - well-separated clusters
        const clusters = [
            { center: [0.3, 0.3], color: '#ff6b6b', count: 15 },
            { center: [0.7, 0.3], color: '#4ecdc4', count: 12 },
            { center: [0.5, 0.7], color: '#45b7d1', count: 18 }
        ];
        
        clusters.forEach(cluster => {
            for (let i = 0; i < cluster.count; i++) {
                const x = cluster.center[0] + (Math.random() - 0.5) * 0.2;
                const y = cluster.center[1] + (Math.random() - 0.5) * 0.2;
                points.push({ x, y, color: cluster.color });
            }
        });
    } else if (dataset === 'moons') {
        // Two moons - crescent shapes
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI;
            const radius = 0.1 + Math.random() * 0.05;
            const x = 0.3 + Math.cos(angle) * radius;
            const y = 0.3 + Math.sin(angle) * radius;
            points.push({ x, y, color: '#ff6b6b' });
        }
        
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI;
            const radius = 0.1 + Math.random() * 0.05;
            const x = 0.7 + Math.cos(angle + Math.PI) * radius;
            const y = 0.7 + Math.sin(angle + Math.PI) * radius;
            points.push({ x, y, color: '#4ecdc4' });
        }
    } else if (dataset === 'aniso') {
        // Anisotropic - elongated clusters
        const clusters = [
            { center: [0.2, 0.5], color: '#ff6b6b', count: 20, stretch: 0.3 },
            { center: [0.8, 0.5], color: '#4ecdc4', count: 20, stretch: 0.3 }
        ];
        
        clusters.forEach(cluster => {
            for (let i = 0; i < cluster.count; i++) {
                const x = cluster.center[0] + (Math.random() - 0.5) * cluster.stretch;
                const y = cluster.center[1] + (Math.random() - 0.5) * 0.1;
                points.push({ x, y, color: cluster.color });
            }
        });
    } else if (dataset === 'varied') {
        // Varied density - different cluster sizes
        const clusters = [
            { center: [0.2, 0.2], color: '#ff6b6b', count: 8 },
            { center: [0.8, 0.2], color: '#4ecdc4', count: 8 },
            { center: [0.2, 0.8], color: '#45b7d1', count: 8 },
            { center: [0.8, 0.8], color: '#96ceb4', count: 8 },
            { center: [0.5, 0.5], color: '#feca57', count: 20 } // Larger cluster
        ];
        
        clusters.forEach(cluster => {
            for (let i = 0; i < cluster.count; i++) {
                const x = cluster.center[0] + (Math.random() - 0.5) * 0.15;
                const y = cluster.center[1] + (Math.random() - 0.5) * 0.15;
                points.push({ x, y, color: cluster.color });
            }
        });
    }
    
    return points;
}

// Create Step-by-Step visualization
function createStepByStepVisualization() {
    const container = document.getElementById('step-by-step-canvas');
    if (!container) {
        console.log('Step-by-step container not found');
        return;
    }
    
    console.log('Creating step-by-step visualization');
    
    // Generate sample data points
    const dataPoints = generateMeanShiftData('blobs');
    
    // Create SVG visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    svg.style.borderRadius = '8px';
    
    // Draw data points
    dataPoints.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x * 400);
        circle.setAttribute('cy', point.y * 300);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', point.color);
        circle.setAttribute('opacity', '0.7');
        svg.appendChild(circle);
    });
    
    // Replace container content with SVG
    container.innerHTML = '';
    container.appendChild(svg);
    
    console.log('Step-by-step visualization created with', dataPoints.length, 'data points');
}

// Create Bandwidth Assistant visualization
function createBandwidthAssistantVisualization(dataType, goal, noise, bandwidth) {
    const container = document.getElementById('bandwidth-assistant-canvas');
    if (!container) {
        console.log('Bandwidth assistant container not found');
        return;
    }
    
    console.log('Creating bandwidth assistant visualization for:', dataType, goal, noise, bandwidth);
    
    // Create SVG visualization showing bandwidth effects
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '250');
    svg.setAttribute('viewBox', '0 0 400 250');
    svg.style.border = '1px solid #ccc';
    svg.style.background = '#f9f9f9';
    svg.style.borderRadius = '8px';
    
    // Draw bandwidth comparison chart
    const bandwidths = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    const currentBw = parseFloat(bandwidth);
    
    bandwidths.forEach((bw, index) => {
        const x = 50 + (index * 40);
        const height = Math.max(10, 100 - Math.abs(bw - currentBw) * 100);
        const y = 200 - height;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', '30');
        rect.setAttribute('height', height);
        rect.setAttribute('fill', Math.abs(bw - currentBw) < 0.05 ? '#ff6b6b' : '#4ecdc4');
        rect.setAttribute('opacity', '0.7');
        svg.appendChild(rect);
        
        // Add bandwidth labels
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + 15);
        text.setAttribute('y', 220);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#666');
        text.textContent = bw.toFixed(1);
        svg.appendChild(text);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', 200);
    title.setAttribute('y', 20);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Bandwidth Selection Analysis';
    svg.appendChild(title);
    
    // Add current bandwidth indicator
    const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    indicator.setAttribute('x', 200);
    indicator.setAttribute('y', 40);
    indicator.setAttribute('text-anchor', 'middle');
    indicator.setAttribute('font-size', '12');
    indicator.setAttribute('fill', '#ff6b6b');
    indicator.textContent = `Recommended: ${bandwidth}`;
    svg.appendChild(indicator);
    
    // Replace container content with SVG
    container.innerHTML = '';
    container.appendChild(svg);
    
    console.log('Bandwidth assistant visualization created');
}

// Create convergence tracking visualization
function createConvergenceTracking() {
    const container = document.getElementById('convergence-tracking');
    if (!container) {
        console.log('Convergence tracking container not found');
        return;
    }
    
    console.log('Creating convergence tracking visualization');
    
    // Create SVG for convergence tracking
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '80');
    svg.setAttribute('viewBox', '0 0 300 80');
    svg.style.border = 'none';
    svg.style.background = 'transparent';
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '10');
    title.setAttribute('y', '15');
    title.setAttribute('font-size', '10');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Movement Size Over Time';
    svg.appendChild(title);
    
    // Add axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '10');
    xAxis.setAttribute('y1', '70');
    xAxis.setAttribute('x2', '290');
    xAxis.setAttribute('y2', '70');
    xAxis.setAttribute('stroke', '#ccc');
    xAxis.setAttribute('stroke-width', '1');
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '10');
    yAxis.setAttribute('y1', '25');
    yAxis.setAttribute('x2', '10');
    yAxis.setAttribute('y2', '70');
    yAxis.setAttribute('stroke', '#ccc');
    yAxis.setAttribute('stroke-width', '1');
    svg.appendChild(yAxis);
    
    // Add labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', '150');
    xLabel.setAttribute('y', '85');
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '8');
    xLabel.setAttribute('fill', '#666');
    xLabel.textContent = 'Steps';
    svg.appendChild(xLabel);
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', '5');
    yLabel.setAttribute('y', '50');
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('font-size', '8');
    yLabel.setAttribute('fill', '#666');
    yLabel.setAttribute('transform', 'rotate(-90 5 50)');
    yLabel.textContent = 'Movement';
    svg.appendChild(yLabel);
    
    // Store reference to SVG for updates
    container.convergenceSvg = svg;
    container.convergenceData = [];
    
    // Replace container content with SVG
    container.innerHTML = '';
    container.appendChild(svg);
    
    console.log('Convergence tracking visualization created');
}

// Update convergence tracking with new data point
function updateConvergenceTracking(stepNumber, movementSize) {
    const container = document.getElementById('convergence-tracking');
    if (!container || !container.convergenceSvg) {
        console.log('Convergence tracking not initialized');
        return;
    }
    
    // Add new data point
    container.convergenceData.push({ step: stepNumber, movement: movementSize });
    
    // Keep only last 20 points for display
    if (container.convergenceData.length > 20) {
        container.convergenceData = container.convergenceData.slice(-20);
    }
    
    // Clear existing data points and line
    const existingPoints = container.convergenceSvg.querySelectorAll('.data-point, .convergence-line');
    existingPoints.forEach(point => point.remove());
    
    if (container.convergenceData.length < 2) return;
    
    // Draw convergence line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = '';
    
    container.convergenceData.forEach((point, index) => {
        const x = 10 + (index * 280 / Math.max(1, container.convergenceData.length - 1));
        const y = 70 - (point.movement * 1000); // Scale movement for visibility
        
        if (index === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });
    
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#ff6b6b');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('class', 'convergence-line');
    container.convergenceSvg.appendChild(path);
    
    // Draw data points
    container.convergenceData.forEach((point, index) => {
        const x = 10 + (index * 280 / Math.max(1, container.convergenceData.length - 1));
        const y = 70 - (point.movement * 1000);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '2');
        circle.setAttribute('fill', '#ff6b6b');
        circle.setAttribute('class', 'data-point');
        container.convergenceSvg.appendChild(circle);
    });
    
    console.log('Convergence tracking updated with step', stepNumber, 'movement', movementSize);
}

console.log('Chapter 13 JavaScript file loaded successfully');