// Chapter 3: Python Implementation - JavaScript Demo

// Global variables for the demo
let pythonDemoData = null;
let pythonDemoState = {
    hasData: false,
    hasTree: false,
    currentStep: 0
};

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Decision Trees Chapter 3: Initializing...');
    initializeTutorial();
    initializePythonDemo();
});

function initializeTutorial() {
    // Initialize section navigation
    const sections = ['sklearn', 'custom', 'visualization', 'parameters', 'demo', 'quiz'];
    const labels = ['Using scikit-learn', 'Custom Implementation', 'Tree Visualization', 'Parameters & Tuning', 'Interactive Demo', 'Quiz'];
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', labels);
    
    // Initialize shared tutorial functionality
    if (typeof initializeSectionNavigation === 'function') {
        initializeSectionNavigation(sections, labels);
    }
    
    console.log('Decision Trees Chapter 3: Initialization complete');
}

function initializePythonDemo() {
    console.log('Initializing Python Demo...');
    updatePythonDemoStatus('Click "Load Dataset" to start');
}

// Python Demo Functions
function loadDataset() {
    console.log('Loading dataset...');
    updatePythonDemoStatus('Loading Iris dataset...');
    
    // Simulate loading dataset
    setTimeout(() => {
        pythonDemoData = {
            name: 'Iris Dataset',
            samples: 150,
            features: 4,
            classes: 3
        };
        
        pythonDemoState.hasData = true;
        displayDatasetInfo();
        updatePythonDemoStatus('Dataset loaded! Click "Train Tree" to build the model.');
        
        // Enable train button
        const trainBtn = document.querySelector('button[onclick="trainTree()"]');
        if (trainBtn) {
            trainBtn.disabled = false;
        }
    }, 1000);
}

function trainTree() {
    if (!pythonDemoState.hasData) {
        updatePythonDemoStatus('Please load dataset first!');
        return;
    }
    
    console.log('Training decision tree...');
    updatePythonDemoStatus('Training decision tree...');
    
    // Simulate training
    setTimeout(() => {
        pythonDemoState.hasTree = true;
        displayTrainingResults();
        updatePythonDemoStatus('Tree trained! Click "Visualize Tree" to see the structure.');
        
        // Enable visualize button
        const vizBtn = document.querySelector('button[onclick="visualizeTree()"]');
        if (vizBtn) {
            vizBtn.disabled = false;
        }
    }, 2000);
}

function visualizeTree() {
    if (!pythonDemoState.hasTree) {
        updatePythonDemoStatus('Please train tree first!');
        return;
    }
    
    console.log('Visualizing tree...');
    updatePythonDemoStatus('Generating tree visualization...');
    
    // Simulate visualization
    setTimeout(() => {
        displayTreeVisualization();
        updatePythonDemoStatus('Tree visualized! You can see the decision structure.');
    }, 1500);
}

function displayDatasetInfo() {
    const canvas = document.getElementById('python-demo-canvas');
    if (!canvas) return;
    
    const infoHTML = `
        <div class="dataset-info">
            <h4>Dataset Information</h4>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Dataset Name:</span>
                    <span class="info-value">${pythonDemoData.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Samples:</span>
                    <span class="info-value">${pythonDemoData.samples}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Features:</span>
                    <span class="info-value">${pythonDemoData.features}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Classes:</span>
                    <span class="info-value">${pythonDemoData.classes}</span>
                </div>
            </div>
            
            <div class="python-code">
                <h5>Python Code:</h5>
                <pre><code>from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target

print(f"Dataset shape: {X.shape}")
print(f"Classes: {iris.target_names}")</code></pre>
            </div>
        </div>
    `;
    
    canvas.innerHTML = infoHTML;
}

function displayTrainingResults() {
    const canvas = document.getElementById('python-demo-canvas');
    if (!canvas) return;
    
    const resultsHTML = `
        <div class="training-results">
            <h4>Training Results</h4>
            
            <div class="python-code">
                <h5>Training Code:</h5>
                <pre><code># Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train decision tree
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)

# Make predictions
predictions = clf.predict(X_test)
accuracy = clf.score(X_test, y_test)

print(f"Accuracy: {accuracy:.3f}")
print(f"Tree depth: {clf.get_depth()}")
print(f"Number of leaves: {clf.get_n_leaves()}")</code></pre>
            </div>
            
            <div class="results-metrics">
                <div class="metric">
                    <span class="metric-label">Accuracy:</span>
                    <span class="metric-value">0.967</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Tree Depth:</span>
                    <span class="metric-value">3</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Number of Leaves:</span>
                    <span class="metric-value">5</span>
                </div>
            </div>
        </div>
    `;
    
    canvas.innerHTML = resultsHTML;
}

function displayTreeVisualization() {
    const canvas = document.getElementById('python-demo-canvas');
    if (!canvas) return;
    
    const vizHTML = `
        <div class="tree-visualization">
            <h4>Decision Tree Structure</h4>
            
            <div class="python-code">
                <h5>Visualization Code:</h5>
                <pre><code>import matplotlib.pyplot as plt
from sklearn.tree import plot_tree

plt.figure(figsize=(12, 8))
plot_tree(clf, feature_names=iris.feature_names, 
          class_names=iris.target_names, filled=True)
plt.title("Decision Tree Visualization")
plt.show()</code></pre>
            </div>
            
            <div class="tree-structure">
                <div class="tree-node root">
                    <div class="node-question">petal width ≤ 0.8?</div>
                    <div class="tree-branches">
                        <div class="branch">
                            <span class="branch-label">Yes</span>
                            <div class="tree-node leaf">
                                <div class="node-answer">Setosa</div>
                            </div>
                        </div>
                        <div class="branch">
                            <span class="branch-label">No</span>
                            <div class="tree-node internal">
                                <div class="node-question">petal width ≤ 1.75?</div>
                                <div class="tree-branches">
                                    <div class="branch">
                                        <span class="branch-label">Yes</span>
                                        <div class="tree-node leaf">
                                            <div class="node-answer">Versicolor</div>
                                        </div>
                                    </div>
                                    <div class="branch">
                                        <span class="branch-label">No</span>
                                        <div class="tree-node leaf">
                                            <div class="node-answer">Virginica</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.innerHTML = vizHTML;
}

function resetPythonDemo() {
    console.log('Resetting Python demo...');
    
    pythonDemoData = null;
    pythonDemoState = {
        hasData: false,
        hasTree: false,
        currentStep: 0
    };
    
    // Clear visualizations
    const canvas = document.getElementById('python-demo-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Python code and results will appear here</p>';
    }
    
    // Reset status
    updatePythonDemoStatus('Click "Load Dataset" to start');
    
    // Disable buttons
    const buttons = ['trainTree', 'visualizeTree'];
    buttons.forEach(funcName => {
        const btn = document.querySelector(`button[onclick="${funcName}()"]`);
        if (btn) {
            btn.disabled = true;
        }
    });
}

function updatePythonDemoStatus(message) {
    const statusDiv = document.getElementById('python-demo-status');
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
window.loadDataset = loadDataset;
window.trainTree = trainTree;
window.visualizeTree = visualizeTree;
window.resetPythonDemo = resetPythonDemo;
window.checkAnswer = checkAnswer;