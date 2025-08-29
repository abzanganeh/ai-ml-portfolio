// XGBoost Training Functions
function runXGBoostTraining() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '🔄 Training...';
    button.disabled = true;
    
    // Simulate training process
    setTimeout(() => {
        // Update metrics
        document.getElementById('accuracy-display').textContent = '94.2%';
        document.getElementById('time-display').textContent = '2.1s';
        document.getElementById('overfitting-display').textContent = 'Low';
        document.getElementById('memory-display').textContent = '98MB';
        
        // Update training chart
        updateTrainingChart();
        
        // Reset button
        button.innerHTML = '✅ Training Complete!';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }, 1500);
}

function resetParameters() {
    // Reset all parameter values to defaults
    document.getElementById('learning-rate-value').textContent = '0.1';
    document.getElementById('max-depth-value').textContent = '6';
    document.getElementById('n-estimators-value').textContent = '100';
    document.getElementById('subsample-value').textContent = '1.0';
    
    // Reset metrics to initial values
    document.getElementById('accuracy-display').textContent = '92.4%';
    document.getElementById('time-display').textContent = '1.8s';
    document.getElementById('overfitting-display').textContent = 'Low';
    document.getElementById('memory-display').textContent = '95MB';
    
    // Reset training chart
    resetTrainingChart();
    
    // Show feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '✅ Reset Complete!';
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 1000);
}

function showFeatureImportance(type) {
    const ctx = document.getElementById('feature-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.featureChart) {
        window.featureChart.destroy();
    }
    
    let data, title;
    
    switch(type) {
        case 'gain':
            data = [0.35, 0.25, 0.20, 0.15, 0.05];
            title = 'Gain Importance';
            break;
        case 'split':
            data = [0.30, 0.28, 0.22, 0.15, 0.05];
            title = 'Split Frequency';
            break;
        case 'cover':
            data = [0.40, 0.20, 0.18, 0.17, 0.05];
            title = 'Coverage';
            break;
    }
    
    window.featureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Age', 'Credit Score', 'Education', 'Employment'],
            datasets: [{
                label: title,
                data: data,
                backgroundColor: [
                    'rgba(255, 140, 0, 0.8)',
                    'rgba(255, 215, 0, 0.8)',
                    'rgba(199, 62, 29, 0.8)',
                    'rgba(255, 69, 0, 0.8)',
                    'rgba(255, 165, 0, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 140, 0, 1)',
                    'rgba(255, 215, 0, 1)',
                    'rgba(199, 62, 29, 1)',
                    'rgba(255, 69, 0, 1)',
                    'rgba(255, 165, 0, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 0.5
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

function updateTrainingChart() {
    const ctx = document.getElementById('training-chart').getContext('2d');
    
    if (window.trainingChart) {
        window.trainingChart.destroy();
    }
    
    window.trainingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
            datasets: [{
                label: 'Training Loss',
                data: [0.45, 0.32, 0.28, 0.25, 0.23],
                borderColor: 'rgba(255, 140, 0, 1)',
                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                tension: 0.4
            }, {
                label: 'Validation Loss',
                data: [0.48, 0.35, 0.30, 0.28, 0.26],
                borderColor: 'rgba(199, 62, 29, 1)',
                backgroundColor: 'rgba(199, 62, 29, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 0.5
                }
            }
        }
    });
}

function resetTrainingChart() {
    const ctx = document.getElementById('training-chart').getContext('2d');
    
    if (window.trainingChart) {
        window.trainingChart.destroy();
    }
    
    window.trainingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
            datasets: [{
                label: 'Training Loss',
                data: [0.50, 0.38, 0.32, 0.28, 0.26],
                borderColor: 'rgba(255, 140, 0, 1)',
                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                tension: 0.4
            }, {
                label: 'Validation Loss',
                data: [0.52, 0.40, 0.35, 0.32, 0.30],
                borderColor: 'rgba(199, 62, 29, 1)',
                backgroundColor: 'rgba(199, 62, 29, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 0.6
                }
            }
        }
    });
}



// XGBoost Demo Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize feature importance chart
    showFeatureImportance('gain');
    
    // Initialize training chart
    resetTrainingChart();
    
});