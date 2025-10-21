// Chapter 8: Integration & Decision Making Interactive Functions

let currentDecisionPath = [];
let currentScenario = 'general';

// Decision Tree Navigation
function startDecisionTree() {
    const startNode = document.getElementById('start-node');
    startNode.innerHTML = `
        <div class="decision-content">
            <h4>Start Your ML Journey</h4>
            <p>Click on a question to begin the decision tree:</p>
            <div class="decision-options">
                <button class="decision-btn" onclick="navigateDecision('data-size')">How much data do you have?</button>
                <button class="decision-btn" onclick="navigateDecision('interpretability')">Do you need interpretability?</button>
                <button class="decision-btn" onclick="navigateDecision('performance')">What's your priority?</button>
            </div>
        </div>
    `;
    currentDecisionPath = [];
}

function navigateDecision(question) {
    currentDecisionPath.push(question);
    
    const decisionContent = {
        'data-size': {
            title: 'Data Size',
            question: 'How much training data do you have?',
            options: [
                { text: 'Small (< 1,000 samples)', action: 'small-data' },
                { text: 'Medium (1,000 - 10,000 samples)', action: 'medium-data' },
                { text: 'Large (> 10,000 samples)', action: 'large-data' }
            ]
        },
        'interpretability': {
            title: 'Interpretability',
            question: 'Do you need to understand how the model makes decisions?',
            options: [
                { text: 'Yes, very important', action: 'high-interpretability' },
                { text: 'Somewhat important', action: 'medium-interpretability' },
                { text: 'Not important', action: 'low-interpretability' }
            ]
        },
        'performance': {
            title: 'Performance Priority',
            question: 'What is your main priority?',
            options: [
                { text: 'Maximum accuracy', action: 'max-accuracy' },
                { text: 'Fast training/prediction', action: 'speed' },
                { text: 'Robust to overfitting', action: 'robustness' }
            ]
        },
        'small-data': {
            title: 'Small Dataset Recommendation',
            question: 'With limited data, you need simple, robust models:',
            recommendation: 'Linear Regression or Logistic Regression with regularization',
            reasoning: 'Simple models prevent overfitting with limited data. Regularization helps with generalization.',
            next: 'interpretability'
        },
        'medium-data': {
            title: 'Medium Dataset',
            question: 'Good amount of data allows for more complex models:',
            recommendation: 'Random Forest or Gradient Boosting',
            reasoning: 'Enough data to train ensemble methods effectively without overfitting.',
            next: 'interpretability'
        },
        'large-data': {
            title: 'Large Dataset',
            question: 'With lots of data, you can use sophisticated models:',
            recommendation: 'XGBoost, LightGBM, or Deep Learning',
            reasoning: 'Large datasets can support complex models. XGBoost often performs best on tabular data.',
            next: 'interpretability'
        },
        'high-interpretability': {
            title: 'High Interpretability',
            question: 'You need to understand model decisions:',
            recommendation: 'Linear Models, Decision Trees, or SHAP explanations',
            reasoning: 'Linear models are inherently interpretable. Decision trees show clear rules. SHAP can explain any model.',
            next: 'performance'
        },
        'medium-interpretability': {
            title: 'Medium Interpretability',
            question: 'Some understanding is helpful:',
            recommendation: 'Random Forest with feature importance',
            reasoning: 'Random Forest provides feature importance and partial interpretability while maintaining good performance.',
            next: 'performance'
        },
        'low-interpretability': {
            title: 'Low Interpretability',
            question: 'Performance is more important than understanding:',
            recommendation: 'XGBoost, Neural Networks, or Ensemble methods',
            reasoning: 'Focus on maximum performance without interpretability constraints.',
            next: 'performance'
        },
        'max-accuracy': {
            title: 'Maximum Accuracy',
            question: 'Your final recommendation:',
            recommendation: 'XGBoost with hyperparameter tuning',
            reasoning: 'XGBoost consistently achieves state-of-the-art performance on tabular data when properly tuned.',
            final: true
        },
        'speed': {
            title: 'Speed Priority',
            question: 'Your final recommendation:',
            recommendation: 'Linear models or Random Forest',
            reasoning: 'Linear models are fastest. Random Forest is fast to train and predict, with good performance.',
            final: true
        },
        'robustness': {
            title: 'Robustness Priority',
            question: 'Your final recommendation:',
            recommendation: 'Random Forest with cross-validation',
            reasoning: 'Random Forest is naturally robust to overfitting and handles various data types well.',
            final: true
        }
    };
    
    const content = decisionContent[question];
    if (!content) return;
    
    const startNode = document.getElementById('start-node');
    
    if (content.final) {
        startNode.innerHTML = `
            <div class="decision-content final-recommendation">
                <h4>🎯 Your ML Recommendation</h4>
                <div class="recommendation-card">
                    <h5>${content.recommendation}</h5>
                    <p><strong>Why this choice:</strong> ${content.reasoning}</p>
                </div>
                <button class="decision-btn" onclick="startDecisionTree()">Start Over</button>
            </div>
        `;
    } else {
        let optionsHtml = content.options.map(option => 
            `<button class="decision-btn" onclick="navigateDecision('${option.action}')">${option.text}</button>`
        ).join('');
        
        startNode.innerHTML = `
            <div class="decision-content">
                <h4>${content.title}</h4>
                <p>${content.question}</p>
                ${content.recommendation ? `<div class="current-recommendation"><strong>Current recommendation:</strong> ${content.recommendation}</div>` : ''}
                ${content.reasoning ? `<div class="current-reasoning"><strong>Reasoning:</strong> ${content.reasoning}</div>` : ''}
                <div class="decision-options">
                    ${optionsHtml}
                </div>
                <button class="decision-btn secondary" onclick="startDecisionTree()">Start Over</button>
            </div>
        `;
    }
}

// Scenario Demonstrations
function showScenario(scenario) {
    currentScenario = scenario;
    
    // Remove active class from all buttons
    document.querySelectorAll('.azbn-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    event.target.classList.add('active');
    
    const scenarioData = {
        'general': {
            title: 'General Tabular Data',
            description: 'Standard business dataset with mixed features',
            recommendation: 'Start with Random Forest, then try XGBoost',
            reasoning: 'Random Forest is robust and interpretable. XGBoost often performs better but requires more tuning.',
            metrics: { accuracy: '89.2%', training_time: '2.3s', interpretability: 'Medium' }
        },
        'small': {
            title: 'Small Dataset (< 1,000 samples)',
            description: 'Limited data requires careful model selection',
            recommendation: 'Linear models with regularization',
            reasoning: 'Simple models prevent overfitting. Regularization helps with generalization on small datasets.',
            metrics: { accuracy: '85.7%', training_time: '0.1s', interpretability: 'High' }
        },
        'noisy': {
            title: 'Noisy Data',
            description: 'Data with measurement errors and outliers',
            recommendation: 'Random Forest or robust linear models',
            reasoning: 'Random Forest is naturally robust to noise. Linear models with robust loss functions also work well.',
            metrics: { accuracy: '82.4%', training_time: '1.8s', interpretability: 'Medium' }
        },
        'interpretable': {
            title: 'Need Interpretability',
            description: 'Business requires understanding model decisions',
            recommendation: 'Linear models or shallow decision trees',
            reasoning: 'Linear models show feature importance directly. Decision trees provide clear decision rules.',
            metrics: { accuracy: '87.1%', training_time: '0.2s', interpretability: 'High' }
        }
    };
    
    const data = scenarioData[scenario];
    const resultsContainer = document.getElementById('scenario-results');
    
    resultsContainer.innerHTML = `
        <div class="scenario-results">
            <h4>${data.title}</h4>
            <p>${data.description}</p>
            
            <div class="recommendation-box">
                <h5>Recommended Approach:</h5>
                <p><strong>${data.recommendation}</strong></p>
                <p>${data.reasoning}</p>
            </div>
            
            <div class="performance-metrics">
                <h5>Expected Performance:</h5>
                <div class="metrics-grid">
                    <div class="metric">
                        <span class="metric-label">Accuracy:</span>
                        <span class="metric-value">${data.metrics.accuracy}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Training Time:</span>
                        <span class="metric-value">${data.metrics.training_time}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Interpretability:</span>
                        <span class="metric-value">${data.metrics.interpretability}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Case Study Selection
function selectCaseStudy(study) {
    // Remove active class from all case studies
    document.querySelectorAll('.case-study').forEach(study => study.classList.remove('active'));
    // Add active class to selected study
    event.currentTarget.classList.add('active');
    
    const caseStudies = {
        'credit': {
            title: 'Credit Risk Assessment',
            problem: 'Predict loan default risk for bank customers',
            data: '10,000 customer records with 15 features',
            solution: 'XGBoost with feature engineering',
            results: '94.2% accuracy, 2.1s training time',
            lessons: 'Feature engineering crucial, ensemble methods excel with tabular data'
        },
        'medical': {
            title: 'Medical Diagnosis Support',
            problem: 'Assist doctors in diagnosing diseases from symptoms',
            data: '5,000 patient records with 20 medical features',
            solution: 'Random Forest for interpretability',
            results: '91.8% accuracy, high interpretability',
            lessons: 'Interpretability critical in medical domain, Random Forest provides good balance'
        },
        'startup': {
            title: 'Startup Success Prediction',
            problem: 'Predict which startups will succeed',
            data: '2,000 startup profiles with 12 features',
            solution: 'Logistic Regression with regularization',
            results: '87.3% accuracy, very fast training',
            lessons: 'Small datasets favor simple models, regularization prevents overfitting'
        },
        'iot': {
            title: 'IoT Device Failure Prediction',
            problem: 'Predict when IoT devices will fail',
            data: '50,000 device records with 25 sensor features',
            solution: 'LightGBM for speed and accuracy',
            results: '96.1% accuracy, 0.8s training time',
            lessons: 'Large datasets enable complex models, LightGBM excellent for speed'
        }
    };
    
    const study = caseStudies[study];
    const detailsContainer = document.getElementById('case-study-details');
    
    detailsContainer.innerHTML = `
        <div class="case-study-details">
            <h4>${study.title}</h4>
            <div class="case-study-content">
                <div class="case-section">
                    <h5>Problem:</h5>
                    <p>${study.problem}</p>
                </div>
                <div class="case-section">
                    <h5>Data:</h5>
                    <p>${study.data}</p>
                </div>
                <div class="case-section">
                    <h5>Solution:</h5>
                    <p>${study.solution}</p>
                </div>
                <div class="case-section">
                    <h5>Results:</h5>
                    <p>${study.results}</p>
                </div>
                <div class="case-section">
                    <h5>Key Lessons:</h5>
                    <p>${study.lessons}</p>
                </div>
            </div>
        </div>
    `;
}

// Initialize Chapter 8 when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 8 interactive functions loaded');
    
    // Initialize default scenario
    showScenario('general');
});
