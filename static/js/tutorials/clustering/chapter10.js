// Chapter 10: Dendrogram Construction and Interpretation
// Interactive Demo JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDendrogramDemo();
    initializeCuttingDemo();
});

// Initialize dendrogram construction demo
function initializeDendrogramDemo() {
    const generateBtn = document.getElementById('generate-dendrogram');
    const numPointsSlider = document.getElementById('num-points');
    const numPointsValue = document.getElementById('num-points-value');
    const noiseSlider = document.getElementById('noise-level');
    const noiseValue = document.getElementById('noise-level-value');

    // Update slider values
    if (numPointsSlider && numPointsValue) {
        numPointsSlider.addEventListener('input', function() {
            numPointsValue.textContent = this.value;
        });
    }

    if (noiseSlider && noiseValue) {
        noiseSlider.addEventListener('input', function() {
            noiseValue.textContent = this.value;
        });
    }

    // Generate dendrogram
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateDendrogramVisualization();
        });
    }

    // Generate initial visualization
    generateDendrogramVisualization();
}

// Initialize cutting demo
function initializeCuttingDemo() {
    const cutHeightSlider = document.getElementById('cut-height');
    const cutHeightValue = document.getElementById('cut-height-value');
    const minClusterSlider = document.getElementById('min-cluster-size');
    const minClusterValue = document.getElementById('min-cluster-size-value');
    const maxClustersSlider = document.getElementById('max-clusters');
    const maxClustersValue = document.getElementById('max-clusters-value');

    // Update slider values
    if (cutHeightSlider && cutHeightValue) {
        cutHeightSlider.addEventListener('input', function() {
            cutHeightValue.textContent = this.value;
            updateCuttingVisualization();
        });
    }

    if (minClusterSlider && minClusterValue) {
        minClusterSlider.addEventListener('input', function() {
            minClusterValue.textContent = this.value;
            updateCuttingVisualization();
        });
    }

    if (maxClustersSlider && maxClustersValue) {
        maxClustersSlider.addEventListener('input', function() {
            maxClustersValue.textContent = this.value;
            updateCuttingVisualization();
        });
    }

    // Update on cutting method change
    const cuttingMethods = document.querySelectorAll('input[name="cutting-method"]');
    cuttingMethods.forEach(radio => {
        radio.addEventListener('change', function() {
            updateCuttingVisualization();
        });
    });

    // Generate initial cutting visualization
    updateCuttingVisualization();
}

// Generate dendrogram visualization
function generateDendrogramVisualization() {
    const datasetType = document.getElementById('dataset-type')?.value || 'gaussian';
    const numPoints = parseInt(document.getElementById('num-points')?.value || 50);
    const noiseLevel = parseFloat(document.getElementById('noise-level')?.value || 0.2);
    const linkageMethod = document.getElementById('linkage-method')?.value || 'average';
    const distanceMetric = document.getElementById('distance-metric')?.value || 'euclidean';

    // Generate data points
    const dataPoints = generateDataset(datasetType, numPoints, noiseLevel);
    
    // Draw data points
    drawDataPoints(dataPoints);
    
    // Generate dendrogram
    const dendrogram = generateDendrogram(dataPoints, linkageMethod, distanceMetric);
    
    // Draw dendrogram using shared function
    drawSharedDendrogram('dendrogram-svg', 3);
}

// Generate different types of datasets
function generateDataset(type, numPoints, noiseLevel) {
    const points = [];
    
    switch (type) {
        case 'gaussian':
            return generateGaussianClusters(numPoints, noiseLevel);
        case 'elongated':
            return generateElongatedClusters(numPoints, noiseLevel);
        case 'nested':
            return generateNestedHierarchies(numPoints, noiseLevel);
        case 'random':
            return generateRandomPoints(numPoints);
        case 'iris':
            return generateIrisDataset();
        default:
            return generateGaussianClusters(numPoints, noiseLevel);
    }
}

function generateGaussianClusters(numPoints, noiseLevel) {
    const points = [];
    const numClusters = 3;
    const pointsPerCluster = Math.floor(numPoints / numClusters);
    
    const centers = [
        { x: 2, y: 2 },
        { x: 6, y: 3 },
        { x: 4, y: 6 }
    ];
    
    for (let i = 0; i < numClusters; i++) {
        for (let j = 0; j < pointsPerCluster; j++) {
            const x = centers[i].x + (Math.random() - 0.5) * 2 + (Math.random() - 0.5) * noiseLevel;
            const y = centers[i].y + (Math.random() - 0.5) * 2 + (Math.random() - 0.5) * noiseLevel;
            points.push({ x, y, cluster: i });
        }
    }
    
    return points;
}

function generateElongatedClusters(numPoints, noiseLevel) {
    const points = [];
    const pointsPerCluster = Math.floor(numPoints / 2);
    
    // First elongated cluster
    for (let i = 0; i < pointsPerCluster; i++) {
        const x = 1 + i * 0.1 + (Math.random() - 0.5) * noiseLevel;
        const y = 2 + (Math.random() - 0.5) * 0.5 + (Math.random() - 0.5) * noiseLevel;
        points.push({ x, y, cluster: 0 });
    }
    
    // Second elongated cluster
    for (let i = 0; i < pointsPerCluster; i++) {
        const x = 1 + i * 0.1 + (Math.random() - 0.5) * noiseLevel;
        const y = 5 + (Math.random() - 0.5) * 0.5 + (Math.random() - 0.5) * noiseLevel;
        points.push({ x, y, cluster: 1 });
    }
    
    return points;
}

function generateNestedHierarchies(numPoints, noiseLevel) {
    const points = [];
    const pointsPerCluster = Math.floor(numPoints / 4);
    
    const centers = [
        { x: 2, y: 2 },
        { x: 3, y: 2.5 },
        { x: 5, y: 5 },
        { x: 5.5, y: 5.5 }
    ];
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < pointsPerCluster; j++) {
            const x = centers[i].x + (Math.random() - 0.5) * 1 + (Math.random() - 0.5) * noiseLevel;
            const y = centers[i].y + (Math.random() - 0.5) * 1 + (Math.random() - 0.5) * noiseLevel;
            points.push({ x, y, cluster: i });
        }
    }
    
    return points;
}

function generateRandomPoints(numPoints) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 8;
        const y = Math.random() * 8;
        points.push({ x, y, cluster: 0 });
    }
    return points;
}

function generateIrisDataset() {
    // Simplified Iris dataset
    return [
        { x: 5.1, y: 3.5, cluster: 0 },
        { x: 4.9, y: 3.0, cluster: 0 },
        { x: 4.7, y: 3.2, cluster: 0 },
        { x: 4.6, y: 3.1, cluster: 0 },
        { x: 5.0, y: 3.6, cluster: 0 },
        { x: 7.0, y: 3.2, cluster: 1 },
        { x: 6.4, y: 3.2, cluster: 1 },
        { x: 6.9, y: 3.1, cluster: 1 },
        { x: 5.5, y: 2.3, cluster: 1 },
        { x: 6.5, y: 2.8, cluster: 1 },
        { x: 6.3, y: 3.3, cluster: 2 },
        { x: 5.8, y: 2.7, cluster: 2 },
        { x: 7.1, y: 3.0, cluster: 2 },
        { x: 6.3, y: 2.9, cluster: 2 },
        { x: 6.5, y: 3.0, cluster: 2 }
    ];
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
function generateDendrogram(points, linkageMethod, distanceMetric) {
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
                distances[i][j] = calculateDistance(points[i], points[j], distanceMetric);
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

function calculateDistance(point1, point2, metric) {
    switch (metric) {
        case 'euclidean':
            return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
        case 'manhattan':
            return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
        case 'cosine':
            const dot = point1.x * point2.x + point1.y * point2.y;
            const norm1 = Math.sqrt(point1.x ** 2 + point1.y ** 2);
            const norm2 = Math.sqrt(point2.x ** 2 + point2.y ** 2);
            return 1 - (dot / (norm1 * norm2));
        default:
            return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    }
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

// Update cutting visualization
function updateCuttingVisualization() {
    const cutHeight = parseFloat(document.getElementById('cut-height')?.value || 3.5);
    const minClusterSize = parseInt(document.getElementById('min-cluster-size')?.value || 3);
    const maxClusters = parseInt(document.getElementById('max-clusters')?.value || 8);
    const cuttingMethod = document.querySelector('input[name="cutting-method"]:checked')?.value || 'height';
    
    // Update metrics
    updateMetrics(cutHeight, minClusterSize, maxClusters, cuttingMethod);
    
    // Draw cutting visualization
    drawCuttingVisualization(cutHeight);
}

function updateMetrics(cutHeight, minClusterSize, maxClusters, cuttingMethod) {
    // Simulate metrics calculation
    const numClusters = Math.min(Math.floor(cutHeight * 2), maxClusters);
    const silhouetteScore = Math.max(0, 1 - cutHeight * 0.1);
    const daviesBouldin = Math.max(0.5, cutHeight * 0.2);
    const copheneticCorrelation = Math.max(0.6, 1 - cutHeight * 0.05);
    
    // Update metric displays
    const numClustersEl = document.getElementById('num-clusters');
    const silhouetteEl = document.getElementById('silhouette-score');
    const daviesBouldinEl = document.getElementById('davies-bouldin');
    const copheneticEl = document.getElementById('cophenetic-correlation');
    
    if (numClustersEl) numClustersEl.textContent = numClusters;
    if (silhouetteEl) silhouetteEl.textContent = silhouetteScore.toFixed(3);
    if (daviesBouldinEl) daviesBouldinEl.textContent = daviesBouldin.toFixed(3);
    if (copheneticEl) copheneticEl.textContent = copheneticCorrelation.toFixed(3);
}

function drawCuttingVisualization(cutHeight) {
    const svg = document.getElementById('cutting-dendrogram-svg');
    const clustersSvg = document.getElementById('cutting-clusters');
    
    if (svg) {
        // Use shared dendrogram function with cut line
        drawSharedDendrogram('cutting-dendrogram-svg', 3, cutHeight);
    }
    
    if (clustersSvg) {
        // Draw clustered data points on SVG
        clustersSvg.innerHTML = '';
        
        const width = parseInt(clustersSvg.getAttribute('width')) || 700;
        const height = parseInt(clustersSvg.getAttribute('height')) || 300;
        
        // Generate clustered points based on cut height
        const numClusters = Math.min(Math.floor(cutHeight * 2), 8);
        const pointsPerCluster = Math.floor(50 / numClusters);
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        
        for (let cluster = 0; cluster < numClusters; cluster++) {
            const centerX = 50 + (cluster * 50);
            const centerY = 100;
            
            for (let i = 0; i < pointsPerCluster; i++) {
                const x = centerX + (Math.random() - 0.5) * 30;
                const y = centerY + (Math.random() - 0.5) * 30;
                
                // Create SVG circle element
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', 4);
                circle.setAttribute('fill', colors[cluster % colors.length]);
                circle.setAttribute('stroke', '#2c3e50');
                circle.setAttribute('stroke-width', 1);
                
                clustersSvg.appendChild(circle);
            }
        }
    }
}

// Quiz functionality
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'b',
        'q2': 'c', 
        'q3': 'b',
        'q4': 'c',
        'q5': 'b',
        'q6': 'c',
        'q7': 'c',
        'q8': 'b',
        'q9': 'c',
        'q10': 'c',
        'q11': 'b',
        'q12': 'b',
        'q13': 'b',
        'q14': 'b',
        'q15': 'b'
    };

    const explanations = {
        'q1': 'The ultrametric property states that the distance between any two leaves equals the height of their lowest common ancestor, making dendrograms preserve hierarchical distance relationships.',
        'q2': 'In Ward\'s method, heights represent the increase in within-cluster sum of squared errors (ESS) when clusters are merged, providing a statistical interpretation of merge costs.',
        'q3': 'A cophenetic correlation of 0.85 indicates good preservation of original distances, falling in the 0.80-0.90 range which is acceptable for most applications.',
        'q4': 'A bootstrap confidence of 0.65 means the cluster appears in 65% of bootstrap samples, indicating questionable stability that requires additional validation.',
        'q5': 'The gap statistic method identifies the largest gap between consecutive merge heights, suggesting natural breakpoints in the hierarchical structure.',
        'q6': 'The basic dendrogram construction algorithm has O(n³) complexity due to the nested loops for finding minimum distances and updating the distance matrix.',
        'q7': 'Centroid and median linkage can produce non-monotonic heights where child nodes have higher values than their parents, violating the ultrametric property.',
        'q8': 'AU bootstrap corrects for selection bias inherent in hierarchical clustering by extrapolating bootstrap probabilities to eliminate the bias from choosing clusters that optimize the same criterion.',
        'q9': 'Large dendrograms require hierarchical simplification and level-of-detail rendering to maintain readability while preserving important structural information.',
        'q10': 'In phylogenetics, ensuring monophyletic groups cluster together is crucial for biological validity, as these represent true evolutionary relationships.',
        'q11': 'A "Christmas tree" shape indicates one dominant central cluster with many small peripheral branches, suggesting outliers or a few dominant groups.',
        'q12': 'Dynamic tree cutting adapts the cutting height locally based on tree structure, accommodating clusters that exist at different scales within the same dendrogram.',
        'q13': 'The Davies-Bouldin index should be minimized, as it measures the ratio of within-cluster to between-cluster distances (lower values indicate better separation).',
        'q14': 'Bootstrap samples may have different tree topologies, making it challenging to match edges between the original tree and bootstrap trees for confidence calculation.',
        'q15': 'In customer segmentation, segments should be actionable for marketing strategies, meaning they should correspond to distinct customer behaviors that can inform business decisions.'
    };

    // Collect user answers
    let userAnswers = {};
    let score = 0;
    
    for (let i = 1; i <= 15; i++) {
        const questionName = 'q' + i;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        if (selectedOption) {
            userAnswers[questionName] = selectedOption.value;
            if (selectedOption.value === correctAnswers[questionName]) {
                score++;
            }
        }
    }

    // Display results
    const percentage = Math.round((score / 15) * 100);
    let performanceLevel = '';
    
    if (percentage >= 90) {
        performanceLevel = 'Excellent';
    } else if (percentage >= 80) {
        performanceLevel = 'Very Good';
    } else if (percentage >= 70) {
        performanceLevel = 'Good';
    } else if (percentage >= 60) {
        performanceLevel = 'Fair';
    } else {
        performanceLevel = 'Needs Improvement';
    }

    document.getElementById('score-display').innerHTML = 
        `Score: ${score}/15 (${percentage}%) - ${performanceLevel}`;

    // Show detailed results
    let detailedHTML = '<h4>Detailed Results:</h4>';
    for (let i = 1; i <= 15; i++) {
        const questionName = 'q' + i;
        const userAnswer = userAnswers[questionName] || 'Not answered';
        const correctAnswer = correctAnswers[questionName];
        const isCorrect = userAnswer === correctAnswer;
        
        detailedHTML += `
            <div style="background: ${isCorrect ? '#e8f5e8' : '#ffebee'}; border: 1px solid ${isCorrect ? '#4caf50' : '#f44336'}; border-radius: 6px; padding: 1rem; margin: 0.5rem 0;">
                <strong>Question ${i}:</strong> ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                <br><small>Your answer: ${userAnswer} | Correct answer: ${correctAnswer}</small>
                <br><em>${explanations[questionName]}</em>
            </div>
        `;
    }

    document.getElementById('detailed-results').innerHTML = detailedHTML;
    document.getElementById('quiz-results').style.display = 'block';
    
    // Scroll to results
    document.getElementById('quiz-results').scrollIntoView({ behavior: 'smooth' });
}

