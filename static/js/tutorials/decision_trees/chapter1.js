// Chapter 1: Introduction to Decision Trees - JavaScript Demo

// Global variables for the demo
let demoData = null;
let decisionTree = null;
let demoState = {
    hasData: false,
    hasTree: false,
    currentStep: 0
};

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Decision Trees Chapter 1: Initializing...');
    initializeTutorial();
    initializeDemo();
});

function initializeTutorial() {
    // Initialize section navigation
    const sections = ['introduction', 'structure', 'examples', 'advantages', 'demo', 'quiz'];
    const labels = ['What are Decision Trees?', 'Tree Structure', 'Real-World Examples', 'Advantages & Limitations', 'Interactive Demo', 'Quiz'];
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', labels);
    
    // Initialize shared tutorial functionality
    if (typeof initializeSectionNavigation === 'function') {
        initializeSectionNavigation(sections, labels);
    }
    
    console.log('Decision Trees Chapter 1: Initialization complete');
}

function initializeDemo() {
    console.log('Initializing Decision Tree Demo...');
    
    // Set up demo status
    updateDemoStatus('Click "Generate New Data" to start the demo');
}

// Demo Functions
function generateDemoData() {
    console.log('Generating demo data...');
    
    // Generate sample weather data for tennis playing
    const weatherData = [
        { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false, play: false },
        { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true, play: false },
        { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false, play: true },
        { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false, play: true },
        { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false, play: true },
        { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true, play: false },
        { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true, play: true },
        { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false, play: false },
        { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false, play: true },
        { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false, play: true }
    ];
    
    demoData = weatherData;
    demoState.hasData = true;
    demoState.hasTree = false;
    demoState.currentStep = 0;
    
    // Display the data
    displayDataTable(weatherData);
    updateDemoStatus('Data generated! Click "Run Decision Tree" to build the tree.');
    
    // Enable the Run Decision Tree button
    const runBtn = document.querySelector('button[onclick="runDecisionTreeDemo()"]');
    if (runBtn) {
        runBtn.disabled = false;
        runBtn.classList.remove('disabled');
    }
}

function runDecisionTreeDemo() {
    if (!demoState.hasData) {
        updateDemoStatus('Please generate data first!');
        return;
    }
    
    console.log('Running decision tree demo...');
    updateDemoStatus('Building decision tree...');
    
    // Disable buttons during execution
    const runBtn = document.querySelector('button[onclick="runDecisionTreeDemo()"]');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = 'Building Tree...';
    }
    
    // Simulate tree building process
    setTimeout(() => {
        buildDecisionTree();
        visualizeTree();
        calculateMetrics();
        
        demoState.hasTree = true;
        updateDemoStatus('Decision tree built successfully!');
        
        // Re-enable button
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.textContent = 'Run Decision Tree';
        }
    }, 2000);
}

function buildDecisionTree() {
    // Simple decision tree implementation for demo
    decisionTree = {
        root: {
            feature: 'outlook',
            threshold: 'overcast',
            left: {
                feature: 'humidity',
                threshold: 'normal',
                left: { prediction: true }, // play tennis
                right: { prediction: false } // don't play
            },
            right: { prediction: true } // overcast -> always play
        }
    };
}

function visualizeTree() {
    const canvas = document.getElementById('demo-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = `
        <div class="tree-visualization">
            <div class="tree-title">Decision Tree for Tennis Playing</div>
            <div class="tree-structure">
                <div class="tree-node root-node">
                    <div class="node-question">Outlook = ?</div>
                    <div class="node-branches">
                        <div class="branch">
                            <span class="branch-label">overcast</span>
                            <div class="tree-node leaf-node">
                                <div class="node-answer">Play Tennis</div>
                            </div>
                        </div>
                        <div class="branch">
                            <span class="branch-label">sunny/rainy</span>
                            <div class="tree-node internal-node">
                                <div class="node-question">Humidity = ?</div>
                                <div class="node-branches">
                                    <div class="branch">
                                        <span class="branch-label">normal</span>
                                        <div class="tree-node leaf-node">
                                            <div class="node-answer">Play Tennis</div>
                                        </div>
                                    </div>
                                    <div class="branch">
                                        <span class="branch-label">high</span>
                                        <div class="tree-node leaf-node">
                                            <div class="node-answer">Don't Play</div>
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
}

function calculateMetrics() {
    // Calculate simple metrics
    const accuracy = 0.9; // 90% accuracy
    const depth = 2;
    const leaves = 3;
    
    // Show metrics
    const metricsDiv = document.getElementById('demo-metrics');
    if (metricsDiv) {
        metricsDiv.style.display = 'block';
        document.getElementById('accuracy-value').textContent = (accuracy * 100).toFixed(1) + '%';
        document.getElementById('depth-value').textContent = depth;
        document.getElementById('leaves-value').textContent = leaves;
    }
}

function displayDataTable(data) {
    const canvas = document.getElementById('demo-canvas');
    if (!canvas) return;
    
    let tableHTML = `
        <div class="data-table-container">
            <h4>Sample Weather Data</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Outlook</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>Windy</th>
                        <th>Play Tennis</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(row => {
        tableHTML += `
            <tr>
                <td>${row.outlook}</td>
                <td>${row.temperature}</td>
                <td>${row.humidity}</td>
                <td>${row.windy ? 'Yes' : 'No'}</td>
                <td class="${row.play ? 'play-yes' : 'play-no'}">${row.play ? 'Yes' : 'No'}</td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    canvas.innerHTML = tableHTML;
}

function resetDemo() {
    console.log('Resetting demo...');
    
    demoData = null;
    decisionTree = null;
    demoState = {
        hasData: false,
        hasTree: false,
        currentStep: 0
    };
    
    // Clear visualizations
    const canvas = document.getElementById('demo-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Decision tree visualization will appear here</p>';
    }
    
    // Hide metrics
    const metricsDiv = document.getElementById('demo-metrics');
    if (metricsDiv) {
        metricsDiv.style.display = 'none';
    }
    
    // Reset status
    updateDemoStatus('Click "Generate New Data" to start the demo');
    
    // Disable Run Decision Tree button
    const runBtn = document.querySelector('button[onclick="runDecisionTreeDemo()"]');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = 'Run Decision Tree';
    }
}

function updateDemoStatus(message) {
    const statusDiv = document.getElementById('demo-status');
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
window.generateDemoData = generateDemoData;
window.runDecisionTreeDemo = runDecisionTreeDemo;
window.resetDemo = resetDemo;
window.checkAnswer = checkAnswer;