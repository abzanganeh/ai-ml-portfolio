// Shared JavaScript for Clustering Tutorial
// Handles all common functionality across chapters

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

// Initialize tutorial functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Clustering Tutorial: Initializing...');
    
    // Initialize sections from page content
    initializeSections();
    
    // Initialize section navigation
    initializeSectionNavigation();
    
    // Initialize progress bars
    initializeProgressBars();
    
    // Initialize quiz functionality
    initializeQuiz();
    
    // Initialize interactive demos
    initializeInteractiveDemos();
    
    console.log('Clustering Tutorial: Initialization complete');
});

// Section Navigation Functions
function initializeSectionNavigation() {
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Add click event listeners to section navigation buttons
    sectionNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection, this);
        });
    });
    
    // Initialize sub-section navigation
    initializeSubSectionNavigation();
}

function showSection(sectionName, clickedElement) {
    console.log('Showing section:', sectionName);
    
    // Hide all content sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all navigation buttons
    const allButtons = document.querySelectorAll('.section-nav-btn');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Section shown:', sectionName);
    } else {
        console.error('❌ Section not found:', sectionName);
    }
    
    // Add active class to clicked button
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
    
    // Update section progress
    updateSectionProgress(sectionName);
    
    // Update sub-section navigation
    updateSubSectionNavigation();
    
    // Scroll to top of the page for better user experience
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function updateSectionProgress(sectionName) {
    const sectionIndex = sections.indexOf(sectionName);
    if (sectionIndex !== -1) {
        const progress = ((sectionIndex + 1) / sections.length) * 100;
        const progressFill = document.querySelector('.section-progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }
}

// Sub-section Navigation Functions
function initializeSubSectionNavigation() {
    const prevBtn = document.getElementById('prev-subsection');
    const nextBtn = document.getElementById('next-subsection');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateSubSection('prev'));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateSubSection('next'));
    }
    
    // Initialize with first section
    updateSubSectionNavigation();
}

function navigateSubSection(direction) {
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    const currentSectionId = activeSection.id;
    const currentIndex = sections.indexOf(currentSectionId);
    
    let newIndex;
    if (direction === 'prev') {
        newIndex = currentIndex - 1;
    } else {
        newIndex = currentIndex + 1;
    }
    
    if (newIndex >= 0 && newIndex < sections.length) {
        const newSectionName = sections[newIndex];
        const newButton = document.querySelector(`[data-section="${newSectionName}"]`);
        showSection(newSectionName, newButton);
    }
}

function updateSubSectionNavigation() {
    const currentSection = document.querySelector('.content-section.active');
    if (!currentSection) return;
    
    const currentIndex = sections.indexOf(currentSection.id);
    const prevBtn = document.getElementById('prev-subsection');
    const nextBtn = document.getElementById('next-subsection');
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');
    
    // Update previous button
    if (prevBtn && prevLabel) {
        if (currentIndex > 0) {
            prevBtn.style.display = 'flex';
            prevLabel.textContent = sectionLabels[currentIndex - 1];
        } else {
            prevBtn.style.display = 'none';
        }
    }
    
    // Update next button
    if (nextBtn && nextLabel) {
        if (currentIndex < sections.length - 1) {
            nextBtn.style.display = 'flex';
            nextLabel.textContent = sectionLabels[currentIndex + 1];
        } else {
            nextBtn.style.display = 'none';
        }
    }
}


// Progress Bar Functions
function initializeProgressBars() {
    // Initialize chapter progress
    const chapterProgressFill = document.querySelector('.chapter-progress-fill');
    if (chapterProgressFill) {
        const progress = chapterProgressFill.getAttribute('data-progress');
        if (progress) {
            chapterProgressFill.style.width = progress + '%';
        }
    }
    
    // Initialize section progress
    updateSectionProgress('clustering');
}

// Quiz Functions
function initializeQuiz() {
    const quizOptions = document.querySelectorAll('.enhanced-quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const question = this.closest('.enhanced-quiz-question');
            const allOptions = question.querySelectorAll('.enhanced-quiz-option');
            const explanation = question.querySelector('.enhanced-quiz-explanation');
            
            // Remove previous selections
            allOptions.forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });
            
            // Add appropriate class
            const isCorrect = this.getAttribute('data-answer') === 'correct';
            this.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // Show explanation
            if (explanation) {
                explanation.classList.add('show');
            }
            
            // Disable further clicks
            allOptions.forEach(opt => {
                opt.style.pointerEvents = 'none';
            });
        });
    });
}

// Interactive Demo Functions
function initializeInteractiveDemos() {
    // Initialize K-means demo if canvas exists
    const kmeansCanvas = document.getElementById('kmeans-demo');
    if (kmeansCanvas) {
        initializeKMeansDemo(kmeansCanvas);
    }
}

function initializeKMeansDemo(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Sample data points
    const dataPoints = [
        {x: 100, y: 100, cluster: 0},
        {x: 120, y: 110, cluster: 0},
        {x: 90, y: 90, cluster: 0},
        {x: 300, y: 200, cluster: 1},
        {x: 320, y: 220, cluster: 1},
        {x: 280, y: 180, cluster: 1},
        {x: 200, y: 300, cluster: 2},
        {x: 220, y: 320, cluster: 2},
        {x: 180, y: 280, cluster: 2}
    ];
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    function drawDemo() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw data points
        dataPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = colors[point.cluster];
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Draw cluster centers
        const centers = calculateCenters();
        centers.forEach((center, index) => {
            ctx.beginPath();
            ctx.arc(center.x, center.y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = colors[index];
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw X mark
            ctx.beginPath();
            ctx.moveTo(center.x - 6, center.y - 6);
            ctx.lineTo(center.x + 6, center.y + 6);
            ctx.moveTo(center.x + 6, center.y - 6);
            ctx.lineTo(center.x - 6, center.y + 6);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
    
    function calculateCenters() {
        const centers = [];
        const clusterCounts = {};
        
        // Initialize centers
        dataPoints.forEach(point => {
            if (!clusterCounts[point.cluster]) {
                clusterCounts[point.cluster] = {x: 0, y: 0, count: 0};
            }
            clusterCounts[point.cluster].x += point.x;
            clusterCounts[point.cluster].y += point.y;
            clusterCounts[point.cluster].count++;
        });
        
        // Calculate centroids
        Object.keys(clusterCounts).forEach(cluster => {
            const data = clusterCounts[cluster];
            centers.push({
                x: data.x / data.count,
                y: data.y / data.count
            });
        });
        
        return centers;
    }
    
    // Initial draw
    drawDemo();
    
    // Add animation effect
    let animationId;
    function animate() {
        drawDemo();
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Stop animation after 3 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationId);
    }, 3000);
}

// Utility Functions
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


// Scroll to top function for chapter navigation
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export functions for potential use in other files
window.showSection = showSection;
window.navigateSubSection = navigateSubSection;
window.updateSectionProgress = updateSectionProgress;
window.updateSubSectionNavigation = updateSubSectionNavigation;
window.scrollToTop = scrollToTop;