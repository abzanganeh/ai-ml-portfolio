console.log('chapter1.js loaded successfully');

function updateAssessment() {
    document.getElementById('linear-value').textContent = document.getElementById('linear-understanding').value;
    document.getElementById('ensemble-value').textContent = document.getElementById('ensemble-understanding').value;
    document.getElementById('selection-value').textContent = document.getElementById('selection-understanding').value;
}

function generateRecommendations() {
    const linear = parseInt(document.getElementById('linear-understanding').value);
    const ensemble = parseInt(document.getElementById('ensemble-understanding').value);
    const selection = parseInt(document.getElementById('selection-understanding').value);
    
    const results = document.getElementById('assessment-results');
    results.style.display = 'block';
    
    let recommendations = '<h5>Your Personalized Learning Path:</h5>';
    
    if (linear <= 2) {
        recommendations += '<p><strong>Priority 1:</strong> Focus on Chapters 2-3 (Foundation Models & Regularization)</p>';
    }
    if (ensemble <= 2) {
        recommendations += '<p><strong>Priority 2:</strong> Spend extra time on Chapters 4-6 (Ensemble Methods)</p>';
    }
    if (selection <= 2) {
        recommendations += '<p><strong>Priority 3:</strong> Chapter 8 (Integration) will be crucial for you</p>';
    }
    if (linear >= 4 && ensemble >= 4) {
        recommendations += '<p><strong>Advanced Path:</strong> You can move quickly to Chapters 7-8</p>';
    }
    
    results.innerHTML = recommendations;
}

// Hierarchy exploration
function explainHierarchy() {
    document.getElementById('hierarchy-explanation').style.display = 'block';
}

function showLevelDetails(level) {
    document.querySelectorAll('.connection-node').forEach(node => node.classList.remove('active'));
    event.target.classList.add('active');
    
    const details = document.getElementById('level-details');
    const content = {
        1: '<h4>Level 1: Basic Models</h4><p><strong>Problem:</strong> Need simple, interpretable algorithms</p><p><strong>Solution:</strong> Linear Regression, Decision Trees</p><p><strong>New Problem Created:</strong> These models overfit to training data</p>',
        2: '<h4>Level 2: Regularization</h4><p><strong>Problem:</strong> Basic models overfit</p><p><strong>Solution:</strong> Add penalty terms (L1/L2) to control complexity</p><p><strong>New Problem Created:</strong> Single models still have limitations</p>',
        3: '<h4>Level 3: Ensemble Methods</h4><p><strong>Problem:</strong> Single models are limited</p><p><strong>Solution:</strong> Combine multiple models (Bagging/Boosting)</p><p><strong>New Problem Created:</strong> Need efficient implementations</p>',
            4: '<h4>Level 4: Advanced Implementations</h4><p><strong>Problem:</strong> Ensemble methods need optimization</p><p><strong>Solution:</strong> XGBoost, LightGBM - optimized implementations</p><p><strong>Result:</strong> State-of-the-art performance</p>'
    };
    
    details.innerHTML = content[level];
}

// Cooking metaphor interactions
function highlightStep(stepNumber) {
    document.querySelectorAll('.cooking-step').forEach(step => step.style.background = 'white');
    event.target.closest('.cooking-step').style.background = '#e3f2fd';
    
    const stepDetails = document.getElementById('step-details');
    stepDetails.classList.add('active');
    
    const details = {
        1: {
            title: 'Raw Ingredients = Your Data',
            description: 'Just like cooking starts with quality ingredients, ML starts with quality data. Poor data = poor results, no matter how sophisticated your algorithm.'
        },
        2: {
            title: 'Cooking Method = Algorithm',
            description: 'Different algorithms are like different cooking methods. Grilling (Linear Regression) is simple and fast. Slow cooking (Deep Learning) takes time but handles complex recipes.'
        },
        3: {
            title: 'Seasoning = Regularization',
            description: 'Too little seasoning and the dish is bland (underfitting). Too much and it overwhelms (overfitting). Regularization helps you find the perfect balance.'
        },
        4: {
            title: 'Team Cooking = Ensemble Methods',
            description: 'Multiple chefs bring different strengths. One might be great at appetizers (one model type), another at desserts (another model type). Together they create something amazing.'
        }
    };
    
    document.getElementById('step-title').textContent = details[stepNumber].title;
    document.getElementById('step-description').textContent = details[stepNumber].description;
}

function updateRecipe() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.nextSibling.textContent.trim());
    
    const recommendation = document.getElementById('recipe-recommendation');
    const details = document.getElementById('recipe-details');
    
    if (selected.length === 0) {
        recommendation.style.display = 'none';
        return;
    }
    
    recommendation.style.display = 'block';
    
    let recipe = '';
    if (selected.includes('Noisy data')) recipe += '<p>🧂 <strong>Add regularization</strong> (L1/L2) to handle noise</p>';
    if (selected.includes('Many features')) recipe += '<p>🔪 <strong>Feature selection</strong> with L1 regularization</p>';
    if (selected.includes('Complex patterns')) recipe += '<p>🌳 <strong>Decision trees</strong> or ensemble methods</p>';
    if (selected.includes('Need high accuracy')) recipe += '<p>👥 <strong>Ensemble methods</strong> (Random Forest, XGBoost)</p>';
    if (selected.includes('Must be interpretable')) recipe += '<p>📊 <strong>Linear models</strong> or single decision trees</p>';
    
    details.innerHTML = recipe;
}

// Connection web interactions
function showConnections(technique) {
    document.querySelectorAll('.connection-details').forEach(detail => detail.classList.remove('active'));
    document.querySelectorAll('.connection-node').forEach(node => node.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('connection-' + technique).classList.add('active');
}
