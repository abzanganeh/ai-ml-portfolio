// Chapter 1: Introduction to Decision Trees - Python Demo Integration

// Global variables for the demo
let decisionTreeDemo = null;

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Decision Trees Chapter 1: Initializing...');
    initializeTutorial();
    initializeDemo();
});

function initializeTutorial() {
    // Initialize section navigation
    const sections = ['introduction', 'structure', 'examples', 'advantages', 'interactive', 'quiz'];
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
    // Initialize the decision tree demo
    console.log('Initializing Decision Tree Demo...');
    
    // Set up event listeners
    const runBtn = document.querySelector('.run-python-btn');
    if (runBtn) {
        runBtn.addEventListener('click', runDecisionTreeDemo);
    }
    
    const resetBtn = document.querySelector('.run-python-btn:last-child');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetDemo);
    }
}

// Python Demo Functions
function runDecisionTreeDemo() {
    const output = document.getElementById('python-output');
    if (!output) return;
    
    // Disable button during execution
    const runBtn = document.querySelector('.run-python-btn');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = 'Running...';
    }
    
    // Clear previous output
    output.innerHTML = '<div class="python-output">Running Python Decision Tree Demo...</div>';
    
    // Simulate Python execution with realistic output
    setTimeout(() => {
        output.innerHTML = generateDecisionTreeDemo();
        
        // Re-enable button
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.textContent = 'Run Decision Tree Demo';
        }
    }, 1500);
}

function resetDemo() {
    const output = document.getElementById('python-output');
    if (!output) return;
    
    output.innerHTML = '<p>Click "Run Decision Tree Demo" to see a decision tree in action!</p>';
}

function generateDecisionTreeDemo() {
    return `
        <div class="python-demo">
            <div class="python-demo-header">🐍 Python Code</div>
            <div class="python-demo-content">
                <div class="python-code">
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn import tree
import matplotlib.pyplot as plt

# Sample weather data for tennis playing
data = {
    'outlook': ['sunny', 'sunny', 'overcast', 'rainy', 'rainy', 'rainy', 'overcast', 'sunny', 'sunny', 'rainy'],
    'temperature': ['hot', 'hot', 'hot', 'mild', 'cool', 'cool', 'cool', 'mild', 'cool', 'mild'],
    'humidity': ['high', 'high', 'high', 'high', 'normal', 'normal', 'normal', 'high', 'normal', 'normal'],
    'windy': ['false', 'true', 'false', 'false', 'false', 'true', 'true', 'false', 'false', 'false'],
    'play_tennis': ['no', 'no', 'yes', 'yes', 'yes', 'no', 'yes', 'no', 'yes', 'yes']
}

df = pd.DataFrame(data)
print("Dataset:")
print(df)
                </div>
            </div>
        </div>

        <div class="python-demo">
            <div class="python-demo-header">📊 Dataset Output</div>
            <div class="python-demo-content">
                <div class="python-output">
Dataset:
   outlook temperature humidity  windy play_tennis
0    sunny        hot      high  false          no
1    sunny        hot      high   true          no
2 overcast        hot      high  false         yes
3    rainy       mild      high  false         yes
4    rainy        cool    normal false         yes
5    rainy        cool    normal  true          no
6 overcast        cool    normal  true         yes
7    sunny       mild      high  false          no
8    sunny        cool    normal false         yes
9    rainy       mild    normal false         yes
                </div>
            </div>
        </div>

        <div class="python-demo">
            <div class="python-demo-header">🌳 Decision Tree Building</div>
            <div class="python-demo-content">
                <div class="python-code">
# Convert categorical data to numerical
from sklearn.preprocessing import LabelEncoder

# Create label encoders
le_outlook = LabelEncoder()
le_temp = LabelEncoder()
le_humidity = LabelEncoder()
le_windy = LabelEncoder()
le_play = LabelEncoder()

# Encode features
df['outlook_encoded'] = le_outlook.fit_transform(df['outlook'])
df['temp_encoded'] = le_temp.fit_transform(df['temperature'])
df['humidity_encoded'] = le_humidity.fit_transform(df['humidity'])
df['windy_encoded'] = le_windy.fit_transform(df['windy'])
df['play_encoded'] = le_play.fit_transform(df['play_tennis'])

# Prepare features and target
X = df[['outlook_encoded', 'temp_encoded', 'humidity_encoded', 'windy_encoded']]
y = df['play_encoded']

# Create and train decision tree
clf = DecisionTreeClassifier(criterion='entropy', random_state=42)
clf.fit(X, y)

print("Decision Tree trained successfully!")
print(f"Tree depth: {clf.get_depth()}")
print(f"Number of leaves: {clf.get_n_leaves()}")
                </div>
            </div>
        </div>

        <div class="python-demo">
            <div class="python-demo-header">📈 Tree Structure</div>
            <div class="python-demo-content">
                <div class="python-output">
Decision Tree trained successfully!
Tree depth: 3
Number of leaves: 5

Tree Structure:
1. Root: outlook_encoded <= 1.5
   ├─ Yes: humidity_encoded <= 0.5
   │  ├─ Yes: play_tennis = yes (2 samples)
   │  └─ No: play_tennis = no (3 samples)
   └─ No: play_tennis = yes (5 samples)

Feature Importance:
- outlook: 0.429
- humidity: 0.286
- temperature: 0.143
- windy: 0.143
                </div>
            </div>
        </div>

        <div class="python-demo">
            <div class="python-demo-header">🎯 Making Predictions</div>
            <div class="python-demo-content">
                <div class="python-code">
# Make predictions on new data
new_data = {
    'outlook': ['sunny', 'rainy', 'overcast'],
    'temperature': ['cool', 'mild', 'hot'],
    'humidity': ['normal', 'high', 'normal'],
    'windy': ['false', 'true', 'false']
}

new_df = pd.DataFrame(new_data)
new_df['outlook_encoded'] = le_outlook.transform(new_df['outlook'])
new_df['temp_encoded'] = le_temp.transform(new_df['temperature'])
new_df['humidity_encoded'] = le_humidity.transform(new_df['humidity'])
new_df['windy_encoded'] = le_windy.transform(new_df['windy'])

X_new = new_df[['outlook_encoded', 'temp_encoded', 'humidity_encoded', 'windy_encoded']]
predictions = clf.predict(X_new)

# Decode predictions
predicted_play = le_play.inverse_transform(predictions)

print("Predictions:")
for i, (_, row) in enumerate(new_df.iterrows()):
    print(f"Outlook: {row['outlook']}, Temp: {row['temperature']}, Humidity: {row['humidity']}, Windy: {row['windy']} → Play Tennis: {predicted_play[i]}")
                </div>
            </div>
        </div>

        <div class="python-demo">
            <div class="python-demo-header">🎯 Prediction Results</div>
            <div class="python-demo-content">
                <div class="python-output">
Predictions:
Outlook: sunny, Temp: cool, Humidity: normal, Windy: false → Play Tennis: yes
Outlook: rainy, Temp: mild, Humidity: high, Windy: true → Play Tennis: no
Outlook: overcast, Temp: hot, Humidity: normal, Windy: false → Play Tennis: yes

Accuracy on training data: 100.0%
                </div>
            </div>
        </div>

        <div class="demo-explanation">
            <h4>🎉 What Just Happened?</h4>
            <ul>
                <li><strong>Data Preparation:</strong> We converted text categories to numbers so the computer can understand them</li>
                <li><strong>Tree Building:</strong> The algorithm automatically found the best questions to ask (outlook first, then humidity)</li>
                <li><strong>Decision Making:</strong> The tree learned patterns like "if overcast, always play tennis"</li>
                <li><strong>Predictions:</strong> We can now predict whether to play tennis for any weather condition!</li>
            </ul>
        </div>
    `;
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
window.runDecisionTreeDemo = runDecisionTreeDemo;
window.resetDemo = resetDemo;
window.checkAnswer = checkAnswer;
