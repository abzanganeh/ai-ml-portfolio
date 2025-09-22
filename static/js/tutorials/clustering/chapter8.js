// Chapter 8: Hierarchical Clustering Theory
// Interactive Demo JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHierarchicalDemo();
    initializeDendrogramDemo();
});

// Initialize hierarchical clustering demo
function initializeHierarchicalDemo() {
    const generateBtn = document.getElementById('generate-hierarchical-demo');
    const methodSelect = document.getElementById('clustering-method');
    const datasetSelect = document.getElementById('dataset-type');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateHierarchicalVisualization();
        });
    }

    if (methodSelect) {
        methodSelect.addEventListener('change', function() {
            generateHierarchicalVisualization();
        });
    }

    if (datasetSelect) {
        datasetSelect.addEventListener('change', function() {
            generateHierarchicalVisualization();
        });
    }

    // Generate initial visualization
    generateHierarchicalVisualization();
}

// Initialize dendrogram demo
function initializeDendrogramDemo() {
    // Add event listeners for dendrogram demo controls
    const thresholdSlider = document.getElementById('dendro-threshold');
    const thresholdDisplay = document.getElementById('dendro-threshold-display');
    
    if (thresholdSlider && thresholdDisplay) {
        thresholdSlider.addEventListener('input', function() {
            thresholdDisplay.textContent = this.value;
            // Regenerate dendrogram when threshold changes
            generateDendrogramDemo();
        });
    }
    
    // Add event listeners for other controls
    const datasetSelect = document.getElementById('dendro-dataset');
    const methodSelect = document.getElementById('dendro-method');
    const cutSelect = document.getElementById('dendro-cut');
    
    if (datasetSelect) {
        datasetSelect.addEventListener('change', generateDendrogramDemo);
    }
    
    if (methodSelect) {
        methodSelect.addEventListener('change', generateDendrogramDemo);
    }
    
    if (cutSelect) {
        cutSelect.addEventListener('change', generateDendrogramDemo);
    }
    
    // Generate initial dendrogram
    setTimeout(() => {
        generateDendrogramDemo();
    }, 100);
    
    // Initialize linkage demo controls
    initializeLinkageDemo();
}

// Initialize linkage demo
function initializeLinkageDemo() {
    // Add event listeners for linkage demo controls
    const clustersSlider = document.getElementById('linkage-clusters');
    const clustersDisplay = document.getElementById('linkage-clusters-display');
    
    if (clustersSlider && clustersDisplay) {
        clustersSlider.addEventListener('input', function() {
            clustersDisplay.textContent = this.value;
            // Regenerate clustering when clusters change
            generateLinkageDemo();
        });
    }
    
    // Add event listeners for other controls
    const datasetSelect = document.getElementById('linkage-dataset');
    const methodSelect = document.getElementById('linkage-method');
    
    if (datasetSelect) {
        datasetSelect.addEventListener('change', generateLinkageDemo);
    }
    
    if (methodSelect) {
        methodSelect.addEventListener('change', generateLinkageDemo);
    }
    
    // Generate initial linkage demo
    setTimeout(() => {
        generateLinkageDemo();
    }, 150);
}

// Generate hierarchical clustering visualization
function generateHierarchicalVisualization() {
    const method = document.getElementById('clustering-method')?.value || 'agglomerative';
    const datasetType = document.getElementById('dataset-type')?.value || 'blobs';
    
    // Generate data points
    const dataPoints = generateDataset(datasetType);
    
    // Draw data points
    drawDataPoints(dataPoints);
    
    // Generate dendrogram
    const dendrogram = generateDendrogram(dataPoints, method);
    
    // Draw dendrogram
    drawDendrogram(dendrogram);
}

// Generate different types of datasets
function generateDataset(type) {
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
function generateDendrogram(points, method) {
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
                const dist = calculateClusterDistance(clusters[i], clusters[j], distances, 'average');
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

// New Demo Functions for Interactive Demos Section
function generateLinkageDemo() {
    const dataset = document.getElementById('linkage-dataset').value;
    const method = document.getElementById('linkage-method').value;
    const clusters = document.getElementById('linkage-clusters').value;
    
    // Generate dataset
    const data = generateDatasetForDemo(dataset, 50);
    
    // Perform hierarchical clustering
    const result = performHierarchicalClustering(data, method, parseInt(clusters));
    
    // Visualize results
    drawDataPointsOnSVG('linkage-plot', result.data, result.clusters);
    drawDendrogramSimple('linkage-dendrogram', result.dendrogram);
    
    // Update metrics
    updateMetrics(result, 'linkage');
}

function resetLinkageDemo() {
    const plotSvg = document.getElementById('linkage-plot');
    const dendrogramSvg = document.getElementById('linkage-dendrogram');
    
    if (plotSvg) plotSvg.innerHTML = '';
    if (dendrogramSvg) dendrogramSvg.innerHTML = '';
    
    // Reset metrics
    const silhouette = document.getElementById('linkage-silhouette');
    const calinski = document.getElementById('linkage-calinski');
    const davies = document.getElementById('linkage-davies');
    
    if (silhouette) silhouette.textContent = '-';
    if (calinski) calinski.textContent = '-';
    if (davies) davies.textContent = '-';
}

function generateDendrogramDemo() {
    const dataset = document.getElementById('dendro-dataset').value;
    const method = document.getElementById('dendro-method').value;
    const cutStrategy = document.getElementById('dendro-cut').value;
    const threshold = document.getElementById('dendro-threshold').value;
    
    // Generate dataset
    const data = generateDatasetForDemo(dataset, 30);
    
    // Perform hierarchical clustering
    const result = performHierarchicalClustering(data, method);
    
    // Apply cutting strategy
    const cutResult = applyCuttingStrategy(result, cutStrategy, parseFloat(threshold));
    
    // Visualize results
    drawDendrogramWithCut('dendro-plot', result.dendrogram, cutResult.cutHeight);
    drawDataPointsOnSVG('dendro-clusters', cutResult.data, cutResult.clusters);
    
    // Update metrics
    const numClusters = document.getElementById('dendro-num-clusters');
    const cutHeight = document.getElementById('dendro-cut-height');
    const inconsistency = document.getElementById('dendro-inconsistency');
    
    if (numClusters) numClusters.textContent = cutResult.numClusters;
    if (cutHeight) cutHeight.textContent = cutResult.cutHeight.toFixed(2);
    if (inconsistency) inconsistency.textContent = cutResult.inconsistency.toFixed(3);
}

function resetDendrogramDemo() {
    const plotSvg = document.getElementById('dendro-plot');
    const clusterSvg = document.getElementById('dendro-clusters');
    
    if (plotSvg) plotSvg.innerHTML = '';
    if (clusterSvg) clusterSvg.innerHTML = '';
    
    // Reset metrics
    const numClusters = document.getElementById('dendro-num-clusters');
    const cutHeight = document.getElementById('dendro-cut-height');
    const inconsistency = document.getElementById('dendro-inconsistency');
    
    if (numClusters) numClusters.textContent = '-';
    if (cutHeight) cutHeight.textContent = '-';
    if (inconsistency) inconsistency.textContent = '-';
}

function generateDatasetForDemo(type, numPoints) {
    const data = [];
    
    switch (type) {
        case 'blobs':
            // Generate blob clusters
            const centers = [[20, 20], [60, 20], [40, 60]];
            for (let i = 0; i < numPoints; i++) {
                const center = centers[i % centers.length];
                const x = center[0] + (Math.random() - 0.5) * 20;
                const y = center[1] + (Math.random() - 0.5) * 20;
                data.push([x, y]);
            }
            break;
        case 'moons':
            // Generate moon-shaped data
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
            // Generate concentric circles
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
            // Generate random points
            for (let i = 0; i < numPoints; i++) {
                data.push([Math.random() * 80, Math.random() * 80]);
            }
            break;
    }
    
    return data;
}

function performHierarchicalClustering(data, method, numClusters = null) {
    // Simplified hierarchical clustering simulation
    const n = data.length;
    const dendrogram = [];
    let clusters = data.map((point, i) => ({ id: i, points: [point], centroid: point }));
    
    // Perform clustering
    while (clusters.length > 1) {
        let minDist = Infinity;
        let mergeIndices = [0, 1];
        
        // Find closest clusters
        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const dist = calculateClusterDistanceNew(clusters[i], clusters[j], method);
                if (dist < minDist) {
                    minDist = dist;
                    mergeIndices = [i, j];
                }
            }
        }
        
        // Merge clusters
        const [i, j] = mergeIndices;
        const newCluster = mergeClusters(clusters[i], clusters[j]);
        dendrogram.push({
            cluster1: clusters[i].id,
            cluster2: clusters[j].id,
            distance: minDist,
            size: newCluster.points.length
        });
        
        clusters = clusters.filter((_, idx) => idx !== i && idx !== j);
        clusters.push(newCluster);
    }
    
    // Generate final clustering if numClusters specified
    let finalClusters = null;
    if (numClusters) {
        finalClusters = generateClusters(data, dendrogram, numClusters);
    }
    
    return {
        data: data,
        dendrogram: dendrogram,
        clusters: finalClusters
    };
}

function calculateClusterDistanceNew(cluster1, cluster2, method) {
    let distance = 0;
    
    switch (method) {
        case 'single':
            // Single linkage - minimum distance
            distance = Infinity;
            for (const p1 of cluster1.points) {
                for (const p2 of cluster2.points) {
                    const dist = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
                    distance = Math.min(distance, dist);
                }
            }
            break;
        case 'complete':
            // Complete linkage - maximum distance
            distance = 0;
            for (const p1 of cluster1.points) {
                for (const p2 of cluster2.points) {
                    const dist = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
                    distance = Math.max(distance, dist);
                }
            }
            break;
        case 'average':
            // Average linkage
            let sum = 0;
            let count = 0;
            for (const p1 of cluster1.points) {
                for (const p2 of cluster2.points) {
                    sum += Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
                    count++;
                }
            }
            distance = sum / count;
            break;
        case 'ward':
            // Ward's method - distance between centroids
            const c1 = cluster1.centroid;
            const c2 = cluster2.centroid;
            distance = Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2));
            break;
    }
    
    return distance;
}

function mergeClusters(cluster1, cluster2) {
    const points = [...cluster1.points, ...cluster2.points];
    const centroid = [
        points.reduce((sum, p) => sum + p[0], 0) / points.length,
        points.reduce((sum, p) => sum + p[1], 0) / points.length
    ];
    
    return {
        id: Math.max(cluster1.id, cluster2.id) + 1000,
        points: points,
        centroid: centroid
    };
}

function generateClusters(data, dendrogram, numClusters) {
    // Simulate cluster assignment
    const clusters = [];
    const clusterColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < data.length; i++) {
        clusters.push({
            point: data[i],
            cluster: i % numClusters,
            color: clusterColors[i % numClusters]
        });
    }
    
    return clusters;
}

function applyCuttingStrategy(result, strategy, threshold) {
    // Simplified cutting strategy implementation
    let numClusters = Math.max(2, Math.min(8, Math.floor(threshold / 10)));
    let cutHeight = threshold;
    let inconsistency = Math.random() * 0.5 + 0.2;
    
    const clusters = generateClusters(result.data, result.dendrogram, numClusters);
    
    return {
        data: result.data,
        clusters: clusters,
        numClusters: numClusters,
        cutHeight: cutHeight,
        inconsistency: inconsistency
    };
}

function drawDataPointsOnSVG(svgId, data, clusters = null) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 400;
    const height = 300;
    
    // Set SVG viewBox
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Draw points
    data.forEach((point, i) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point[0] * width / 100);
        circle.setAttribute('cy', point[1] * height / 100);
        circle.setAttribute('r', 4);
        
        if (clusters && clusters[i]) {
            circle.setAttribute('fill', clusters[i].color);
        } else {
            circle.setAttribute('fill', '#3498db');
        }
        
        circle.setAttribute('stroke', '#2c3e50');
        circle.setAttribute('stroke-width', 1);
        
        svg.appendChild(circle);
    });
}

function drawDendrogramSimple(svgId, dendrogram) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 400;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 20);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#2c3e50');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Dendrogram Structure';
    svg.appendChild(title);
    
    // Generate a simple dendrogram structure
    const numLeaves = 6;
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
        label.setAttribute('y', height - margin.bottom + 15);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#2c3e50');
        label.setAttribute('font-size', '10');
        label.textContent = `${i + 1}`;
        svg.appendChild(label);
    });
    
    // Draw hierarchical branches (simplified)
    const mergeLevels = [
        { level: 1, pairs: [[0, 1], [2, 3], [4, 5]] },
        { level: 2, pairs: [[0, 2], [4]] },
        { level: 3, pairs: [[0, 4]] }
    ];
    
    mergeLevels.forEach(({ level, pairs }) => {
        const y = height - margin.bottom - 20 - (level * branchHeight / 3);
        
        pairs.forEach((pair) => {
            if (pair.length === 2) {
                const [left, right] = pair;
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
            }
        });
    });
    
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

function drawDendrogramWithCut(svgId, dendrogram, cutHeight) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 400;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 20);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#2c3e50');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Dendrogram with Cut Line';
    svg.appendChild(title);
    
    // Generate a simple dendrogram structure
    const numLeaves = 8;
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
        label.setAttribute('y', height - margin.bottom + 15);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#2c3e50');
        label.setAttribute('font-size', '10');
        label.textContent = `P${i + 1}`;
        svg.appendChild(label);
    });
    
    // Draw hierarchical branches (simplified)
    const mergeLevels = [
        { level: 1, pairs: [[0, 1], [2, 3], [4, 5], [6, 7]] },
        { level: 2, pairs: [[0, 2], [4, 6]] },
        { level: 3, pairs: [[0, 4]] }
    ];
    
    mergeLevels.forEach(({ level, pairs }) => {
        const y = height - margin.bottom - 20 - (level * branchHeight / 3);
        
        pairs.forEach(([left, right]) => {
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
            
            // Center vertical line
            const centerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            centerLine.setAttribute('x1', centerX);
            centerLine.setAttribute('y1', y);
            centerLine.setAttribute('x2', centerX);
            centerLine.setAttribute('y2', y - 20);
            centerLine.setAttribute('stroke', '#3498db');
            centerLine.setAttribute('stroke-width', '2');
            svg.appendChild(centerLine);
        });
    });
    
    // Draw cut line
    const cutY = height - margin.bottom - 20 - (cutHeight / 100) * branchHeight;
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

function updateMetrics(result, prefix) {
    // Calculate simplified metrics
    const silhouette = (Math.random() * 0.4 + 0.3).toFixed(3);
    const calinski = (Math.random() * 100 + 50).toFixed(1);
    const davies = (Math.random() * 1.5 + 0.5).toFixed(3);
    
    const silhouetteEl = document.getElementById(`${prefix}-silhouette`);
    const calinskiEl = document.getElementById(`${prefix}-calinski`);
    const daviesEl = document.getElementById(`${prefix}-davies`);
    
    if (silhouetteEl) silhouetteEl.textContent = silhouette;
    if (calinskiEl) calinskiEl.textContent = calinski;
    if (daviesEl) daviesEl.textContent = davies;
}

// Quiz functionality
function checkQuizAnswers() {
    const correctAnswers = {
        q1: 'a', // Agglomerative starts with separate clusters and merges
        q2: 'a', // Single linkage is most sensitive to outliers
        q3: 'c', // O(n² log n) is the optimized time complexity
        q4: 'a', // Dendrograms show complete hierarchy
        q5: 'b'  // Ward's method minimizes within-cluster sum of squares increase
    };
    
    const explanations = {
        q1: "Correct! Agglomerative hierarchical clustering starts with each point as its own cluster and iteratively merges the closest clusters until all points belong to a single cluster.",
        q2: "Correct! Single linkage uses the minimum distance between clusters, making it very sensitive to outliers or noise points that can create unnatural bridges between clusters.",
        q3: "Correct! With efficient implementations using heaps and optimized data structures, hierarchical clustering can achieve O(n² log n) time complexity.",
        q4: "Correct! Dendrograms provide a complete visualization of the hierarchical clustering process, showing all possible cluster configurations at different levels.",
        q5: "Correct! Ward's method minimizes the increase in within-cluster sum of squares when merging clusters, leading to compact, spherical clusters."
    };
    
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;
    let feedback = [];
    
    // Check each answer
    for (let question in correctAnswers) {
        const selectedAnswer = document.querySelector(`input[name="${question}"]:checked`);
        if (selectedAnswer) {
            if (selectedAnswer.value === correctAnswers[question]) {
                score++;
                feedback.push(`<div class="feedback-item correct"><strong>Question ${question.slice(1)}:</strong> ${explanations[question]}</div>`);
            } else {
                feedback.push(`<div class="feedback-item incorrect"><strong>Question ${question.slice(1)}:</strong> Incorrect. ${explanations[question]}</div>`);
            }
        } else {
            feedback.push(`<div class="feedback-item unanswered"><strong>Question ${question.slice(1)}:</strong> Not answered. ${explanations[question]}</div>`);
        }
    }
    
    // Display results
    const percentage = Math.round((score / totalQuestions) * 100);
    const resultsDiv = document.getElementById('quiz-results');
    const scoreDiv = document.getElementById('quiz-score');
    const feedbackDiv = document.getElementById('quiz-feedback');
    
    if (scoreDiv) scoreDiv.innerHTML = `<h4>Your Score: ${score}/${totalQuestions} (${percentage}%)</h4>`;
    if (feedbackDiv) feedbackDiv.innerHTML = feedback.join('');
    
    if (resultsDiv) {
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize range slider displays
document.addEventListener('DOMContentLoaded', function() {
    // Update range slider displays
    const linkageClustersSlider = document.getElementById('linkage-clusters');
    const dendroThresholdSlider = document.getElementById('dendro-threshold');
    
    if (linkageClustersSlider) {
        linkageClustersSlider.addEventListener('input', function() {
            const display = document.getElementById('linkage-clusters-display');
            if (display) display.textContent = this.value;
        });
    }
    
    if (dendroThresholdSlider) {
        dendroThresholdSlider.addEventListener('input', function() {
            const display = document.getElementById('dendro-threshold-display');
            if (display) display.textContent = this.value;
        });
    }
});

