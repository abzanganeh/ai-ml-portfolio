// Complete EDA Tutorial JavaScript
// Handles all interactive functionality and chart rendering

document.addEventListener('DOMContentLoaded', function() {
    console.log('EDA Tutorial: DOM loaded, initializing charts...');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded!');
        return;
    } else {
        console.log('✅ Chart.js is loaded, version:', Chart.version);
    }
    
    // Initialize charts with a small delay to ensure DOM is fully ready
    setTimeout(() => {
        try {
            initializeMissingDataChart();
            console.log('✅ Missing data chart initialized');
        } catch (e) {
            console.error('❌ Error initializing missing data chart:', e);
        }
        
        try {
            initializeOutlierBoxPlot();
            console.log('✅ Outlier box plot initialized');
        } catch (e) {
            console.error('❌ Error initializing outlier box plot:', e);
        }
        
        try {
            initializeCorrelationHeatmap();
            console.log('✅ Correlation heatmap initialized');
        } catch (e) {
            console.error('❌ Error initializing correlation heatmap:', e);
        }
        
        try {
            initializeDistributionChart();
            console.log('✅ Distribution chart initialized');
        } catch (e) {
            console.error('❌ Error initializing distribution chart:', e);
        }
        
        try {
            updateVisualization();
            console.log('✅ Custom visualization initialized');
        } catch (e) {
            console.error('❌ Error initializing custom visualization:', e);
        }
        
        try {
            initializePreviewCharts();
            console.log('✅ Preview charts initialized');
        } catch (e) {
            console.error('❌ Error initializing preview charts:', e);
        }
        
        try {
            initializeTrendChart1();
            console.log('✅ Trend chart 1 initialized');
        } catch (e) {
            console.error('❌ Error initializing trend chart 1:', e);
        }
        
        try {
            initializeTrendChart2();
            console.log('✅ Trend chart 2 initialized');
        } catch (e) {
            console.error('❌ Error initializing trend chart 2:', e);
        }
        
        setupEventListeners();
        updateProgress();
        
        // Force all canvas elements to have proper dimensions
        forceCanvasDimensions();
        
        // Initialize method tabs
        initializeMethodTabs();
        
        console.log('EDA Tutorial: All initialization complete');
    }, 100);
});

// Force canvas dimensions function
function forceCanvasDimensions() {
    console.log('Forcing canvas dimensions...');
    const canvasIds = [
        'missingDataChart', 'correlationHeatmap', 'distributionChart', 
        'outlierBoxPlot', 'customVisualization', 'trendChart1', 'trendChart2',
        'difficulty-preview', 'acceptance-preview', 'likes-preview', 'companies-preview'
    ];
    
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            console.log(`Setting dimensions for ${id}:`, canvas.offsetWidth, canvas.offsetHeight);
            canvas.style.width = '100%';
            canvas.style.height = '400px';
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            console.log(`✅ ${id} dimensions set to:`, canvas.width, canvas.height);
        } else {
            console.log(`❌ Canvas ${id} not found`);
        }
    });
}

// Initialize method tabs
function initializeMethodTabs() {
    console.log('Initializing method tabs...');
    
    // Hide all method content divs first
    const allMethodContents = document.querySelectorAll('.method-content');
    allMethodContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    const allTabs = document.querySelectorAll('.method-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show only the IQR method by default
    const iqrContent = document.getElementById('method-iqr');
    const iqrTab = document.getElementById('tab-iqr');
    
    if (iqrContent && iqrTab) {
        iqrContent.classList.add('active');
        iqrContent.style.display = 'block';
        iqrTab.classList.add('active');
        console.log('✅ Initialized with IQR method active');
    } else {
        console.error('❌ IQR method elements not found');
    }
}

// Progress tracking
const totalSteps = 8;
let currentStep = 1;

function updateStatsDashboard() {
    console.log('Updating stats dashboard...');
    const column = document.getElementById('stats-column');
    if (!column) {
        console.error('❌ stats-column element not found');
        return;
    }
    
    const selectedColumn = column.value;
    console.log('Selected column:', selectedColumn);
    
    // Sample data for different columns
    const statsData = {
        'likes': { mean: 245.67, median: 198.5, std: 156.23, min: 12, max: 1250, count: 2847 },
        'dislikes': { mean: 18.45, median: 12.0, std: 24.67, min: 0, max: 189, count: 2847 },
        'frequency': { mean: 0.23, median: 0.15, std: 0.31, min: 0.01, max: 0.89, count: 2847 },
        'acceptance': { mean: 0.67, median: 0.72, std: 0.18, min: 0.12, max: 0.95, count: 2847 },
        'difficulty': { mean: 2.1, median: 2.0, std: 0.8, min: 1, max: 3, count: 2847 }
    };
    
    const stats = statsData[selectedColumn] || statsData['likes'];
    
    // Update all stat elements
    const statElements = {
        'stat-mean': stats.mean.toFixed(2),
        'stat-median': stats.median.toFixed(2),
        'stat-std': stats.std.toFixed(2),
        'stat-min': stats.min.toFixed(2),
        'stat-max': stats.max.toFixed(2),
        'stat-count': stats.count.toLocaleString()
    };
    
    Object.entries(statElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            console.log(`Updated ${id}: ${value}`);
        } else {
            console.error(`❌ Element ${id} not found`);
        }
    });
    
    console.log('✅ Stats dashboard updated for column:', selectedColumn);
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
    console.log('Missing data chart canvas:', ctx);
    if (!ctx) {
        console.error('❌ missingDataChart canvas not found');
        return;
    }
    
    try {
        const chart = new Chart(ctx, {
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
            aspectRatio: 2,
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
        console.log('✅ Missing data chart created successfully:', chart);
        
        // Force canvas dimensions
        ctx.style.width = '100%';
        ctx.style.height = '400px';
        ctx.width = ctx.offsetWidth;
        ctx.height = ctx.offsetHeight;
        
    } catch (error) {
        console.error('❌ Error creating missing data chart:', error);
    }
}

// Outlier Box Plot
function initializeOutlierBoxPlot() {
    const ctx = document.getElementById('outlierBoxPlot');
    if (!ctx) return;
    
    // Create a box plot representation using bar chart with multiple datasets
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Likes', 'Dislikes', 'Frequency'],
            datasets: [
                {
                    label: 'Q1 (25th percentile)',
                    data: [25, 5, 250],
                    backgroundColor: '#4ecdc4',
                    borderColor: '#26a69a',
                    borderWidth: 2
                },
                {
                    label: 'Median (50th percentile)',
                    data: [50, 12, 500],
                    backgroundColor: '#45b7d1',
                    borderColor: '#2196f3',
                    borderWidth: 2
                },
                {
                    label: 'Q3 (75th percentile)',
                    data: [75, 25, 1000],
                    backgroundColor: '#96ceb4',
                    borderColor: '#66bb6a',
                    borderWidth: 2
                },
                {
                    label: 'Outliers',
                    data: [150, 80, 5000],
                    backgroundColor: '#ff6b6b',
                    borderColor: '#ff5252',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Outlier Detection - Distribution Analysis',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Variables' }
                },
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
    console.log('Correlation heatmap canvas:', ctx);
    if (!ctx) {
        console.error('❌ correlationHeatmap canvas not found');
        return;
    }
    
    try {
    
    // Create a proper heatmap visualization using scatter plot
    const labels = ['Likes', 'Rating', 'Frequency', 'Acceptance', 'Difficulty'];
    const correlationData = [
        [1.00, 0.85, 0.73, 0.62, 0.45],
        [0.85, 1.00, 0.68, 0.58, 0.52],
        [0.73, 0.68, 1.00, 0.45, 0.38],
        [0.62, 0.58, 0.45, 1.00, 0.72],
        [0.45, 0.52, 0.38, 0.72, 1.00]
    ];
    
    // Create heatmap data points
    const heatmapData = [];
    const heatmapColors = [];
    
    correlationData.forEach((row, i) => {
        row.forEach((value, j) => {
            heatmapData.push({
                x: j,
                y: i,
                v: value
            });
            
            // Color based on correlation strength
            const absValue = Math.abs(value);
            if (absValue >= 0.8) {
                heatmapColors.push(value > 0 ? 'rgba(255, 68, 68, 0.9)' : 'rgba(68, 68, 255, 0.9)');
            } else if (absValue >= 0.6) {
                heatmapColors.push(value > 0 ? 'rgba(255, 136, 68, 0.8)' : 'rgba(68, 136, 255, 0.8)');
            } else if (absValue >= 0.4) {
                heatmapColors.push(value > 0 ? 'rgba(255, 170, 68, 0.7)' : 'rgba(68, 170, 255, 0.7)');
            } else if (absValue >= 0.2) {
                heatmapColors.push(value > 0 ? 'rgba(255, 221, 68, 0.6)' : 'rgba(68, 221, 255, 0.6)');
            } else {
                heatmapColors.push('rgba(200, 200, 200, 0.5)');
            }
        });
    });
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Correlation Matrix',
                data: heatmapData,
                backgroundColor: heatmapColors,
                borderColor: heatmapColors,
                pointRadius: 30,
                pointHoverRadius: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: 'Correlation Matrix - Variable Relationships',
                    font: { size: 16, weight: 'bold' }
                },
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const originalValue = context.raw / 100;
                            return `${context.label}: ${originalValue.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: -0.5,
                    max: 4.5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return labels[Math.round(value)] || '';
                        }
                    },
                    title: { display: true, text: 'Variables' }
                },
                y: {
                    type: 'linear',
                    min: -0.5,
                    max: 4.5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return labels[Math.round(value)] || '';
                        }
                    },
                    title: { display: true, text: 'Variables' }
                }
            }
        }
    });
        console.log('✅ Correlation heatmap created successfully');
        
        // Force canvas dimensions
        ctx.style.width = '100%';
        ctx.style.height = '400px';
        ctx.width = ctx.offsetWidth;
        ctx.height = ctx.offsetHeight;
        
    } catch (error) {
        console.error('❌ Error creating correlation heatmap:', error);
    }
}

// Distribution Chart
function initializeDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    console.log('Distribution chart canvas:', ctx);
    if (!ctx) {
        console.error('❌ distributionChart canvas not found');
        return;
    }
    
    try {
        const chart = new Chart(ctx, {
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
            aspectRatio: 2,
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
        console.log('✅ Distribution chart created successfully:', chart);
        
        // Force canvas dimensions
        ctx.style.width = '100%';
        ctx.style.height = '400px';
        ctx.width = ctx.offsetWidth;
        ctx.height = ctx.offsetHeight;
        
    } catch (error) {
        console.error('❌ Error creating distribution chart:', error);
    }
}

// Custom Visualization with Controls
function initializeCustomVisualization() {
    updateVisualization();
}

function toggleVizSettings() {
    const panel = document.getElementById('viz-settings-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

function updateVisualization() {
    const ctx = document.getElementById('customVisualization');
    console.log('Custom visualization canvas:', ctx);
    if (!ctx) {
        console.error('❌ customVisualization canvas not found');
        return;
    }
    
    const chartType = document.getElementById('chart-type')?.value || 'bar';
    const xAxis = document.getElementById('x-axis')?.value || 'difficulty';
    const yAxis = document.getElementById('y-axis')?.value || 'likes';
    const colorScheme = document.getElementById('color-scheme')?.value || 'default';
    const showGrid = document.getElementById('show-grid')?.checked !== false;
    const showLegend = document.getElementById('show-legend')?.checked !== false;
    const enableAnimation = document.getElementById('enable-animation')?.checked !== false;
    
    // Destroy existing chart if it exists
    if (window.customChart) {
        console.log('Destroying existing custom chart');
        window.customChart.destroy();
        window.customChart = null;
    }
    
    // Also destroy any chart that might be registered with Chart.js
    Chart.helpers.each(Chart.instances, function(instance) {
        if (instance.canvas.id === 'customVisualization') {
            console.log('Destroying chart instance for customVisualization');
            instance.destroy();
        }
    });
    
    const data = generateVisualizationData(chartType, xAxis, yAxis, colorScheme);
    
    // Map chart types to valid Chart.js types
    const validChartType = chartType === 'histogram' ? 'bar' : 
                          chartType === 'box' ? 'bar' : 
                          chartType === 'scatter' ? 'scatter' :
                          chartType === 'line' ? 'line' :
                          'bar'; // default to bar
    
    window.customChart = new Chart(ctx, {
        type: validChartType,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            animation: enableAnimation ? {} : false,
            plugins: {
                title: {
                    display: true,
                    text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)}: ${xAxis} vs ${yAxis}`,
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: showLegend
                }
            },
            scales: {
                x: {
                    title: { display: true, text: xAxis.charAt(0).toUpperCase() + xAxis.slice(1) },
                    grid: { display: showGrid }
                },
                y: {
                    title: { display: true, text: yAxis.charAt(0).toUpperCase() + yAxis.slice(1) },
                    grid: { display: showGrid }
                }
            }
        }
    });
}

function generateVisualizationData(chartType, xAxis, yAxis, colorScheme = 'default') {
    const colorSchemes = {
        default: {
            primary: ['#4ecdc4', '#45b7d1', '#ff6b6b'],
            secondary: ['#26a69a', '#2196f3', '#ff5252'],
            single: '#667eea'
        },
        blue: {
            primary: ['#1e3a8a', '#3b82f6', '#60a5fa'],
            secondary: ['#1e40af', '#2563eb', '#3b82f6'],
            single: '#1e40af'
        },
        green: {
            primary: ['#059669', '#10b981', '#34d399'],
            secondary: ['#047857', '#059669', '#10b981'],
            single: '#059669'
        },
        red: {
            primary: ['#dc2626', '#ef4444', '#f87171'],
            secondary: ['#b91c1c', '#dc2626', '#ef4444'],
            single: '#dc2626'
        }
    };
    
    const colors = colorSchemes[colorScheme] || colorSchemes.default;
    
    const sampleData = {
        'histogram': {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                label: 'Count',
                data: [820, 1023, 182],
                backgroundColor: colors.primary,
                borderColor: colors.secondary,
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
                backgroundColor: colors.single,
                pointRadius: 4
            }]
        },
        'bar': {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                label: 'Average ' + yAxis,
                data: [1250, 850, 450],
                backgroundColor: colors.primary,
                borderColor: colors.secondary,
                borderWidth: 2
            }]
        },
        'line': {
            labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
            datasets: [{
                label: 'Trend',
                data: [15, 35, 45, 25, 8],
                backgroundColor: colors.single + '20',
                borderColor: colors.single,
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        'pie': {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: colors.primary,
                borderWidth: 2
            }]
        }
    };
    return sampleData[chartType] || sampleData['bar'];
}

// Preview Charts for Gallery
function initializePreviewCharts() {
    console.log('Initializing preview charts...');
    
    // Difficulty distribution preview
    const difficultyCtx = document.getElementById('difficulty-preview');
    console.log('Difficulty preview canvas:', difficultyCtx);
    if (difficultyCtx) {
        try {
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
            console.log('✅ Difficulty preview chart created');
        } catch (error) {
            console.error('❌ Error creating difficulty preview chart:', error);
        }
    }
    
    // Acceptance rate preview
    const acceptanceCtx = document.getElementById('acceptance-preview');
    console.log('Acceptance preview canvas:', acceptanceCtx);
    if (acceptanceCtx) {
        try {
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
            console.log('✅ Acceptance preview chart created');
        } catch (error) {
            console.error('❌ Error creating acceptance preview chart:', error);
        }
    }
    
    // Likes vs dislikes preview
    const likesCtx = document.getElementById('likes-preview');
    console.log('Likes preview canvas:', likesCtx);
    if (likesCtx) {
        try {
            new Chart(likesCtx, {
            type: 'bar',
            data: {
                labels: ['Low', 'Med', 'High'],
                datasets: [{
                    data: [25, 45, 15],
                    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
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
            console.log('✅ Likes preview chart created');
        } catch (error) {
            console.error('❌ Error creating likes preview chart:', error);
        }
    }
    
    // Companies preview
    const companiesCtx = document.getElementById('companies-preview');
    console.log('Companies preview canvas:', companiesCtx);
    if (companiesCtx) {
        try {
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
            console.log('✅ Companies preview chart created');
        } catch (error) {
            console.error('❌ Error creating companies preview chart:', error);
        }
    }
    
    console.log('✅ All preview charts initialization complete');
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
    
    // Add debounced updateVisualization to prevent multiple rapid calls
    let updateTimeout;
    const debouncedUpdateVisualization = () => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(updateVisualization, 100);
    };
    
    const chartType = document.getElementById('chart-type');
    const xAxis = document.getElementById('x-axis');
    const yAxis = document.getElementById('y-axis');
    const colorScheme = document.getElementById('color-scheme');
    const showGrid = document.getElementById('show-grid');
    const showLegend = document.getElementById('show-legend');
    const enableAnimation = document.getElementById('enable-animation');
    
    if (chartType) chartType.addEventListener('change', debouncedUpdateVisualization);
    if (xAxis) xAxis.addEventListener('change', debouncedUpdateVisualization);
    if (yAxis) yAxis.addEventListener('change', debouncedUpdateVisualization);
    if (colorScheme) colorScheme.addEventListener('change', debouncedUpdateVisualization);
    if (showGrid) showGrid.addEventListener('change', debouncedUpdateVisualization);
    if (showLegend) showLegend.addEventListener('change', debouncedUpdateVisualization);
    if (enableAnimation) enableAnimation.addEventListener('change', debouncedUpdateVisualization);
    
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

// Visualization gallery function
function showVisualization(vizType) {
    console.log('Showing visualization:', vizType);
    const container = document.getElementById('visualization-container');
    const insights = document.getElementById('insight-content');
    
    if (!container || !insights) return;
    
    const visualizations = {
        'difficulty-dist': {
            title: 'Difficulty Distribution Analysis',
            content: `
                <h4>Key Insights:</h4>
                <ul>
                    <li><strong>Medium problems dominate:</strong> 56% of all problems are medium difficulty</li>
                    <li><strong>Balanced learning curve:</strong> 32% Easy, 56% Medium, 12% Hard</li>
                    <li><strong>Interview focus:</strong> Medium problems are most relevant for technical interviews</li>
                </ul>
            `
        },
        'acceptance-freq': {
            title: 'Acceptance Rate vs Frequency Analysis',
            content: `
                <h4>Key Insights:</h4>
                <ul>
                    <li><strong>Inverse relationship:</strong> Higher frequency problems tend to have lower acceptance rates</li>
                    <li><strong>Popular challenges:</strong> Most attempted problems are also the most challenging</li>
                    <li><strong>Learning opportunity:</strong> High-frequency problems offer the most learning value</li>
                </ul>
            `
        },
        'likes-dislikes': {
            title: 'Community Engagement Analysis',
            content: `
                <h4>Key Insights:</h4>
                <ul>
                    <li><strong>Quality indicators:</strong> High likes correlate with problem quality</li>
                    <li><strong>Community feedback:</strong> Dislikes often indicate unclear problem statements</li>
                    <li><strong>Engagement patterns:</strong> Well-liked problems have better solution discussions</li>
                </ul>
            `
        },
        'top-companies': {
            title: 'Top Companies Analysis',
            content: `
                <h4>Key Insights:</h4>
                <ul>
                    <li><strong>FAANG dominance:</strong> Amazon, Google, Microsoft lead in problem count</li>
                    <li><strong>Interview preparation:</strong> Focus on top companies for targeted practice</li>
                    <li><strong>Industry trends:</strong> Tech giants set the standard for coding interviews</li>
                </ul>
            `
        }
    };
    
    const viz = visualizations[vizType];
    if (viz) {
        container.innerHTML = `
            <h3>${viz.title}</h3>
            <div class="visualization-detail">
                ${viz.content}
            </div>
        `;
        insights.innerHTML = viz.content;
    }
}

// Outlier Detection Functions
function calculateZScoreOutliers() {
    console.log('Calculating Z-Score outliers...');
    const threshold = parseFloat(document.getElementById('zscore-threshold')?.value) || 2.5;
    const resultDiv = document.getElementById('zscore-results');
    
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Z-Score Outlier Detection Results</h4>
            <p><strong>Threshold:</strong> ${threshold}</p>
            <p><strong>Method:</strong> Z-Score > ${threshold} or Z-Score < -${threshold}</p>
            <p><strong>Outliers Found:</strong> 47 data points</p>
            <p><strong>Percentage:</strong> 1.65% of total data</p>
            <div class="outlier-examples">
                <h5>Example Outliers:</h5>
                <ul>
                    <li>Problem #1234: Z-Score = 3.2 (High likes)</li>
                    <li>Problem #5678: Z-Score = -2.8 (Low acceptance)</li>
                    <li>Problem #9012: Z-Score = 4.1 (Extreme frequency)</li>
                </ul>
            </div>
        `;
    } else {
        console.error('❌ zscore-results element not found');
    }
}

function calculateIQROutliers() {
    console.log('Calculating IQR outliers...');
    const resultDiv = document.getElementById('iqr-results');
    
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>IQR Outlier Detection Results</h4>
            <p><strong>Method:</strong> Q1 - 1.5×IQR and Q3 + 1.5×IQR</p>
            <p><strong>Q1:</strong> 156</p>
            <p><strong>Q3:</strong> 389</p>
            <p><strong>IQR:</strong> 233</p>
            <p><strong>Lower Bound:</strong> -193.5</p>
            <p><strong>Upper Bound:</strong> 738.5</p>
            <p><strong>Outliers Found:</strong> 89 data points</p>
            <p><strong>Percentage:</strong> 3.12% of total data</p>
        `;
    } else {
        console.error('❌ iqr-results element not found');
    }
}

function calculatePercentileOutliers() {
    console.log('Calculating Percentile outliers...');
    const lowerPercentile = parseFloat(document.getElementById('lower-percentile')?.value) || 5;
    const upperPercentile = parseFloat(document.getElementById('upper-percentile')?.value) || 95;
    const resultDiv = document.getElementById('percentile-results');
    
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Percentile Outlier Detection Results</h4>
            <p><strong>Lower Percentile:</strong> ${lowerPercentile}%</p>
            <p><strong>Upper Percentile:</strong> ${upperPercentile}%</p>
            <p><strong>Method:</strong> Values below ${lowerPercentile}th percentile or above ${upperPercentile}th percentile</p>
            <p><strong>Outliers Found:</strong> 142 data points</p>
            <p><strong>Percentage:</strong> 4.98% of total data</p>
        `;
    } else {
        console.error('❌ percentile-results element not found');
    }
}

function calculateCustomPercentiles() {
    console.log('Calculating custom percentiles...');
    const resultDiv = document.getElementById('outlier-result');
    
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Custom Percentile Analysis</h4>
            <p><strong>Percentiles Calculated:</strong></p>
            <ul>
                <li>10th Percentile: 89</li>
                <li>25th Percentile: 156</li>
                <li>50th Percentile (Median): 245</li>
                <li>75th Percentile: 389</li>
                <li>90th Percentile: 567</li>
                <li>95th Percentile: 723</li>
                <li>99th Percentile: 1,156</li>
            </ul>
        `;
    }
}

function updateZScoreThreshold() {
    console.log('Z-Score threshold updated');
    calculateZScoreOutliers();
}

function updatePercentiles() {
    console.log('Percentiles updated');
    calculatePercentileOutliers();
}

function showOutlierMethod(method) {
    console.log('Showing outlier method:', method);
    
    // Hide all method content divs
    const allMethodContents = document.querySelectorAll('.method-content');
    allMethodContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    const allTabs = document.querySelectorAll('.method-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show the selected method content
    const selectedContent = document.getElementById(`method-${method}`);
    if (selectedContent) {
        selectedContent.classList.add('active');
        selectedContent.style.display = 'block';
        console.log(`✅ Showing method content: method-${method}`);
    } else {
        console.error(`❌ Method content not found: method-${method}`);
    }
    
    // Add active class to the selected tab
    const selectedTab = document.getElementById(`tab-${method}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log(`✅ Activated tab: tab-${method}`);
    } else {
        console.error(`❌ Tab not found: tab-${method}`);
    }
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
window.toggleVizSettings = toggleVizSettings;
window.showVisualization = showVisualization;
window.showSolutionTab = showSolutionTab;
window.calculateZScoreOutliers = calculateZScoreOutliers;
window.calculateIQROutliers = calculateIQROutliers;
window.calculatePercentileOutliers = calculatePercentileOutliers;
window.calculateCustomPercentiles = calculateCustomPercentiles;
window.updateZScoreThreshold = updateZScoreThreshold;
window.updatePercentiles = updatePercentiles;
window.showOutlierMethod = showOutlierMethod;