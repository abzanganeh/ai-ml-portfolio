// Chapter 5: K-means Clustering Theory JavaScript


// K-means Demo Variables
let kmeansData = [];
let kmeansCentroids = [];
let kmeansAssignments = [];
let kmeansHistory = [];
let currentIteration = 0;
let isRunning = false;

// Demo Functions
function generateDemoData() {
    updateKMeansDemo();
}

function runKmeansDemo() {
    if (kmeansData.length === 0) {
        generateDemoData();
    }
    
    // Run K-means to convergence
    let converged = false;
    let iterations = 0;
    const maxIterations = 50;
    
    while (!converged && iterations < maxIterations) {
        const newAssignments = assignPoints(kmeansData, kmeansCentroids);
        const newCentroids = updateCentroids(kmeansData, newAssignments, kmeansCentroids.length);
        
        // Check convergence
        converged = checkConvergence(kmeansCentroids, newCentroids, newAssignments, kmeansAssignments);
        
        kmeansAssignments = newAssignments;
        kmeansCentroids = newCentroids;
        kmeansHistory.push({
            iteration: iterations,
            wcss: calculateWCSS(kmeansData, kmeansCentroids, kmeansAssignments),
            centroids: kmeansCentroids.map(c => ({...c}))
        });
        
        iterations++;
    }
    
    currentIteration = iterations;
    drawKMeansVisualization();
    drawConvergencePlot();
    updateMetrics();
}

function stepKmeansDemo() {
    if (kmeansData.length === 0) {
        generateDemoData();
        return;
    }
    
    if (currentIteration === 0) {
        // First step - assign points
        kmeansAssignments = assignPoints(kmeansData, kmeansCentroids);
    } else {
        // Update centroids
        kmeansCentroids = updateCentroids(kmeansData, kmeansAssignments, kmeansCentroids.length);
        // Assign points again
        kmeansAssignments = assignPoints(kmeansData, kmeansCentroids);
    }
    
    // Store history
    kmeansHistory.push({
        iteration: currentIteration,
        wcss: calculateWCSS(kmeansData, kmeansCentroids, kmeansAssignments),
        centroids: kmeansCentroids.map(c => ({...c}))
    });
    
    currentIteration++;
    drawKMeansVisualization();
    drawConvergencePlot();
    updateMetrics();
}

function resetDemo() {
    kmeansData = [];
    kmeansCentroids = [];
    kmeansAssignments = [];
    kmeansHistory = [];
    currentIteration = 0;
    
    const canvas = document.getElementById('kmeans-demo-canvas');
    const plot = document.getElementById('convergencePlot');
    const status = document.getElementById('demo-status');
    
    if (canvas) canvas.innerHTML = '<p>Interactive K-means clustering visualization will appear here</p>';
    if (plot) plot.innerHTML = '';
    if (status) status.innerHTML = '<p>Click "Generate Data" to start the demo</p>';
}

function runInitializationDemo() {
    const method = document.getElementById('init-method')?.value || 'random';
    const k = parseInt(document.getElementById('num-clusters-init')?.value || 3);
    
    // Generate sample data
    const data = generateKMeansDataset('blobs');
    
    // Run initialization comparison
    const randomCentroids = initializeCentroids(data, k, 'random');
    const kmeansPlusCentroids = initializeCentroids(data, k, 'kmeans++');
    
    // Draw comparison
    drawInitializationComparison(data, randomCentroids, kmeansPlusCentroids, method);
}

function resetInitializationDemo() {
    const canvas = document.getElementById('initialization-canvas');
    if (canvas) canvas.innerHTML = '<p>Click "Run Demo" to compare different initialization methods</p>';
}

function drawInitializationComparison(data, randomCentroids, kmeansPlusCentroids, method) {
    const canvas = document.getElementById('initialization-canvas');
    if (!canvas) return;
    
    const width = 400;
    const height = 300;
    
    // Clear canvas
    canvas.innerHTML = `
        <svg width="${width}" height="${height}" style="border: 1px solid #ccc; background: white;">
            <g id="init-plot"></g>
        </svg>
    `;
    
    const svg = canvas.querySelector('svg');
    const g = svg.querySelector('#init-plot');
    
    // Scale data to fit canvas
    const margin = 40;
    const plotWidth = width - 2 * margin;
    const plotHeight = height - 2 * margin;
    
    // Find data bounds
    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    const xScale = plotWidth / (xMax - xMin);
    const yScale = plotHeight / (yMax - yMin);
    
    // Draw data points
    data.forEach(point => {
        const x = margin + (point.x - xMin) * xScale;
        const y = margin + (yMax - point.y) * yScale;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', '#666');
        circle.setAttribute('opacity', '0.6');
        g.appendChild(circle);
    });
    
    // Draw centroids based on selected method
    const centroids = method === 'random' ? randomCentroids : kmeansPlusCentroids;
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    
    centroids.forEach((centroid, i) => {
        const x = margin + (centroid.x - xMin) * xScale;
        const y = margin + (yMax - centroid.y) * yScale;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 8);
        circle.setAttribute('fill', colors[i % colors.length]);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        g.appendChild(circle);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 20);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.textContent = `${method.charAt(0).toUpperCase() + method.slice(1)} Initialization (k=${k})`;
    g.appendChild(title);
}

function updateKMeansDemo() {
    const k = parseInt(document.getElementById('demo-clusters')?.value || 3);
    const initMethod = document.getElementById('demo-init')?.value || 'random';
    const dataset = document.getElementById('demo-data')?.value || 'blobs';
    const maxIter = 10;
    
    // Update displays
    const kDisplay = document.getElementById('demo-clusters-display');
    if (kDisplay) kDisplay.textContent = k;
    
    // Generate new data
    kmeansData = generateKMeansDataset(dataset);
    
    // Initialize centroids
    kmeansCentroids = initializeCentroids(kmeansData, k, initMethod);
    kmeansAssignments = new Array(kmeansData.length).fill(0);
    kmeansHistory = [];
    currentIteration = 0;
    
    // Update visualization
    drawKMeansVisualization();
    drawConvergencePlot();
    updateMetrics();
}

function generateKMeansDataset(type) {
    const data = [];
    const n = 100;
    
    switch(type) {
        case 'blobs':
            for (let i = 0; i < n; i++) {
                const cluster = Math.floor(Math.random() * 3);
                const centerX = [100, 300, 200][cluster];
                const centerY = [100, 100, 250][cluster];
                data.push({
                    x: centerX + (Math.random() - 0.5) * 60,
                    y: centerY + (Math.random() - 0.5) * 60
                });
            }
            break;
        case 'moons':
            for (let i = 0; i < n; i++) {
                const angle = Math.random() * Math.PI;
                const radius = 50 + Math.random() * 20;
                const x = 200 + Math.cos(angle) * radius;
                const y = 150 + Math.sin(angle) * radius + (Math.random() - 0.5) * 20;
                data.push({x, y});
            }
            break;
        default:
            for (let i = 0; i < n; i++) {
                data.push({
                    x: Math.random() * 400,
                    y: Math.random() * 300
                });
            }
    }
    
    return data;
}

function initializeCentroids(data, k, method) {
    const centroids = [];
    
    if (method === 'kmeans++') {
        centroids.push(data[Math.floor(Math.random() * data.length)]);
        
        for (let i = 1; i < k; i++) {
            const distances = data.map(point => {
                const minDist = Math.min(...centroids.map(centroid => 
                    Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2)
                ));
                return minDist ** 2;
            });
            
            const totalDist = distances.reduce((sum, dist) => sum + dist, 0);
            let random = Math.random() * totalDist;
            
            for (let j = 0; j < data.length; j++) {
                random -= distances[j];
                if (random <= 0) {
                    centroids.push(data[j]);
                    break;
                }
            }
        }
    } else {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        for (let i = 0; i < k; i++) {
            centroids.push({...shuffled[i]});
        }
    }
    
    return centroids;
}

function assignPoints() {
    kmeansAssignments = kmeansData.map(point => {
        let minDist = Infinity;
        let closestCentroid = 0;
        
        kmeansCentroids.forEach((centroid, index) => {
            if (centroid && !isNaN(centroid.x) && !isNaN(centroid.y) && !isNaN(point.x) && !isNaN(point.y)) {
                const dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2);
                if (!isNaN(dist) && dist < minDist) {
                    minDist = dist;
                    closestCentroid = index;
                }
            }
        });
        
        return closestCentroid;
    });
}

function updateCentroids() {
    const k = kmeansCentroids.length;
    const newCentroids = [];
    
    for (let i = 0; i < k; i++) {
        const clusterPoints = kmeansData.filter((_, index) => kmeansAssignments[index] === i);
        
        if (clusterPoints.length > 0) {
            const avgX = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
            const avgY = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
            // Validate that averages are not NaN
            if (!isNaN(avgX) && !isNaN(avgY)) {
                newCentroids.push({x: avgX, y: avgY});
            } else {
                newCentroids.push({...kmeansCentroids[i]});
            }
        } else {
            newCentroids.push({...kmeansCentroids[i]});
        }
    }
    
    kmeansCentroids = newCentroids;
}

function calculateWCSS() {
    let wcss = 0;
    kmeansData.forEach((point, index) => {
        const centroid = kmeansCentroids[kmeansAssignments[index]];
        if (centroid && !isNaN(centroid.x) && !isNaN(centroid.y) && !isNaN(point.x) && !isNaN(point.y)) {
            wcss += (point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2;
        }
    });
    return isNaN(wcss) ? 0 : wcss;
}

function stepKmeansDemo() {
    if (currentIteration >= 10) { // Default max iterations
        return;
    }
    
    assignPoints();
    updateCentroids();
    
    const wcss = calculateWCSS();
    kmeansHistory.push({
        iteration: currentIteration + 1,
        wcss: wcss,
        centroids: kmeansCentroids.map(c => ({...c}))
    });
    
    currentIteration++;
    
    drawKMeansVisualization();
    drawConvergencePlot();
    updateMetrics();
}


function generateDemoData() {
    updateKMeansDemo();
}

function runInitializationDemo() {
    // Run initialization comparison demo
    const canvas = document.getElementById('initialization-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Initialization demo visualization would appear here</p>';
    }
}

function resetInitializationDemo() {
    // Reset initialization demo
    const canvas = document.getElementById('initialization-canvas');
    if (canvas) {
        canvas.innerHTML = '<p>Click "Run Demo" to see initialization comparison</p>';
    }
}

function runKmeansDemo() {
    if (isRunning) return;
    
    isRunning = true;
    const maxIter = 10; // Default max iterations
    
    const runStep = () => {
        if (currentIteration < maxIter && isRunning) {
            stepKmeansDemo();
            setTimeout(runStep, 500);
        } else {
            isRunning = false;
        }
    };
    
    runStep();
}

function resetDemo() {
    resetKMeansDemo();
}

function resetKMeansDemo() {
    isRunning = false;
    currentIteration = 0;
    kmeansHistory = [];
    updateKMeansDemo();
}

function drawKMeansVisualization() {
    const container = document.getElementById('kmeans-demo-canvas');
    if (!container) {
        console.error('Element kmeans-demo-canvas not found');
        return;
    }
    container.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.setAttribute('style', 'border: 1px solid #ccc; background: white;');
    container.appendChild(svg);
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    
    // Draw data points
    kmeansData.forEach((point, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', colors[kmeansAssignments[index]] || '#666');
        circle.setAttribute('opacity', 0.7);
        svg.appendChild(circle);
    });
    
    // Draw centroids
    kmeansCentroids.forEach((centroid, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', centroid.x);
        circle.setAttribute('cy', centroid.y);
        circle.setAttribute('r', 8);
        circle.setAttribute('fill', colors[index] || '#666');
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', 2);
        svg.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', centroid.x);
        text.setAttribute('y', centroid.y - 12);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', '#333');
        text.textContent = `C${index + 1}`;
        svg.appendChild(text);
    });
}

function drawConvergencePlot() {
    const container = document.getElementById('convergencePlot');
    if (!container) {
        console.error('Element convergencePlot not found');
        return;
    }
    
    // Show the convergence plot container
    container.style.display = 'block';
    container.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '200');
    svg.setAttribute('style', 'border: 1px solid #ccc; background: white;');
    container.appendChild(svg);
    
    if (kmeansHistory.length === 0) return;
    
    const width = 400;
    const height = 200;
    const margin = 40;
    
    const wcssValues = kmeansHistory.map(h => h.wcss).filter(wcss => !isNaN(wcss) && isFinite(wcss));
    if (wcssValues.length === 0) return; // No valid WCSS values
    
    const maxWCSS = Math.max(...wcssValues);
    const minWCSS = Math.min(...wcssValues);
    const range = maxWCSS - minWCSS;
    
    // Handle edge case where all WCSS values are the same
    const effectiveRange = range === 0 ? 1 : range;
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin);
    xAxis.setAttribute('y1', height - margin);
    xAxis.setAttribute('x2', width - margin);
    xAxis.setAttribute('y2', height - margin);
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', 2);
    svg.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin);
    yAxis.setAttribute('y1', margin);
    yAxis.setAttribute('x2', margin);
    yAxis.setAttribute('y2', height - margin);
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', 2);
    svg.appendChild(yAxis);
    
    // Draw convergence line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = '';
    
    kmeansHistory.forEach((point, index) => {
        const x = margin + (kmeansHistory.length === 1 ? 0 : (index / (kmeansHistory.length - 1))) * (width - 2 * margin);
        const y = height - margin - ((point.wcss - minWCSS) / effectiveRange) * (height - 2 * margin);
        
        if (index === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });
    
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#4ECDC4');
    path.setAttribute('stroke-width', 3);
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    
    // Draw points
    kmeansHistory.forEach((point, index) => {
        const x = margin + (kmeansHistory.length === 1 ? 0 : (index / (kmeansHistory.length - 1))) * (width - 2 * margin);
        const y = height - margin - ((point.wcss - minWCSS) / effectiveRange) * (height - 2 * margin);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', '#4ECDC4');
        svg.appendChild(circle);
    });
}

function updateMetrics() {
    const iterationElement = document.getElementById('iterations-value');
    if (iterationElement) {
        iterationElement.textContent = currentIteration;
    }
    
    const wcssElement = document.getElementById('wcss-value');
    if (wcssElement) {
        if (kmeansHistory.length > 0) {
            const currentWCSS = kmeansHistory[kmeansHistory.length - 1].wcss;
            wcssElement.textContent = currentWCSS.toFixed(2);
        } else {
            wcssElement.textContent = '-';
        }
    }
    
    // Update silhouette (proper calculation)
    const silhouetteElement = document.getElementById('silhouette-value');
    if (silhouetteElement) {
        if (kmeansData.length > 0 && kmeansAssignments.length > 0) {
            const silhouette = calculateSilhouetteScore();
            silhouetteElement.textContent = silhouette.toFixed(3);
        } else {
            silhouetteElement.textContent = '-';
        }
    }
    
    // Show metrics container
    const metricsContainer = document.getElementById('demo-metrics');
    if (metricsContainer) {
        metricsContainer.style.display = 'block';
    }
}

// Quiz Functions
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'b', // Within-cluster sum of squares
        'q2': 'b', // Assignment and update
        'q3': 'a', // Monotonic decrease of objective function
        'q4': 'b', // O(nk)
        'q5': 'a'  // The objective function is non-convex
    };
    
    const explanations = {
        'q1': 'K-means minimizes the within-cluster sum of squares (WCSS), which measures the total squared distance of all points from their cluster centroids.',
        'q2': 'Lloyd\'s algorithm alternates between two steps: assignment (assigning points to nearest centroids) and update (recalculating centroids).',
        'q3': 'K-means is guaranteed to converge because the objective function (WCSS) decreases monotonically with each iteration and is bounded below.',
        'q4': 'Each iteration requires O(nk) operations: O(nk) for assignment step and O(n) for update step, where n is the number of points and k is the number of clusters.',
        'q5': 'K-means can converge to local minima because the objective function is non-convex, meaning there can be multiple local optima.'
    };
    
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;
    let results = '';
    
    Object.keys(correctAnswers).forEach(questionId => {
        const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
        const isCorrect = selectedAnswer && selectedAnswer.value === correctAnswers[questionId];
        
        if (isCorrect) {
            score++;
        }
        
        results += `
            <div class="quiz-result-item ${isCorrect ? 'correct' : 'incorrect'}">
                <h5>Question ${questionId.charAt(1)}: ${isCorrect ? 'Correct' : 'Incorrect'}</h5>
                <p><strong>Your answer:</strong> ${selectedAnswer ? selectedAnswer.value.toUpperCase() : 'No answer'}</p>
                <p><strong>Correct answer:</strong> ${correctAnswers[questionId].toUpperCase()}</p>
                <p><strong>Explanation:</strong> ${explanations[questionId]}</p>
            </div>
        `;
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    const scoreDisplay = `
        <div class="quiz-score">
            <h3>Your Score: ${score}/${totalQuestions} (${percentage}%)</h3>
            <p>${percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep studying!'}</p>
        </div>
    `;
    
    document.getElementById('quizScore').innerHTML = scoreDisplay;
    document.getElementById('quizExplanations').innerHTML = results;
    document.getElementById('quizResults').style.display = 'block';
}

function calculateSilhouetteScore() {
    if (kmeansData.length === 0 || kmeansAssignments.length === 0) {
        return 0;
    }
    
    const numClusters = kmeansCentroids.length;
    if (numClusters <= 1) return 0;
    
    let totalSilhouette = 0;
    let validPoints = 0;
    
    for (let i = 0; i < kmeansData.length; i++) {
        const point = kmeansData[i];
        const clusterIndex = kmeansAssignments[i];
        
        // Calculate average distance to points in same cluster (a_i)
        let sameClusterDist = 0;
        let sameClusterCount = 0;
        
        for (let j = 0; j < kmeansData.length; j++) {
            if (i !== j && kmeansAssignments[j] === clusterIndex) {
                const dist = Math.sqrt((point.x - kmeansData[j].x) ** 2 + (point.y - kmeansData[j].y) ** 2);
                sameClusterDist += dist;
                sameClusterCount++;
            }
        }
        
        const a_i = sameClusterCount > 0 ? sameClusterDist / sameClusterCount : 0;
        
        // Calculate minimum average distance to points in other clusters (b_i)
        let minOtherClusterDist = Infinity;
        
        for (let k = 0; k < numClusters; k++) {
            if (k !== clusterIndex) {
                let otherClusterDist = 0;
                let otherClusterCount = 0;
                
                for (let j = 0; j < kmeansData.length; j++) {
                    if (kmeansAssignments[j] === k) {
                        const dist = Math.sqrt((point.x - kmeansData[j].x) ** 2 + (point.y - kmeansData[j].y) ** 2);
                        otherClusterDist += dist;
                        otherClusterCount++;
                    }
                }
                
                if (otherClusterCount > 0) {
                    const avgDist = otherClusterDist / otherClusterCount;
                    minOtherClusterDist = Math.min(minOtherClusterDist, avgDist);
                }
            }
        }
        
        const b_i = minOtherClusterDist === Infinity ? 0 : minOtherClusterDist;
        
        // Calculate silhouette score for this point
        if (Math.max(a_i, b_i) > 0) {
            const s_i = (b_i - a_i) / Math.max(a_i, b_i);
            totalSilhouette += s_i;
            validPoints++;
        }
    }
    
    return validPoints > 0 ? totalSilhouette / validPoints : 0;
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateKMeansDemo();
    
    // Initialize range slider event listeners
    const clustersSlider = document.getElementById('demo-clusters');
    if (clustersSlider) {
        clustersSlider.addEventListener('input', function() {
            document.getElementById('demo-clusters-display').textContent = this.value;
        });
    }
});