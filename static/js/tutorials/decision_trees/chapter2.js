// Chapter 2: Decision Tree Mathematics - JavaScript Demo

// Global variables for the demo
let mathDemoData = null;
let mathDemoState = {
    hasData: false,
    hasCalculations: false,
    currentStep: 0
};

// Initialize the tutorial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Decision Trees Chapter 2: Initializing...');
    initializeTutorial();
    initializeMathDemo();
});

function initializeTutorial() {
    // Initialize section navigation
    const sections = ['entropy', 'information-gain', 'gini', 'splitting', 'demo', 'quiz'];
    const labels = ['Entropy & Information', 'Information Gain', 'Gini Impurity', 'Splitting Criteria', 'Interactive Demo', 'Quiz'];
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', labels);
    
    // Initialize shared tutorial functionality
    if (typeof initializeSectionNavigation === 'function') {
        initializeSectionNavigation(sections, labels);
    }
    
    console.log('Decision Trees Chapter 2: Initialization complete');
}

function initializeMathDemo() {
    console.log('Initializing Math Demo...');
    updateMathDemoStatus('Click "Generate Sample Data" to start');
}

// Math Demo Functions
function generateMathDemo() {
    console.log('Generating math demo data...');
    
    // Generate sample data for entropy calculation
    const sampleData = [
        { feature: 'outlook', value: 'sunny', play: false },
        { feature: 'outlook', value: 'sunny', play: false },
        { feature: 'outlook', value: 'overcast', play: true },
        { feature: 'outlook', value: 'rainy', play: true },
        { feature: 'outlook', value: 'rainy', play: true },
        { feature: 'outlook', value: 'rainy', play: false },
        { feature: 'outlook', value: 'overcast', play: true },
        { feature: 'outlook', value: 'sunny', play: false },
        { feature: 'outlook', value: 'sunny', play: true },
        { feature: 'outlook', value: 'rainy', play: true }
    ];
    
    mathDemoData = sampleData;
    mathDemoState.hasData = true;
    mathDemoState.hasCalculations = false;
    
    // Display the data
    displayMathDataTable(sampleData);
    updateMathDemoStatus('Data generated! Click "Calculate Entropy" to see the math.');
    
    // Enable calculation buttons
    const calcBtn = document.querySelector('button[onclick="calculateEntropy()"]');
    if (calcBtn) {
        calcBtn.disabled = false;
    }
}

function calculateEntropy() {
    if (!mathDemoState.hasData) {
        updateMathDemoStatus('Please generate data first!');
        return;
    }
    
    console.log('Calculating entropy...');
    updateMathDemoStatus('Calculating entropy...');
    
    // Calculate entropy for the dataset
    const playCounts = { true: 0, false: 0 };
    mathDemoData.forEach(item => {
        playCounts[item.play]++;
    });
    
    const total = mathDemoData.length;
    const pTrue = playCounts.true / total;
    const pFalse = playCounts.false / total;
    
    const entropy = -(pTrue * Math.log2(pTrue) + pFalse * Math.log2(pFalse));
    
    // Display calculation
    displayEntropyCalculation(playCounts, total, pTrue, pFalse, entropy);
    
    mathDemoState.hasCalculations = true;
    updateMathDemoStatus('Entropy calculated! Click "Calculate Information Gain" to see splitting.');
    
    // Enable information gain button
    const igBtn = document.querySelector('button[onclick="calculateInformationGain()"]');
    if (igBtn) {
        igBtn.disabled = false;
    }
}

function calculateInformationGain() {
    if (!mathDemoState.hasCalculations) {
        updateMathDemoStatus('Please calculate entropy first!');
        return;
    }
    
    console.log('Calculating information gain...');
    updateMathDemoStatus('Calculating information gain...');
    
    // Calculate information gain for outlook feature
    const outlookGroups = {
        'sunny': { true: 0, false: 0 },
        'overcast': { true: 0, false: 0 },
        'rainy': { true: 0, false: 0 }
    };
    
    mathDemoData.forEach(item => {
        outlookGroups[item.value][item.play]++;
    });
    
    // Calculate weighted entropy
    let weightedEntropy = 0;
    Object.keys(outlookGroups).forEach(outlook => {
        const group = outlookGroups[outlook];
        const groupTotal = group.true + group.false;
        if (groupTotal > 0) {
            const pTrue = group.true / groupTotal;
            const pFalse = group.false / groupTotal;
            const groupEntropy = -(pTrue * Math.log2(pTrue || 0.001) + pFalse * Math.log2(pFalse || 0.001));
            weightedEntropy += (groupTotal / mathDemoData.length) * groupEntropy;
        }
    });
    
    // Original entropy (from previous calculation)
    const originalEntropy = 0.971; // Pre-calculated value
    const informationGain = originalEntropy - weightedEntropy;
    
    // Display information gain calculation
    displayInformationGainCalculation(outlookGroups, weightedEntropy, originalEntropy, informationGain);
    
    updateMathDemoStatus('Information gain calculated! Try different features to see which gives the best split.');
}

function displayMathDataTable(data) {
    const canvas = document.getElementById('math-demo-canvas');
    if (!canvas) return;
    
    let tableHTML = `
        <div class="data-table-container">
            <h4>Sample Tennis Data</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Outlook</th>
                        <th>Play Tennis</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(row => {
        tableHTML += `
            <tr>
                <td>${row.value}</td>
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

function displayEntropyCalculation(counts, total, pTrue, pFalse, entropy) {
    const canvas = document.getElementById('math-demo-canvas');
    if (!canvas) return;
    
    const calculationHTML = `
        <div class="entropy-calculation">
            <h4>Entropy Calculation</h4>
            <div class="calculation-steps">
                <div class="step">
                    <h5>Step 1: Count Classes</h5>
                    <p>Play = Yes: ${counts.true} samples</p>
                    <p>Play = No: ${counts.false} samples</p>
                    <p>Total: ${total} samples</p>
                </div>
                
                <div class="step">
                    <h5>Step 2: Calculate Probabilities</h5>
                    <p>P(Yes) = ${counts.true}/${total} = ${pTrue.toFixed(3)}</p>
                    <p>P(No) = ${counts.false}/${total} = ${pFalse.toFixed(3)}</p>
                </div>
                
                <div class="step">
                    <h5>Step 3: Calculate Entropy</h5>
                    <p>H(S) = -(P(Yes) × log₂(P(Yes)) + P(No) × log₂(P(No)))</p>
                    <p>H(S) = -(${pTrue.toFixed(3)} × log₂(${pTrue.toFixed(3)}) + ${pFalse.toFixed(3)} × log₂(${pFalse.toFixed(3)}))</p>
                    <p><strong>H(S) = ${entropy.toFixed(3)}</strong></p>
                </div>
            </div>
        </div>
    `;
    
    canvas.innerHTML = calculationHTML;
}

function displayInformationGainCalculation(groups, weightedEntropy, originalEntropy, informationGain) {
    const canvas = document.getElementById('math-demo-canvas');
    if (!canvas) return;
    
    let groupsHTML = '';
    Object.keys(groups).forEach(outlook => {
        const group = groups[outlook];
        const groupTotal = group.true + group.false;
        if (groupTotal > 0) {
            groupsHTML += `
                <div class="group">
                    <h5>${outlook.toUpperCase()} (${groupTotal} samples)</h5>
                    <p>Yes: ${group.true}, No: ${group.false}</p>
                </div>
            `;
        }
    });
    
    const calculationHTML = `
        <div class="information-gain-calculation">
            <h4>Information Gain Calculation</h4>
            <div class="calculation-steps">
                <div class="step">
                    <h5>Step 1: Split by Outlook</h5>
                    ${groupsHTML}
                </div>
                
                <div class="step">
                    <h5>Step 2: Calculate Weighted Entropy</h5>
                    <p>Weighted Entropy = ${weightedEntropy.toFixed(3)}</p>
                </div>
                
                <div class="step">
                    <h5>Step 3: Calculate Information Gain</h5>
                    <p>IG = Original Entropy - Weighted Entropy</p>
                    <p>IG = ${originalEntropy.toFixed(3)} - ${weightedEntropy.toFixed(3)}</p>
                    <p><strong>IG = ${informationGain.toFixed(3)}</strong></p>
                </div>
            </div>
        </div>
    `;
    
    canvas.innerHTML = calculationHTML;
}

function resetMathDemo() {
    console.log('Resetting math demo...');
    
    mathDemoData = null;
    mathDemoState = {
        hasData: false,
        hasCalculations: false,
        currentStep: 0
    };
    
    // Clear visualizations
    const canvas = document.getElementById('math-demo-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Mathematical calculations will appear here</p>';
    }
    
    // Reset status
    updateMathDemoStatus('Click "Generate Sample Data" to start');
    
    // Disable buttons
    const buttons = ['calculateEntropy', 'calculateInformationGain'];
    buttons.forEach(funcName => {
        const btn = document.querySelector(`button[onclick="${funcName}()"]`);
        if (btn) {
            btn.disabled = true;
        }
    });
}

function updateMathDemoStatus(message) {
    const statusDiv = document.getElementById('math-demo-status');
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
window.generateMathDemo = generateMathDemo;
window.calculateEntropy = calculateEntropy;
window.calculateInformationGain = calculateInformationGain;
window.resetMathDemo = resetMathDemo;
window.checkAnswer = checkAnswer;