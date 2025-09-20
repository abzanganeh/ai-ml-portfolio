// Chapter 14: Clustering Evaluation - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 14: Clustering Evaluation loaded');
    
    // Initialize demo functionality
    initializeDemo();
});

// ===== CHAPTER 14 DEMO FUNCTIONS =====

// Initialize demo when page loads
function initializeDemo() {
    console.log('Initializing Chapter 14 evaluation demo...');
    updateEvalDemo();
    updateStabilityDemo();
    updateSelectionDemo();
}

// Update evaluation demo
function updateEvalDemo() {
    const dataset = document.getElementById('eval-dataset');
    const algorithm = document.getElementById('eval-algorithm');
    const clusters = document.getElementById('eval-clusters');
    
    if (!dataset || !algorithm || !clusters) return;
    
    document.getElementById('eval-k-val').textContent = clusters.value;
    
    // Simulate metric values based on scenario
    const scenarios = {
        'wellseparated': { sil: 0.65, db: 1.23, ch: 245.7, dunn: 0.42, interp: 'Good clustering quality with well-separated, compact clusters.' },
        'overlapping': { sil: 0.35, db: 1.85, ch: 125.2, dunn: 0.22, interp: 'Moderate quality with some cluster overlap.' },
        'different-sizes': { sil: 0.48, db: 1.52, ch: 198.7, dunn: 0.31, interp: 'Good separation but unbalanced cluster sizes.' },
        'noisy': { sil: 0.25, db: 2.18, ch: 96.4, dunn: 0.18, interp: 'Lower quality due to noise interference.' }
    };
    
    const scenario = scenarios[dataset.value];
    const algEffect = algorithm.value === 'dbscan' ? 1.1 : algorithm.value === 'gmm' ? 0.95 : algorithm.value === 'hierarchical' ? 1.05 : 1.0;
    
    document.getElementById('eval-silhouette').textContent = (scenario.sil * algEffect).toFixed(2);
    document.getElementById('eval-db').textContent = (scenario.db / algEffect).toFixed(2);
    document.getElementById('eval-ch').textContent = (scenario.ch * algEffect).toFixed(1);
    document.getElementById('eval-dunn').textContent = (scenario.dunn * algEffect).toFixed(2);
    document.getElementById('eval-interpretation').textContent = scenario.interp;
}

// Update stability demo
function updateStabilityDemo() {
    const runs = document.getElementById('stability-runs');
    const level = document.getElementById('stability-level');
    
    if (!runs || !level) return;
    
    document.getElementById('stability-runs-val').textContent = runs.value;
    document.getElementById('stability-level-val').textContent = level.value;
}

// Run stability analysis
function runStabilityAnalysis() {
    const method = document.getElementById('stability-method').value;
    const runs = parseInt(document.getElementById('stability-runs').value);
    const level = parseFloat(document.getElementById('stability-level').value);
    
    // Simulate stability analysis results
    const baseARI = 0.78;
    const variation = level * 0.5;
    
    const meanARI = baseARI + (Math.random() - 0.5) * variation;
    const stdDev = variation * 0.3;
    const minARI = Math.max(0, meanARI - stdDev * 2);
    const maxARI = Math.min(1, meanARI + stdDev * 2);
    
    document.getElementById('stability-mean').textContent = meanARI.toFixed(2);
    document.getElementById('stability-std').textContent = stdDev.toFixed(2);
    document.getElementById('stability-min').textContent = minARI.toFixed(2);
    document.getElementById('stability-max').textContent = maxARI.toFixed(2);
    
    const assessment = meanARI > 0.7 ? 'High stability - clustering is robust to perturbations.' :
                      meanARI > 0.5 ? 'Moderate stability - some sensitivity to perturbations.' :
                      'Low stability - clustering is sensitive to perturbations.';
    
    document.getElementById('stability-assessment').textContent = assessment;
}

// Update selection demo
function updateSelectionDemo() {
    const maxK = document.getElementById('max-k');
    const method = document.getElementById('selection-metric').value;
    const complexity = document.getElementById('selection-data').value;
    
    if (!maxK) return;
    
    document.getElementById('max-k-val').textContent = maxK.value;
    
    // Simulate parameter selection results
    const complexityFactors = {
        'simple': { optimal: 3, score: 0.85, confidence: 'High', alternatives: '2, 4' },
        'moderate': { optimal: 4, score: 0.73, confidence: 'High', alternatives: '3, 5' },
        'complex': { optimal: 6, score: 0.62, confidence: 'Medium', alternatives: '5, 7' }
    };
    
    const factor = complexityFactors[complexity];
    const methodEffect = method === 'gap' ? 1.0 : method === 'elbow' ? 0.95 : method === 'silhouette' ? 1.05 : 0.9;
    
    document.getElementById('selection-optimal').textContent = factor.optimal;
    document.getElementById('selection-score').textContent = (factor.score * methodEffect).toFixed(2);
    document.getElementById('selection-confidence').textContent = factor.confidence;
    document.getElementById('selection-alternative').textContent = factor.alternatives;
}

// Quiz functionality
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'b', 'q2': 'b', 'q3': 'b', 'q4': 'b', 'q5': 'b'
    };

    const explanations = {
        'q1': 'Silhouette coefficient ranges from -1 to 1, where values close to 1 indicate excellent clustering with well-separated, compact clusters.',
        'q2': 'The Davies-Bouldin Index measures cluster similarity - lower values indicate better separated, more distinct clusters.',
        'q3': 'External metrics require known ground truth labels to compare against. They provide the most reliable evaluation when available.',
        'q4': 'The Gap Statistic compares the within-cluster dispersion of actual data to that of reference (uniform) data to determine optimal cluster number.',
        'q5': 'High stability indicates that clustering results are consistent across different data samples, suggesting robust and reliable cluster structure.'
    };

    // Collect user answers
    let userAnswers = {};
    let score = 0;
    
    for (let i = 1; i <= 5; i++) {
        const questionName = 'q' + i;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        if (selectedOption) {
            userAnswers[questionName] = selectedOption.value;
            if (selectedOption.value === correctAnswers[questionName]) {
                score++;
            }
        }
    }

    // Display results
    const percentage = Math.round((score / 5) * 100);
    let performanceLevel = '';
    let feedback = '';

    if (percentage >= 90) {
        performanceLevel = 'Excellent';
        feedback = 'Outstanding! You have mastered clustering evaluation concepts.';
    } else if (percentage >= 80) {
        performanceLevel = 'Very Good';
        feedback = 'Great job! You have strong understanding of evaluation metrics.';
    } else if (percentage >= 70) {
        performanceLevel = 'Good';
        feedback = 'Good understanding! Review the missed questions to improve.';
    } else if (percentage >= 60) {
        performanceLevel = 'Fair';
        feedback = 'Decent foundation, but review evaluation concepts.';
    } else {
        performanceLevel = 'Needs Improvement';
        feedback = 'Consider reviewing the evaluation metrics and their applications.';
    }

    const scoreColor = percentage >= 70 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336';
    
    document.getElementById('score-display').innerHTML = 
        `<div style="background: ${scoreColor}; color: white; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
            Score: ${score}/5 (${percentage}%) - ${performanceLevel}
            <br><small>${feedback}</small>
        </div>`;

    // Show detailed results
    let detailedHTML = '<h4>Detailed Answer Review:</h4>';
    for (let i = 1; i <= 5; i++) {
        const questionName = 'q' + i;
        const userAnswer = userAnswers[questionName] || 'Not answered';
        const correctAnswer = correctAnswers[questionName];
        const isCorrect = userAnswer === correctAnswer;
        
        detailedHTML += `
            <div style="background: ${isCorrect ? '#e8f5e8' : '#ffebee'}; border: 1px solid ${isCorrect ? '#4caf50' : '#f44336'}; border-radius: 6px; padding: 1rem; margin: 0.5rem 0;">
                <strong>Question ${i}:</strong> ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                <br><small>Your answer: ${userAnswer} | Correct answer: ${correctAnswer}</small>
                <br><em>${explanations[questionName]}</em>
            </div>
        `;
    }

    document.getElementById('detailed-results').innerHTML = detailedHTML;
    document.getElementById('quiz-results').style.display = 'block';
    
    // Scroll to results
    document.getElementById('quiz-results').scrollIntoView({ behavior: 'smooth' });
}

// Make functions globally available
window.updateEvalDemo = updateEvalDemo;
window.updateStabilityDemo = updateStabilityDemo;
window.runStabilityAnalysis = runStabilityAnalysis;
window.updateSelectionDemo = updateSelectionDemo;
window.checkQuizAnswers = checkQuizAnswers;