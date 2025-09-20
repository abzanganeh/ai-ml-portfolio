// Chapter 13: Mean Shift Clustering - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 13: Mean Shift Clustering loaded');
    
    // Initialize demo functionality
    initializeDemo();
});

// ===== CHAPTER 13 DEMO FUNCTIONS =====

// Initialize demo when page loads
function initializeDemo() {
    console.log('Initializing Chapter 13 Mean Shift demo...');
    updateKernelDemo();
    updateMeanShiftDemo();
    updateBandwidthDemo();
    updateBandwidthAssist();
}

// Quiz state
let quizAnswers = {};

// Update kernel demo
function updateKernelDemo() {
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
}

// Update Mean Shift demo
function updateMeanShiftDemo() {
    const bandwidth = document.getElementById('demo-bandwidth');
    const kernel = document.getElementById('demo-kernel');
    const dataset = document.getElementById('demo-dataset');
    
    if (!bandwidth || !kernel || !dataset) return;
    
    document.getElementById('demo-bw-val').textContent = bandwidth.value;
    
    // Simulate Mean Shift results based on parameters
    const datasetEffects = {
        'wellseparated': { modes: 3, iterations: 12, converged: 98, quality: 0.85 },
        'overlapping': { modes: 2, iterations: 18, converged: 85, quality: 0.72 },
        'noisy': { modes: 4, iterations: 25, converged: 78, quality: 0.68 },
        'hierarchical': { modes: 5, iterations: 15, converged: 92, quality: 0.79 }
    };
    
    const bw = parseFloat(bandwidth.value);
    const effect = datasetEffects[dataset.value];
    
    // Adjust based on bandwidth
    const modes = Math.max(1, Math.round(effect.modes * (2 - bw)));
    const iterations = Math.round(effect.iterations * (1 + bw));
    const converged = Math.max(60, effect.converged - (bw - 0.3) * 20);
    const quality = Math.max(0.3, effect.quality - Math.abs(bw - 0.5) * 0.3);
    
    document.getElementById('demo-modes').textContent = modes;
    document.getElementById('demo-iterations').textContent = iterations;
    document.getElementById('demo-converged').textContent = converged.toFixed(0) + '%';
    document.getElementById('demo-quality').textContent = quality.toFixed(2);
}

// Update bandwidth demo
function updateBandwidthDemo() {
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
}

// Update bandwidth assistant
function updateBandwidthAssist() {
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
}

// Quiz functionality
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

// Make functions globally available
window.updateKernelDemo = updateKernelDemo;
window.updateMeanShiftDemo = updateMeanShiftDemo;
window.updateBandwidthDemo = updateBandwidthDemo;
window.updateBandwidthAssist = updateBandwidthAssist;
window.checkAnswer = checkAnswer;
window.updateQuizScore = updateQuizScore;
window.resetQuiz = resetQuiz;
