// Chapter 9: Linkage Criteria Methods
// Interactive Demo JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeLinkageDemo();
    initializeQuiz();
    initializeDemoControls();
});

// Demo functions for HTML onclick compatibility
function runInitializationDemo() {
    const canvas = document.getElementById('linkage-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Linkage methods demo would appear here</p>';
    }
}

function resetInitializationDemo() {
    const canvas = document.getElementById('linkage-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Run Demo" to see linkage comparison</p>';
    }
}

// Initialize quiz functionality
function initializeQuiz() {
    const quizOptions = document.querySelectorAll('.enhanced-quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selection from other options in same question
            const question = this.closest('.enhanced-quiz-question');
            const otherOptions = question.querySelectorAll('.enhanced-quiz-option');
            otherOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Select this option
            this.classList.add('selected');
        });
    });
}

// Initialize demo controls
function initializeDemoControls() {
    // Initialize clusters slider with auto-generation
    initializeRangeSlider('demo-clusters', 'demo-clusters-display');
    
    // Add auto-generation on slider change
    const clustersSlider = document.getElementById('demo-clusters');
    if (clustersSlider) {
        clustersSlider.addEventListener('input', function() {
            // Auto-generate dendrogram when slider changes
            generateDendrogramDemo();
        });
    }
    
    // Add event listeners for linkage demo controls
    const datasetSelect = document.getElementById('demo-dataset');
    const linkageSelect = document.getElementById('demo-linkage');
    
    if (datasetSelect) {
        datasetSelect.addEventListener('change', generateLinkageDemo);
    }
    
    if (linkageSelect) {
        linkageSelect.addEventListener('change', generateLinkageDemo);
    }
    
    // Auto-generate demos on page load
    setTimeout(() => {
        generateLinkageDemo();
        generateDendrogramDemo();
    }, 200);
}


// Initialize linkage comparison demo
function initializeLinkageDemo() {
    const generateBtn = document.getElementById('generate-linkage-demo');
    const linkageSelect = document.getElementById('linkage-method');
    const datasetSelect = document.getElementById('dataset-type');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateLinkageVisualization();
        });
    }

    if (linkageSelect) {
        linkageSelect.addEventListener('change', function() {
            generateLinkageVisualization();
        });
    }

    if (datasetSelect) {
        datasetSelect.addEventListener('change', function() {
            generateLinkageVisualization();
        });
    }

    // Generate initial visualization
    generateLinkageVisualization();
}

// Generate linkage visualization
function generateLinkageVisualization() {
    const linkageMethod = document.getElementById('linkage-method')?.value || 'single';
    const datasetType = document.getElementById('dataset-type')?.value || 'blobs';
    
    // Generate data points
    const dataPoints = generateDataset(datasetType);
    
    // Draw data points
    drawDataPoints(dataPoints);
    
    // Generate dendrogram
    const dendrogram = generateDendrogram(dataPoints, linkageMethod);
    
    // Draw dendrogram
    drawDendrogram(dendrogram);
}

// Generate different types of datasets
function generateDataset(type) {
    const points = [];
    
    switch (type) {
        case 'blobs':
            return generateBlobClusters();
        case 'moons':
            return generateMoonClusters();
        case 'circles':
            return generateCircleClusters();
        case 'random':
            return generateRandomPoints();
        default:
            return generateBlobClusters();
    }
}

function generateBlobClusters() {
    const points = [];
    const centers = [
        { x: 2, y: 2 },
        { x: 6, y: 3 },
        { x: 4, y: 6 }
    ];
    
    centers.forEach((center, i) => {
        for (let j = 0; j < 20; j++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * 1.5;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            points.push({ x, y, cluster: i });
        }
    });
    
    return points;
}

function generateMoonClusters() {
    const points = [];
    
    // First moon
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI;
        const radius = 1 + Math.random() * 0.5;
        const x = 2 + radius * Math.cos(angle);
        const y = 2 + radius * Math.sin(angle);
        points.push({ x, y, cluster: 0 });
    }
    
    // Second moon
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI;
        const radius = 1 + Math.random() * 0.5;
        const x = 6 + radius * Math.cos(angle + Math.PI);
        const y = 2 + radius * Math.sin(angle + Math.PI);
        points.push({ x, y, cluster: 1 });
    }
    
    return points;
}

function generateCircleClusters() {
    const points = [];
    
    // Outer circle
    for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * 2 * Math.PI;
        const x = 4 + 2.5 * Math.cos(angle);
        const y = 4 + 2.5 * Math.sin(angle);
        points.push({ x, y, cluster: 0 });
    }
    
    // Inner circle
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * 2 * Math.PI;
        const x = 4 + 1 * Math.cos(angle);
        const y = 4 + 1 * Math.sin(angle);
        points.push({ x, y, cluster: 1 });
    }
    
    return points;
}

function generateRandomPoints() {
    const points = [];
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 8;
        const y = Math.random() * 8;
        points.push({ x, y, cluster: 0 });
    }
    return points;
}

// Draw data points on canvas
function drawDataPoints(points) {
    const canvas = document.getElementById('data-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up scaling
    const margin = 40;
    const scaleX = (width - 2 * margin) / 8;
    const scaleY = (height - 2 * margin) / 8;
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // Draw points
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    points.forEach((point, index) => {
        const x = margin + point.x * scaleX;
        const y = height - margin - point.y * scaleY;
        
        ctx.fillStyle = colors[point.cluster % colors.length];
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Generate dendrogram structure
function generateDendrogram(points, linkageMethod) {
    // Simplified hierarchical clustering
    const n = points.length;
    const distances = [];
    
    // Calculate distance matrix
    for (let i = 0; i < n; i++) {
        distances[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                distances[i][j] = 0;
            } else {
                distances[i][j] = calculateDistance(points[i], points[j]);
            }
        }
    }
    
    // Simple hierarchical clustering
    const clusters = points.map((point, index) => ({ points: [index], height: 0 }));
    const merges = [];
    
    while (clusters.length > 1) {
        let minDist = Infinity;
        let mergeI = 0, mergeJ = 1;
        
        // Find closest clusters
        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const dist = calculateClusterDistance(clusters[i], clusters[j], distances, linkageMethod);
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
        
        merges.push({ left: mergeI, right: mergeJ, height: minDist });
        clusters.splice(mergeJ, 1);
        clusters[mergeI] = newCluster;
    }
    
    return clusters[0];
}

function calculateDistance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

function calculateClusterDistance(cluster1, cluster2, distances, linkageMethod) {
    let minDist = Infinity;
    let maxDist = 0;
    let sumDist = 0;
    let count = 0;
    
    for (const p1 of cluster1.points) {
        for (const p2 of cluster2.points) {
            const dist = distances[p1][p2];
            minDist = Math.min(minDist, dist);
            maxDist = Math.max(maxDist, dist);
            sumDist += dist;
            count++;
        }
    }
    
    switch (linkageMethod) {
        case 'single':
            return minDist;
        case 'complete':
            return maxDist;
        case 'average':
            return sumDist / count;
        case 'ward':
            return sumDist / count; // Simplified
        default:
            return sumDist / count;
    }
}

// Draw dendrogram
function drawDendrogram(dendrogram) {
    const svg = document.getElementById('dendrogram-svg');
    if (!svg) return;
    
    // Clear SVG
    svg.innerHTML = '';
    
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');
    const margin = 40;
    
    // Calculate layout
    const leaves = getLeaves(dendrogram);
    const leafPositions = {};
    leaves.forEach((leaf, index) => {
        leafPositions[leaf] = margin + (index * (width - 2 * margin)) / (leaves.length - 1);
    });
    
    // Draw dendrogram
    drawDendrogramNode(dendrogram, svg, leafPositions, height - margin, 0);
}

function getLeaves(node) {
    if (!node.left && !node.right) {
        return node.points;
    }
    
    const leftLeaves = node.left ? getLeaves(node.left) : [];
    const rightLeaves = node.right ? getLeaves(node.right) : [];
    return [...leftLeaves, ...rightLeaves];
}

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
    
    // Internal node
    const leftPos = drawDendrogramNode(node.left, svg, leafPositions, maxHeight, depth + 1);
    const rightPos = drawDendrogramNode(node.right, svg, leafPositions, maxHeight, depth + 1);
    
    const x = (leftPos.x + rightPos.x) / 2;
    const y = maxHeight - (node.height * 20); // Scale height
    
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

// Quiz functionality
function checkQuizAnswers() {
    const questions = document.querySelectorAll('.enhanced-quiz-question');
    let correctAnswers = 0;
    let totalQuestions = questions.length;
    
    const correctAnswersMap = {
        1: 'correct', // Single linkage
        2: 'correct', // Ward's method minimizes variance
        3: 'correct', // Complete linkage is most robust
        4: 'correct', // O(n² log n) complexity
        5: 'correct'  // Average linkage is UPGMA
    };
    
    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('.enhanced-quiz-option.selected');
        const correctOption = question.querySelector('.enhanced-quiz-option[data-answer="correct"]');
        
        if (selectedOption === correctOption) {
            correctAnswers++;
            selectedOption.style.backgroundColor = '#d4edda';
        } else {
            if (selectedOption) {
                selectedOption.style.backgroundColor = '#f8d7da';
            }
            if (correctOption) {
                correctOption.style.backgroundColor = '#d4edda';
            }
        }
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const resultsDiv = document.getElementById('quiz-results');
    
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <div class="quiz-score-container">
                <h3>Quiz Results</h3>
                <p><strong>Score: ${correctAnswers}/${totalQuestions} (${score}%)</strong></p>
                <p>${score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep studying!'}</p>
            </div>
        `;
    }
}

// Additional demo functions for new interactive demos
function generateAverageLinkageDemo() {
    const canvas = document.getElementById('average-linkage-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '<h4>Average Linkage Clustering Demo</h4><p>Generating dataset and performing average linkage clustering...</p>';
    
    // Simulate clustering process
    setTimeout(() => {
        canvas.innerHTML = `
            <h4>Average Linkage Clustering Results</h4>
            <div style="display: flex; gap: 20px; margin: 20px 0;">
                <div style="flex: 1;">
                    <h5>Original Data</h5>
                    <div style="width: 200px; height: 150px; border: 1px solid #ccc; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center;">
                        <p>Mixed cluster shapes</p>
                    </div>
                </div>
                <div style="flex: 1;">
                    <h5>Average Linkage Dendrogram</h5>
                    <div style="width: 200px; height: 150px; border: 1px solid #ccc; background: linear-gradient(45deg, #e8f4f8, #d0e8f0); display: flex; align-items: center; justify-content: center;">
                        <p>Balanced clustering</p>
                    </div>
                </div>
            </div>
            <p><strong>Result:</strong> Average linkage created balanced clusters with moderate compactness, showing the compromise between single and complete linkage.</p>
        `;
    }, 1000);
}

function resetAverageLinkageDemo() {
    const canvas = document.getElementById('average-linkage-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Generate Demo" to see average linkage clustering in action</p>';
    }
}

function generateWardsMethodDemo() {
    const canvas = document.getElementById('wards-method-canvas');
    if (!canvas) return;
    
    canvas.innerHTML = '<h4>Ward\'s Method Clustering Demo</h4><p>Generating dataset and performing Ward\'s method clustering...</p>';
    
    // Simulate clustering process
    setTimeout(() => {
        canvas.innerHTML = `
            <h4>Ward's Method Clustering Results</h4>
            <div style="display: flex; gap: 20px; margin: 20px 0;">
                <div style="flex: 1;">
                    <h5>Original Data</h5>
                    <div style="width: 200px; height: 150px; border: 1px solid #ccc; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center;">
                        <p>Spherical clusters</p>
                    </div>
                </div>
                <div style="flex: 1;">
                    <h5>Ward's Method Dendrogram</h5>
                    <div style="width: 200px; height: 150px; border: 1px solid #ccc; background: linear-gradient(45deg, #e8f4f8, #d0e8f0); display: flex; align-items: center; justify-content: center;">
                        <p>Compact clusters</p>
                    </div>
                </div>
            </div>
            <p><strong>Result:</strong> Ward's method created compact, spherical clusters with minimal variance increase, ideal for well-separated data.</p>
        `;
    }, 1000);
}

function resetWardsMethodDemo() {
    const canvas = document.getElementById('wards-method-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Generate Demo" to see Ward\'s method clustering in action</p>';
    }
}

function generateLinkageDemo() {
    const dataset = document.getElementById('demo-dataset')?.value || 'blobs';
    const linkage = document.getElementById('demo-linkage')?.value || 'single';
    
    // Generate dataset visualization
    drawDatasetVisualization('linkage-dataset-plot', dataset);
    
    // Generate clustering visualization
    drawClusteringVisualization('linkage-clustering-plot', dataset, linkage);
}

function drawDatasetVisualization(svgId, datasetType) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    // Generate data points based on dataset type
    const data = generateDatasetPoints(datasetType, 30);
    
    // Draw points
    data.forEach((point, i) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', margin.left + point.x * (width - margin.left - margin.right));
        circle.setAttribute('cy', margin.top + point.y * (height - margin.top - margin.bottom));
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', '#3498db');
        circle.setAttribute('opacity', '0.7');
        svg.appendChild(circle);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 15);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#2c3e50');
    title.setAttribute('font-size', '12');
    title.setAttribute('font-weight', 'bold');
    title.textContent = `${datasetType.charAt(0).toUpperCase() + datasetType.slice(1)} Dataset`;
    svg.appendChild(title);
}

function drawClusteringVisualization(svgId, datasetType, linkageMethod) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    // Generate data points and clusters
    const data = generateDatasetPoints(datasetType, 30);
    const clusters = performClustering(data, linkageMethod);
    
    // Color palette for clusters
    const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
    
    // Draw clustered points
    data.forEach((point, i) => {
        const cluster = clusters[i];
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', margin.left + point.x * (width - margin.left - margin.right));
        circle.setAttribute('cy', margin.top + point.y * (height - margin.top - margin.bottom));
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', colors[cluster % colors.length]);
        circle.setAttribute('opacity', '0.8');
        svg.appendChild(circle);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 15);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#2c3e50');
    title.setAttribute('font-size', '12');
    title.setAttribute('font-weight', 'bold');
    title.textContent = `${linkageMethod.charAt(0).toUpperCase() + linkageMethod.slice(1)} Clustering`;
    svg.appendChild(title);
}

function resetLinkageDemo() {
    resetDemo(['linkage-dataset-plot', 'linkage-clustering-plot']);
}

function generateDendrogramDemo() {
    const clusters = document.getElementById('demo-clusters')?.value || '3';
    const display = document.getElementById('demo-clusters-display');
    if (display) display.textContent = clusters;
    
    // Generate data points visualization
    drawDendrogramDataVisualization('dendrogram-data-plot', clusters);
    
    // Generate dendrogram visualization using shared function
    drawSharedDendrogram('dendrogram-tree-plot', clusters);
}

function drawDendrogramDataVisualization(svgId, numClusters) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 350;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    // Generate more clustered data points for better visualization
    const data = generateClusteredDataPoints(parseInt(numClusters), 80);
    const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#f1c40f'];
    
    // Draw clustered points
    data.forEach((point, i) => {
        // Safety check for NaN values
        if (isNaN(point.x) || isNaN(point.y)) {
            console.warn('Skipping point with NaN coordinates:', point);
            return;
        }
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', margin.left + point.x * (width - margin.left - margin.right));
        circle.setAttribute('cy', margin.top + point.y * (height - margin.top - margin.bottom));
        circle.setAttribute('r', '2.5');
        circle.setAttribute('fill', colors[point.cluster % colors.length]);
        circle.setAttribute('opacity', '0.8');
        svg.appendChild(circle);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 15);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#2c3e50');
    title.setAttribute('font-size', '12');
    title.setAttribute('font-weight', 'bold');
    title.textContent = `${numClusters} Clusters`;
    svg.appendChild(title);
}


function resetDendrogramDemo() {
    resetDemo(['dendrogram-data-plot', 'dendrogram-tree-plot']);
}

// Helper functions for data generation
function generateDatasetPoints(datasetType, numPoints) {
    const points = [];
    
    if (datasetType === 'blobs') {
        // Generate blob clusters
        for (let i = 0; i < numPoints; i++) {
            const cluster = Math.floor(i / (numPoints / 3));
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * 0.15;
            const centerX = 0.2 + (cluster % 2) * 0.6;
            const centerY = 0.2 + Math.floor(cluster / 2) * 0.6;
            
            points.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }
    } else if (datasetType === 'moons') {
        // Generate moon shapes
        for (let i = 0; i < numPoints; i++) {
            const angle = Math.random() * Math.PI;
            const radius = 0.1 + Math.random() * 0.1;
            const x = 0.3 + radius * Math.cos(angle);
            const y = 0.5 + radius * Math.sin(angle);
            points.push({ x, y });
        }
        
        for (let i = 0; i < numPoints; i++) {
            const angle = Math.random() * Math.PI;
            const radius = 0.1 + Math.random() * 0.1;
            const x = 0.7 + radius * Math.cos(angle + Math.PI);
            const y = 0.5 + radius * Math.sin(angle + Math.PI);
            points.push({ x, y });
        }
    } else {
        // Random points
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random(),
                y: Math.random()
            });
        }
    }
    
    return points;
}

function performClustering(data, linkageMethod) {
    // Simple clustering simulation
    const clusters = [];
    const numClusters = 3;
    
    data.forEach((point, i) => {
        let cluster;
        if (linkageMethod === 'single') {
            cluster = Math.floor(i / (data.length / numClusters));
        } else if (linkageMethod === 'complete') {
            cluster = (i + 1) % numClusters;
        } else if (linkageMethod === 'average') {
            cluster = Math.floor(i / (data.length / numClusters));
        } else {
            cluster = i % numClusters;
        }
        clusters.push(cluster);
    });
    
    return clusters;
}

function generateClusteredDataPoints(numClusters, numPoints) {
    const points = [];
    const pointsPerCluster = Math.floor(numPoints / numClusters);
    
    // Define cluster centers with some overlap potential
    const clusterCenters = [];
    const cols = Math.ceil(Math.sqrt(numClusters));
    const rows = Math.ceil(numClusters / cols);
    
    for (let i = 0; i < numClusters; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        // Fix division by zero when numClusters = 1
        const centerX = cols === 1 ? 0.5 : 0.2 + (col / (cols - 1)) * 0.6;
        const centerY = rows === 1 ? 0.5 : 0.2 + (row / (rows - 1)) * 0.6;
        clusterCenters.push({ x: centerX, y: centerY });
    }
    
    // Generate points for each cluster with more realistic spread
    for (let cluster = 0; cluster < numClusters; cluster++) {
        const center = clusterCenters[cluster];
        const clusterPoints = cluster === numClusters - 1 ? 
            numPoints - (cluster * pointsPerCluster) : pointsPerCluster;
            
        for (let i = 0; i < clusterPoints; i++) {
            const angle = Math.random() * 2 * Math.PI;
            // More realistic cluster spread with some overlap
            const radius = Math.random() * 0.12 + Math.random() * 0.05;
            
            points.push({
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle),
                cluster: cluster
            });
        }
    }
    
    return points;
}

