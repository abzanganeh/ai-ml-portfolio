// Complete EDA Tutorial JavaScript
// Handles all interactive functionality and chart rendering

document.addEventListener('DOMContentLoaded', function() {
    initializeMissingDataChart();
    initializeOutlierBoxPlot();
    initializeCorrelationHeatmap();
    initializeDistributionChart();
    initializeCustomVisualization();
    initializePreviewCharts();
    initializeTrendChart1();
    initializeTrendChart2();
    setupEventListeners();
    updateProgress();
});

// Progress tracking
const totalSteps = 8;
let currentStep = 1;

function updateStatsDashboard() {
    // Example: update stats based on selected column
    const column = document.getElementById('stats-column').value;
    // You can add logic here to update the stats display
    // For now, just update the mean as a demo
    document.getElementById('stat-mean').textContent = 'Updated for ' + column;
    // Add similar updates for other stats if needed
}

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const navBtn = document.getElementById('nav-' + sectionName);
    if (navBtn) {
        navBtn.classList.add('active');
    }
    currentStep = parseInt(sectionName.replace('step', ''));
    updateProgress();
}

function updateProgress() {
    const progressPercent = (currentStep / totalSteps) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    if (progressText) {
        progressText.textContent = Math.round(progressPercent) + '% Complete';
    }
}

// Missing Data Chart
function initializeMissingDataChart() {
    const ctx = document.getElementById('missingDataChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['solution_link', 'companies', 'related_topics', 'similar_questions'],
            datasets: [{
                label: 'Missing Data %',
                data: [45.92, 4.16, 13.92, 59.18],
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
                borderColor: ['#ff5252', '#26a69a', '#2196f3', '#66bb6a'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Missing Data Analysis',
                    font: { size: 16, weight: 'bold' }
                },
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Percentage Missing' }
                },
                x: {
                    title: { display: true, text: 'Columns' }
                }
            }
        }
    });
}

// Outlier Box Plot
function initializeOutlierBoxPlot() {
    const ctx = document.getElementById('outlierBoxPlot');
    if (!ctx) return;
    // Sample data for demonstration
    const data = {
        labels: ['Likes', 'Dislikes', 'Frequency'],
        datasets: [{
            label: 'Distribution',
            data: [
                [15, 25, 50, 75, 95, 150, 200], // Likes data
                [2, 5, 12, 25, 45, 80, 120],    // Dislikes data
                [100, 250, 500, 1000, 2000, 5000, 8000] // Frequency data
            ],
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2
        }]
    };
    // Create a simple bar chart to represent box plot concept
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Q1', 'Median', 'Q3', 'Outliers'],
            datasets: [{
                label: 'Likes Distribution',
                data: [25, 50, 75, 150],
                backgroundColor: ['#4ecdc4', '#45b7d1', '#96ceb4', '#ff6b6b'],
                borderColor: ['#26a69a', '#2196f3', '#66bb6a', '#ff5252'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Outlier Detection - Likes Distribution',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Values' }
                }
            }
        }
    });
    updateOutlierStats();
}

function updateOutlierStats() {
    const stats = {
        likesOutliers: '23 (1.3%)',
        dislikesOutliers: '15 (0.8%)',
        frequencyOutliers: '31 (1.7%)'
    };
    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Correlation Heatmap
function initializeCorrelationHeatmap() {
    const ctx = document.getElementById('correlationHeatmap');
    if (!ctx) return;
    // Matrix plugin required for proper heatmap
    const correlationData = [
        [1.00, 0.85, 0.73, 0.62, 0.45],
        [0.85, 1.00, 0.68, 0.58, 0.52],
        [0.73, 0.68, 1.00, 0.45, 0.38],
        [0.62, 0.58, 0.45, 1.00, 0.72],
        [0.45, 0.52, 0.38, 0.72, 1.00]
    ];
    const labels = ['Likes', 'Rating', 'Frequency', 'Acceptance', 'Difficulty'];
    new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                label: 'Correlation',
                data: correlationData.flatMap((row, i) =>
                    row.map((value, j) => ({ x: i, y: j, v: value }))
                ),
                backgroundColor: (context) => {
                    const value = context.raw.v;
                    const alpha = Math.abs(value);
                    return value > 0 ?
                        `rgba(102, 126, 234, ${alpha})` :
                        `rgba(255, 107, 107, ${alpha})`;
                },
                borderColor: '#fff',
                borderWidth: 1,
                width: ({ chart }) => (chart.chartArea || {}).width / 5 - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / 5 - 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Correlation Matrix' },
                tooltip: {
                    callbacks: {
                        title: () => '',
                        label: (context) => {
                            const value = context.raw.v;
                            return `${labels[context.raw.x]} ↔ ${labels[context.raw.y]}: ${value.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { callback: (_, i) => labels[i] },
                    grid: { display: false }
                },
                y: {
                    ticks: { callback: (_, i) => labels[i] },
                    grid: { display: false }
                }
            }
        }
    });
}

// Distribution Chart
function initializeDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-200', '200-400', '400-600', '600-800', '800-1000', '1000+'],
            datasets: [{
                label: 'Likes Distribution',
                data: [45, 78, 123, 89, 56, 23],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution Analysis',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Frequency' }
                },
                x: {
                    title: { display: true, text: 'Value Range' }
                }
            }
        }
    });
}

// Custom Visualization with Controls
function initializeCustomVisualization() {
    updateVisualization();
}

function updateVisualization() {
    const ctx = document.getElementById('customVisualization');
    if (!ctx) return;
    const chartType = document.getElementById('chart-type')?.value || 'bar';
    const xAxis = document.getElementById('x-axis')?.value || 'difficulty';
    const yAxis = document.getElementById('y-axis')?.value || 'likes';
    if (window.customChart) {
        window.customChart.destroy();
    }
    const data = generateVisualizationData(chartType, xAxis, yAxis);
    window.customChart = new Chart(ctx, {
        type: chartType === 'histogram' ? 'bar' : chartType,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)}: ${xAxis} vs ${yAxis}`,
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: xAxis.charAt(0).toUpperCase() + xAxis.slice(1) }
                },
                y: {
                    title: { display: true, text: yAxis.charAt(0).toUpperCase() + yAxis.slice(1) }
                }
            }
        }
    });
}

function generateVisualizationData(chartType, xAxis, yAxis) {
    const sampleData = {
        'histogram': {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                label: 'Count',
                data: [820, 1023, 182],
                backgroundColor: ['#4ecdc4', '#45b7d1', '#ff6b6b'],
                borderColor: ['#26a69a', '#2196f3', '#ff5252'],
                borderWidth: 2
            }]
        },
        'scatter': {
            datasets: [{
                label: 'Data Points',
                data: Array.from({ length: 50 }, () => ({
                    x: Math.random() * 100,
                    y: Math.random() * 100
                })),
                backgroundColor: '#667eea',
                pointRadius: 4
            }]
        },
        'bar': {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                label: 'Average ' + yAxis,
                data: [1250, 850, 450],
                backgroundColor: ['#4ecdc4', '#45b7d1', '#ff6b6b'],
                borderColor: ['#26a69a', '#2196f3', '#ff5252'],
                borderWidth: 2
            }]
        },
        'line': {
            labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
            datasets: [{
                label: 'Trend',
                data: [15, 35, 45, 25, 8],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        'pie': {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: ['#4ecdc4', '#45b7d1', '#ff6b6b'],
                borderWidth: 2
            }]
        }
    };
    return sampleData[chartType] || sampleData['bar'];
}

// Preview Charts for Gallery
function initializePreviewCharts() {
    // Difficulty distribution preview
    const difficultyCtx = document.getElementById('difficulty-preview');
    if (difficultyCtx) {
        new Chart(difficultyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: ['#4ecdc4', '#45b7d1', '#ff6b6b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
    // Acceptance rate preview
    const acceptanceCtx = document.getElementById('acceptance-preview');
    if (acceptanceCtx) {
        new Chart(acceptanceCtx, {
            type: 'bar',
            data: {
                labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
                datasets: [{
                    data: [15, 25, 35, 20, 5],
                    backgroundColor: '#667eea',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }
    // Likes vs dislikes preview
    const likesCtx = document.getElementById('likes-preview');
    if (likesCtx) {
        new Chart(likesCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    data: [
                        { x: 100, y: 20 }, { x: 200, y: 35 }, { x: 300, y: 45 },
                        { x: 400, y: 60 }, { x: 500, y: 80 }
                    ],
                    backgroundColor: '#667eea',
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }
    // Companies preview
    const companiesCtx = document.getElementById('companies-preview');
    if (companiesCtx) {
        new Chart(companiesCtx, {
            type: 'bar',
            data: {
                labels: ['Amazon', 'Google', 'Microsoft'],
                datasets: [{
                    data: [156, 142, 128],
                    backgroundColor: ['#4ecdc4', '#45b7d1', '#ff6b6b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }
}

// Interactive Functions
function applyMissingDataStrategy(strategy) {
    const resultDiv = document.getElementById('strategy-result');
    if (!resultDiv) return;
    document.querySelectorAll('.strategy-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const selectedBtn = document.getElementById('strategy-' + strategy);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    const strategies = {
        'drop': {
            title: 'Drop Rows Strategy Applied',
            results: [
                'Original dataset: 1,825 rows',
                'After dropping: 1,749 rows',
                'Data loss: 76 rows (4.16%)',
                'Impact: Minimal data loss, clean dataset'
            ]
        },
        'impute': {
            title: 'Imputation with "Unknown" Applied',
            results: [
                'Original dataset: 1,825 rows',
                'After imputation: 1,825 rows',
                'Data loss: 0 rows',
                'Impact: Preserved all data, added "Unknown" category'
            ]
        },
        'mode': {
            title: 'Mode Imputation Applied',
            results: [
                'Original dataset: 1,825 rows',
                'After imputation: 1,825 rows',
                'Most common company: "Amazon"',
                'Impact: May introduce bias toward popular companies'
            ]
        }
    };
    const strategyData = strategies[strategy];
    if (strategyData) {
        resultDiv.innerHTML = `
            <h4>${strategyData.title}</h4>
            <ul>
                ${strategyData.results.map(result => `<li>${result}</li>`).join('')}
            </ul>
        `;
    }
}

// Data type conversion demo
function convertValue() {
    const inputValue = document.getElementById('sample-value')?.value || '4.1M';
    const resultDiv = document.getElementById('conversion-result');
    if (!resultDiv) return;
    let convertedValue;
    let explanation = '';
    if (inputValue.endsWith('M')) {
        convertedValue = parseFloat(inputValue.slice(0, -1)) * 1000000;
        explanation = `"${inputValue}" → Remove "M" → Multiply by 1,000,000 → ${convertedValue.toLocaleString()}`;
    } else if (inputValue.endsWith('K')) {
        convertedValue = parseFloat(inputValue.slice(0, -1)) * 1000;
        explanation = `"${inputValue}" → Remove "K" → Multiply by 1,000 → ${convertedValue.toLocaleString()}`;
    } else {
        convertedValue = parseFloat(inputValue);
        explanation = `"${inputValue}" → Direct conversion → ${convertedValue}`;
    }
    resultDiv.innerHTML = `
        <div class="conversion-step">
            <h4>Conversion Process:</h4>
            <p class="conversion-formula">${explanation}</p>
            <div class="conversion-output">
                <span class="output-label">Numeric Value:</span>
                <span class="output-value">${convertedValue.toLocaleString()}</span>
            </div>
        </div>
    `;
}

// Dataset Explorer Functions
function showDatasetInfo() {
    const display = document.getElementById('dataset-display');
    if (!display) return;
    display.innerHTML = `
        <div class="dataset-info">
            <h4>Dataset Information</h4>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Shape:</strong> (1825, 19)
                </div>
                <div class="info-item">
                    <strong>Memory Usage:</strong> 271.0+ KB
                </div>
                <div class="info-item">
                    <strong>Index Range:</strong> 0 to 1824
                </div>
                <div class="info-item">
                    <strong>Dtypes:</strong> object(15), int64(4)
                </div>
            </div>
            <div class="info-note">
                <p><strong>Note:</strong> The dataset contains 1,825 LeetCode problems with 19 features including problem details, difficulty, acceptance rates, and company information.</p>
            </div>
        </div>
    `;
}

function showSampleData() {
    const display = document.getElementById('dataset-display');
    if (!display) return;
    display.innerHTML = `
        <div class="sample-data">
            <h4>Sample Data (First 5 rows)</h4>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Problem ID</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Acceptance Rate</th>
                            <th>Company</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Two Sum</td>
                            <td>Easy</td>
                            <td>48.5%</td>
                            <td>Amazon</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Add Two Numbers</td>
                            <td>Medium</td>
                            <td>37.2%</td>
                            <td>Microsoft</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Longest Substring</td>
                            <td>Medium</td>
                            <td>33.8%</td>
                            <td>Google</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showColumnTypes() {
    const display = document.getElementById('dataset-display');
    if (!display) return;
    display.innerHTML = `
        <div class="column-types">
            <h4>Column Data Types</h4>
            <div class="type-grid">
                <div class="type-category">
                    <h5>Object (String) Columns (15):</h5>
                    <ul>
                        <li>title, difficulty, category, company, tags</li>
                        <li>description, solution, discussion_url</li>
                        <li>related_topics, similar_problems</li>
                    </ul>
                </div>
                <div class="type-category">
                    <h5>Integer Columns (4):</h5>
                    <ul>
                        <li>problem_id, likes, dislikes, acceptance_count</li>
                    </ul>
                </div>
            </div>
            <div class="type-note">
                <p><strong>Note:</strong> Most columns are categorical (object type) which is typical for problem metadata. Numeric columns represent counts and identifiers.</p>
            </div>
        </div>
    `;
}

// Solution tab functionality
function showSolutionTab(tabName) {
    document.querySelectorAll('.solution-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const selectedTab = document.getElementById('tab-' + tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    document.querySelectorAll('.solution-content').forEach(content => {
        content.style.display = 'none';
    });
    const targetContent = document.getElementById('solution-' + tabName);
    if (targetContent) {
        targetContent.style.display = 'block';
    }
}

// Event Listeners Setup
function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.id.replace('nav-', '');
            showSection(sectionId);
        });
    });
    const chartType = document.getElementById('chart-type');
    const xAxis = document.getElementById('x-axis');
    const yAxis = document.getElementById('y-axis');
    if (chartType) chartType.addEventListener('change', updateVisualization);
    if (xAxis) xAxis.addEventListener('change', updateVisualization);
    if (yAxis) yAxis.addEventListener('change', updateVisualization);
    const sampleValue = document.getElementById('sample-value');
    if (sampleValue) {
        sampleValue.addEventListener('input', convertValue);
    }
}

function initializeTrendChart1() {
    const ctx = document.getElementById('trendChart1');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                label: 'Acceptance Rate (%)',
                data: [65, 40, 15], // Example: Easy=65%, Medium=40%, Hard=15%
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Difficulty vs Success Rate Relationship'
                }
            },
            scales: {
                x: { title: { display: true, text: 'Difficulty' } },
                y: { title: { display: true, text: 'Acceptance Rate (%)' }, min: 0, max: 100 }
            }
        }
    });
}

function initializeTrendChart2() {
    const ctx = document.getElementById('trendChart2');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                label: 'Attempt Frequency',
                data: [1200, 1800, 600], // Example: Medium is most popular
                backgroundColor: ['#4ecdc4', '#45b7d1', '#ff6b6b'],
                borderColor: ['#26a69a', '#2196f3', '#ff5252'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Popular Problems Characteristics'
                }
            },
            scales: {
                x: { title: { display: true, text: 'Difficulty' } },
                y: { title: { display: true, text: 'Attempt Frequency' }, beginAtZero: true }
            }
        }
    });
}

// Make functions globally available
window.showSection = showSection;
window.updateStatsDashboard = updateStatsDashboard;
window.applyMissingDataStrategy = applyMissingDataStrategy;
window.convertValue = convertValue;
window.showDatasetInfo = showDatasetInfo;
window.showSampleData = showSampleData;
window.showColumnTypes = showColumnTypes;
window.updateVisualization = updateVisualization;
window.showSolutionTab = showSolutionTab;