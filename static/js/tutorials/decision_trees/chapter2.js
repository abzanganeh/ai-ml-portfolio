// Chapter 2: Decision Tree Mathematics - Interactive Calculator

// Global variables
let class1Count = 10;
let class2Count = 10;

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Decision Trees Chapter 2: Initializing...');
    initializeTutorial();
    initializeCalculator();
});

function initializeTutorial() {
    // Initialize section navigation
    const sections = ['entropy', 'information-gain', 'gini', 'comparison', 'interactive', 'quiz'];
    const labels = ['Entropy', 'Information Gain', 'Gini Impurity', 'Criteria Comparison', 'Interactive Calculator', 'Quiz'];
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', labels);
    
    // Initialize shared tutorial functionality
    if (typeof initializeSectionNavigation === 'function') {
        initializeSectionNavigation(sections, labels);
    }
    
    console.log('Decision Trees Chapter 2: Initialization complete');
}

function initializeCalculator() {
    // Initialize the interactive calculator
    const class1Slider = document.getElementById('class1-count');
    const class2Slider = document.getElementById('class2-count');
    const class1Display = document.getElementById('class1-display');
    const class2Display = document.getElementById('class2-display');
    
    if (class1Slider && class1Display) {
        class1Slider.addEventListener('input', function() {
            class1Count = parseInt(this.value);
            class1Display.textContent = class1Count;
        });
    }
    
    if (class2Slider && class2Display) {
        class2Slider.addEventListener('input', function() {
            class2Count = parseInt(this.value);
            class2Display.textContent = class2Count;
        });
    }
    
    // Initial calculation
    calculateSplittingMetrics();
}

function calculateSplittingMetrics() {
    const output = document.getElementById('splitting-output');
    if (!output) return;
    
    // Calculate metrics
    const total = class1Count + class2Count;
    
    if (total === 0) {
        output.innerHTML = '<p>Please set at least one class count to see the metrics!</p>';
        return;
    }
    
    const p1 = class1Count / total;
    const p2 = class2Count / total;
    
    // Calculate entropy
    let entropy = 0;
    if (p1 > 0) entropy -= p1 * Math.log2(p1);
    if (p2 > 0) entropy -= p2 * Math.log2(p2);
    
    // Calculate Gini impurity
    const gini = 1 - (p1 * p1 + p2 * p2);
    
    // Generate visualization
    const visualization = generateMetricsVisualization(p1, p2, entropy, gini);
    
    output.innerHTML = `
        <div class="python-demo">
            <div class="python-demo-header">📊 Calculated Metrics</div>
            <div class="python-demo-content">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h4>📈 Entropy</h4>
                        <div class="metric-value">${entropy.toFixed(4)}</div>
                        <div class="metric-range">Range: 0.0000 - 1.0000</div>
                    </div>
                    <div class="metric-card">
                        <h4>📊 Gini Impurity</h4>
                        <div class="metric-value">${gini.toFixed(4)}</div>
                        <div class="metric-range">Range: 0.0000 - 0.5000</div>
                    </div>
                </div>
                
                <div class="data-summary">
                    <h4>Data Summary</h4>
                    <p><strong>Class 1:</strong> ${class1Count} samples (${(p1 * 100).toFixed(1)}%)</p>
                    <p><strong>Class 2:</strong> ${class2Count} samples (${(p2 * 100).toFixed(1)}%)</p>
                    <p><strong>Total:</strong> ${total} samples</p>
                </div>
            </div>
        </div>
        
        ${visualization}
        
        <div class="python-demo">
            <div class="python-demo-header">🐍 Python Code</div>
            <div class="python-demo-content">
                <div class="python-code">
import math

def calculate_entropy(class_counts):
    total = sum(class_counts)
    if total == 0:
        return 0
    
    entropy = 0
    for count in class_counts:
        if count > 0:
            p = count / total
            entropy -= p * math.log2(p)
    return entropy

def calculate_gini(class_counts):
    total = sum(class_counts)
    if total == 0:
        return 0
    
    gini = 1
    for count in class_counts:
        p = count / total
        gini -= p * p
    return gini

# Your data
class_counts = [${class1Count}, ${class2Count}]

# Calculate metrics
entropy = calculate_entropy(class_counts)
gini = calculate_gini(class_counts)

print(f"Entropy: {entropy:.4f}")
print(f"Gini Impurity: {gini:.4f}")
print(f"Class 1: {class_counts[0]} samples")
print(f"Class 2: {class_counts[1]} samples")
                </div>
            </div>
        </div>
        
        <div class="python-demo">
            <div class="python-demo-header">📊 Python Output</div>
            <div class="python-demo-content">
                <div class="python-output">
Entropy: ${entropy.toFixed(4)}
Gini Impurity: ${gini.toFixed(4)}
Class 1: ${class1Count} samples
Class 2: ${class2Count} samples
                </div>
            </div>
        </div>
        
        <div class="insights-box">
            <h4>🎯 Key Insights</h4>
            <ul>
                ${generateInsights(p1, p2, entropy, gini)}
            </ul>
        </div>
    `;
}

function generateMetricsVisualization(p1, p2, entropy, gini) {
    const total = class1Count + class2Count;
    
    // Create bar chart representation
    const class1Width = (p1 * 100).toFixed(1);
    const class2Width = (p2 * 100).toFixed(1);
    
    return `
        <div class="python-demo">
            <div class="python-demo-header">📊 Visual Representation</div>
            <div class="python-demo-content">
                <div class="data-visualization">
                    <h4>Class Distribution</h4>
                    <div class="bar-chart">
                        <div class="bar-container">
                            <div class="bar class1-bar" style="width: ${class1Width}%">
                                <span class="bar-label">Class 1 (${class1Count})</span>
                            </div>
                            <div class="bar class2-bar" style="width: ${class2Width}%">
                                <span class="bar-label">Class 2 (${class2Count})</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metrics-comparison">
                        <div class="metric-bar">
                            <div class="metric-label">Entropy</div>
                            <div class="metric-bar-container">
                                <div class="metric-bar-fill entropy-bar" style="width: ${(entropy * 100).toFixed(1)}%"></div>
                                <span class="metric-bar-value">${entropy.toFixed(4)}</span>
                            </div>
                        </div>
                        <div class="metric-bar">
                            <div class="metric-label">Gini</div>
                            <div class="metric-bar-container">
                                <div class="metric-bar-fill gini-bar" style="width: ${(gini * 200).toFixed(1)}%"></div>
                                <span class="metric-bar-value">${gini.toFixed(4)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateInsights(p1, p2, entropy, gini) {
    const insights = [];
    
    if (entropy === 0) {
        insights.push('<li><strong>Perfect Order:</strong> All samples belong to the same class - no uncertainty!</li>');
    } else if (entropy === 1) {
        insights.push('<li><strong>Maximum Disorder:</strong> Equal mix of classes - complete uncertainty!</li>');
    } else if (entropy > 0.8) {
        insights.push('<li><strong>High Uncertainty:</strong> Data is very mixed - good splitting opportunity!</li>');
    } else if (entropy < 0.3) {
        insights.push('<li><strong>Low Uncertainty:</strong> Data is mostly pure - less need for splitting</li>');
    } else {
        insights.push('<li><strong>Moderate Uncertainty:</strong> Data has some structure but could benefit from splitting</li>');
    }
    
    if (Math.abs(p1 - p2) < 0.1) {
        insights.push('<li><strong>Balanced Classes:</strong> Classes are roughly equal in size</li>');
    } else {
        insights.push('<li><strong>Imbalanced Classes:</strong> One class is much larger than the other</li>');
    }
    
    const giniRatio = gini / 0.5; // Normalize Gini to 0-1 scale
    if (Math.abs(entropy - giniRatio) < 0.1) {
        insights.push('<li><strong>Consistent Metrics:</strong> Entropy and Gini agree on the data structure</li>');
    } else {
        insights.push('<li><strong>Different Sensitivity:</strong> Entropy and Gini show different levels of uncertainty</li>');
    }
    
    return insights.join('');
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
window.calculateSplittingMetrics = calculateSplittingMetrics;
window.checkAnswer = checkAnswer;
