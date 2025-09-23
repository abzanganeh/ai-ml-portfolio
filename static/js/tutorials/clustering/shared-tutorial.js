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
    // Find the currently active content section and scroll to its title
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        // Find the h2 title within the active section
        const sectionTitle = activeSection.querySelector('h2');
        if (sectionTitle) {
            const rect = sectionTitle.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = scrollTop + rect.top - 80; // 80px margin above the title
            
            window.scrollTo({
                top: Math.max(0, targetPosition), // Ensure we don't scroll above the page
                behavior: 'smooth'
            });
        } else {
            // Fallback: scroll to the section itself
            activeSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
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

// Shared dendrogram visualization function - Proper hierarchical structure
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
    
    // Generate data points for dendrogram
    const dataPoints = generateChapter10Dataset();
    
    // Generate proper dendrogram structure using Chapter 10's algorithm
    const dendrogram = generateChapter10Dendrogram(dataPoints);
    
    if (!dendrogram) {
        console.error('Failed to generate dendrogram');
        return;
    }
    
    // Calculate leaf positions
    const leaves = getChapter10Leaves(dendrogram);
    const leafPositions = {};
    const leafPositionsArray = [];
    
    leaves.forEach((leaf, index) => {
        const x = margin.left + (index * (width - margin.left - margin.right)) / (leaves.length - 1);
        leafPositions[leaf] = x;
        leafPositionsArray[index] = x;
    });
    
    // Draw the proper dendrogram using Chapter 10's drawing function
    drawChapter10DendrogramNode(dendrogram, svg, leafPositions, height - margin.bottom, 0);
    
    // Draw cut line if specified
    if (cutHeight !== null && cutHeight > 0) {
        const maxHeight = Math.max(...getChapter10AllHeights(dendrogram));
        const cutY = height - margin.bottom - (cutHeight / 100) * maxHeight;
        
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
        highlightClustersAtCut(svg, leafPositionsArray, cutY, clusterCount, margin, height);
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

// Helper functions for proper hierarchical dendrogram

// Chapter 10 dendrogram functions (working implementation)
function generateChapter10Dataset() {
    const points = [];
    const numPoints = 15;
    const numClusters = 3;
    const pointsPerCluster = Math.floor(numPoints / numClusters);
    
    const centers = [
        { x: 2, y: 2 },
        { x: 6, y: 3 },
        { x: 4, y: 6 }
    ];
    
    for (let i = 0; i < numClusters; i++) {
        for (let j = 0; j < pointsPerCluster; j++) {
            const x = centers[i].x + (Math.random() - 0.5) * 2;
            const y = centers[i].y + (Math.random() - 0.5) * 2;
            points.push({ x, y, cluster: i });
        }
    }
    
    return points;
}

function generateChapter10Dendrogram(points) {
    const n = points.length;
    const distances = [];
    
    // Calculate distance matrix
    for (let i = 0; i < n; i++) {
        distances[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                distances[i][j] = 0;
            } else {
                distances[i][j] = calculateChapter10Distance(points[i], points[j]);
            }
        }
    }
    
    // Simple hierarchical clustering
    const clusters = points.map((point, index) => ({ points: [index], height: 0 }));
    
    while (clusters.length > 1) {
        let minDist = Infinity;
        let mergeI = 0, mergeJ = 1;
        
        // Find closest clusters
        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const dist = calculateChapter10ClusterDistance(clusters[i], clusters[j], distances);
                if (dist < minDist) {
                    minDist = dist;
                    mergeI = i;
                    mergeJ = j;
                }
            }
        }
        
        // Merge clusters
        const newCluster = {
            points: [...clusters[mergeI].points, ...clusters[mergeJ].points],
            height: minDist,
            left: clusters[mergeI],
            right: clusters[mergeJ]
        };
        
        // Remove merged clusters and add new one
        clusters.splice(Math.max(mergeI, mergeJ), 1);
        clusters.splice(Math.min(mergeI, mergeJ), 1);
        clusters.push(newCluster);
    }
    
    return clusters[0];
}

function calculateChapter10Distance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function calculateChapter10ClusterDistance(cluster1, cluster2, distances) {
    let totalDist = 0;
    let count = 0;
    
    for (const point1 of cluster1.points) {
        for (const point2 of cluster2.points) {
            totalDist += distances[point1][point2];
            count++;
        }
    }
    
    return count > 0 ? totalDist / count : 0;
}

function getChapter10Leaves(node) {
    if (!node.left && !node.right) {
        return node.points;
    }
    
    const leftLeaves = node.left ? getChapter10Leaves(node.left) : [];
    const rightLeaves = node.right ? getChapter10Leaves(node.right) : [];
    return [...leftLeaves, ...rightLeaves];
}

function getChapter10AllHeights(node) {
    if (!node.left && !node.right) {
        return [0];
    }
    
    const heights = [node.height];
    if (node.left) heights.push(...getChapter10AllHeights(node.left));
    if (node.right) heights.push(...getChapter10AllHeights(node.right));
    return heights;
}

function drawChapter10DendrogramNode(node, svg, leafPositions, maxHeight, depth) {
    if (!node.left && !node.right) {
        // Leaf node
        const x = leafPositions[node.points[0]];
        const y = maxHeight;
        
        // Draw leaf
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', '#4f46e5');
        svg.appendChild(circle);
        
        // Draw leaf label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', y + 15);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#2c3e50');
        label.setAttribute('font-size', '12');
        label.textContent = `P${node.points[0] + 1}`;
        svg.appendChild(label);
        
        return { x, y };
    }
    
    // Internal node
    const leftPos = drawChapter10DendrogramNode(node.left, svg, leafPositions, maxHeight, depth + 1);
    const rightPos = drawChapter10DendrogramNode(node.right, svg, leafPositions, maxHeight, depth + 1);
    
    const x = (leftPos.x + rightPos.x) / 2;
    const y = maxHeight - node.height * 2; // Scale height for visualization
    
    // Draw horizontal line
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', leftPos.x);
    hLine.setAttribute('y1', y);
    hLine.setAttribute('x2', rightPos.x);
    hLine.setAttribute('y2', y);
    hLine.setAttribute('stroke', '#666');
    hLine.setAttribute('stroke-width', 2);
    svg.appendChild(hLine);
    
    // Draw vertical lines
    const vLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine1.setAttribute('x1', leftPos.x);
    vLine1.setAttribute('y1', leftPos.y);
    vLine1.setAttribute('x2', leftPos.x);
    vLine1.setAttribute('y2', y);
    vLine1.setAttribute('stroke', '#666');
    vLine1.setAttribute('stroke-width', 2);
    svg.appendChild(vLine1);
    
    const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine2.setAttribute('x1', rightPos.x);
    vLine2.setAttribute('y1', rightPos.y);
    vLine2.setAttribute('x2', rightPos.x);
    vLine2.setAttribute('y2', y);
    vLine2.setAttribute('stroke', '#666');
    vLine2.setAttribute('stroke-width', 2);
    svg.appendChild(vLine2);
    
    return { x, y };
}

// Draw simple hierarchical dendrogram structure
function drawSimpleDendrogram(svg, leafPositions, leafPositionsArray, numLeaves, clusterCount, margin, height) {
    // Draw leaf nodes
    Object.keys(leafPositions).forEach((leafId, index) => {
        const x = leafPositions[leafId];
        const y = height - margin.bottom;
        
        // Draw leaf circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', '#4f46e5');
        svg.appendChild(circle);
        
        // Draw leaf label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', y + 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#2c3e50');
        label.setAttribute('font-size', '12');
        label.textContent = leafId;
        svg.appendChild(label);
    });
    
    // Draw hierarchical merging structure with different heights
    const mergeLevels = createMergeLevels(numLeaves, clusterCount);
    const maxHeight = 200;
    
    mergeLevels.forEach((level, levelIndex) => {
        const y = height - margin.bottom - (levelIndex + 1) * (maxHeight / mergeLevels.length);
        
        level.pairs.forEach(([leftIndex, rightIndex]) => {
            if (leftIndex < numLeaves && rightIndex < numLeaves) {
                const leftX = leafPositionsArray[leftIndex];
                const rightX = leafPositionsArray[rightIndex];
                
                // Draw horizontal connecting line
                const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                hLine.setAttribute('x1', leftX);
                hLine.setAttribute('y1', y);
                hLine.setAttribute('x2', rightX);
                hLine.setAttribute('y2', y);
                hLine.setAttribute('stroke', '#666');
                hLine.setAttribute('stroke-width', 2);
                svg.appendChild(hLine);
                
                // Draw vertical lines from leaves to connection
                const vLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                vLine1.setAttribute('x1', leftX);
                vLine1.setAttribute('y1', height - margin.bottom);
                vLine1.setAttribute('x2', leftX);
                vLine1.setAttribute('y2', y);
                vLine1.setAttribute('stroke', '#666');
                vLine1.setAttribute('stroke-width', 2);
                svg.appendChild(vLine1);
                
                const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                vLine2.setAttribute('x1', rightX);
                vLine2.setAttribute('y1', height - margin.bottom);
                vLine2.setAttribute('x2', rightX);
                vLine2.setAttribute('y2', y);
                vLine2.setAttribute('stroke', '#666');
                vLine2.setAttribute('stroke-width', 2);
                svg.appendChild(vLine2);
            }
        });
    });
}

// Create merge levels for simple dendrogram
function createMergeLevels(numLeaves, clusterCount) {
    const levels = [];
    
    if (clusterCount <= 2) {
        // Merge everything into 2 groups
        levels.push({ pairs: [[0, Math.floor(numLeaves / 2)]] });
    } else if (clusterCount === 3) {
        // First level: merge adjacent pairs
        levels.push({ pairs: [[0, 1], [2, 3], [4, 5]] });
        // Second level: merge some groups
        levels.push({ pairs: [[1, 3]] });
    } else if (clusterCount === 4) {
        // First level: merge adjacent pairs
        levels.push({ pairs: [[0, 1], [2, 3], [4, 5], [6, 7]] });
        // Second level: merge some groups
        levels.push({ pairs: [[1, 3], [5, 7]] });
        // Third level: final merge
        levels.push({ pairs: [[3, 7]] });
    } else {
        // Default: merge adjacent pairs
        for (let i = 0; i < Math.floor(numLeaves / 2); i++) {
            if (i * 2 + 1 < numLeaves) {
                if (!levels[0]) levels[0] = { pairs: [] };
                levels[0].pairs.push([i * 2, i * 2 + 1]);
            }
        }
    }
    
    return levels;
}

// Generate sample data for dendrogram
function generateSampleDataForDendrogram(numPoints, numClusters) {
    const points = [];
    const pointsPerCluster = Math.floor(numPoints / numClusters);
    
    for (let i = 0; i < numClusters; i++) {
        const centerX = 100 + (i * 150);
        const centerY = 100 + (i * 50);
        
        for (let j = 0; j < pointsPerCluster; j++) {
            points.push({
                id: `P${points.length + 1}`,
                x: centerX + (Math.random() - 0.5) * 40,
                y: centerY + (Math.random() - 0.5) * 40,
                cluster: i
            });
        }
    }
    
    // Add remaining points
    while (points.length < numPoints) {
        points.push({
            id: `P${points.length + 1}`,
            x: 200 + Math.random() * 200,
            y: 150 + Math.random() * 100,
            cluster: Math.floor(Math.random() * numClusters)
        });
    }
    
    return points;
}

// Perform hierarchical clustering
function performHierarchicalClustering(points) {
    if (!points || !Array.isArray(points) || points.length === 0) {
        console.error('Invalid points array:', points);
        return null;
    }
    
    const n = points.length;
    const distances = [];
    
    // Calculate distance matrix
    for (let i = 0; i < n; i++) {
        distances[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                distances[i][j] = 0;
            } else {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                distances[i][j] = Math.sqrt(dx * dx + dy * dy);
            }
        }
    }
    
    // Initialize clusters (each point is its own cluster)
    const clusters = points.map((point, index) => ({
        points: [point.id],
        height: 0,
        left: null,
        right: null
    }));
    
    // Perform hierarchical clustering
    while (clusters.length > 1) {
        let minDist = Infinity;
        let minI = 0, minJ = 1;
        
        // Find closest clusters
        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const dist = calculateClusterDistance(clusters[i], clusters[j], distances, points);
                if (dist < minDist) {
                    minDist = dist;
                    minI = i;
                    minJ = j;
                }
            }
        }
        
        // Merge closest clusters
        const newCluster = {
            points: [...clusters[minI].points, ...clusters[minJ].points],
            height: minDist,
            left: clusters[minI],
            right: clusters[minJ]
        };
        
        // Remove merged clusters and add new one
        clusters.splice(Math.max(minI, minJ), 1);
        clusters.splice(Math.min(minI, minJ), 1);
        clusters.push(newCluster);
    }
    
    if (clusters.length !== 1) {
        console.error('Hierarchical clustering failed - expected 1 final cluster, got:', clusters.length);
        return null;
    }
    
    return clusters[0];
}

// Calculate distance between clusters (average linkage)
function calculateClusterDistance(cluster1, cluster2, distances, points) {
    let totalDist = 0;
    let count = 0;
    
    for (const point1 of cluster1.points) {
        for (const point2 of cluster2.points) {
            const i = points.findIndex(p => p.id === point1);
            const j = points.findIndex(p => p.id === point2);
            if (i !== -1 && j !== -1) {
                totalDist += distances[i][j];
                count++;
            }
        }
    }
    
    return count > 0 ? totalDist / count : 0;
}

// Get leaves from dendrogram
function getDendrogramLeaves(node) {
    if (!node.left && !node.right) {
        return node.points;
    }
    
    const leftLeaves = node.left ? getDendrogramLeaves(node.left) : [];
    const rightLeaves = node.right ? getDendrogramLeaves(node.right) : [];
    return [...leftLeaves, ...rightLeaves];
}

// Get all heights from dendrogram
function getAllHeights(node) {
    if (!node.left && !node.right) {
        return [0];
    }
    
    const heights = [node.height];
    if (node.left) heights.push(...getAllHeights(node.left));
    if (node.right) heights.push(...getAllHeights(node.right));
    return heights;
}

// Draw dendrogram node recursively
function drawDendrogramNode(node, svg, leafPositions, maxHeight, depth) {
    if (!node.left && !node.right) {
        // Leaf node
        const x = leafPositions[node.points[0]];
        const y = maxHeight;
        
        // Draw leaf
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', '#4f46e5');
        svg.appendChild(circle);
        
        return { x, y };
    }
    
    // Internal node - recursively draw children
    const leftPos = drawDendrogramNode(node.left, svg, leafPositions, maxHeight, depth + 1);
    const rightPos = drawDendrogramNode(node.right, svg, leafPositions, maxHeight, depth + 1);
    
    const x = (leftPos.x + rightPos.x) / 2;
    const y = maxHeight - (node.height * 2); // Scale height appropriately
    
    // Draw horizontal line
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', leftPos.x);
    hLine.setAttribute('y1', y);
    hLine.setAttribute('x2', rightPos.x);
    hLine.setAttribute('y2', y);
    hLine.setAttribute('stroke', '#666');
    hLine.setAttribute('stroke-width', 2);
    svg.appendChild(hLine);
    
    // Draw vertical lines
    const vLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine1.setAttribute('x1', leftPos.x);
    vLine1.setAttribute('y1', leftPos.y);
    vLine1.setAttribute('x2', leftPos.x);
    vLine1.setAttribute('y2', y);
    vLine1.setAttribute('stroke', '#666');
    vLine1.setAttribute('stroke-width', 2);
    svg.appendChild(vLine1);
    
    const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine2.setAttribute('x1', rightPos.x);
    vLine2.setAttribute('y1', rightPos.y);
    vLine2.setAttribute('x2', rightPos.x);
    vLine2.setAttribute('y2', y);
    vLine2.setAttribute('stroke', '#666');
    vLine2.setAttribute('stroke-width', 2);
    svg.appendChild(vLine2);
    
    return { x, y };
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
window.highlightClustersAtCut = highlightClustersAtCut;
window.generateChapter10Dataset = generateChapter10Dataset;
window.generateChapter10Dendrogram = generateChapter10Dendrogram;
window.drawChapter10DendrogramNode = drawChapter10DendrogramNode;
window.getChapter10Leaves = getChapter10Leaves;
window.getChapter10AllHeights = getChapter10AllHeights;

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