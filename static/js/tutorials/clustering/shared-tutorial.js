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

// ===== SHARED CLUSTERING FUNCTIONS =====
// These functions are used across multiple chapters

function initializeCentroids(data, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        centroids.push({
            x: data[randomIndex].x,
            y: data[randomIndex].y
        });
    }
    return centroids;
}

function updateCentroids(clusters) {
    const clusterGroups = {};
    clusters.forEach(point => {
        if (!clusterGroups[point.cluster]) {
            clusterGroups[point.cluster] = [];
        }
        clusterGroups[point.cluster].push(point);
    });
    
    return Object.keys(clusterGroups).map(clusterId => {
        const points = clusterGroups[clusterId];
        const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return { x: avgX, y: avgY };
    });
}

function hasConverged(oldClusters, newClusters) {
    return oldClusters.every((point, index) => 
        point.cluster === newClusters[index].cluster
    );
}

function generateSampleData(clusterCount, pointsPerCluster = 20) {
    const data = [];
    
    for (let i = 0; i < clusterCount; i++) {
        const centerX = Math.random() * 300 + 50;
        const centerY = Math.random() * 200 + 50;
        
        for (let j = 0; j < pointsPerCluster; j++) {
            data.push({
                x: centerX + (Math.random() - 0.5) * 40,
                y: centerY + (Math.random() - 0.5) * 40,
                cluster: i
            });
        }
    }
    
    return data;
}

function assignPointsToClusters(data, centroids, metric = 'euclidean') {
    return data.map(point => {
        let minDistance = Infinity;
        let assignedCluster = 0;
        
        centroids.forEach((centroid, index) => {
            let distance;
            if (metric === 'euclidean') {
                distance = Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2));
            } else if (metric === 'manhattan') {
                distance = Math.abs(point.x - centroid.x) + Math.abs(point.y - centroid.y);
            } else {
                // Default to euclidean
                distance = Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2));
            }
            
            if (distance < minDistance) {
                minDistance = distance;
                assignedCluster = index;
            }
        });
        
        return { ...point, cluster: assignedCluster };
    });
}

// Shared dendrogram visualization function
function drawSharedDendrogram(svgId, numClusters, cutHeight = null) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 350;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 15);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#2c3e50');
    title.setAttribute('font-size', '12');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Dendrogram';
    svg.appendChild(title);
    
    // Generate dendrogram with leaves matching the number of clusters
    const numLeaves = Math.max(4, parseInt(numClusters) * 2);
    const leafPositions = [];
    const leafSpacing = (width - margin.left - margin.right) / (numLeaves - 1);
    
    // Position leaves
    for (let i = 0; i < numLeaves; i++) {
        leafPositions.push(margin.left + i * leafSpacing);
    }
    
    // Draw dendrogram branches
    const maxHeight = height - margin.top - margin.bottom;
    const branchHeight = maxHeight * 0.8;
    
    // Draw vertical lines for leaves
    leafPositions.forEach((x, i) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', height - margin.bottom);
        line.setAttribute('y2', height - margin.bottom - 15);
        line.setAttribute('stroke', '#3498db');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
    });
    
    // Draw hierarchical branches with proper structure
    const mergeLevels = [
        { level: 1, pairs: [[0, 1], [2, 3], [4, 5], [6, 7]] },
        { level: 2, pairs: [[1, 3], [5, 7]] },
        { level: 3, pairs: [[3, 7]] }
    ];
    
    // Only show merge levels up to the selected number of clusters
    const maxLevel = Math.min(mergeLevels.length, Math.max(1, 4 - parseInt(numClusters) + 1));
    
    for (let level = 1; level <= maxLevel; level++) {
        const y = height - margin.bottom - 15 - (level * branchHeight / 3);
        
        if (level === 1) {
            // First level merges
            const pairs = [[0, 1], [2, 3], [4, 5], [6, 7]];
            pairs.forEach(([left, right]) => {
                if (left < numLeaves && right < numLeaves) {
                    const leftX = leafPositions[left];
                    const rightX = leafPositions[right];
                    
                    // Horizontal line
                    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    hLine.setAttribute('x1', leftX);
                    hLine.setAttribute('y1', y);
                    hLine.setAttribute('x2', rightX);
                    hLine.setAttribute('y2', y);
                    hLine.setAttribute('stroke', '#3498db');
                    hLine.setAttribute('stroke-width', '2');
                    svg.appendChild(hLine);
                    
                    // Vertical lines
                    const vLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    vLine1.setAttribute('x1', leftX);
                    vLine1.setAttribute('y1', height - margin.bottom - 15);
                    vLine1.setAttribute('x2', leftX);
                    vLine1.setAttribute('y2', y);
                    vLine1.setAttribute('stroke', '#3498db');
                    vLine1.setAttribute('stroke-width', '2');
                    svg.appendChild(vLine1);
                    
                    const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    vLine2.setAttribute('x1', rightX);
                    vLine2.setAttribute('y1', height - margin.bottom - 15);
                    vLine2.setAttribute('x2', rightX);
                    vLine2.setAttribute('y2', y);
                    vLine2.setAttribute('stroke', '#3498db');
                    vLine2.setAttribute('stroke-width', '2');
                    svg.appendChild(vLine2);
                }
            });
        } else if (level === 2) {
            // Second level merges
            const pairs = [[1, 3], [5, 7]];
            pairs.forEach(([left, right]) => {
                if (left < numLeaves && right < numLeaves) {
                    const leftX = leafPositions[left];
                    const rightX = leafPositions[right];
                    
                    // Horizontal line
                    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    hLine.setAttribute('x1', leftX);
                    hLine.setAttribute('y1', y);
                    hLine.setAttribute('x2', rightX);
                    hLine.setAttribute('y2', y);
                    hLine.setAttribute('stroke', '#3498db');
                    hLine.setAttribute('stroke-width', '2');
                    svg.appendChild(hLine);
                    
                    // Vertical lines
                    const vLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    vLine1.setAttribute('x1', leftX);
                    vLine1.setAttribute('y1', height - margin.bottom - 15 - (branchHeight / 3));
                    vLine1.setAttribute('x2', leftX);
                    vLine1.setAttribute('y2', y);
                    vLine1.setAttribute('stroke', '#3498db');
                    vLine1.setAttribute('stroke-width', '2');
                    svg.appendChild(vLine1);
                    
                    const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    vLine2.setAttribute('x1', rightX);
                    vLine2.setAttribute('y1', height - margin.bottom - 15 - (branchHeight / 3));
                    vLine2.setAttribute('x2', rightX);
                    vLine2.setAttribute('y2', y);
                    vLine2.setAttribute('stroke', '#3498db');
                    vLine2.setAttribute('stroke-width', '2');
                    svg.appendChild(vLine2);
                }
            });
        } else if (level === 3) {
            // Final merge
            const leftX = leafPositions[3];
            const rightX = leafPositions[7];
            
            // Horizontal line
            const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            hLine.setAttribute('x1', leftX);
            hLine.setAttribute('y1', y);
            hLine.setAttribute('x2', rightX);
            hLine.setAttribute('y2', y);
            hLine.setAttribute('stroke', '#3498db');
            hLine.setAttribute('stroke-width', '2');
            svg.appendChild(hLine);
            
            // Vertical lines
            const vLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            vLine1.setAttribute('x1', leftX);
            vLine1.setAttribute('y1', height - margin.bottom - 15 - (2 * branchHeight / 3));
            vLine1.setAttribute('x2', leftX);
            vLine1.setAttribute('y2', y);
            vLine1.setAttribute('stroke', '#3498db');
            vLine1.setAttribute('stroke-width', '2');
            svg.appendChild(vLine1);
            
            const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            vLine2.setAttribute('x1', rightX);
            vLine2.setAttribute('y1', height - margin.bottom - 15 - (2 * branchHeight / 3));
            vLine2.setAttribute('x2', rightX);
            vLine2.setAttribute('y2', y);
            vLine2.setAttribute('stroke', '#3498db');
            vLine2.setAttribute('stroke-width', '2');
            svg.appendChild(vLine2);
        }
    }
    
    // Add cut line if specified
    if (cutHeight !== null) {
        const cutY = height - margin.bottom - 15 - (cutHeight / 100) * branchHeight;
        const cutLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        cutLine.setAttribute('x1', margin.left);
        cutLine.setAttribute('y1', cutY);
        cutLine.setAttribute('x2', width - margin.right);
        cutLine.setAttribute('y2', cutY);
        cutLine.setAttribute('stroke', '#e74c3c');
        cutLine.setAttribute('stroke-width', '3');
        cutLine.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(cutLine);
        
        // Add cut line label
        const cutLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        cutLabel.setAttribute('x', width - margin.right + 10);
        cutLabel.setAttribute('y', cutY + 5);
        cutLabel.setAttribute('fill', '#e74c3c');
        cutLabel.setAttribute('font-size', '12');
        cutLabel.setAttribute('font-weight', 'bold');
        cutLabel.textContent = `Cut: ${cutHeight.toFixed(1)}`;
        svg.appendChild(cutLabel);
    }
}

// Export functions for potential use in other files
window.showSection = showSection;
window.navigateSubSection = navigateSubSection;
window.updateSectionProgress = updateSectionProgress;
window.updateSubSectionNavigation = updateSubSectionNavigation;
window.scrollToTop = scrollToTop;
window.initializeCentroids = initializeCentroids;
window.updateCentroids = updateCentroids;
window.hasConverged = hasConverged;
window.generateSampleData = generateSampleData;
window.assignPointsToClusters = assignPointsToClusters;
window.drawSharedDendrogram = drawSharedDendrogram;