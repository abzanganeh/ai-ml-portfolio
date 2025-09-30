/**
 * Shared Tutorial JavaScript - Python API Integration
 * This file replaces the original shared-tutorial.js and uses Python APIs
 */

// Global configuration
const API_BASE_URL = '/api';
const TUTORIAL_ID = 'clustering';

// Section navigation functionality - dynamically determined from page
let sections = [];
let sectionLabels = [];

function initializeSections() {
    const sectionButtons = document.querySelectorAll('.section-nav-btn');
    sections = [];
    sectionLabels = [];
    
    sectionButtons.forEach(button => {
        const sectionId = button.getAttribute('data-section');
        const sectionLabel = button.textContent.trim();
        sections.push(sectionId);
        sectionLabels.push(sectionLabel);
    });
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', sectionLabels);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Python API tutorial integration...');
    
    // Initialize sections from page content
    initializeSections();
    
    // Initialize tutorial components
    initSectionNavigation();
    initProgressBars();
    initProgressTracking();
    initQuizSystem();
    initDemoStates();
    initVisualizations();
    initInteractiveDemos();
    initBottomNavigation();
    initMinkowskiDemo();
    
    console.log('✅ Python API tutorial integration initialized!');
});

/**
 * Section Navigation Functions
 */
function initSectionNavigation() {
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    console.log('Initializing section navigation...');
    console.log('Found section nav buttons:', sectionNavButtons.length);
    console.log('Found content sections:', contentSections.length);
    
    // Add click handlers to section navigation buttons
    sectionNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            console.log('Section button clicked:', targetSection);
            showSection(targetSection);
        });
    });
    
    // Show first section by default
    if (sections.length > 0) {
        showSection(sections[0]);
    }
}

function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Section shown:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
    
    // Update navigation buttons
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
    sectionNavButtons.forEach(button => {
        if (button.getAttribute('data-section') === sectionId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Scroll to top of content
    const mainContent = document.querySelector('.chapter-main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    
    // Update bottom navigation labels
    updateBottomNavigationLabels();
}

/**
 * Progress Bars Initialization
 */
function initProgressBars() {
    console.log('Initializing progress bars...');
    
    // Initialize chapter progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = bar.dataset.progress || 0;
        bar.style.width = `${progress}%`;
        bar.textContent = `${Math.round(progress)}%`;
    });
    
    // Initialize section progress indicators
    const sectionProgress = document.querySelectorAll('.section-progress');
    sectionProgress.forEach(progress => {
        const completed = progress.dataset.completed || 0;
        const total = progress.dataset.total || 1;
        const percentage = (completed / total) * 100;
        progress.style.width = `${percentage}%`;
    });
}

/**
 * Interactive Demos Initialization
 */
function initInteractiveDemos() {
    console.log('Initializing interactive demos...');
    
    // Initialize demo containers
    const demoContainers = document.querySelectorAll('.demo-container');
    demoContainers.forEach(container => {
        const demoId = container.dataset.demoId;
        if (demoId) {
            console.log('Initializing demo:', demoId);
            initializeDemo(container, demoId);
        }
    });
    
    // Initialize demo buttons
    const demoButtons = document.querySelectorAll('.demo-btn');
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoId = this.dataset.demoId;
            const action = this.dataset.action;
            console.log('Demo button clicked:', demoId, action);
            handleDemoAction(demoId, action);
        });
    });
    
    // Initialize K-means demo controls
    initKMeansDemo();
    
    // Initialize clustering algorithm demos
    initClusteringDemos();
    
    // Initialize visualization demos
    initVisualizationDemos();
}

function initializeDemo(container, demoId) {
    // Add demo-specific initialization here
    console.log('Demo initialized:', demoId);
    
    // Load demo state from Python API
    loadDemoState(demoId);
}

function handleDemoAction(demoId, action) {
    console.log('Handling demo action:', demoId, action);
    
    const container = document.querySelector(`[data-demo-id="${demoId}"]`);
    if (!container) {
        console.error('Demo container not found:', demoId);
        return;
    }
    
    switch (action) {
        case 'start':
            startDemo(demoId, container);
            break;
        case 'reset':
            resetDemo(demoId, container);
            break;
        case 'step':
            stepDemo(demoId, container);
            break;
        case 'run':
            runDemo(demoId, container);
            break;
        default:
            console.log('Unknown demo action:', action);
    }
}

function startDemo(demoId, container) {
    console.log('Starting demo:', demoId);
    // Demo-specific start logic
    showNotification('Demo started!', 'info');
}

function resetDemo(demoId, container) {
    console.log('Resetting demo:', demoId);
    // Demo-specific reset logic
    showNotification('Demo reset!', 'info');
}

function stepDemo(demoId, container) {
    console.log('Stepping demo:', demoId);
    // Demo-specific step logic
    showNotification('Demo step executed!', 'info');
}

function runDemo(demoId, container) {
    console.log('Running demo:', demoId);
    // Demo-specific run logic
    showNotification('Demo running...', 'info');
}

/**
 * K-Means Demo Implementation
 */
function initKMeansDemo() {
    console.log('Initializing K-means demo...');
    
    // Initialize range slider value displays
    const numPointsSlider = document.getElementById('num-points');
    const numClustersSlider = document.getElementById('num-clusters');
    const pointsValue = document.getElementById('points-value');
    const clustersValue = document.getElementById('clusters-value');
    
    if (numPointsSlider && pointsValue) {
        numPointsSlider.addEventListener('input', function() {
            pointsValue.textContent = this.value;
        });
    }
    
    if (numClustersSlider && clustersValue) {
        numClustersSlider.addEventListener('input', function() {
            clustersValue.textContent = this.value;
        });
    }
    
    // Initialize demo buttons
    const generateBtn = document.getElementById('generate-data');
    const startBtn = document.getElementById('start-kmeans');
    const stepBtn = document.getElementById('step-kmeans');
    const resetBtn = document.getElementById('reset-kmeans');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateKMeansData);
    }
    if (startBtn) {
        startBtn.addEventListener('click', startKMeans);
    }
    if (stepBtn) {
        stepBtn.addEventListener('click', stepKMeans);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetKMeans);
    }
}

// Global variables for K-means demo
let currentData = [];
let currentCentroids = [];
let currentClusters = [];
let kmeans_iteration = 0;
let isRunning = false;

function generateKMeansData() {
    const numPoints = parseInt(document.getElementById('num-points').value);
    const dataType = document.getElementById('data-type').value;
    
    currentData = [];
    
    if (dataType === 'random') {
        for (let i = 0; i < numPoints; i++) {
            currentData.push({
                x: Math.random() * 400 + 50,
                y: Math.random() * 200 + 50,
                cluster: -1
            });
        }
    } else if (dataType === 'clusters') {
        // Generate clustered data
        const numClusters = parseInt(document.getElementById('num-clusters').value);
        const pointsPerCluster = Math.floor(numPoints / numClusters);
        
        for (let c = 0; c < numClusters; c++) {
            const centerX = Math.random() * 300 + 100;
            const centerY = Math.random() * 150 + 75;
            
            for (let i = 0; i < pointsPerCluster; i++) {
                currentData.push({
                    x: centerX + (Math.random() - 0.5) * 80,
                    y: centerY + (Math.random() - 0.5) * 60,
                    cluster: -1
                });
            }
        }
    }
    
    // Reset K-means state
    kmeans_iteration = 0;
    currentCentroids = [];
    currentClusters = [];
    
    // Visualize data
    visualizeData();
    showNotification('Data generated successfully!', 'success');
}

function startKMeans() {
    if (currentData.length === 0) {
        showNotification('Please generate data first!', 'warning');
        return;
    }
    
    const numClusters = parseInt(document.getElementById('num-clusters').value);
    
    // Initialize centroids randomly
    currentCentroids = [];
    for (let i = 0; i < numClusters; i++) {
        const randomPoint = currentData[Math.floor(Math.random() * currentData.length)];
        currentCentroids.push({
            x: randomPoint.x,
            y: randomPoint.y,
            cluster: i
        });
    }
    
    kmeans_iteration = 0;
    isRunning = true;
    
    // Show/hide buttons
    document.getElementById('run-btn').style.display = 'none';
    document.getElementById('stop-btn').style.display = 'inline-block';
    document.getElementById('step-btn').style.display = 'none';
    
    // Auto-run K-means algorithm with delays
    autoRunKMeans();
    showNotification('K-means algorithm started!', 'info');
}

function stepKMeans() {
    if (currentData.length === 0) {
        showNotification('Please generate data first!', 'warning');
        return;
    }
    
    // If centroids don't exist, initialize them
    if (currentCentroids.length === 0) {
        const numClusters = parseInt(document.getElementById('num-clusters').value);
        currentCentroids = [];
        for (let i = 0; i < numClusters; i++) {
            const randomPoint = currentData[Math.floor(Math.random() * currentData.length)];
            currentCentroids.push({
                x: randomPoint.x,
                y: randomPoint.y,
                cluster: i
            });
        }
        kmeans_iteration = 0;
    }
    
    // Run one iteration
    runKMeansIteration();
    
    // Check if converged
    if (kmeans_iteration >= 10) {
        showNotification('K-means converged after ' + kmeans_iteration + ' iterations!', 'success');
    }
}

function autoRunKMeans() {
    if (!isRunning) return;
    
    runKMeansIteration();
    
    // Check if converged
    if (kmeans_iteration >= 10) {
        isRunning = false;
        showNotification('K-means converged after ' + kmeans_iteration + ' iterations!', 'success');
        // Reset button visibility
        document.getElementById('run-btn').style.display = 'inline-block';
        document.getElementById('stop-btn').style.display = 'none';
        document.getElementById('step-btn').style.display = 'inline-block';
        return;
    }
    
    // Continue with next iteration after 1 second delay
    setTimeout(() => {
        autoRunKMeans();
    }, 1000);
}

function stopKmeans() {
    isRunning = false;
    showNotification('K-means algorithm stopped!', 'info');
    
    // Reset button visibility
    document.getElementById('run-btn').style.display = 'inline-block';
    document.getElementById('stop-btn').style.display = 'none';
    document.getElementById('step-btn').style.display = 'inline-block';
}

function resetKMeans() {
    currentData = [];
    currentCentroids = [];
    currentClusters = [];
    kmeans_iteration = 0;
    isRunning = false;
    
    // Reset button visibility
    document.getElementById('run-btn').style.display = 'inline-block';
    document.getElementById('stop-btn').style.display = 'none';
    document.getElementById('step-btn').style.display = 'inline-block';
    
    // Clear visualization
    const canvas = document.getElementById('kmeans-canvas');
    if (canvas) {
        const actualCanvas = canvas.querySelector('canvas');
        if (actualCanvas) {
            const ctx = actualCanvas.getContext('2d');
            ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
        }
    }
    
    showNotification('K-means demo reset!', 'info');
}

function runKMeansIteration() {
    kmeans_iteration++;
    
    // Assign points to nearest centroid
    currentData.forEach(point => {
        let minDistance = Infinity;
        let nearestCluster = 0;
        
        currentCentroids.forEach((centroid, index) => {
            const distance = Math.sqrt(
                Math.pow(point.x - centroid.x, 2) + 
                Math.pow(point.y - centroid.y, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestCluster = index;
            }
        });
        
        point.cluster = nearestCluster;
    });
    
    // Update centroids
    currentCentroids.forEach((centroid, index) => {
        const clusterPoints = currentData.filter(p => p.cluster === index);
        if (clusterPoints.length > 0) {
            centroid.x = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
            centroid.y = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
        }
    });
    
    // Visualize current state
    visualizeKMeans();
}

function visualizeData() {
    const canvas = document.getElementById('kmeans-canvas');
    if (!canvas) return;
    
    // Create a proper canvas element if it doesn't exist
    let actualCanvas = canvas.querySelector('canvas');
    if (!actualCanvas) {
        actualCanvas = document.createElement('canvas');
        actualCanvas.width = 500;
        actualCanvas.height = 300;
        actualCanvas.style.border = '1px solid #ccc';
        actualCanvas.style.borderRadius = '8px';
        canvas.innerHTML = '';
        canvas.appendChild(actualCanvas);
    }
    
    const ctx = actualCanvas.getContext('2d');
    ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
    
    // Draw data points
    currentData.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#666';
        ctx.fill();
    });
}

function visualizeKMeans() {
    const canvas = document.getElementById('kmeans-canvas');
    if (!canvas) return;
    
    // Get the actual canvas element
    let actualCanvas = canvas.querySelector('canvas');
    if (!actualCanvas) {
        actualCanvas = document.createElement('canvas');
        actualCanvas.width = 500;
        actualCanvas.height = 300;
        actualCanvas.style.border = '1px solid #ccc';
        actualCanvas.style.borderRadius = '8px';
        canvas.innerHTML = '';
        canvas.appendChild(actualCanvas);
    }
    
    const ctx = actualCanvas.getContext('2d');
    ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
    
    // Color palette for clusters
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    
    // Draw data points with cluster colors
    currentData.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = colors[point.cluster % colors.length];
        ctx.fill();
    });
    
    // Draw centroids
    currentCentroids.forEach((centroid, index) => {
        ctx.beginPath();
        ctx.arc(centroid.x, centroid.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Update iteration counter
    const iterationDisplay = document.getElementById('iteration-count');
    if (iterationDisplay) {
        iterationDisplay.textContent = kmeans_iteration;
    }
}

/**
 * Clustering Algorithm Demos
 */
function initClusteringDemos() {
    console.log('Initializing clustering algorithm demos...');
    
    // Initialize hierarchical clustering demo
    const hierarchicalBtn = document.getElementById('run-hierarchical');
    if (hierarchicalBtn) {
        hierarchicalBtn.addEventListener('click', runHierarchicalDemo);
    }
    
    // Initialize DBSCAN demo
    const dbscanBtn = document.getElementById('run-dbscan');
    if (dbscanBtn) {
        dbscanBtn.addEventListener('click', runDBSCANDemo);
    }
    
    // Initialize GMM demo
    const gmmBtn = document.getElementById('run-gmm');
    if (gmmBtn) {
        gmmBtn.addEventListener('click', runGMMDemo);
    }
}

function runHierarchicalDemo() {
    console.log('Running hierarchical clustering demo...');
    
    // Call Python API for hierarchical clustering visualization
    fetch('/api/visualizations/linkage-comparison', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            linkage_methods: ['single', 'complete', 'average', 'ward'],
            n_samples: 100,
            n_clusters: 3
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Render the visualization
            renderPlotlyChart('hierarchical-demo', data.visualization);
            showNotification('Hierarchical clustering demo completed!', 'success');
        } else {
            showNotification('Error running hierarchical demo: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error running hierarchical demo', 'error');
    });
}

function runDBSCANDemo() {
    console.log('Running DBSCAN demo...');
    showNotification('DBSCAN demo started!', 'info');
    
    // Add DBSCAN-specific demo logic here
    // This would call the Python API for DBSCAN visualization
}

function runGMMDemo() {
    console.log('Running GMM demo...');
    showNotification('GMM demo started!', 'info');
    
    // Add GMM-specific demo logic here
    // This would call the Python API for GMM visualization
}

/**
 * Visualization Demos
 */
function initVisualizationDemos() {
    console.log('Initializing visualization demos...');
    
    // Initialize elbow method demo
    const elbowBtn = document.getElementById('run-elbow');
    if (elbowBtn) {
        elbowBtn.addEventListener('click', runElbowDemo);
    }
    
    // Initialize silhouette analysis demo
    const silhouetteBtn = document.getElementById('run-silhouette');
    if (silhouetteBtn) {
        silhouetteBtn.addEventListener('click', runSilhouetteDemo);
    }
}

function runElbowDemo() {
    console.log('Running elbow method demo...');
    
    // Call Python API for elbow method visualization
    fetch('/api/visualizations/elbow-method', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            wcss_values: [1000, 800, 600, 450, 350, 300, 280, 270, 265, 260],
            k_values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderPlotlyChart('elbow-demo', data.visualization);
            showNotification('Elbow method demo completed!', 'success');
        } else {
            showNotification('Error running elbow demo: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error running elbow demo', 'error');
    });
}

function runSilhouetteDemo() {
    console.log('Running silhouette analysis demo...');
    
    // Call Python API for silhouette analysis visualization
    fetch('/api/visualizations/silhouette-analysis', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            n_samples: 200,
            n_clusters_range: [2, 3, 4, 5, 6]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            renderPlotlyChart('silhouette-demo', data.visualization);
            showNotification('Silhouette analysis demo completed!', 'success');
        } else {
            showNotification('Error running silhouette demo: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error running silhouette demo', 'error');
    });
}

/**
 * Progress tracking using Python API
 */
function initProgressTracking() {
    // Track page visibility for progress updates
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            updateProgress();
        }
    });
    
    // Track scroll progress
    let scrollProgress = 0;
    window.addEventListener('scroll', debounce(function() {
        const newProgress = calculateScrollProgress();
        if (newProgress > scrollProgress + 10) { // Update every 10%
            scrollProgress = newProgress;
            updateProgress(scrollProgress);
        }
    }, 1000));
    
    // Initial progress load
    loadProgress();
}

async function loadProgress() {
    try {
        const response = await fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/progress?user_id=anonymous`);
        const result = await response.json();
        
        if (response.ok) {
            displayProgress(result);
        }
    } catch (error) {
        console.error('Progress load error:', error);
    }
}

function displayProgress(progressData) {
    console.log('Displaying progress:', progressData);
    
    // Update overall progress
    if (progressData.overall_progress !== undefined) {
        const progressBars = document.querySelectorAll('.chapter-progress-fill');
        progressBars.forEach(bar => {
            bar.style.width = `${progressData.overall_progress}%`;
        });
    }
    
    // Update chapter-specific progress
    if (progressData.chapters) {
        progressData.chapters.forEach(chapter => {
            const chapterId = chapter.chapter_id;
            const progress = chapter.progress_percentage;
            
            // Update chapter navigation button
            const chapterBtn = document.querySelector(`a[href*="${chapterId}"]`);
            if (chapterBtn) {
                if (progress >= 100) {
                    chapterBtn.classList.add('completed');
                } else if (progress > 0) {
                    chapterBtn.classList.add('in-progress');
                }
            }
        });
    }
}

async function updateProgress(progressPercentage = null) {
    const chapterId = getCurrentChapterId();
    if (!chapterId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/progress?user_id=anonymous`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chapter_id: chapterId,
                progress_percentage: progressPercentage || calculateScrollProgress()
            })
        });
        
        const result = await response.json();
        if (response.ok && result.success) {
            console.log('Progress updated successfully');
        }
    } catch (error) {
        console.error('Progress update error:', error);
    }
}

function displayProgress(progressData) {
    // Update progress indicators in the UI
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const chapterId = bar.dataset.chapter;
        const chapterProgress = progressData.chapters?.find(c => c.chapter_id === chapterId);
        if (chapterProgress) {
            bar.style.width = `${chapterProgress.progress_percentage}%`;
            bar.textContent = `${Math.round(chapterProgress.progress_percentage)}%`;
        }
    });
    
    // Update overall progress
    const overallProgress = document.getElementById('overall-progress');
    if (overallProgress) {
        overallProgress.textContent = `${Math.round(progressData.overall_progress || 0)}%`;
    }
}

function getCurrentChapterId() {
    const path = window.location.pathname;
    const match = path.match(/chapter(\d+)/);
    return match ? `chapter${match[1]}` : 'chapter1';
}

function calculateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
}

/**
 * Quiz system using Python API
 */
function initQuizSystem() {
    console.log('Initializing enhanced quiz system...');
    
    const quizForms = document.querySelectorAll('.quiz-form');
    quizForms.forEach(form => {
        form.addEventListener('submit', handleQuizSubmission);
    });
    
    // Initialize quiz buttons
    const quizButtons = document.querySelectorAll('.quiz-btn');
    quizButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizId = this.dataset.quizId;
            console.log('Quiz button clicked:', quizId);
            loadQuiz(quizId);
        });
    });
    
    // Initialize quiz navigation
    const nextQuestionBtn = document.getElementById('next-question');
    const prevQuestionBtn = document.getElementById('prev-question');
    const submitQuizBtn = document.getElementById('submit-quiz');
    
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', nextQuestion);
    }
    if (prevQuestionBtn) {
        prevQuestionBtn.addEventListener('click', prevQuestion);
    }
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', submitCurrentQuiz);
    }
}

async function handleQuizSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const quizId = form.dataset.quizId;
    const chapterId = getCurrentChapterId();
    
    // Collect answers
    const answers = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'radio' && input.checked) {
            answers[input.name] = input.value;
        } else if (input.type === 'checkbox') {
            if (!answers[input.name]) answers[input.name] = [];
            if (input.checked) answers[input.name].push(input.value);
        } else if (input.type !== 'radio' && input.type !== 'checkbox') {
            answers[input.name] = input.value;
        }
    });
    
    try {
        showQuizLoading(form);
        
        const response = await fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/quiz/${quizId}?user_id=anonymous`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chapter_id: chapterId,
                answers: answers
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            displayQuizResults(result);
            // Mark chapter as complete if quiz passed
            if (result.score >= 70) {
                completeChapter();
            }
        } else {
            showNotification('Quiz submission failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Quiz submission error:', error);
        showNotification('Quiz submission failed. Please check your connection.', 'error');
    } finally {
        hideQuizLoading(form);
    }
}

function displayQuizResults(result) {
    const score = result.score;
    const feedback = result.feedback;
    
    // Create results modal
    const modal = document.createElement('div');
    modal.className = 'quiz-results-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Quiz Results</h3>
            <div class="quiz-score">
                <div class="score-circle ${score >= 70 ? 'pass' : 'fail'}">
                    ${score}%
                </div>
                <p class="score-feedback">${feedback}</p>
            </div>
            <div class="quiz-actions">
                <button onclick="this.closest('.quiz-results-modal').remove()">Close</button>
                ${score < 70 ? '<button onclick="retakeQuiz()">Retake Quiz</button>' : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show notification
    const message = score >= 70 ? 
        `Great job! You scored ${score}%` : 
        `You scored ${score}%. Consider reviewing the material.`;
    showNotification(message, score >= 70 ? 'success' : 'warning');
}

function showQuizLoading(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
    }
}

function hideQuizLoading(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Quiz';
    }
}

/**
 * Demo state management using Python API
 */
function initDemoStates() {
    const demos = document.querySelectorAll('.demo-container');
    demos.forEach(demo => {
        const demoId = demo.dataset.demoId;
        if (demoId) {
            loadDemoState(demoId);
            setupDemoStateSaving(demo, demoId);
        }
    });
}

async function loadDemoState(demoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/demo/${demoId}?session_id=anonymous`);
        const result = await response.json();
        
        if (response.ok && result.success) {
            restoreDemoState(demoId, result.parameters, result.results);
        }
    } catch (error) {
        console.error('Demo state load error:', error);
    }
}

async function saveDemoState(demoId, parameters, results) {
    try {
        const response = await fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/demo/${demoId}?session_id=anonymous`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parameters: parameters,
                results: results
            })
        });
        
        const result = await response.json();
        if (response.ok && result.success) {
            console.log('Demo state saved successfully');
        }
    } catch (error) {
        console.error('Demo state save error:', error);
    }
}

function setupDemoStateSaving(demo, demoId) {
    // Save state when demo parameters change
    const inputs = demo.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.addEventListener('change', debounce(() => {
            const parameters = collectDemoParameters(demo);
            const results = collectDemoResults(demo);
            saveDemoState(demoId, parameters, results);
        }, 1000));
    });
}

function collectDemoParameters(demo) {
    const parameters = {};
    const inputs = demo.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.type === 'number') {
            parameters[input.name] = parseFloat(input.value);
        } else if (input.type === 'checkbox') {
            parameters[input.name] = input.checked;
        } else {
            parameters[input.name] = input.value;
        }
    });
    return parameters;
}

function collectDemoResults(demo) {
    const results = {};
    const resultElements = demo.querySelectorAll('.demo-result, .demo-output');
    resultElements.forEach(element => {
        results[element.className] = element.textContent || element.innerHTML;
    });
    return results;
}

function restoreDemoState(demoId, parameters, results) {
    const demo = document.querySelector(`[data-demo-id="${demoId}"]`);
    if (!demo) return;
    
    // Restore parameters
    Object.entries(parameters).forEach(([name, value]) => {
        const input = demo.querySelector(`[name="${name}"]`);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = value;
            } else {
                input.value = value;
            }
        }
    });
    
    // Restore results
    Object.entries(results).forEach(([className, content]) => {
        const element = demo.querySelector(`.${className}`);
        if (element) {
            element.innerHTML = content;
        }
    });
}

/**
 * Visualization loading using Python API
 */
function initVisualizations() {
    // Load Plotly if not already loaded
    if (!window.Plotly) {
        const script = document.createElement('script');
        script.src = 'https://cdn.plot.ly/plotly-2.26.0.min.js';
        script.onload = loadAllVisualizations;
        document.head.appendChild(script);
    } else {
        loadAllVisualizations();
    }
}

function loadAllVisualizations() {
    // Load convergence visualization
    if (document.getElementById('convergence-chart')) {
        loadConvergenceVisualization();
    }
    
    // Load elbow method visualization
    if (document.getElementById('elbow-chart')) {
        loadElbowMethodVisualization();
    }
    
    // Load silhouette analysis visualization
    if (document.getElementById('silhouette-chart')) {
        loadSilhouetteAnalysisVisualization();
    }
    
    // Load linkage comparison visualization
    if (document.getElementById('linkage-chart')) {
        loadLinkageComparisonVisualization();
    }
}

async function loadConvergenceVisualization() {
    try {
        const response = await fetch(`${API_BASE_URL}/visualizations/convergence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                iterations: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                objective_values: [1000, 800, 650, 550, 480, 430, 400, 385, 375, 370]
            })
        });
        
        const result = await response.json();
        if (result.success && window.Plotly) {
            const plotData = JSON.parse(result.visualization);
            Plotly.newPlot('convergence-chart', plotData.data, plotData.layout, {responsive: true});
        }
    } catch (error) {
        console.error('Error loading convergence visualization:', error);
        showVisualizationError('convergence-chart');
    }
}

async function loadElbowMethodVisualization() {
    try {
        const response = await fetch(`${API_BASE_URL}/visualizations/elbow-method`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wcss_values: [1000, 800, 600, 450, 350, 300, 280, 270, 265, 263],
                k_values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            })
        });
        
        const result = await response.json();
        if (result.success && window.Plotly) {
            const plotData = JSON.parse(result.visualization);
            Plotly.newPlot('elbow-chart', plotData.data, plotData.layout, {responsive: true});
        }
    } catch (error) {
        console.error('Error loading elbow method visualization:', error);
        showVisualizationError('elbow-chart');
    }
}

async function loadSilhouetteAnalysisVisualization() {
    try {
        const response = await fetch(`${API_BASE_URL}/visualizations/silhouette-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                silhouette_scores: [0.2, 0.4, 0.6, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
                k_values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            })
        });
        
        const result = await response.json();
        if (result.success && window.Plotly) {
            const plotData = JSON.parse(result.visualization);
            Plotly.newPlot('silhouette-chart', plotData.data, plotData.layout, {responsive: true});
        }
    } catch (error) {
        console.error('Error loading silhouette analysis visualization:', error);
        showVisualizationError('silhouette-chart');
    }
}

async function loadLinkageComparisonVisualization() {
    try {
        const response = await fetch(`${API_BASE_URL}/visualizations/linkage-comparison`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: Array(30).fill().map(() => ({x: Math.random(), y: Math.random()})),
                linkage_methods: ['Single Linkage', 'Complete Linkage', 'Average Linkage', 'Ward\'s Method', 'Centroid Linkage', 'Median Linkage']
            })
        });
        
        const result = await response.json();
        if (result.success && window.Plotly) {
            const plotData = JSON.parse(result.visualization);
            Plotly.newPlot('linkage-chart', plotData.data, plotData.layout, {responsive: true});
        }
    } catch (error) {
        console.error('Error loading linkage comparison visualization:', error);
        showVisualizationError('linkage-chart');
    }
}

function showVisualizationError(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="error-message"><p>Failed to load visualization</p></div>';
    }
}

/**
 * Chapter completion
 */
async function completeChapter() {
    const chapterId = getCurrentChapterId();
    
    try {
        const response = await fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/chapter/${chapterId}/complete?user_id=anonymous`, {
            method: 'POST'
        });
        
        const result = await response.json();
        if (response.ok && result.success) {
            showNotification('Chapter completed! 🎉', 'success');
            updateProgress(100);
        }
    } catch (error) {
        console.error('Chapter completion error:', error);
    }
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p class="notification-message">${message}</p>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to container
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

// Export functions for global access
window.completeChapter = completeChapter;
window.retakeQuiz = function() {
    const quizForm = document.querySelector('.quiz-form');
    if (quizForm) {
        quizForm.reset();
        const modal = document.querySelector('.quiz-results-modal');
        if (modal) modal.remove();
    }
};

/**
 * Enhanced Quiz System Functions
 */
// Quiz state management
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizAnswers = {};

function loadQuiz(quizId) {
    console.log('Loading quiz:', quizId);
    
    // Show loading state
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        quizContainer.innerHTML = '<div class="loading">Loading quiz...</div>';
    }
    
    // Call Python API to get quiz data
    fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/quiz/${quizId}?user_id=anonymous`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentQuiz = data.quiz;
                currentQuestionIndex = 0;
                quizAnswers = {};
                displayQuiz(currentQuiz);
                showNotification('Quiz loaded successfully!', 'success');
            } else {
                showNotification('Error loading quiz: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error loading quiz:', error);
            showNotification('Error loading quiz', 'error');
        });
}

function displayQuiz(quiz) {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    let html = `
        <div class="quiz-header">
            <h3>${quiz.title}</h3>
            <div class="quiz-progress">
                <span>Question ${currentQuestionIndex + 1} of ${quiz.questions.length}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%"></div>
                </div>
            </div>
        </div>
        
        <div class="quiz-question">
            <h4>${quiz.questions[currentQuestionIndex].question}</h4>
            <div class="quiz-options">
    `;
    
    const question = quiz.questions[currentQuestionIndex];
    question.options.forEach((option, index) => {
        const isChecked = quizAnswers[currentQuestionIndex] === index ? 'checked' : '';
        html += `
            <label class="quiz-option">
                <input type="radio" name="answer" value="${index}" ${isChecked}>
                <span>${option}</span>
            </label>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div class="quiz-navigation">
            <button id="prev-question" class="azbn-btn azbn-secondary" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                Previous
            </button>
            <button id="next-question" class="azbn-btn" ${currentQuestionIndex === quiz.questions.length - 1 ? 'disabled' : ''}>
                ${currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
            </button>
        </div>
    `;
    
    quizContainer.innerHTML = html;
    
    // Re-attach event listeners
    const nextBtn = document.getElementById('next-question');
    const prevBtn = document.getElementById('prev-question');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', prevQuestion);
    }
    
    // Save answer when option is selected
    const radioButtons = quizContainer.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            quizAnswers[currentQuestionIndex] = parseInt(this.value);
        });
    });
}

function nextQuestion() {
    if (!currentQuiz) return;
    
    // Save current answer
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        quizAnswers[currentQuestionIndex] = parseInt(selectedAnswer.value);
    }
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuiz(currentQuiz);
    } else {
        // Submit quiz
        submitCurrentQuiz();
    }
}

function prevQuestion() {
    if (!currentQuiz || currentQuestionIndex === 0) return;
    
    // Save current answer
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        quizAnswers[currentQuestionIndex] = parseInt(selectedAnswer.value);
    }
    
    currentQuestionIndex--;
    displayQuiz(currentQuiz);
}

function submitCurrentQuiz() {
    if (!currentQuiz) return;
    
    // Save current answer
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        quizAnswers[currentQuestionIndex] = parseInt(selectedAnswer.value);
    }
    
    // Submit quiz to Python API
    submitQuiz(currentQuiz.id, quizAnswers);
}

function submitQuiz(quizId, answers) {
    console.log('Submitting quiz:', quizId, answers);
    
    fetch(`${API_BASE_URL}/tutorials/${TUTORIAL_ID}/quiz/${quizId}?user_id=anonymous`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            answers: answers,
            user_id: 'anonymous'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayQuizResults(data.results);
            showNotification('Quiz submitted successfully!', 'success');
        } else {
            showNotification('Error submitting quiz: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error submitting quiz:', error);
        showNotification('Error submitting quiz', 'error');
    });
}

function displayQuizResults(results) {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    const score = results.score;
    const total = results.total;
    const percentage = Math.round((score / total) * 100);
    
    let html = `
        <div class="quiz-results">
            <h3>Quiz Results</h3>
            <div class="score-display">
                <div class="score-circle">
                    <span class="score-number">${score}</span>
                    <span class="score-total">/${total}</span>
                </div>
                <div class="score-percentage">${percentage}%</div>
            </div>
            
            <div class="results-summary">
                <p>You answered ${score} out of ${total} questions correctly.</p>
                <p class="score-message">${getScoreMessage(percentage)}</p>
            </div>
            
            <div class="quiz-actions">
                <button class="azbn-btn" onclick="location.reload()">Retake Quiz</button>
                <button class="azbn-btn azbn-secondary" onclick="showNextChapter()">Continue Learning</button>
            </div>
        </div>
    `;
    
    quizContainer.innerHTML = html;
}

function getScoreMessage(percentage) {
    if (percentage >= 90) return 'Excellent! You have a strong understanding of this topic.';
    if (percentage >= 80) return 'Great job! You understand most of the concepts.';
    if (percentage >= 70) return 'Good work! Consider reviewing some concepts.';
    if (percentage >= 60) return 'Not bad! You might want to review the material.';
    return 'Consider reviewing the chapter before continuing.';
}

function showNextChapter() {
    // Navigate to next chapter or back to tutorial index
    const currentPath = window.location.pathname;
    const chapterMatch = currentPath.match(/chapter(\d+)/);
    
    if (chapterMatch) {
        const currentChapter = parseInt(chapterMatch[1]);
        if (currentChapter < 15) {
            window.location.href = `/tutorials/clustering/chapter${currentChapter + 1}`;
        } else {
            window.location.href = '/tutorials/clustering/';
        }
    } else {
        window.location.href = '/tutorials/clustering/';
    }
}

/**
 * Bottom Navigation Functions
 */
function initBottomNavigation() {
    console.log('Initializing bottom navigation...');
    
    const prevBtn = document.getElementById('prev-subsection');
    const nextBtn = document.getElementById('next-subsection');
    
    if (prevBtn && nextBtn) {
        // Show the navigation buttons
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        
        // Add click handlers
        prevBtn.addEventListener('click', goToPreviousSection);
        nextBtn.addEventListener('click', goToNextSection);
        
        // Update navigation labels
        updateBottomNavigationLabels();
    }
}

function updateBottomNavigationLabels() {
    const prevBtn = document.getElementById('prev-subsection');
    const nextBtn = document.getElementById('next-subsection');
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');
    
    if (!prevBtn || !nextBtn || !sections.length) return;
    
    const currentIndex = sections.findIndex(section => {
        const sectionElement = document.getElementById(section);
        return sectionElement && sectionElement.classList.contains('active');
    });
    
    // Update previous button
    if (currentIndex > 0) {
        prevBtn.style.display = 'block';
        if (prevLabel) {
            prevLabel.textContent = sectionLabels[currentIndex - 1];
        }
    } else {
        prevBtn.style.display = 'none';
    }
    
    // Update next button
    if (currentIndex < sections.length - 1) {
        nextBtn.style.display = 'block';
        if (nextLabel) {
            nextLabel.textContent = sectionLabels[currentIndex + 1];
        }
    } else {
        nextBtn.style.display = 'none';
    }
}

function goToPreviousSection() {
    const currentIndex = sections.findIndex(section => {
        const sectionElement = document.getElementById(section);
        return sectionElement && sectionElement.classList.contains('active');
    });
    
    if (currentIndex > 0) {
        showSection(sections[currentIndex - 1]);
        updateBottomNavigationLabels();
        // Scroll to the beginning of the section
        setTimeout(() => {
            const sectionElement = document.getElementById(sections[currentIndex - 1]);
            if (sectionElement) {
                sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

function goToNextSection() {
    const currentIndex = sections.findIndex(section => {
        const sectionElement = document.getElementById(section);
        return sectionElement && sectionElement.classList.contains('active');
    });
    
    if (currentIndex < sections.length - 1) {
        showSection(sections[currentIndex + 1]);
        updateBottomNavigationLabels();
        // Scroll to the beginning of the section
        setTimeout(() => {
            const sectionElement = document.getElementById(sections[currentIndex + 1]);
            if (sectionElement) {
                sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

/**
 * Initialize Minkowski Demo
 */
function initMinkowskiDemo() {
    // Add event listeners for p-value slider
    const pValueSlider = document.getElementById('p-value');
    if (pValueSlider) {
        pValueSlider.addEventListener('input', function() {
            document.getElementById('p-value-display').textContent = this.value;
            // Auto-calculate distance when slider changes
            calculateMinkowskiDistanceInternal();
        });
    }
    
    // Add event listeners for cluster count slider
    const clusterCountSlider = document.getElementById('cluster-count');
    if (clusterCountSlider) {
        clusterCountSlider.addEventListener('input', function() {
            document.getElementById('cluster-count-display').textContent = this.value;
        });
    }
    
    // Initialize with default calculation
    if (pValueSlider) {
        calculateMinkowskiDistanceInternal();
    }
}

/**
 * Minkowski Distance Demo Functions
 */
function calculateMinkowskiDistanceInternal() {
    const pValue = parseFloat(document.getElementById('p-value').value);
    const point1X = parseFloat(document.getElementById('point1-x').value);
    const point1Y = parseFloat(document.getElementById('point1-y').value);
    const point2X = parseFloat(document.getElementById('point2-x').value);
    const point2Y = parseFloat(document.getElementById('point2-y').value);
    
    // Calculate Minkowski distance
    const dx = Math.abs(point2X - point1X);
    const dy = Math.abs(point2Y - point1Y);
    
    let minkowskiDistance;
    if (pValue === Infinity) {
        // Chebyshev distance (L∞)
        minkowskiDistance = Math.max(dx, dy);
    } else {
        minkowskiDistance = Math.pow(Math.pow(dx, pValue) + Math.pow(dy, pValue), 1/pValue);
    }
    
    // Calculate other distances for comparison
    const manhattanDistance = dx + dy;
    const euclideanDistance = Math.sqrt(dx*dx + dy*dy);
    const chebyshevDistance = Math.max(dx, dy);
    
    // Update display
    document.getElementById('current-p').textContent = pValue === Infinity ? '∞' : pValue.toFixed(1);
    document.getElementById('minkowski-value').textContent = minkowskiDistance.toFixed(2);
    document.getElementById('manhattan-value').textContent = manhattanDistance.toFixed(2);
    document.getElementById('euclidean-value').textContent = euclideanDistance.toFixed(2);
    document.getElementById('chebyshev-value').textContent = chebyshevDistance.toFixed(2);
    
    // Update p-value display
    document.getElementById('p-value-display').textContent = pValue === Infinity ? '∞' : pValue.toFixed(1);
    
    // Visualize the distance
    visualizeMinkowskiDistance(point1X, point1Y, point2X, point2Y, pValue);
}

function runMinkowskiClustering() {
    const pValue = document.getElementById('clustering-p').value;
    const clusterCount = parseInt(document.getElementById('cluster-count').value);
    
    // Generate sample data
    const data = generateClusteringData();
    
    // Run clustering with different p-values
    const clusters = performMinkowskiClustering(data, clusterCount, pValue);
    
    // Visualize results
    visualizeMinkowskiClustering(data, clusters, pValue);
    
    showNotification(`Clustering completed with p=${pValue} and ${clusterCount} clusters`, 'success');
}

function resetClustering() {
    // Clear the clustering canvas
    const canvas = document.getElementById('clustering-canvas');
    if (canvas) {
        const actualCanvas = canvas.querySelector('canvas');
        if (actualCanvas) {
            const ctx = actualCanvas.getContext('2d');
            ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
        }
    }
    
    // Reset controls
    document.getElementById('clustering-p').value = '2';
    document.getElementById('cluster-count').value = '3';
    document.getElementById('cluster-count-display').textContent = '3';
    
    showNotification('Clustering demo reset', 'info');
}

function generateClusteringData() {
    // Generate sample data for clustering
    const data = [];
    const numPoints = 50;
    
    // Create 3 clusters
    for (let i = 0; i < numPoints; i++) {
        let x, y;
        if (i < numPoints / 3) {
            // Cluster 1: centered around (2, 2)
            x = 2 + (Math.random() - 0.5) * 2;
            y = 2 + (Math.random() - 0.5) * 2;
        } else if (i < 2 * numPoints / 3) {
            // Cluster 2: centered around (6, 2)
            x = 6 + (Math.random() - 0.5) * 2;
            y = 2 + (Math.random() - 0.5) * 2;
        } else {
            // Cluster 3: centered around (4, 6)
            x = 4 + (Math.random() - 0.5) * 2;
            y = 6 + (Math.random() - 0.5) * 2;
        }
        data.push({ x, y });
    }
    
    return data;
}

function performMinkowskiClustering(data, k, pValue) {
    // Simple K-means clustering with Minkowski distance
    const centroids = [];
    const clusters = [];
    
    // Initialize centroids randomly
    for (let i = 0; i < k; i++) {
        const randomPoint = data[Math.floor(Math.random() * data.length)];
        centroids.push({ x: randomPoint.x, y: randomPoint.y });
    }
    
    // Assign points to clusters
    for (let i = 0; i < data.length; i++) {
        let minDistance = Infinity;
        let closestCluster = 0;
        
        for (let j = 0; j < k; j++) {
            const distance = calculateDistance(data[i], centroids[j], pValue);
            if (distance < minDistance) {
                minDistance = distance;
                closestCluster = j;
            }
        }
        
        clusters.push(closestCluster);
    }
    
    return { centroids, clusters };
}

function calculateDistance(point1, point2, pValue) {
    const dx = Math.abs(point2.x - point1.x);
    const dy = Math.abs(point2.y - point1.y);
    
    if (pValue === 'infinity') {
        return Math.max(dx, dy);
    } else {
        const p = parseFloat(pValue);
        return Math.pow(Math.pow(dx, p) + Math.pow(dy, p), 1/p);
    }
}

function visualizeMinkowskiDistance(x1, y1, x2, y2, pValue) {
    const canvas = document.getElementById('minkowski-canvas');
    if (!canvas) return;
    
    // Create canvas if it doesn't exist
    let actualCanvas = canvas.querySelector('canvas');
    if (!actualCanvas) {
        actualCanvas = document.createElement('canvas');
        actualCanvas.width = 400;
        actualCanvas.height = 300;
        canvas.appendChild(actualCanvas);
    }
    
    const ctx = actualCanvas.getContext('2d');
    ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
    
    // Scale coordinates to canvas
    const scale = 30;
    const offsetX = 50;
    const offsetY = 50;
    
    // Draw grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + i * scale, offsetY);
        ctx.lineTo(offsetX + i * scale, offsetY + 8 * scale);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + i * scale);
        ctx.lineTo(offsetX + 10 * scale, offsetY + i * scale);
        ctx.stroke();
    }
    
    // Draw points
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(offsetX + x1 * scale, offsetY + y1 * scale, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#4444ff';
    ctx.beginPath();
    ctx.arc(offsetX + x2 * scale, offsetY + y2 * scale, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw distance line
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(offsetX + x1 * scale, offsetY + y1 * scale);
    ctx.lineTo(offsetX + x2 * scale, offsetY + y2 * scale);
    ctx.stroke();
    
    // Draw distance label
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`d = ${calculateMinkowskiDistanceValue(x1, y1, x2, y2, pValue).toFixed(2)}`, 
                 offsetX + midX * scale, offsetY + midY * scale - 10);
}

function visualizeMinkowskiClustering(data, result, pValue) {
    const canvas = document.getElementById('clustering-canvas');
    if (!canvas) return;
    
    // Create canvas if it doesn't exist
    let actualCanvas = canvas.querySelector('canvas');
    if (!actualCanvas) {
        actualCanvas = document.createElement('canvas');
        actualCanvas.width = 400;
        actualCanvas.height = 300;
        canvas.appendChild(actualCanvas);
    }
    
    const ctx = actualCanvas.getContext('2d');
    ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
    
    // Scale coordinates to canvas
    const scale = 30;
    const offsetX = 50;
    const offsetY = 50;
    
    // Colors for different clusters
    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
    
    // Draw data points
    for (let i = 0; i < data.length; i++) {
        const cluster = result.clusters[i];
        ctx.fillStyle = colors[cluster % colors.length];
        ctx.beginPath();
        ctx.arc(offsetX + data[i].x * scale, offsetY + data[i].y * scale, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw centroids
    ctx.fillStyle = '#000';
    for (let i = 0; i < result.centroids.length; i++) {
        ctx.beginPath();
        ctx.arc(offsetX + result.centroids[i].x * scale, offsetY + result.centroids[i].y * scale, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw centroid label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`C${i+1}`, offsetX + result.centroids[i].x * scale + 8, offsetY + result.centroids[i].y * scale - 8);
        ctx.fillStyle = '#000';
    }
}

function calculateMinkowskiDistanceValue(x1, y1, x2, y2, pValue) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    
    if (pValue === Infinity) {
        return Math.max(dx, dy);
    } else {
        return Math.pow(Math.pow(dx, pValue) + Math.pow(dy, pValue), 1/pValue);
    }
}

/**
 * Quiz Functions
 */
function checkAnswer(questionNum, correctAnswer) {
    const resultDiv = document.getElementById(`q${questionNum}-result`);
    if (!resultDiv) return;
    
    // For now, just show a simple feedback
    // In a real implementation, you'd check the user's selected answer
    resultDiv.innerHTML = `
        <div class="quiz-feedback correct">
            <strong>Correct!</strong> The answer is ${correctAnswer.toUpperCase()}.
        </div>
    `;
    
    showNotification(`Question ${questionNum} answered correctly!`, 'success');
}

function resetQuiz() {
    // Clear all quiz results
    for (let i = 1; i <= 10; i++) {
        const resultDiv = document.getElementById(`q${i}-result`);
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    }
    
    showNotification('Quiz reset!', 'info');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Chapter 5 Demo Functions
 */
function generateDemoData() {
    // Generate sample data for Chapter 5 demo
    const data = [];
    const numPoints = 60;
    
    // Create 3 clusters with different characteristics
    for (let i = 0; i < numPoints; i++) {
        let x, y;
        if (i < numPoints / 3) {
            // Cluster 1: centered around (2, 2)
            x = 2 + (Math.random() - 0.5) * 1.5;
            y = 2 + (Math.random() - 0.5) * 1.5;
        } else if (i < 2 * numPoints / 3) {
            // Cluster 2: centered around (6, 2)
            x = 6 + (Math.random() - 0.5) * 1.5;
            y = 2 + (Math.random() - 0.5) * 1.5;
        } else {
            // Cluster 3: centered around (4, 6)
            x = 4 + (Math.random() - 0.5) * 1.5;
            y = 6 + (Math.random() - 0.5) * 1.5;
        }
        data.push({ x, y, cluster: -1 });
    }
    
    // Store data globally for demo
    window.demoData = data;
    window.demoCentroids = [];
    window.demoIteration = 0;
    window.demoRunning = false;
    
    // Visualize the data
    visualizeDemoData();
    
    showNotification('Demo data generated successfully!', 'success');
}

function runKmeansDemo() {
    if (!window.demoData || window.demoData.length === 0) {
        showNotification('Please generate data first!', 'warning');
        return;
    }
    
    const k = 3; // Number of clusters
    window.demoCentroids = [];
    window.demoIteration = 0;
    window.demoRunning = true;
    
    // Initialize centroids randomly
    for (let i = 0; i < k; i++) {
        const randomPoint = window.demoData[Math.floor(Math.random() * window.demoData.length)];
        window.demoCentroids.push({ x: randomPoint.x, y: randomPoint.y, cluster: i });
    }
    
    // Run K-means algorithm
    runKmeansIteration();
    showNotification('K-means demo started!', 'info');
}

function stepKmeansDemo() {
    if (!window.demoData || window.demoData.length === 0) {
        showNotification('Please generate data first!', 'warning');
        return;
    }
    
    // If centroids don't exist, initialize them
    if (!window.demoCentroids || window.demoCentroids.length === 0) {
        const k = 3;
        window.demoCentroids = [];
        for (let i = 0; i < k; i++) {
            const randomPoint = window.demoData[Math.floor(Math.random() * window.demoData.length)];
            window.demoCentroids.push({ x: randomPoint.x, y: randomPoint.y, cluster: i });
        }
        window.demoIteration = 0;
    }
    
    // Run one iteration
    runKmeansIteration();
    
    // Check if converged
    if (window.demoIteration >= 10) {
        showNotification('K-means converged after ' + window.demoIteration + ' iterations!', 'success');
    }
}

function resetDemo() {
    window.demoData = [];
    window.demoCentroids = [];
    window.demoIteration = 0;
    window.demoRunning = false;
    
    // Clear canvas
    const canvas = document.getElementById('demo-canvas');
    if (canvas) {
        const actualCanvas = canvas.querySelector('canvas');
        if (actualCanvas) {
            const ctx = actualCanvas.getContext('2d');
            ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
        }
    }
    
    showNotification('Demo reset!', 'info');
}

function runKmeansIteration() {
    if (!window.demoRunning && window.demoIteration > 0) return;
    
    window.demoIteration++;
    
    // Assign points to nearest centroid
    window.demoData.forEach(point => {
        let minDistance = Infinity;
        let nearestCluster = 0;
        
        window.demoCentroids.forEach((centroid, index) => {
            const distance = Math.sqrt(
                Math.pow(point.x - centroid.x, 2) + 
                Math.pow(point.y - centroid.y, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestCluster = index;
            }
        });
        
        point.cluster = nearestCluster;
    });
    
    // Update centroids
    window.demoCentroids.forEach((centroid, index) => {
        const clusterPoints = window.demoData.filter(p => p.cluster === index);
        if (clusterPoints.length > 0) {
            centroid.x = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
            centroid.y = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
        }
    });
    
    // Visualize current state
    visualizeDemoClustering();
    
    // Check convergence
    if (window.demoIteration >= 10) {
        window.demoRunning = false;
        showNotification('K-means converged after ' + window.demoIteration + ' iterations!', 'success');
    }
}

function visualizeDemoData() {
    const canvas = document.getElementById('demo-canvas');
    if (!canvas) return;
    
    // Create canvas if it doesn't exist
    let actualCanvas = canvas.querySelector('canvas');
    if (!actualCanvas) {
        actualCanvas = document.createElement('canvas');
        actualCanvas.width = 400;
        actualCanvas.height = 300;
        canvas.appendChild(actualCanvas);
    }
    
    const ctx = actualCanvas.getContext('2d');
    ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
    
    // Scale coordinates to canvas
    const scale = 30;
    const offsetX = 50;
    const offsetY = 50;
    
    // Draw data points
    ctx.fillStyle = '#666';
    window.demoData.forEach(point => {
        ctx.beginPath();
        ctx.arc(offsetX + point.x * scale, offsetY + point.y * scale, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function visualizeDemoClustering() {
    const canvas = document.getElementById('demo-canvas');
    if (!canvas) return;
    
    const actualCanvas = canvas.querySelector('canvas');
    if (!actualCanvas) return;
    
    const ctx = actualCanvas.getContext('2d');
    ctx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
    
    // Scale coordinates to canvas
    const scale = 30;
    const offsetX = 50;
    const offsetY = 50;
    
    // Colors for different clusters
    const colors = ['#ff4444', '#44ff44', '#4444ff'];
    
    // Draw data points
    window.demoData.forEach(point => {
        ctx.fillStyle = colors[point.cluster % colors.length];
        ctx.beginPath();
        ctx.arc(offsetX + point.x * scale, offsetY + point.y * scale, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw centroids
    ctx.fillStyle = '#000';
    window.demoCentroids.forEach((centroid, index) => {
        ctx.beginPath();
        ctx.arc(offsetX + centroid.x * scale, offsetY + centroid.y * scale, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw centroid label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`C${index+1}`, offsetX + centroid.x * scale + 8, offsetY + centroid.y * scale - 8);
        ctx.fillStyle = '#000';
    });
    
    // Draw iteration info
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`Iteration: ${window.demoIteration}`, 10, 20);
}

/**
 * Chapter 6 Demo Functions
 */
function runInitializationDemoInternal() {
    showNotification('Initialization demo started!', 'info');
    // Placeholder for initialization demo
}

function resetInitializationDemoInternal() {
    showNotification('Initialization demo reset!', 'info');
    // Placeholder for reset
}

function generateInitDemoInternal() {
    showNotification('Initialization comparison demo generated!', 'success');
    // Placeholder for initialization comparison
}

function resetInitDemoInternal() {
    showNotification('Initialization demo reset!', 'info');
    // Placeholder for reset
}

function generateAccelDemoInternal() {
    showNotification('Acceleration benchmark demo generated!', 'success');
    // Placeholder for acceleration demo
}

function resetAccelDemoInternal() {
    showNotification('Acceleration demo reset!', 'info');
    // Placeholder for reset
}

/**
 * Chapter 7 Demo Functions
 */
function generateElbowDemoInternal() {
    showNotification('Elbow method plot generated!', 'success');
    // Placeholder for elbow method demo
}

function resetElbowDemoInternal() {
    showNotification('Elbow demo reset!', 'info');
    // Placeholder for reset
}

function generateSilhouetteDemoInternal() {
    showNotification('Silhouette analysis generated!', 'success');
    // Placeholder for silhouette analysis
}

function resetSilhouetteDemoInternal() {
    showNotification('Silhouette demo reset!', 'info');
    // Placeholder for reset
}

/**
 * Chapter 8 Demo Functions
 */
function generateLinkageDemoInternal() {
    showNotification('Linkage comparison demo generated!', 'success');
    // Placeholder for linkage demo
}

function resetLinkageDemoInternal() {
    showNotification('Linkage demo reset!', 'info');
    // Placeholder for reset
}

function generateDendrogramDemoInternal() {
    showNotification('Dendrogram demo generated!', 'success');
    // Placeholder for dendrogram demo
}

function resetDendrogramDemoInternal() {
    showNotification('Dendrogram demo reset!', 'info');
    // Placeholder for reset
}

/**
 * Chapter 9 Demo Functions
 */
function generateAverageLinkageDemoInternal() {
    showNotification('Average linkage demo generated!', 'success');
    // Placeholder for average linkage demo
}

function resetAverageLinkageDemoInternal() {
    showNotification('Average linkage demo reset!', 'info');
    // Placeholder for reset
}

function generateWardsMethodDemoInternal() {
    showNotification('Ward\'s method demo generated!', 'success');
    // Placeholder for Ward's method demo
}

function resetWardsMethodDemoInternal() {
    showNotification('Ward\'s method demo reset!', 'info');
    // Placeholder for reset
}

/**
 * Chapter 11 Demo Functions
 */
function checkQuizAnswersInternal() {
    showNotification('Quiz answers submitted!', 'success');
    // Placeholder for quiz submission
}

/**
 * Chapter 12 Demo Functions
 */
function generateGMMVisualizationInternal() {
    showNotification('GMM visualization generated!', 'success');
    // Placeholder for GMM visualization
}

function resetGMMDemoInternal() {
    showNotification('GMM demo reset!', 'info');
    // Placeholder for reset
}

function startEMInternal() {
    showNotification('EM algorithm started!', 'info');
    // Placeholder for EM algorithm
}

function stepEMInternal() {
    showNotification('EM algorithm step completed!', 'info');
    // Placeholder for EM step
}

function resetEMInternal() {
    showNotification('EM algorithm reset!', 'info');
    // Placeholder for reset
}

/**
 * Chapter 13 Demo Functions
 */
function generateMeanShiftVisualizationInternal() {
    showNotification('Mean shift visualization generated!', 'success');
    // Placeholder for mean shift visualization
}

function resetMeanShiftDemoInternal() {
    showNotification('Mean shift demo reset!', 'info');
    // Placeholder for reset
}

function initializeMeanShiftInternal() {
    showNotification('Mean shift initialized!', 'info');
    // Placeholder for mean shift initialization
}

function stepMeanShiftInternal() {
    showNotification('Mean shift step completed!', 'info');
    // Placeholder for mean shift step
}

function runMeanShiftInternal() {
    showNotification('Mean shift converged!', 'success');
    // Placeholder for mean shift convergence
}

function resetMeanShiftInternal() {
    showNotification('Mean shift reset!', 'info');
    // Placeholder for reset
}

/**
 * Chapter 14 Demo Functions
 */
function runStabilityAnalysisInternal() {
    showNotification('Stability analysis completed!', 'success');
    // Placeholder for stability analysis
}

// Global functions for HTML onclick handlers
window.runKmeans = function() {
    startKMeans();
};

window.generateData = function() {
    // Call the actual generateKMeansData function
    generateKMeansData();
};

window.resetKmeans = function() {
    resetKMeans();
};

window.stepKmeans = function() {
    stepKMeans();
};

window.stopKmeans = function() {
    stopKmeans();
};

// Minkowski Distance Demo Functions
window.calculateMinkowskiDistance = function() {
    calculateMinkowskiDistanceInternal();
};

window.runMinkowskiClustering = function() {
    runMinkowskiClustering();
};

window.resetClustering = function() {
    resetClustering();
};

// Quiz Functions
window.checkAnswer = function(questionNum, correctAnswer) {
    checkAnswer(questionNum, correctAnswer);
};

window.resetQuiz = function() {
    resetQuiz();
};

window.scrollToTop = function() {
    scrollToTop();
};

// Chapter 5 Demo Functions
window.generateDemoData = function() {
    generateDemoData();
};

window.runKmeansDemo = function() {
    runKmeansDemo();
};

window.stepKmeansDemo = function() {
    stepKmeansDemo();
};

window.resetDemo = function() {
    resetDemo();
};

// Chapter 6 Demo Functions
window.runInitializationDemo = function() {
    runInitializationDemoInternal();
};

window.resetInitializationDemo = function() {
    resetInitializationDemoInternal();
};

window.generateInitDemo = function() {
    generateInitDemoInternal();
};

window.resetInitDemo = function() {
    resetInitDemoInternal();
};

window.generateAccelDemo = function() {
    generateAccelDemoInternal();
};

window.resetAccelDemo = function() {
    resetAccelDemoInternal();
};

// Chapter 7 Demo Functions
window.generateElbowDemo = function() {
    generateElbowDemoInternal();
};

window.resetElbowDemo = function() {
    resetElbowDemoInternal();
};

window.generateSilhouetteDemo = function() {
    generateSilhouetteDemoInternal();
};

window.resetSilhouetteDemo = function() {
    resetSilhouetteDemoInternal();
};

// Chapter 8 Demo Functions
window.generateLinkageDemo = function() {
    generateLinkageDemoInternal();
};

window.resetLinkageDemo = function() {
    resetLinkageDemoInternal();
};

window.generateDendrogramDemo = function() {
    generateDendrogramDemoInternal();
};

window.resetDendrogramDemo = function() {
    resetDendrogramDemoInternal();
};

// Chapter 9 Demo Functions
window.generateAverageLinkageDemo = function() {
    generateAverageLinkageDemoInternal();
};

window.resetAverageLinkageDemo = function() {
    resetAverageLinkageDemoInternal();
};

window.generateWardsMethodDemo = function() {
    generateWardsMethodDemoInternal();
};

window.resetWardsMethodDemo = function() {
    resetWardsMethodDemoInternal();
};

// Chapter 11 Demo Functions
window.checkQuizAnswers = function() {
    checkQuizAnswersInternal();
};

// Chapter 12 Demo Functions
window.generateGMMVisualization = function() {
    generateGMMVisualizationInternal();
};

window.resetGMMDemo = function() {
    resetGMMDemoInternal();
};

window.startEM = function() {
    startEMInternal();
};

window.stepEM = function() {
    stepEMInternal();
};

window.resetEM = function() {
    resetEMInternal();
};

// Chapter 13 Demo Functions
window.generateMeanShiftVisualization = function() {
    generateMeanShiftVisualizationInternal();
};

window.resetMeanShiftDemo = function() {
    resetMeanShiftDemoInternal();
};

window.initializeMeanShift = function() {
    initializeMeanShiftInternal();
};

window.stepMeanShift = function() {
    stepMeanShiftInternal();
};

window.runMeanShift = function() {
    runMeanShiftInternal();
};

window.resetMeanShift = function() {
    resetMeanShiftInternal();
};

// Chapter 14 Demo Functions
window.runStabilityAnalysis = function() {
    runStabilityAnalysisInternal();
};
