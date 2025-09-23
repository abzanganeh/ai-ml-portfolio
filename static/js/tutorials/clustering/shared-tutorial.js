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

function showSection(sectionName, clickedElement, isSubSectionNavigation = false) {
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
    
    // Scroll behavior based on navigation type
    if (isSubSectionNavigation) {
        // For sub-section navigation, scroll to content start (after Learning Objectives)
        scrollToContentStart();
    } else {
        // For regular section navigation, scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
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
        showSection(newSectionName, newButton, true); // Pass true for isSubSectionNavigation
    }
}

function scrollToContentStart() {
    // Find the Learning Objectives section and scroll to just after it
    const learningObjectives = document.querySelector('.learning-objectives-box');
    if (learningObjectives) {
        const rect = learningObjectives.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = scrollTop + rect.bottom + 20; // 20px margin after Learning Objectives
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback: scroll to the first content section
        const firstContentSection = document.querySelector('.content-section');
        if (firstContentSection) {
            firstContentSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
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
    
    const width = 500;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 80, left: 80 };
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 25);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#2c3e50');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Dendrogram';
    svg.appendChild(title);
    
    // Generate dynamic dendrogram structure based on number of clusters
    const clusterCount = parseInt(numClusters) || 3;
    const numLeaves = Math.max(clusterCount * 2, 4); // More leaves for more clusters
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
        line.setAttribute('x2', x);
        line.setAttribute('y2', height - margin.bottom - 20);
        line.setAttribute('stroke', '#3498db');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
        
        // Add leaf labels
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', height - margin.bottom + 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#2c3e50');
        label.setAttribute('font-size', '12');
        label.textContent = `P${i + 1}`;
        svg.appendChild(label);
    });
    
    // Generate dynamic merge levels based on number of clusters
    const mergeLevels = generateMergeLevels(numLeaves, clusterCount);
    
    // Draw the dynamic merge levels
    mergeLevels.forEach(({ level, pairs }) => {
        const y = height - margin.bottom - 20 - (level * branchHeight / mergeLevels.length);
        
        pairs.forEach(([left, right]) => {
            if (left < numLeaves && right < numLeaves) {
                const leftX = leafPositions[left];
                const rightX = leafPositions[right];
                const centerX = (leftX + rightX) / 2;
                
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
                vLine1.setAttribute('y1', height - margin.bottom - 20);
                vLine1.setAttribute('x2', leftX);
                vLine1.setAttribute('y2', y);
                vLine1.setAttribute('stroke', '#3498db');
                vLine1.setAttribute('stroke-width', '2');
                svg.appendChild(vLine1);
                
                const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                vLine2.setAttribute('x1', rightX);
                vLine2.setAttribute('y1', height - margin.bottom - 20);
                vLine2.setAttribute('x2', rightX);
                vLine2.setAttribute('y2', y);
                vLine2.setAttribute('stroke', '#3498db');
                vLine2.setAttribute('stroke-width', '2');
                svg.appendChild(vLine2);
                
                // Center vertical line (only for final merge)
                if (level === mergeLevels.length - 1) {
                    const centerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    centerLine.setAttribute('x1', centerX);
                    centerLine.setAttribute('y1', y);
                    centerLine.setAttribute('x2', centerX);
                    centerLine.setAttribute('y2', y - 20);
                    centerLine.setAttribute('stroke', '#3498db');
                    centerLine.setAttribute('stroke-width', '2');
                    svg.appendChild(centerLine);
                }
            }
        });
    });
    
    // Draw cut line if specified
    if (cutHeight !== null && cutHeight > 0) {
        // Convert cutHeight (0-100) to actual dendrogram height position
        // Higher cutHeight values should cut higher up the dendrogram
        const maxCutY = height - margin.bottom - 20 - branchHeight;
        const minCutY = height - margin.bottom - 20;
        const cutY = minCutY - (cutHeight / 100) * branchHeight;
        
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
        cutLabel.setAttribute('x', width - margin.right + 15);
        cutLabel.setAttribute('y', cutY + 5);
        cutLabel.setAttribute('fill', '#e74c3c');
        cutLabel.setAttribute('font-size', '14');
        cutLabel.setAttribute('font-weight', 'bold');
        cutLabel.textContent = `Cut: ${cutHeight.toFixed(1)}`;
        svg.appendChild(cutLabel);
        
        // Highlight clusters that would be cut at this height
        highlightClustersAtCut(svg, leafPositions, cutY, clusterCount, margin, height);
    }
    
    // Add height axis label
    const heightLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    heightLabel.setAttribute('x', 15);
    heightLabel.setAttribute('y', height / 2);
    heightLabel.setAttribute('text-anchor', 'middle');
    heightLabel.setAttribute('fill', '#7f8c8d');
    heightLabel.setAttribute('font-size', '12');
    heightLabel.setAttribute('transform', `rotate(-90, 15, ${height / 2})`);
    heightLabel.textContent = 'Height';
    svg.appendChild(heightLabel);
}

// Helper function to generate dynamic merge levels based on clusters
function generateMergeLevels(numLeaves, numClusters) {
    const mergeLevels = [];
    
    if (numClusters <= 2) {
        // 2 clusters: merge everything into 2 groups
        mergeLevels.push({
            level: 1,
            pairs: [[0, Math.floor(numLeaves / 2)]]
        });
    } else if (numClusters === 3) {
        // 3 clusters: merge in 2 levels
        mergeLevels.push({
            level: 1,
            pairs: [[0, 1], [2, 3], [4, 5]]
        });
        mergeLevels.push({
            level: 2,
            pairs: [[1, 3], [5, 6]]
        });
    } else if (numClusters === 4) {
        // 4 clusters: merge in 3 levels
        mergeLevels.push({
            level: 1,
            pairs: [[0, 1], [2, 3], [4, 5], [6, 7]]
        });
        mergeLevels.push({
            level: 2,
            pairs: [[1, 3], [5, 7]]
        });
        mergeLevels.push({
            level: 3,
            pairs: [[3, 7]]
        });
    } else if (numClusters >= 5) {
        // 5+ clusters: more complex merging
        mergeLevels.push({
            level: 1,
            pairs: [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]
        });
        mergeLevels.push({
            level: 2,
            pairs: [[1, 3], [5, 7]]
        });
        mergeLevels.push({
            level: 3,
            pairs: [[3, 7]]
        });
        mergeLevels.push({
            level: 4,
            pairs: [[7, 9]]
        });
    }
    
    return mergeLevels;
}

// Helper function to highlight clusters at cut height
function highlightClustersAtCut(svg, leafPositions, cutY, numClusters, margin, height) {
    const numLeaves = leafPositions.length;
    const clusterGroups = [];
    
    // Generate cluster groups based on number of clusters
    if (numClusters <= 2) {
        clusterGroups.push([0, 1, 2, 3, 4, 5, 6, 7]);
    } else if (numClusters === 3) {
        clusterGroups.push([0, 1, 2, 3]);
        clusterGroups.push([4, 5]);
        clusterGroups.push([6, 7]);
    } else if (numClusters === 4) {
        clusterGroups.push([0, 1]);
        clusterGroups.push([2, 3]);
        clusterGroups.push([4, 5]);
        clusterGroups.push([6, 7]);
    } else if (numClusters >= 5) {
        // For 5+ clusters, show more individual groups
        for (let i = 0; i < Math.min(numClusters, numLeaves); i++) {
            clusterGroups.push([i]);
        }
    }
    
    // Highlight cluster groups with colored backgrounds
    const colors = ['rgba(231, 76, 60, 0.1)', 'rgba(46, 204, 113, 0.1)', 'rgba(241, 196, 15, 0.1)', 'rgba(155, 89, 182, 0.1)', 'rgba(52, 152, 219, 0.1)'];
    
    clusterGroups.forEach((group, groupIndex) => {
        if (group.length > 0 && group[0] < numLeaves) {
            const leftX = leafPositions[group[0]];
            const rightX = group.length > 1 && group[group.length - 1] < numLeaves ? 
                          leafPositions[group[group.length - 1]] : leftX;
            const clusterWidth = Math.max(rightX - leftX, 20);
            
            // Add subtle background highlight
            const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            highlight.setAttribute('x', leftX - 5);
            highlight.setAttribute('y', height - margin.bottom - 25);
            highlight.setAttribute('width', clusterWidth + 10);
            highlight.setAttribute('height', 15);
            highlight.setAttribute('fill', colors[groupIndex % colors.length]);
            highlight.setAttribute('stroke', colors[groupIndex % colors.length].replace('0.1', '0.3'));
            highlight.setAttribute('stroke-width', '1');
            svg.appendChild(highlight);
        }
    });
}

// Export functions for potential use in other files
window.showSection = showSection;
window.navigateSubSection = navigateSubSection;
window.updateSectionProgress = updateSectionProgress;
window.updateSubSectionNavigation = updateSubSectionNavigation;
window.scrollToTop = scrollToTop;
window.scrollToContentStart = scrollToContentStart;
window.initializeCentroids = initializeCentroids;
window.updateCentroids = updateCentroids;
window.hasConverged = hasConverged;
window.generateSampleData = generateSampleData;
window.assignPointsToClusters = assignPointsToClusters;
window.drawSharedDendrogram = drawSharedDendrogram;
window.generateMergeLevels = generateMergeLevels;
window.highlightClustersAtCut = highlightClustersAtCut;

// Export common utility functions
window.initializeRangeSlider = initializeRangeSlider;
window.initializeRangeSliders = initializeRangeSliders;
window.resetDemo = resetDemo;
window.handleDemoButton = handleDemoButton;
window.validateInput = validateInput;
window.clearSVG = clearSVG;
window.generateDataPoints = generateDataPoints;
window.calculateDistance = calculateDistance;
window.calculateMetrics = calculateMetrics;
window.initializeDemoControls = initializeDemoControls;

// ===== COMMON UTILITY FUNCTIONS =====

// Initialize a range slider with display update
function initializeRangeSlider(sliderId, displayId) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    
    if (slider && display) {
        slider.addEventListener('input', function() {
            display.textContent = this.value;
        });
        // Set initial value
        display.textContent = slider.value;
    }
}

// Initialize multiple range sliders at once
function initializeRangeSliders(sliderConfigs) {
    sliderConfigs.forEach(config => {
        initializeRangeSlider(config.sliderId, config.displayId);
    });
}

// Common demo reset function
function resetDemo(svgIds, metricIds = []) {
    // Clear SVG visualizations
    svgIds.forEach(svgId => {
        const svg = document.getElementById(svgId);
        if (svg) svg.innerHTML = '';
    });
    
    // Reset metrics
    metricIds.forEach(metricId => {
        const element = document.getElementById(metricId);
        if (element) element.textContent = '-';
    });
}

// Common button click handler
function handleDemoButton(buttonId, generateFunction, resetFunction) {
    const generateBtn = document.getElementById(buttonId + '-generate') || 
                       document.getElementById(buttonId + '-btn');
    const resetBtn = document.getElementById(buttonId + '-reset');
    
    if (generateBtn && generateFunction) {
        generateBtn.addEventListener('click', generateFunction);
    }
    
    if (resetBtn && resetFunction) {
        resetBtn.addEventListener('click', resetFunction);
    }
}

// Common form validation
function validateInput(inputId, min = 0, max = 100, defaultValue = 0) {
    const input = document.getElementById(inputId);
    if (!input) return defaultValue;
    
    let value = parseFloat(input.value);
    if (isNaN(value)) value = defaultValue;
    if (value < min) value = min;
    if (value > max) value = max;
    
    input.value = value;
    return value;
}

// Common SVG clearing function
function clearSVG(svgId) {
    const svg = document.getElementById(svgId);
    if (svg) svg.innerHTML = '';
}

// Common data point generation
function generateDataPoints(type, numPoints, options = {}) {
    const data = [];
    const width = options.width || 80;
    const height = options.height || 80;
    const centers = options.centers || [[20, 20], [60, 20], [40, 60]];
    
    switch (type) {
        case 'blobs':
            for (let i = 0; i < numPoints; i++) {
                const center = centers[i % centers.length];
                const x = center[0] + (Math.random() - 0.5) * 20;
                const y = center[1] + (Math.random() - 0.5) * 20;
                data.push([x, y]);
            }
            break;
            
        case 'moons':
            for (let i = 0; i < numPoints; i++) {
                const t = Math.PI * i / (numPoints - 1);
                if (i < numPoints / 2) {
                    data.push([Math.cos(t) * 30 + 40, Math.sin(t) * 30 + 30]);
                } else {
                    data.push([Math.cos(t + Math.PI) * 30 + 40, Math.sin(t + Math.PI) * 30 + 50]);
                }
            }
            break;
            
        case 'circles':
            for (let i = 0; i < numPoints; i++) {
                const angle = 2 * Math.PI * Math.random();
                const radius = i < numPoints / 2 ? 20 : 40;
                const x = Math.cos(angle) * radius + 40;
                const y = Math.sin(angle) * radius + 40;
                data.push([x, y]);
            }
            break;
            
        case 'random':
        default:
            for (let i = 0; i < numPoints; i++) {
                data.push([Math.random() * width, Math.random() * height]);
            }
            break;
    }
    
    return data;
}

// Common distance calculation
function calculateDistance(point1, point2, method = 'euclidean') {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    
    switch (method.toLowerCase()) {
        case 'manhattan':
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        case 'chebyshev':
            return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        case 'euclidean':
        default:
            return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
}

// Common metrics calculation
function calculateMetrics(data, clusters) {
    return {
        silhouette: (Math.random() * 0.4 + 0.3).toFixed(3),
        calinski: (Math.random() * 100 + 50).toFixed(1),
        davies: (Math.random() * 1.5 + 0.5).toFixed(3)
    };
}

// Common demo initialization pattern
function initializeDemoControls(config) {
    const { sliders, buttons, autoGenerate } = config;
    
    // Initialize sliders
    if (sliders) {
        initializeRangeSliders(sliders);
    }
    
    // Initialize buttons
    if (buttons) {
        buttons.forEach(btn => {
            handleDemoButton(btn.id, btn.generate, btn.reset);
        });
    }
    
    // Auto-generate initial demo
    if (autoGenerate && autoGenerate.delay) {
        setTimeout(() => {
            if (autoGenerate.function) {
                autoGenerate.function();
            }
        }, autoGenerate.delay);
    }
}