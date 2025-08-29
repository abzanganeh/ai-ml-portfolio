
let forestTrees = [];
        
// Quick Demo Functions
function updateQuickDemo() {
    const numTrees = parseInt(document.getElementById('demo-trees').value);
    document.getElementById('demo-trees-value').textContent = numTrees;
    
    const container = document.getElementById('demo-tree-grid');
    let html = '';
    
    const predictions = ['A', 'B'];
    let votesA = 0, votesB = 0;
    
    for (let i = 0; i < numTrees; i++) {
        const pred = predictions[Math.floor(Math.random() * predictions.length)];
        const conf = Math.floor(Math.random() * 30) + 60; // 60-90%
        
        if (pred === 'A') votesA++; else votesB++;
        
        html += `
            <div class="tree-card">
                <span class="tree-icon">🌳</span>
                <div class="tree-prediction">${pred}</div>
                <div class="tree-confidence">${conf}%</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    const finalPred = votesA > votesB ? 'Class A' : 'Class B';
    const finalConf = Math.round(Math.max(votesA, votesB) / numTrees * 100);
    const voteBreakdown = votesA > votesB ? `${votesA}/${numTrees} votes` : `${votesB}/${numTrees} votes`;
    
    document.getElementById('forest-prediction').textContent = finalPred;
    document.getElementById('forest-confidence').textContent = `Confidence: ${finalConf}% (${voteBreakdown})`;
}

// Forest Construction
function updateForestConstruction() {
    const nTrees = parseInt(document.getElementById('n-trees').value);
    const maxDepth = parseInt(document.getElementById('max-depth').value);
    const maxFeatures = parseInt(document.getElementById('max-features').value);
    const minSamples = parseInt(document.getElementById('min-samples').value);
    
    // Update display values
    document.getElementById('n-trees-value').textContent = nTrees;
    document.getElementById('max-depth-value').textContent = maxDepth;
    document.getElementById('max-features-value').textContent = maxFeatures;
    document.getElementById('min-samples-value').textContent = minSamples;
    
    // Simulate performance metrics
    const baseTrainAcc = 0.85;
    const treeComplexity = (maxDepth / 20) + (1 / (minSamples + 1));
    const trainAcc = Math.min(0.99, baseTrainAcc + (treeComplexity * 0.1) + (nTrees * 0.001));
    
    const diversityFactor = Math.min(1, Math.sqrt(nTrees) / 10);
    const featureRandomness = (10 - maxFeatures) / 10;
    const valAcc = trainAcc - (treeComplexity * 0.05) + (diversityFactor * 0.03) + (featureRandomness * 0.02);
    
    const overfitScore = Math.max(0, trainAcc - valAcc);
    const trainTime = (nTrees * 0.05) + (maxDepth * 0.1) + 0.5;
    
    document.getElementById('train-acc').textContent = trainAcc.toFixed(2);
    document.getElementById('val-acc').textContent = Math.max(0.6, valAcc).toFixed(2);
    document.getElementById('overfit-score').textContent = overfitScore.toFixed(2);
    document.getElementById('train-time').textContent = trainTime.toFixed(1) + 's';
    
    // Update analysis
    let analysis = '';
    if (overfitScore > 0.15) {
        analysis = 'High overfitting detected. Consider reducing max_depth or increasing min_samples_leaf.';
    } else if (overfitScore < 0.05) {
        analysis = 'Good balance between bias and variance. This configuration looks promising.';
    } else {
        analysis = 'Moderate overfitting. The model is learning well but could benefit from some regularization.';
    }
    
    if (trainTime > 10) {
        analysis += ' Training time is quite high - consider reducing n_trees for faster training.';
    }
    
    document.getElementById('config-analysis').textContent = analysis;
}

// Bootstrap Sampling
function generateBootstrapSamples() {
    const container = document.getElementById('bootstrap-samples');
    const originalData = Array.from({length: 20}, (_, i) => i + 1);
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'];
    
    let html = '';
    let totalUnique = 0;
    let totalSamples = 0;
    
    for (let i = 0; i < 5; i++) {
        // Generate bootstrap sample
        const sample = [];
        const used = new Set();
        
        for (let j = 0; j < 16; j++) {
            const idx = Math.floor(Math.random() * originalData.length);
            const value = originalData[idx];
            sample.push(value);
            used.add(value);
            totalSamples++;
        }
        
        totalUnique += used.size;
        
        html += `
            <div class="bootstrap-sample">
                <h6>Sample ${i + 1}</h6>
                <div class="sample-data">
        `;
        
        sample.forEach(val => {
            const colorIndex = (val - 1) % colors.length;
            html += `<div class="data-point" style="background: ${colors[colorIndex]}">${val}</div>`;
        });
        
        html += `
                </div>
                <div style="font-size: 0.8rem; margin-top: 0.5rem;">
                    Unique: ${used.size}/20
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Update statistics
    const avgUnique = Math.round(totalUnique / 5);
    const avgDuplicates = 16 - avgUnique;
    const diversity = (avgUnique / 20).toFixed(2);
    
    document.getElementById('unique-samples').textContent = `${Math.round(avgUnique/16*100)}%`;
    document.getElementById('duplicate-samples').textContent = `${Math.round(avgDuplicates/16*100)}%`;
    document.getElementById('diversity-metric').textContent = diversity;
}

// Feature Importance
function updateFeatureImportance() {
    const nTrees = parseInt(document.getElementById('importance-trees').value);
    document.getElementById('importance-trees-value').textContent = nTrees;
    
    const features = ['Age', 'Income', 'Education', 'Experience', 'Location'];
    const baseImportances = [0.35, 0.28, 0.18, 0.12, 0.07];
    
    // Simulate how more trees stabilize importance estimates
    const stability = Math.min(1, nTrees / 100);
    const noise = (1 - stability) * 0.3;
    
    const container = document.getElementById('importance-bars');
    let html = '';
    
    features.forEach((feature, i) => {
        const importance = baseImportances[i] + ((Math.random() - 0.5) * noise);
        const percentage = Math.max(0, importance * 100);
        
        html += `
            <div class="importance-bar">
                <div class="bar-label">${feature}</div>
                <div class="bar-fill" style="width: ${percentage}%;">
                    <div class="bar-value">${percentage.toFixed(1)}%</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Hyperparameter Analysis
function updateHyperparameterAnalysis() {
    const nTrees = parseInt(document.getElementById('tune-trees').value);
    const maxDepth = parseInt(document.getElementById('tune-depth').value);
    const maxFeatures = parseInt(document.getElementById('tune-features').value);
    
    document.getElementById('tune-trees-value').textContent = nTrees;
    document.getElementById('tune-depth-value').textContent = maxDepth;
    document.getElementById('tune-features-value').textContent = maxFeatures;
    
    // Simulate performance metrics
    const complexity = (maxDepth / 25) + (maxFeatures / 10);
    const diversity = Math.min(1, nTrees / 100) * (1 - maxFeatures / 10);
    
    const accuracy = 0.75 + (complexity * 0.1) + (diversity * 0.1);
    const precision = accuracy - 0.02;
    const recall = accuracy + 0.02;
    const f1 = 2 * (precision * recall) / (precision + recall);
    
    const trainTime = (nTrees * 0.02) + (maxDepth * 0.15) + (maxFeatures * 0.1) + 1;
    const memory = Math.round((nTrees * 2) + (maxDepth * 5) + 50);
    
    document.getElementById('tune-accuracy').textContent = Math.min(0.95, accuracy).toFixed(2);
    document.getElementById('tune-precision').textContent = Math.min(0.95, precision).toFixed(2);
    document.getElementById('tune-recall').textContent = Math.min(0.95, recall).toFixed(2);
    document.getElementById('tune-f1').textContent = Math.min(0.95, f1).toFixed(2);
    document.getElementById('tune-time').textContent = trainTime.toFixed(1) + 's';
    document.getElementById('tune-memory').textContent = memory + 'MB';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateQuickDemo();
    updateForestConstruction();
    generateBootstrapSamples();
    updateFeatureImportance();
    updateHyperparameterAnalysis();
});