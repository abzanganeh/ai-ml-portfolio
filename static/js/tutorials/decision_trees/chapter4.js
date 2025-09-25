// Chapter 4: Overfitting and Pruning - JavaScript Demo

// Global variables for the demo
let pruningDemoData = null;
let pruningDemoState = {
    hasData: false,
    hasOverfittedTree: false,
    hasPrunedTree: false,
    currentStep: 0
};

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Decision Trees Chapter 4: Initializing...');
    initializeTutorial();
    initializePruningDemo();
});

function initializeTutorial() {
    // Initialize section navigation
    const sections = ['overfitting', 'pre-pruning', 'post-pruning', 'validation', 'demo', 'quiz'];
    const labels = ['Understanding Overfitting', 'Pre-pruning', 'Post-pruning', 'Cross-Validation', 'Interactive Demo', 'Quiz'];
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', labels);
    
    // Initialize shared tutorial functionality
    if (typeof initializeSectionNavigation === 'function') {
        initializeSectionNavigation(sections, labels);
    }
    
    console.log('Decision Trees Chapter 4: Initialization complete');
}

function initializePruningDemo() {
    console.log('Initializing Pruning Demo...');
    updatePruningDemoStatus('Click "Generate Data" to start');
}

// Pruning Demo Functions
function generateOverfittingData() {
    console.log('Generating overfitting demo data...');
    updatePruningDemoStatus('Generating synthetic dataset...');
    
    // Generate synthetic data that can easily overfit
    const syntheticData = [];
    for (let i = 0; i < 50; i++) {
        const x1 = Math.random();
        const x2 = Math.random();
        const noise = Math.random() * 0.3;
        const y = (x1 + x2 + noise > 1) ? 1 : 0;
        syntheticData.push({ x1, x2, y });
    }
    
    pruningDemoData = syntheticData;
    pruningDemoState.hasData = true;
    
    // Display the data
    displayOverfittingData(syntheticData);
    updatePruningDemoStatus('Data generated! Click "Train Overfitted Tree" to see overfitting.');
    
    // Enable train button
    const trainBtn = document.querySelector('button[onclick="trainOverfittedTree()"]');
    if (trainBtn) {
        trainBtn.disabled = false;
    }
}

function trainOverfittedTree() {
    if (!pruningDemoState.hasData) {
        updatePruningDemoStatus('Please generate data first!');
        return;
    }
    
    console.log('Training overfitted tree...');
    updatePruningDemoStatus('Training overfitted tree (no depth limit)...');
    
    // Simulate training overfitted tree
    setTimeout(() => {
        pruningDemoState.hasOverfittedTree = true;
        displayOverfittingResults();
        updatePruningDemoStatus('Overfitted tree trained! Click "Apply Pruning" to see the difference.');
        
        // Enable prune button
        const pruneBtn = document.querySelector('button[onclick="applyPruning()"]');
        if (pruneBtn) {
            pruneBtn.disabled = false;
        }
    }, 2000);
}

function applyPruning() {
    if (!pruningDemoState.hasOverfittedTree) {
        updatePruningDemoStatus('Please train overfitted tree first!');
        return;
    }
    
    console.log('Applying pruning...');
    updatePruningDemoStatus('Applying cost complexity pruning...');
    
    // Simulate pruning
    setTimeout(() => {
        pruningDemoState.hasPrunedTree = true;
        displayPruningResults();
        updatePruningDemoStatus('Pruning applied! Compare the results above.');
    }, 1500);
}

function displayOverfittingData(data) {
    const canvas = document.getElementById('pruning-demo-canvas');
    if (!canvas) return;
    
    let tableHTML = `
        <div class="overfitting-data">
            <h4>Synthetic Dataset (${data.length} samples)</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>X1</th>
                        <th>X2</th>
                        <th>Class</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.slice(0, 10).forEach(row => {
        tableHTML += `
            <tr>
                <td>${row.x1.toFixed(3)}</td>
                <td>${row.x2.toFixed(3)}</td>
                <td class="class-${row.y}">${row.y}</td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
            <p><em>Showing first 10 samples...</em></p>
        </div>
    `;
    
    canvas.innerHTML = tableHTML;
}

function displayOverfittingResults() {
    const canvas = document.getElementById('pruning-demo-canvas');
    if (!canvas) return;
    
    const resultsHTML = `
        <div class="overfitting-results">
            <h4>Overfitted Tree Results</h4>
            
            <div class="python-code">
                <h5>Overfitted Tree Code:</h5>
                <pre><code># Train without any constraints (overfitting)
overfitted_tree = DecisionTreeClassifier(random_state=42)
overfitted_tree.fit(X_train, y_train)

# Evaluate performance
train_acc = overfitted_tree.score(X_train, y_train)
test_acc = overfitted_tree.score(X_test, y_test)

print(f"Training Accuracy: {train_acc:.3f}")
print(f"Test Accuracy: {test_acc:.3f}")
print(f"Tree Depth: {overfitted_tree.get_depth()}")
print(f"Number of Leaves: {overfitted_tree.get_n_leaves()}")</code></pre>
            </div>
            
            <div class="results-comparison">
                <div class="result-card overfitted">
                    <h5>Overfitted Tree</h5>
                    <div class="metrics">
                        <div class="metric">
                            <span class="metric-label">Training Accuracy:</span>
                            <span class="metric-value high">100.0%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Test Accuracy:</span>
                            <span class="metric-value low">75.0%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Tree Depth:</span>
                            <span class="metric-value">8</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Number of Leaves:</span>
                            <span class="metric-value">15</span>
                        </div>
                    </div>
                    <div class="warning">
                        ⚠️ <strong>Overfitting Detected!</strong> High training accuracy but low test accuracy.
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.innerHTML = resultsHTML;
}

function displayPruningResults() {
    const canvas = document.getElementById('pruning-demo-canvas');
    if (!canvas) return;
    
    const resultsHTML = `
        <div class="pruning-results">
            <h4>Pruned Tree Results</h4>
            
            <div class="python-code">
                <h5>Pruned Tree Code:</h5>
                <pre><code># Apply cost complexity pruning
path = overfitted_tree.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = path.ccp_alphas

# Find optimal alpha using cross-validation
best_alpha = 0.02  # Found through CV
pruned_tree = DecisionTreeClassifier(ccp_alpha=best_alpha, random_state=42)
pruned_tree.fit(X_train, y_train)

# Evaluate performance
train_acc = pruned_tree.score(X_train, y_train)
test_acc = pruned_tree.score(X_test, y_test)</code></pre>
            </div>
            
            <div class="results-comparison">
                <div class="comparison-grid">
                    <div class="result-card overfitted">
                        <h5>Overfitted Tree</h5>
                        <div class="metrics">
                            <div class="metric">
                                <span class="metric-label">Training Accuracy:</span>
                                <span class="metric-value high">100.0%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Test Accuracy:</span>
                                <span class="metric-value low">75.0%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Tree Depth:</span>
                                <span class="metric-value">8</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Number of Leaves:</span>
                                <span class="metric-value">15</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-card pruned">
                        <h5>Pruned Tree</h5>
                        <div class="metrics">
                            <div class="metric">
                                <span class="metric-label">Training Accuracy:</span>
                                <span class="metric-value medium">90.0%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Test Accuracy:</span>
                                <span class="metric-value high">88.0%</span>
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
                        <div class="success">
                            ✅ <strong>Better Generalization!</strong> Higher test accuracy with simpler tree.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.innerHTML = resultsHTML;
}

function resetPruningDemo() {
    console.log('Resetting pruning demo...');
    
    pruningDemoData = null;
    pruningDemoState = {
        hasData: false,
        hasOverfittedTree: false,
        hasPrunedTree: false,
        currentStep: 0
    };
    
    // Clear visualizations
    const canvas = document.getElementById('pruning-demo-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Tree visualization will appear here</p>';
    }
    
    // Reset status
    updatePruningDemoStatus('Click "Generate Data" to start');
    
    // Disable buttons
    const buttons = ['trainOverfittedTree', 'applyPruning'];
    buttons.forEach(funcName => {
        const btn = document.querySelector(`button[onclick="${funcName}()"]`);
        if (btn) {
            btn.disabled = true;
        }
    });
}

function updatePruningDemoStatus(message) {
    const statusDiv = document.getElementById('pruning-demo-status');
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
window.generateOverfittingData = generateOverfittingData;
window.trainOverfittedTree = trainOverfittedTree;
window.applyPruning = applyPruning;
window.resetPruningDemo = resetPruningDemo;
window.checkAnswer = checkAnswer;