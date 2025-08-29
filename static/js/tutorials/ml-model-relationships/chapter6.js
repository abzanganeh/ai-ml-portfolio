let currentWeakLearner = 'stump';
        
// Overview Demo
function updateOverviewDemo() {
    const rounds = parseInt(document.getElementById('overview-rounds').value);
    const learningRate = parseFloat(document.getElementById('overview-learning-rate').value);
    
    document.getElementById('overview-rounds-value').textContent = rounds;
    document.getElementById('overview-learning-rate-value').textContent = learningRate;
    
    const baseError = 0.45;
    const currentError = Math.max(0.05, baseError * Math.pow(0.85, rounds * learningRate));
    const improvement = Math.round((baseError - currentError) / baseError * 100);
    
    document.getElementById('current-error').textContent = currentError.toFixed(2);
    document.getElementById('improvement').textContent = `-${improvement}%`;
    document.getElementById('models-used').textContent = rounds;
    
    const explanation = document.getElementById('overview-explanation');
    if (rounds === 1) {
        explanation.innerHTML = '<h5>Round 1: Initial Model</h5><p>First weak learner makes basic predictions. Error is high but we\'re just getting started!</p>';
    } else if (rounds <= 5) {
        explanation.innerHTML = `<h5>Round ${rounds}: Early Learning</h5><p>Each model is learning from previous mistakes. Error reduction is most dramatic in early rounds.</p>`;
    } else if (rounds <= 10) {
        explanation.innerHTML = `<h5>Round ${rounds}: Steady Improvement</h5><p>The ensemble is becoming more sophisticated. Error reduction continues but at a slower pace.</p>`;
    } else {
        explanation.innerHTML = `<h5>Round ${rounds}: Diminishing Returns</h5><p>Most easy patterns have been learned. Further improvements require more rounds and careful tuning.</p>`;
    }
}

// Sequential Learning Demo
function updateSequentialDemo() {
    const rounds = parseInt(document.getElementById('sequential-rounds').value);
    const learnerType = document.getElementById('weak-learner-type').value;
    
    document.getElementById('sequential-rounds-value').textContent = rounds;
    
    const container = document.getElementById('sequential-flow');
    let html = '';
    
    for (let i = 1; i <= rounds; i++) {
        const error = Math.max(0.05, 0.4 * Math.pow(0.8, i - 1));
        const improvement = i === 1 ? 0 : Math.round((0.4 - error) / 0.4 * 100);
        
        let description = '';
        if (i === 1) {
            description = 'Initial model trained on original target values';
        } else {
            description = `Model trained on residuals from previous ${i-1} models`;
        }
        
        html += `
            <div class="boosting-round">
                <div class="round-number">${i}</div>
                <div class="round-details">
                    <div class="round-title">Round ${i}: ${learnerType.charAt(0).toUpperCase() + learnerType.slice(1)}</div>
                    <div class="round-description">${description}</div>
                </div>
                <div class="round-metrics">
                    <div class="metric-label">Error</div>
                    <div class="metric-value">${(error * 100).toFixed(0)}%</div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Weak Learner Selection
function selectWeakLearner(type) {
    document.querySelectorAll('.weak-learner').forEach(learner => learner.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    currentWeakLearner = type;
    
    const explanation = document.getElementById('weak-learner-explanation');
    const descriptions = {
        stump: {
            title: 'Decision Stumps',
            text: 'Simple one-level decision trees that make a single split. They\'re weak individually but powerful when combined through boosting. Each stump slightly improves overall predictions.'
        },
        shallow: {
            title: 'Shallow Trees',
            text: 'Trees with depth 2-6 can capture feature interactions while remaining simple. They provide more expressive power than stumps while still being "weak" enough for effective boosting.'
        },
        linear: {
            title: 'Linear Models',
            text: 'Simple linear regression models that fit straight lines through the residuals. Fast to train and interpretable, though may require more boosting rounds to achieve good performance.'
        }
    };
    
    explanation.innerHTML = `<h5>${descriptions[type].title}</h5><p>${descriptions[type].text}</p>`;
}

// Residual Visualization
function updateResidualVisualization() {
    const round = parseInt(document.getElementById('residual-round').value);
    document.getElementById('residual-round-value').textContent = round;
    
    const container = document.getElementById('residual-bars');
    let html = '';
    
    let largeResiduals = 10;
    let smallResiduals = 0;
    let avgResidual = 0.42;
    
    // Simulate residual reduction
    if (round > 0) {
        largeResiduals = Math.max(0, 10 - round * 1.2);
        smallResiduals = Math.min(10, round * 0.8);
        avgResidual = Math.max(0.05, 0.42 * Math.pow(0.85, round));
    }
    
    for (let i = 0; i < 10; i++) {
        let height = Math.random() * 60 + 20;
        if (round > 0) {
            height = height * Math.pow(0.9, round) + Math.random() * 20;
        }
        
        const isSmall = height < 30;
        const value = Math.round(height);
        
        html += `<div class="residual-bar ${isSmall ? 'small' : ''}" style="height: ${height}px;">${value}</div>`;
    }
    
    container.innerHTML = html;
    
    document.getElementById('large-residuals').textContent = Math.round(largeResiduals);
    document.getElementById('small-residuals').textContent = Math.round(smallResiduals);
    document.getElementById('avg-residual').textContent = avgResidual.toFixed(2);
    
    const explanation = document.getElementById('residual-explanation');
    if (round === 0) {
        explanation.innerHTML = '<h5>Round 0: Initial Residuals</h5><p>Starting with large residuals everywhere. Each subsequent model will focus on reducing these errors.</p>';
    } else if (round <= 5) {
        explanation.innerHTML = `<h5>Round ${round}: Active Learning</h5><p>Models are actively reducing residuals. Notice how the largest errors are getting smaller with each round.</p>`;
    } else {
        explanation.innerHTML = `<h5>Round ${round}: Fine-tuning</h5><p>Most large residuals have been addressed. The ensemble is now fine-tuning smaller errors for incremental improvements.</p>`;
    }
    
    // Update loss curve
    updateLossCurve(round);
}

// Loss Curve Update
function updateLossCurve(maxRound) {
    const container = document.getElementById('loss-curve');
    let html = '';
    
    for (let i = 0; i < 20; i++) {
        let height = 0;
        if (i <= maxRound) {
            height = Math.max(10, 180 * Math.pow(0.9, i));
        }
        html += `<div class="loss-point" style="height: ${height}px;"></div>`;
    }
    
    container.innerHTML = html;
    
    if (maxRound > 0) {
        const currentLoss = 0.65 * Math.pow(0.9, maxRound);
        const reduction = Math.round((1 - currentLoss / 0.65) * 100);
        
        document.getElementById('current-loss').textContent = currentLoss.toFixed(2);
        document.getElementById('loss-reduction').textContent = `${reduction}%`;
        document.getElementById('convergence').textContent = maxRound < 5 ? 'Fast' : maxRound < 10 ? 'Medium' : 'Slow';
    }
}

// Performance Comparison
function updatePerformanceComparison() {
    const problemType = document.getElementById('problem-type').value;
    
    const scenarios = {
        tabular: { rf: 0.87, gb: 0.91, desc: 'Gradient Boosting typically performs better on structured data due to its sequential learning approach that can capture complex patterns.' },
        noisy: { rf: 0.84, gb: 0.79, desc: 'Random Forest is more robust to noisy data because averaging reduces the impact of outliers and noise.' },
        large: { rf: 0.89, gb: 0.88, desc: 'With large datasets, Random Forest can be parallelized more easily and is less prone to overfitting.' },
        small: { rf: 0.78, gb: 0.82, desc: 'On small datasets, Gradient Boosting\'s sequential learning can extract more signal, but overfitting risk increases.' },
        linear: { rf: 0.81, gb: 0.83, desc: 'For linear patterns, both ensemble methods are overkill, but Gradient Boosting handles bias reduction better.' }
    };
    
    const scenario = scenarios[problemType];
    document.getElementById('rf-score').textContent = scenario.rf.toFixed(2);
    document.getElementById('gb-score').textContent = scenario.gb.toFixed(2);
    
    document.getElementById('rf-description').textContent = scenario.rf > scenario.gb ? 'Better choice' : 'Good alternative';
    document.getElementById('gb-description').textContent = scenario.gb > scenario.rf ? 'Better choice' : 'Good alternative';
    
    document.getElementById('comparison-explanation').innerHTML = `<p><strong>${problemType.charAt(0).toUpperCase() + problemType.slice(1)}:</strong> ${scenario.desc}</p>`;
}

// Hyperparameter Comparison
function updateHyperparameterComparison() {
    const nEstimators = parseInt(document.getElementById('n-estimators').value);
    const learningRate = parseFloat(document.getElementById('learning-rate-comp').value);
    
    document.getElementById('n-estimators-value').textContent = nEstimators;
    document.getElementById('learning-rate-comp-value').textContent = learningRate.toFixed(2);
    
    // Simulate training times
    const rfTime = (nEstimators * 0.02 + 1).toFixed(1) + 's';
    const gbTime = (nEstimators * 0.05 / learningRate + 2).toFixed(1) + 's';
    
    // Simulate memory usage
    const rfMemory = Math.round(nEstimators * 1.5 + 50) + 'MB';
    const gbMemory = Math.round(nEstimators * 0.8 + 30) + 'MB';
    
    // Risk levels based on parameters
    const rfOverfit = nEstimators > 200 ? 'Medium' : 'Low';
    const gbOverfit = learningRate > 0.2 || nEstimators > 300 ? 'High' : 'Medium';
    
    const rfTuning = 'Easy';
    const gbTuning = learningRate < 0.05 || learningRate > 0.2 ? 'Hard' : 'Medium';
    
    document.getElementById('rf-time').textContent = rfTime;
    document.getElementById('gb-time').textContent = gbTime;
    document.getElementById('rf-memory').textContent = rfMemory;
    document.getElementById('gb-memory').textContent = gbMemory;
    document.getElementById('rf-overfit').textContent = rfOverfit;
    document.getElementById('gb-overfit').textContent = gbOverfit;
    document.getElementById('rf-tuning').textContent = rfTuning;
    document.getElementById('gb-tuning').textContent = gbTuning;
}


// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateOverviewDemo();
    updateSequentialDemo();
    updateResidualVisualization();
    updatePerformanceComparison();
    updateHyperparameterComparison();
});