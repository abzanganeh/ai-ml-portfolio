// Chapter 5: Advanced Techniques - JavaScript Demo

// Global variables for the demo
let advancedDemoData = null;
let advancedDemoState = {
    hasData: false,
    hasSingleTree: false,
    hasRandomForest: false,
    hasGradientBoosting: false,
    currentStep: 0
};

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Decision Trees Chapter 5: Initializing...');
    initializeTutorial();
    initializeAdvancedDemo();
});

function initializeTutorial() {
    // Initialize section navigation
    const sections = ['ensemble', 'random-forest', 'gradient-boosting', 'feature-engineering', 'demo', 'quiz'];
    const labels = ['Ensemble Methods', 'Random Forest', 'Gradient Boosting', 'Feature Engineering', 'Interactive Demo', 'Quiz'];
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', labels);
    
    // Initialize shared tutorial functionality
    if (typeof initializeSectionNavigation === 'function') {
        initializeSectionNavigation(sections, labels);
    }
    
    console.log('Decision Trees Chapter 5: Initialization complete');
}

function initializeAdvancedDemo() {
    console.log('Initializing Advanced Demo...');
    updateAdvancedDemoStatus('Click "Load Dataset" to start');
}

// Advanced Demo Functions
function loadAdvancedData() {
    console.log('Loading advanced demo data...');
    updateAdvancedDemoStatus('Loading dataset...');
    
    // Simulate loading dataset
    setTimeout(() => {
        advancedDemoData = {
            name: 'Wine Quality Dataset',
            samples: 1599,
            features: 11,
            classes: 6
        };
        
        advancedDemoState.hasData = true;
        displayAdvancedDatasetInfo();
        updateAdvancedDemoStatus('Dataset loaded! Now you can train different models.');
        
        // Enable all training buttons
        const buttons = ['trainSingleTree', 'trainRandomForest', 'trainGradientBoosting'];
        buttons.forEach(funcName => {
            const btn = document.querySelector(`button[onclick="${funcName}()"]`);
            if (btn) {
                btn.disabled = false;
            }
        });
    }, 1000);
}

function trainSingleTree() {
    if (!advancedDemoState.hasData) {
        updateAdvancedDemoStatus('Please load dataset first!');
        return;
    }
    
    console.log('Training single decision tree...');
    updateAdvancedDemoStatus('Training single decision tree...');
    
    // Simulate training
    setTimeout(() => {
        advancedDemoState.hasSingleTree = true;
        displayModelResults();
        updateAdvancedDemoStatus('Single tree trained! Try Random Forest or Gradient Boosting for comparison.');
    }, 1500);
}

function trainRandomForest() {
    if (!advancedDemoState.hasData) {
        updateAdvancedDemoStatus('Please load dataset first!');
        return;
    }
    
    console.log('Training Random Forest...');
    updateAdvancedDemoStatus('Training Random Forest (100 trees)...');
    
    // Simulate training
    setTimeout(() => {
        advancedDemoState.hasRandomForest = true;
        displayModelResults();
        updateAdvancedDemoStatus('Random Forest trained! Compare with other models.');
    }, 2000);
}

function trainGradientBoosting() {
    if (!advancedDemoState.hasData) {
        updateAdvancedDemoStatus('Please load dataset first!');
        return;
    }
    
    console.log('Training Gradient Boosting...');
    updateAdvancedDemoStatus('Training Gradient Boosting (100 estimators)...');
    
    // Simulate training
    setTimeout(() => {
        advancedDemoState.hasGradientBoosting = true;
        displayModelResults();
        updateAdvancedDemoStatus('Gradient Boosting trained! Compare all models above.');
    }, 2500);
}

function displayAdvancedDatasetInfo() {
    const canvas = document.getElementById('advanced-demo-canvas');
    if (!canvas) return;
    
    const infoHTML = `
        <div class="advanced-dataset-info">
            <h4>Dataset Information</h4>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Dataset Name:</span>
                    <span class="info-value">${advancedDemoData.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Samples:</span>
                    <span class="info-value">${advancedDemoData.samples}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Features:</span>
                    <span class="info-value">${advancedDemoData.features}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Classes:</span>
                    <span class="info-value">${advancedDemoData.classes}</span>
                </div>
            </div>
            
            <div class="python-code">
                <h5>Loading Code:</h5>
                <pre><code>import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load dataset
data = pd.read_csv('winequality.csv')
X = data.drop('quality', axis=1)
y = data['quality']

# Split and scale data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)</code></pre>
            </div>
        </div>
    `;
    
    canvas.innerHTML = infoHTML;
}

function displayModelResults() {
    const canvas = document.getElementById('advanced-demo-canvas');
    if (!canvas) return;
    
    let resultsHTML = `
        <div class="model-comparison">
            <h4>Model Performance Comparison</h4>
            
            <div class="python-code">
                <h5>Training Code:</h5>
                <pre><code>from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

# Single Decision Tree
tree = DecisionTreeClassifier(random_state=42)
tree.fit(X_train_scaled, y_train)

# Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train_scaled, y_train)

# Gradient Boosting
gb = GradientBoostingClassifier(n_estimators=100, random_state=42)
gb.fit(X_train_scaled, y_train)</code></pre>
            </div>
            
            <div class="results-grid">
    `;
    
    // Single Tree Results
    if (advancedDemoState.hasSingleTree) {
        resultsHTML += `
            <div class="model-card single-tree">
                <h5>Single Decision Tree</h5>
                <div class="metrics">
                    <div class="metric">
                        <span class="metric-label">Accuracy:</span>
                        <span class="metric-value">0.641</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Training Time:</span>
                        <span class="metric-value">0.02s</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Tree Depth:</span>
                        <span class="metric-value">15</span>
                    </div>
                </div>
                <div class="pros-cons">
                    <div class="pros">✅ Fast training</div>
                    <div class="cons">❌ Prone to overfitting</div>
                </div>
            </div>
        `;
    }
    
    // Random Forest Results
    if (advancedDemoState.hasRandomForest) {
        resultsHTML += `
            <div class="model-card random-forest">
                <h5>Random Forest</h5>
                <div class="metrics">
                    <div class="metric">
                        <span class="metric-label">Accuracy:</span>
                        <span class="metric-value">0.734</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Training Time:</span>
                        <span class="metric-value">0.45s</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Number of Trees:</span>
                        <span class="metric-value">100</span>
                    </div>
                </div>
                <div class="pros-cons">
                    <div class="pros">✅ Robust, parallel training</div>
                    <div class="cons">❌ Less interpretable</div>
                </div>
            </div>
        `;
    }
    
    // Gradient Boosting Results
    if (advancedDemoState.hasGradientBoosting) {
        resultsHTML += `
            <div class="model-card gradient-boosting">
                <h5>Gradient Boosting</h5>
                <div class="metrics">
                    <div class="metric">
                        <span class="metric-label">Accuracy:</span>
                        <span class="metric-value">0.756</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Training Time:</span>
                        <span class="metric-value">1.23s</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Number of Estimators:</span>
                        <span class="metric-value">100</span>
                    </div>
                </div>
                <div class="pros-cons">
                    <div class="pros">✅ High accuracy</div>
                    <div class="cons">❌ Slower training</div>
                </div>
            </div>
        `;
    }
    
    resultsHTML += `
            </div>
            
            <div class="comparison-summary">
                <h5>Summary</h5>
                <ul>
                    <li><strong>Single Tree:</strong> Fast but prone to overfitting</li>
                    <li><strong>Random Forest:</strong> Good balance of speed and accuracy</li>
                    <li><strong>Gradient Boosting:</strong> Highest accuracy but slower training</li>
                </ul>
            </div>
        </div>
    `;
    
    canvas.innerHTML = resultsHTML;
}

function resetAdvancedDemo() {
    console.log('Resetting advanced demo...');
    
    advancedDemoData = null;
    advancedDemoState = {
        hasData: false,
        hasSingleTree: false,
        hasRandomForest: false,
        hasGradientBoosting: false,
        currentStep: 0
    };
    
    // Clear visualizations
    const canvas = document.getElementById('advanced-demo-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Model comparison will appear here</p>';
    }
    
    // Reset status
    updateAdvancedDemoStatus('Click "Load Dataset" to start');
    
    // Disable all buttons
    const buttons = ['trainSingleTree', 'trainRandomForest', 'trainGradientBoosting'];
    buttons.forEach(funcName => {
        const btn = document.querySelector(`button[onclick="${funcName}()"]`);
        if (btn) {
            btn.disabled = true;
        }
    });
}

function updateAdvancedDemoStatus(message) {
    const statusDiv = document.getElementById('advanced-demo-status');
    if (statusDiv) {
        statusDiv.innerHTML = `<p>${message}</p>`;
    }
}

// Quiz Functions
function checkAnswer(questionNum, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const feedback = document.getElementById(`feedback${questionNum}`);
    
    if (!selectedAnswer) {
        feedback.innerHTML = '<div class="feedback-error">Please select an answer!</div>';
        return;
    }
    
    if (selectedAnswer.value === correctAnswer) {
        feedback.innerHTML = '<div class="feedback-correct">✅ Correct! Well done!</div>';
    } else {
        feedback.innerHTML = '<div class="feedback-incorrect">❌ Not quite. Try again!</div>';
    }
}

// Export functions for global access
window.loadAdvancedData = loadAdvancedData;
window.trainSingleTree = trainSingleTree;
window.trainRandomForest = trainRandomForest;
window.trainGradientBoosting = trainGradientBoosting;
window.resetAdvancedDemo = resetAdvancedDemo;
window.checkAnswer = checkAnswer;