let currentRegularization = 'l1';
let decisionFactors = {};


function updateRegularizationDemo() {
    const lambda = parseFloat(document.getElementById('lambda-demo').value);
    document.getElementById('lambda-value').textContent = lambda.toFixed(1);
    
    const title = document.getElementById('effect-title');
    const description = document.getElementById('effect-description');
    const trainingError = document.getElementById('training-error');
    const validationError = document.getElementById('validation-error');
    
    // Simulate regularization effects
    const baseTraining = 0.05;
    const baseValidation = 0.15;
    
    const newTraining = baseTraining + (lambda * 0.02);
    const newValidation = Math.max(0.08, baseValidation - (lambda * 0.01));
    
    trainingError.textContent = newTraining.toFixed(2);
    validationError.textContent = newValidation.toFixed(2);
    
    if (lambda < 1) {
        title.textContent = "Minimal Regularization";
        description.textContent = "Little constraint on model complexity - still risk of overfitting.";
    } else if (lambda < 5) {
        title.textContent = "Moderate Regularization";
        description.textContent = "Good balance - reducing overfitting while maintaining model capacity.";
    } else {
        title.textContent = "Strong Regularization";
        description.textContent = "Heavy constraint - may start underfitting as model becomes too simple.";
    }
}

// L1 vs L2 Comparison
function selectRegularization(type) {
    document.querySelectorAll('.selector-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentRegularization = type;
    updateFeatureCoefficients();
}

function updateFeatureCoefficients() {
    const strength = parseFloat(document.getElementById('reg-strength').value);
    document.getElementById('reg-strength-value').textContent = strength.toFixed(1);
    
    const baseCoefficients = [0.8, 0.6, 0.4, 0.2, 0.1];
    const title = document.getElementById('reg-explanation-title');
    const text = document.getElementById('reg-explanation-text');
    
    for (let i = 1; i <= 5; i++) {
        const card = document.getElementById(`coef-${i}`);
        const valueElement = card.querySelector('.coefficient-value');
        let newValue = baseCoefficients[i-1];
        
        card.classList.remove('zero', 'shrunk');
        
        if (currentRegularization === 'l1') {
            // L1: Set smaller coefficients to zero
            if (strength > 2 && newValue < 0.3) newValue = 0;
            else if (strength > 5 && newValue < 0.5) newValue = 0;
            else if (strength > 8 && newValue < 0.7) newValue = 0;
            else newValue = Math.max(0, newValue - (strength * 0.05));
            
            if (newValue === 0) card.classList.add('zero');
            else if (newValue < baseCoefficients[i-1] * 0.7) card.classList.add('shrunk');
            
            title.textContent = "L1 Regularization Active";
            text.textContent = "L1 is driving smaller coefficients toward zero, effectively removing less important features.";
        } else if (currentRegularization === 'l2') {
            // L2: Shrink all coefficients proportionally
            newValue = newValue * Math.exp(-strength * 0.1);
            
            if (newValue < baseCoefficients[i-1] * 0.7) card.classList.add('shrunk');
            
            title.textContent = "L2 Regularization Active";
            text.textContent = "L2 is shrinking all coefficients proportionally, maintaining all features but reducing their influence.";
        } else {
            title.textContent = "No Regularization";
            text.textContent = "All features maintain their original coefficients - risk of overfitting if data is complex.";
        }
        
        valueElement.textContent = newValue.toFixed(2);
    }
}

// Regularization Path Visualization
function updateRegularizationPath() {
    const lambda = parseFloat(document.getElementById('path-lambda').value);
    document.getElementById('path-lambda-value').textContent = `λ = ${lambda.toFixed(1)}`;
    
    const container = document.getElementById('path-features');
    const explanation = document.getElementById('path-explanation');
    
    // Generate feature bars
    const features = 10;
    const baseHeights = [80, 70, 60, 50, 40, 30, 25, 20, 15, 10];
    let html = '';
    let featuresZero = 0;
    let activeFeatures = features;
    
    for (let i = 0; i < features; i++) {
        let height = baseHeights[i];
        let color = '#3b82f6';
        
        // Apply regularization effect
        if (lambda > 2 && height < 30) {
            height = 0;
            color = '#ef4444';
            featuresZero++;
            activeFeatures--;
        } else if (lambda > 5 && height < 50) {
            height = 0;
            color = '#ef4444';
            featuresZero++;
            activeFeatures--;
        } else {
            height = Math.max(10, height * (1 - lambda * 0.1));
            if (height < baseHeights[i] * 0.6) color = '#f59e0b';
        }
        
        html += `<div class="feature-bar" style="height: ${height}px; background: ${color};">${i+1}</div>`;
    }
    
    container.innerHTML = html;
    
    // Update metrics
    document.getElementById('features-zero').textContent = featuresZero;
    document.getElementById('features-small').textContent = activeFeatures;
    document.getElementById('model-complexity').textContent = `${Math.max(10, 100 - lambda * 10)}%`;
    
    // Update explanation
    if (lambda < 1) {
        explanation.innerHTML = '<h5>Low Regularization (λ < 1.0)</h5><p>Most features retain their importance. Some regularization effect but risk of overfitting remains.</p>';
    } else if (lambda < 5) {
        explanation.innerHTML = '<h5>Moderate Regularization (λ = 1-5)</h5><p>Smaller features being eliminated, important features shrinking. Good balance point.</p>';
    } else {
        explanation.innerHTML = '<h5>Strong Regularization (λ > 5)</h5><p>Many features eliminated, even important features heavily shrunk. Risk of underfitting.</p>';
    }
}

// Decision Helper
function updateDecision(factor, value) {
    // Remove active class from siblings
    const parent = event.target.parentElement;
    parent.querySelectorAll('.selector-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    decisionFactors[factor] = value;
    
    // Generate recommendation
    const title = document.getElementById('decision-title');
    const recommendation = document.getElementById('decision-recommendation');
    
    if (Object.keys(decisionFactors).length < 3) {
        title.textContent = "Keep selecting...";
        recommendation.textContent = "Answer all questions to get your personalized recommendation.";
        return;
    }
    
    let regType = '';
    let explanation = '';
    
    if (decisionFactors.features === 'many' && decisionFactors.interpretability === 'high') {
        regType = 'L1 Regularization (Lasso)';
        explanation = 'High-dimensional data + need for interpretability = L1 for automatic feature selection.';
    } else if (decisionFactors.correlation === 'high') {
        regType = 'L2 Regularization (Ridge)';
        explanation = 'Highly correlated features work better with L2, which handles multicollinearity better.';
    } else if (decisionFactors.features === 'few' && decisionFactors.interpretability === 'low') {
        regType = 'L2 Regularization (Ridge)';
        explanation = 'With few features and no interpretability constraints, L2 provides stable, smooth predictions.';
    } else if (decisionFactors.features === 'many' && decisionFactors.interpretability === 'low') {
        regType = 'Elastic Net';
        explanation = 'Combines L1 and L2 benefits - some feature selection with stability for high-dimensional data.';
    } else {
        regType = 'L1 Regularization (Lasso)';
        explanation = 'When in doubt with many features, L1 helps identify the most important ones.';
    }
    
    title.textContent = `Recommended: ${regType}`;
    recommendation.textContent = explanation;
}

document.addEventListener('DOMContentLoaded', function() {
    updateRegularizationDemo();
    updateFeatureCoefficients();
    updateRegularizationPath();
});

