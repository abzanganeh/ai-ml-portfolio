// Chapter 2: Foundation Models & Problems Interactive Functions

// Model recommendation system (already exists in shared-tutorial.js)
// This file contains Chapter 2 specific functions

// Dataset selection for overfitting demo
let currentDataset = 'simple';

function selectDataset(dataset) {
    // Remove active class from all buttons
    document.querySelectorAll('.dataset-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    event.target.classList.add('active');
    
    currentDataset = dataset;
    updateComplexity();
}

function updateComplexity() {
    const complexity = parseInt(document.getElementById('complexity-slider').value);
    const title = document.getElementById('complexity-title');
    const description = document.getElementById('complexity-description');
    
    let complexityText = '';
    let descriptionText = '';
    
    // Update based on current dataset
    if (currentDataset === 'simple') {
        if (complexity <= 3) {
            complexityText = `Good Fit (Depth: ${complexity})`;
            descriptionText = 'Perfect complexity for simple data. Model captures patterns without overfitting.';
        } else if (complexity <= 6) {
            complexityText = `Overfitting Risk (Depth: ${complexity})`;
            descriptionText = 'Starting to overfit. Model is too complex for simple data patterns.';
        } else {
            complexityText = `Severe Overfitting (Depth: ${complexity})`;
            descriptionText = 'Model is memorizing noise instead of learning patterns. Poor generalization expected.';
        }
    } else if (currentDataset === 'complex') {
        if (complexity <= 2) {
            complexityText = `Underfitting (Depth: ${complexity})`;
            descriptionText = 'Model too simple for complex data. Missing important patterns.';
        } else if (complexity <= 5) {
            complexityText = `Good Fit (Depth: ${complexity})`;
            descriptionText = 'Appropriate complexity for complex data. Capturing patterns well.';
        } else {
            complexityText = `Overfitting (Depth: ${complexity})`;
            descriptionText = 'Model becoming too complex, starting to overfit to training data.';
        }
    } else if (currentDataset === 'noisy') {
        if (complexity <= 2) {
            complexityText = `Robust Fit (Depth: ${complexity})`;
            descriptionText = 'Good choice for noisy data. Simple model ignores noise.';
        } else if (complexity <= 4) {
            complexityText = `Moderate Risk (Depth: ${complexity})`;
            descriptionText = 'Some overfitting to noise, but still reasonable performance.';
        } else {
            complexityText = `Noise Overfitting (Depth: ${complexity})`;
            descriptionText = 'Model is fitting noise instead of signal. Very poor generalization.';
        }
    }
    
    title.textContent = complexityText;
    description.textContent = descriptionText;
}

// Linear model demo functions
function updateLinearModel() {
    const complexity = parseInt(document.getElementById('linear-complexity').value);
    const noise = parseInt(document.getElementById('noise-level').value);
    const trainingSize = parseInt(document.getElementById('training-size').value);
    
    // Update display values
    document.getElementById('linear-complexity-value').textContent = complexity;
    document.getElementById('noise-level-value').textContent = noise;
    document.getElementById('training-size-value').textContent = trainingSize;
    
    // Simulate model performance
    const baseError = 0.1;
    const complexityError = complexity * 0.02;
    const noiseError = noise * 0.01;
    const sizeError = Math.max(0, 0.3 - (trainingSize / 1000) * 0.2);
    
    const totalError = baseError + complexityError + noiseError + sizeError;
    
    // Update performance display
    const performanceElement = document.getElementById('linear-performance');
    if (performanceElement) {
        performanceElement.innerHTML = `
            <div class="performance-metrics">
                <div class="metric">
                    <span class="metric-label">Training Error:</span>
                    <span class="metric-value">${(totalError * 0.8).toFixed(3)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Validation Error:</span>
                    <span class="metric-value">${totalError.toFixed(3)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Bias-Variance Tradeoff:</span>
                    <span class="metric-value">${complexity <= 3 ? 'Low Bias, Low Variance' : 'High Bias, High Variance'}</span>
                </div>
            </div>
        `;
    }
}

// Tree model demo functions
function updateTreeModel() {
    const depth = parseInt(document.getElementById('tree-depth').value);
    const minSamples = parseInt(document.getElementById('min-samples').value);
    const dataComplexity = parseInt(document.getElementById('tree-data-complexity').value);
    
    // Update display values
    document.getElementById('tree-depth-value').textContent = depth;
    document.getElementById('min-samples-value').textContent = minSamples;
    document.getElementById('tree-data-complexity-value').textContent = dataComplexity;
    
    // Simulate tree performance
    const overfittingRisk = depth > 5 ? 'High' : depth > 3 ? 'Medium' : 'Low';
    const generalization = minSamples > 20 ? 'Good' : minSamples > 10 ? 'Fair' : 'Poor';
    
    // Update performance display
    const performanceElement = document.getElementById('tree-performance');
    if (performanceElement) {
        performanceElement.innerHTML = `
            <div class="performance-metrics">
                <div class="metric">
                    <span class="metric-label">Overfitting Risk:</span>
                    <span class="metric-value ${overfittingRisk.toLowerCase()}">${overfittingRisk}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Generalization:</span>
                    <span class="metric-value ${generalization.toLowerCase()}">${generalization}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Model Complexity:</span>
                    <span class="metric-value">${depth * minSamples} parameters</span>
                </div>
            </div>
        `;
    }
}

// Bias-variance demonstration
function demonstrateBiasVariance() {
    const demoContainer = document.getElementById('bias-variance-demo');
    if (!demoContainer) return;
    
    demoContainer.innerHTML = `
        <div class="bias-variance-visualization">
            <h5>Bias-Variance Tradeoff in Action</h5>
            <div class="tradeoff-chart">
                <div class="chart-section">
                    <h6>High Bias (Underfitting)</h6>
                    <div class="error-bar high-bias">
                        <div class="error-fill" style="width: 80%;"></div>
                        <span>High Bias Error</span>
                    </div>
                    <p>Model too simple, misses patterns</p>
                </div>
                
                <div class="chart-section">
                    <h6>Balanced</h6>
                    <div class="error-bar balanced">
                        <div class="error-fill" style="width: 40%;"></div>
                        <span>Optimal Point</span>
                    </div>
                    <p>Good balance of bias and variance</p>
                </div>
                
                <div class="chart-section">
                    <h6>High Variance (Overfitting)</h6>
                    <div class="error-bar high-variance">
                        <div class="error-fill" style="width: 70%;"></div>
                        <span>High Variance Error</span>
                    </div>
                    <p>Model too complex, fits noise</p>
                </div>
            </div>
        </div>
    `;
}

// Problem demonstration
function updateProblemDemo() {
    const noise = parseInt(document.getElementById('demo-noise').value);
    const complexity = parseInt(document.getElementById('demo-complexity').value);
    
    // Update display values
    document.getElementById('demo-noise-value').textContent = noise;
    document.getElementById('demo-complexity-value').textContent = complexity;
    
    // Simulate how different models handle the same data
    const linearError = 0.1 + (complexity * 0.05) + (noise * 0.02);
    const treeError = 0.05 + (complexity > 3 ? 0.1 : 0.02) + (noise * 0.01);
    
    const comparisonElement = document.getElementById('problem-comparison');
    if (comparisonElement) {
        comparisonElement.innerHTML = `
            <div class="model-comparison-results">
                <div class="model-result">
                    <h6>Linear Model</h6>
                    <div class="error-indicator">
                        <div class="error-bar">
                            <div class="error-fill" style="width: ${Math.min(100, linearError * 1000)}%; background: ${linearError > 0.2 ? '#ef4444' : linearError > 0.15 ? '#f59e0b' : '#10b981'};"></div>
                        </div>
                        <span>Error: ${linearError.toFixed(3)}</span>
                    </div>
                    <p>${complexity > 3 ? 'Struggles with complex patterns' : 'Handles simple patterns well'}</p>
                </div>
                
                <div class="model-result">
                    <h6>Decision Tree</h6>
                    <div class="error-indicator">
                        <div class="error-bar">
                            <div class="error-fill" style="width: ${Math.min(100, treeError * 1000)}%; background: ${treeError > 0.2 ? '#ef4444' : treeError > 0.15 ? '#f59e0b' : '#10b981'};"></div>
                        </div>
                        <span>Error: ${treeError.toFixed(3)}</span>
                    </div>
                    <p>${noise > 5 ? 'Overfits to noise' : 'Captures patterns well'}</p>
                </div>
            </div>
        `;
    }
}

// Initialize Chapter 2 when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 2 interactive functions loaded');
    
    // Initialize default values
    updateComplexity();
    updateLinearModel();
    updateTreeModel();
    updateProblemDemo();
});
