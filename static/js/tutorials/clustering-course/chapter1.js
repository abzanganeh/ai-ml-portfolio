// Chapter 1: Introduction to Clustering - JavaScript functionality

// Global variables for K-means demo
let currentData = [];
let currentCentroids = [];
let currentClusters = [];
let kmeans_iteration = 0;
let isRunning = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Chapter 1: Introduction to Clustering loaded ===');
    console.log('DOM is ready, initializing...');
    
    // Initialize chapter-specific functionality
    initializeChapter1();
    
    // Test if showSection function is available
    if (typeof window.showSection === 'function') {
        console.log('✅ showSection function is available');
    } else {
        console.error('❌ showSection function is NOT available');
    }
});

function initializeChapter1() {
    console.log('Initializing Chapter 1 functionality...');
    
    // Initialize section navigation
    initializeSectionNavigation();
    
    // Initialize quiz functionality
    initializeQuiz();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize progress tracking
    updateChapterProgress(1);
    
    // Initialize demo controls
    initializeDemoControls();
}

function initializeDemoControls() {
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
}

function initializeSectionNavigation() {
    console.log('Initializing section navigation...');
    
    // Set up the showSection function to be called from HTML onclick
    window.showSection = showSection;
    
    // Debug: Check if elements exist
    const sectionButtons = document.querySelectorAll('.section-nav button');
    const sections = document.querySelectorAll('.section-content');
    
    console.log('Found section buttons:', sectionButtons.length);
    console.log('Found sections:', sections.length);
    
    // Initialize with the first section active
    const firstButton = document.querySelector('.section-nav button');
    if (firstButton) {
        firstButton.classList.add('active');
        console.log('Set first button as active:', firstButton.textContent);
    }
    
    // Make sure first section is visible
    const firstSection = document.getElementById('clustering');
    if (firstSection) {
        firstSection.classList.add('active');
        console.log('Set first section as active: clustering');
        console.log('First section classes:', firstSection.className);
        console.log('First section computed display:', getComputedStyle(firstSection).display);
        
        // Force display style as backup
        firstSection.style.display = 'block';
        console.log('Forced first section display to block');
    }
    
    // Add click event listeners as backup
    sectionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('onclick').match(/showSection\('([^']+)'/)[1];
            console.log('Button clicked, section:', sectionName);
            showSection(sectionName, this);
        });
    });
}

// Global function for section navigation (called from HTML onclick)
// This function is defined later in the file to avoid duplication

function updateSectionProgress(sectionName) {
    const sections = ['clustering', 'unsupervised', 'types', 'applications', 'challenges', 'mathematical', 'demo', 'quiz'];
    const currentIndex = sections.indexOf(sectionName);
    const progress = ((currentIndex + 1) / sections.length) * 100;
    
    const progressBar = document.querySelector('.section-progress-fill');
    if (progressBar) {
        progressBar.style.width = progress + '%';
        console.log(`Updated section progress to ${progress}%`);
    }
}

// Global variables for quiz and demo
let quizAnswers = {};
let currentData = [];
let currentCentroids = [];
let currentClusters = [];
let kmeans_iteration = 0;
let isRunning = false;

// Quiz Functions
function checkAnswer(questionNum, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const resultDiv = document.getElementById(`q${questionNum}-result`);
    
    if (!selectedAnswer) {
        resultDiv.innerHTML = '<p style="color: red;">Please select an answer!</p>';
        return;
    }
    
    const isCorrect = selectedAnswer.value === correctAnswer;
    quizAnswers[questionNum] = isCorrect;
    
    if (isCorrect) {
        resultDiv.innerHTML = '<p style="color: green;">✓ Correct! Well done!</p>';
    } else {
        resultDiv.innerHTML = '<p style="color: red;">✗ Incorrect. The correct answer is: ' + 
            document.querySelector(`input[name="q${questionNum}"][value="${correctAnswer}"]`).nextSibling.textContent + '</p>';
    }
}

function submitQuiz() {
    const totalQuestions = 5;
    const answeredQuestions = Object.keys(quizAnswers).length;
    
    if (answeredQuestions < totalQuestions) {
        alert(`Please answer all questions! You have answered ${answeredQuestions} out of ${totalQuestions} questions.`);
        return;
    }
    
    const correctAnswers = Object.values(quizAnswers).filter(answer => answer).length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4>Quiz Results</h4>
                <p><strong>Score:</strong> ${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)</p>
                <p><strong>Grade:</strong> ${percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'}</p>
                ${percentage >= 80 ? 
                    '<p style="color: green;">🎉 Excellent work! You have a strong understanding of clustering fundamentals.</p>' :
                    percentage >= 60 ? 
                        '<p style="color: blue;">👍 Good job! Review the material and try again for a higher score.</p>' :
                        '<p style="color: orange;">📚 Review the material and try again!</p>'}
            </div>
        `;
    }
}

function initializeQuiz() {
    console.log('Initializing quiz functionality...');
    
    // Set up global quiz functions
    window.checkAnswer = checkAnswer;
    window.submitQuiz = submitQuiz;
    
    const submitBtn = document.querySelector('button[onclick="submitQuiz()"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuiz);
    }
}


function initializeInteractiveElements() {
    console.log('Initializing interactive elements...');
    
    // Add hover effects to benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to concept cards
    const conceptCards = document.querySelectorAll('.concept-card');
    conceptCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add interactive tooltips to mathematical formulas
    const mathFormulas = document.querySelectorAll('.math-formula');
    mathFormulas.forEach(formula => {
        formula.addEventListener('click', function() {
            this.style.background = '#e2e8f0';
            setTimeout(() => {
                this.style.background = '#f7fafc';
            }, 1000);
        });
    });
}

function updateChapterProgress(chapterNumber) {
    console.log(`Updating progress for chapter ${chapterNumber}...`);
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const percentage = (chapterNumber / 15) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    // Update progress dots
    const progressDots = document.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
        if (index < chapterNumber) {
            dot.classList.add('completed');
        } else {
            dot.classList.remove('completed');
        }
    });
}

// Section switching function - This is the correct one that handles clickedElement
function showSection(sectionName, clickedElement) {
    console.log('=== showSection called ===');
    console.log('Section name:', sectionName);
    console.log('Clicked element:', clickedElement);
    
    // Prevent multiple rapid calls
    if (window.showSectionInProgress) {
        console.log('⚠️ showSection already in progress, ignoring call');
        return;
    }
    window.showSectionInProgress = true;
    
    // Hide all sections
    const allSections = document.querySelectorAll('.section-content');
    console.log('Found sections to hide:', allSections.length);
    
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; // Force hide
        console.log('Removed active from:', section.id);
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        // Force display style as backup
        targetSection.style.display = 'block';
        console.log(`✅ Showing section: ${sectionName}`);
        console.log('Target section element:', targetSection);
        console.log('Target section classes after adding active:', targetSection.className);
        console.log('Target section computed display:', getComputedStyle(targetSection).display);
    } else {
        console.error(`❌ Section not found: ${sectionName}`);
        console.log('Available sections:', Array.from(allSections).map(s => s.id));
    }
    
    // Update navigation buttons
    const allButtons = document.querySelectorAll('.section-nav button');
    console.log('Found buttons to update:', allButtons.length);
    
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (clickedElement) {
        clickedElement.classList.add('active');
        console.log(`✅ Activated button for: ${sectionName}`);
        console.log('Button classes after adding active:', clickedElement.className);
        console.log('Button element:', clickedElement);
    } else {
        console.error('❌ No clicked element provided to showSection');
    }
    
    // Update section progress bar
    updateSectionProgress(sectionName);
    
    // Update sub-section navigation
    updateSubSectionNavigation();
    
    // Scroll to top of the page for better user experience
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Clear the progress flag
    window.showSectionInProgress = false;
    
    console.log('=== showSection completed ===');
}

// Navigation functions
function navigateToPreviousChapter() {
    console.log('Navigating to previous chapter...');
    // Chapter 1 is the first chapter, so no previous chapter
    alert('This is the first chapter of the course!');
}

function navigateToNextChapter() {
    console.log('Navigating to next chapter...');
    window.location.href = '/tutorials/clustering-course/chapter2';
}

// Sub-section navigation function
function navigateSubSection(direction) {
    const sections = ['clustering', 'unsupervised', 'types', 'applications', 'challenges', 'mathematical', 'demo', 'quiz'];
    const currentSection = document.querySelector('.section-content.active');
    const currentIndex = sections.indexOf(currentSection.id);
    
    let newIndex;
    if (direction === 'prev') {
        newIndex = currentIndex - 1;
    } else {
        newIndex = currentIndex + 1;
    }
    
    if (newIndex >= 0 && newIndex < sections.length) {
        const newSection = sections[newIndex];
        const newSectionElement = document.getElementById(newSection);
        const newButton = document.querySelector(`button[onclick*="${newSection}"]`);
        
        if (newSectionElement && newButton) {
            showSection(newSection, newButton);
            updateSubSectionNavigation();
        }
    }
}

function updateSubSectionNavigation() {
    const sections = ['clustering', 'unsupervised', 'types', 'applications', 'challenges', 'mathematical', 'demo', 'quiz'];
    const currentSection = document.querySelector('.section-content.active');
    const currentIndex = sections.indexOf(currentSection.id);
    
    const prevBtn = document.getElementById('prev-subsection');
    const nextBtn = document.getElementById('next-subsection');
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');
    
    // Update previous button
    if (currentIndex > 0) {
        prevBtn.style.display = 'flex';
        const prevSectionName = getSectionDisplayName(sections[currentIndex - 1]);
        prevLabel.textContent = prevSectionName;
    } else {
        prevBtn.style.display = 'none';
    }
    
    // Update next button
    if (currentIndex < sections.length - 1) {
        nextBtn.style.display = 'flex';
        const nextSectionName = getSectionDisplayName(sections[currentIndex + 1]);
        nextLabel.textContent = nextSectionName;
    } else {
        nextBtn.style.display = 'none';
    }
}

function getSectionDisplayName(sectionId) {
    const displayNames = {
        'clustering': 'What is Clustering?',
        'unsupervised': 'Unsupervised Learning',
        'types': 'Types of Clustering',
        'applications': 'Real-World Applications',
        'challenges': 'Challenges & Assumptions',
        'mathematical': 'Mathematical Foundations',
        'demo': 'Interactive Demo',
        'quiz': 'Quiz'
    };
    return displayNames[sectionId] || sectionId;
}

// ===== K-MEANS INTERACTIVE DEMO FUNCTIONS =====

function generateData() {
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
    } else if (dataType === 'blobs') {
        const centers = [
            {x: 150, y: 100}, {x: 350, y: 100}, {x: 250, y: 200}
        ];
        
        for (let i = 0; i < numPoints; i++) {
            const center = centers[i % centers.length];
            currentData.push({
                x: center.x + (Math.random() - 0.5) * 80,
                y: center.y + (Math.random() - 0.5) * 60,
                cluster: -1
            });
        }
    }
    // Add more data types as needed
    
    resetKmeans();
    drawVisualization();
}

function runKmeans() {
    if (currentData.length === 0) {
        alert('Please generate data first!');
        return;
    }
    
    const k = parseInt(document.getElementById('num-clusters').value);
    initializeCentroids(k);
    
    isRunning = true;
    kmeans_iteration = 0;
    
    const runStep = () => {
        if (isRunning) {
            const converged = kmeansStep();
            updateStatus();
            drawVisualization();
            
            if (!converged && kmeans_iteration < 100) {
                setTimeout(runStep, 1000); // 1 second delay between steps
            } else {
                isRunning = false;
                updateStatus();
            }
        }
    };
    
    runStep();
}

function stepKmeans() {
    if (currentData.length === 0) {
        alert('Please generate data first!');
        return;
    }
    
    if (currentCentroids.length === 0) {
        const k = parseInt(document.getElementById('num-clusters').value);
        initializeCentroids(k);
    }
    
    kmeansStep();
    updateStatus();
    drawVisualization();
}

function resetKmeans() {
    currentCentroids = [];
    currentClusters = [];
    kmeans_iteration = 0;
    isRunning = false;
    
    // Reset cluster assignments
    currentData.forEach(point => point.cluster = -1);
    
    updateStatus();
    document.getElementById('algorithm-status').style.display = 'none';
}

function initializeCentroids(k) {
    currentCentroids = [];
    for (let i = 0; i < k; i++) {
        currentCentroids.push({
            x: Math.random() * 400 + 50,
            y: Math.random() * 200 + 50
        });
    }
}

function kmeansStep() {
    if (currentCentroids.length === 0) return true;
    
    const oldCentroids = JSON.parse(JSON.stringify(currentCentroids));
    
    // Assign points to clusters
    currentData.forEach(point => {
        let minDistance = Infinity;
        let bestCluster = 0;
        
        currentCentroids.forEach((centroid, index) => {
            const distance = euclideanDistance(point, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                bestCluster = index;
            }
        });
        
        point.cluster = bestCluster;
    });
    
    // Update centroids
    currentCentroids.forEach((centroid, index) => {
        const clusterPoints = currentData.filter(point => point.cluster === index);
        
        if (clusterPoints.length > 0) {
            centroid.x = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
            centroid.y = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
        }
    });
    
    kmeans_iteration++;
    
    // Check convergence
    const converged = currentCentroids.every((centroid, index) => {
        const oldCentroid = oldCentroids[index];
        return euclideanDistance(centroid, oldCentroid) < 1;
    });
    
    return converged;
}

function euclideanDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function calculateWCSS() {
    let wcss = 0;
    currentData.forEach(point => {
        if (point.cluster >= 0 && point.cluster < currentCentroids.length) {
            const centroid = currentCentroids[point.cluster];
            wcss += Math.pow(euclideanDistance(point, centroid), 2);
        }
    });
    return wcss;
}

function updateStatus() {
    const statusDiv = document.getElementById('algorithm-status');
    statusDiv.style.display = 'block';
    
    document.getElementById('status-text').textContent = 
        isRunning ? 'Running...' : (kmeans_iteration > 0 ? 'Converged' : 'Ready to start');
    document.getElementById('iteration-count').textContent = `Iteration: ${kmeans_iteration}`;
    
    if (kmeans_iteration > 0) {
        const wcss = calculateWCSS();
        document.getElementById('convergence-info').textContent = `WCSS: ${wcss.toFixed(2)}`;
    }
}

function drawVisualization() {
    const canvas = document.getElementById('kmeans-canvas');
    canvas.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 500 300');
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    
    // Draw data points
    currentData.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', point.cluster >= 0 ? colors[point.cluster % colors.length] : '#666');
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', 1);
        svg.appendChild(circle);
    });
    
    // Draw centroids
    currentCentroids.forEach((centroid, index) => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', centroid.x - 6);
        rect.setAttribute('y', centroid.y - 6);
        rect.setAttribute('width', 12);
        rect.setAttribute('height', 12);
        rect.setAttribute('fill', colors[index % colors.length]);
        rect.setAttribute('stroke', '#000');
        rect.setAttribute('stroke-width', 2);
        svg.appendChild(rect);
    });
    
    canvas.appendChild(svg);
}

function compareDistances() {
    // This would implement distance metric comparison
    alert('Distance comparison feature - implementation would show different clustering results using various distance metrics');
}

function demonstrateMetrics() {
    if (currentData.length === 0 || currentCentroids.length === 0) {
        alert('Please run K-means clustering first!');
        return;
    }
    
    // Calculate mock metrics (in real implementation, these would be properly calculated)
    const silhouette = (Math.random() * 0.6 + 0.2).toFixed(3);
    const ch_score = (Math.random() * 200 + 50).toFixed(1);
    const db_score = (Math.random() * 2 + 0.5).toFixed(3);
    
    document.getElementById('silhouette-score').textContent = silhouette;
    document.getElementById('ch-score').textContent = ch_score;
    document.getElementById('db-score').textContent = db_score;
    
    document.getElementById('metrics-display').style.display = 'block';
}

// Make functions globally available
window.showSection = showSection;
window.submitQuiz = submitQuiz;
window.navigateToPreviousChapter = navigateToPreviousChapter;
window.navigateToNextChapter = navigateToNextChapter;
window.navigateSubSection = navigateSubSection;
window.generateData = generateData;
window.runKmeans = runKmeans;
window.stepKmeans = stepKmeans;
window.resetKmeans = resetKmeans;
window.compareDistances = compareDistances;
window.demonstrateMetrics = demonstrateMetrics;
