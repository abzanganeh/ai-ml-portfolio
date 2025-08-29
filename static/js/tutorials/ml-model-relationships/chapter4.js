let selectedModels = ['linear', 'tree'];
let modelPredictions = [
    {pred: 'Yes', conf: 85, correct: true},
    {pred: 'No', conf: 73, correct: false},
    {pred: 'Yes', conf: 91, correct: true},
    {pred: 'Yes', conf: 67, correct: true},
    {pred: 'No', conf: 79, correct: false}
];

// Ensemble Voting Demo
function toggleModelPrediction(modelNum) {
    const predElement = document.getElementById(`model${modelNum}-pred`);
    const card = event.currentTarget;
    
    // Toggle prediction
    if (modelPredictions[modelNum-1].pred === 'Yes') {
        modelPredictions[modelNum-1].pred = 'No';
        modelPredictions[modelNum-1].correct = false;
    } else {
        modelPredictions[modelNum-1].pred = 'Yes';
        modelPredictions[modelNum-1].correct = true;
    }
    
    predElement.textContent = modelPredictions[modelNum-1].pred;
    
    // Update card styling
    card.classList.remove('correct', 'incorrect');
    if (modelPredictions[modelNum-1].correct) {
        card.classList.add('correct');
    } else {
        card.classList.add('incorrect');
    }
    
    updateEnsembleResult();
}

function updateEnsembleResult() {
    const yesVotes = modelPredictions.filter(m => m.pred === 'Yes').length;
    const noVotes = modelPredictions.length - yesVotes;
    const avgConfidence = modelPredictions.reduce((sum, m) => sum + m.conf, 0) / modelPredictions.length;
    
    document.getElementById('ensemble-prediction').textContent = yesVotes > noVotes ? 'YES' : 'NO';
    document.getElementById('ensemble-reasoning').textContent = `${yesVotes} models vote YES, ${noVotes} vote NO`;
    document.getElementById('ensemble-confidence').textContent = `Average confidence: ${Math.round(avgConfidence)}%`;
}

// Model Selection for Wisdom of Crowds
function toggleModelType(modelType) {
    const checkbox = event.currentTarget;
    const input = checkbox.querySelector('input');
    
    checkbox.classList.toggle('selected');
    input.checked = checkbox.classList.contains('selected');
    
    if (checkbox.classList.contains('selected')) {
        selectedModels.push(modelType);
    } else {
        selectedModels = selectedModels.filter(m => m !== modelType);
    }
    
    updateEnsemblePerformance();
}

function updateEnsemblePerformance() {
    const basePerformances = {
        linear: 0.82,
        tree: 0.79,
        svm: 0.85,
        knn: 0.76,
        nb: 0.74
    };
    
    if (selectedModels.length === 0) {
        document.getElementById('individual-best').textContent = '0.00';
        document.getElementById('ensemble-perf').textContent = '0.00';
        document.getElementById('diversity-score').textContent = '0.00';
        document.getElementById('improvement').textContent = '+0%';
        return;
    }
    
    const individualPerfs = selectedModels.map(m => basePerformances[m]);
    const bestIndividual = Math.max(...individualPerfs);
    
    // Simulate diversity and ensemble performance
    const diversity = Math.min(0.95, selectedModels.length * 0.15 + 0.1);
    const ensemblePerf = bestIndividual + (diversity * 0.1);
    const improvement = ((ensemblePerf - bestIndividual) / bestIndividual * 100);
    
    document.getElementById('individual-best').textContent = bestIndividual.toFixed(2);
    document.getElementById('ensemble-perf').textContent = ensemblePerf.toFixed(2);
    document.getElementById('diversity-score').textContent = diversity.toFixed(2);
    document.getElementById('improvement').textContent = `+${improvement.toFixed(0)}%`;
    
    // Update explanation
    const explanation = document.getElementById('diversity-explanation');
    if (diversity > 0.6) {
        explanation.innerHTML = '<h5>High Model Diversity</h5><p>Your selected models make different types of errors, leading to strong ensemble performance!</p>';
    } else {
        explanation.innerHTML = '<h5>Low Model Diversity</h5><p>Selected models are too similar. Try adding different algorithm types for better ensemble performance.</p>';
    }
}

// Bagging Demo
function updateBaggingDemo() {
    const bootstrapSize = parseInt(document.getElementById('bootstrap-size').value);
    const numModels = parseInt(document.getElementById('num-models').value);
    
    document.getElementById('bootstrap-value').textContent = `${bootstrapSize}%`;
    document.getElementById('models-value').textContent = numModels;
    
    const sampleSize = Math.round(1000 * bootstrapSize / 100);
    document.getElementById('sample-info').textContent = `${numModels} × ${sampleSize} samples`;
    
    // Simulate bagging effects
    const baseVariance = 0.20;
    const varianceReduction = Math.sqrt(numModels) / numModels;
    const newVariance = baseVariance * varianceReduction;
    
    const baseBias = 0.08;
    const sampleEffect = (100 - bootstrapSize) * 0.001;
    const newBias = baseBias + sampleEffect;
    
    const accuracy = 0.95 - newVariance - newBias;
    
    document.getElementById('bagging-variance').textContent = newVariance.toFixed(2);
    document.getElementById('bagging-bias').textContent = newBias.toFixed(2);
    document.getElementById('bagging-accuracy').textContent = accuracy.toFixed(2);
}

// Boosting Demo
function updateBoostingDemo() {
    const rounds = parseInt(document.getElementById('boosting-rounds').value);
    document.getElementById('rounds-value').textContent = rounds;
    
    const container = document.getElementById('boosting-sequence');
    let html = '<div class="process-flow" style="flex-direction: column; gap: 1rem;">';
    
    for (let i = 1; i <= rounds; i++) {
        const error = Math.max(0.02, 0.25 - (i * 0.03));
        const focus = i === 1 ? 'All data equally' : `Focus on ${Math.round(error * 500)} difficult examples`;
        
        html += `
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <div class="process-step">Round ${i}<br><small>Error: ${(error * 100).toFixed(0)}%</small></div>
                <div class="process-arrow">→</div>
                <div class="process-step">${focus}<br><small>Train weak learner</small></div>
            </div>
        `;
        
        if (i < rounds) {
            html += '<div style="text-align: center; color: #64748b; font-size: 0.9rem;">Update example weights based on errors</div>';
        }
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Update metrics
    const finalError = Math.max(0.02, 0.25 - (rounds * 0.03));
    const bias = Math.max(0.03, 0.15 - (rounds * 0.02));
    const accuracy = 1 - finalError;
    
    document.getElementById('boosting-error').textContent = finalError.toFixed(2);
    document.getElementById('boosting-bias').textContent = bias.toFixed(2);
    document.getElementById('boosting-accuracy').textContent = accuracy.toFixed(2);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateEnsembleResult();
    updateEnsemblePerformance();
    updateBaggingDemo();
    updateBoostingDemo();
});