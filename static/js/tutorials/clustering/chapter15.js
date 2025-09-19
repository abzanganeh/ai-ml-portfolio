// Chapter 15: Advanced Topics & Applications - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 15: Advanced Topics & Applications loaded');
    
    // Initialize with default section
    showSection('algorithm');
    updateSubSectionNavigation(['algorithm', 'mathematics', 'optimization', 'convergence', 'demo', 'quiz'], 0);
});

// Section navigation functionality
function showSection(sectionName, clickedElement) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.section-nav button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
}

// Quiz functionality
function checkQuizAnswers() {
    const correctAnswers = {
        'q1': 'b', 'q2': 'c', 'q3': 'b', 'q4': 'b', 'q5': 'b',
        'q6': 'b', 'q7': 'c', 'q8': 'b', 'q9': 'b', 'q10': 'b',
        'q11': 'b', 'q12': 'b', 'q13': 'b', 'q14': 'b', 'q15': 'b',
        'q16': 'b', 'q17': 'b', 'q18': 'b', 'q19': 'b', 'q20': 'a',
        'q21': 'b', 'q22': 'b', 'q23': 'b', 'q24': 'b', 'q25': 'b',
        'q26': 'a', 'q27': 'a', 'q28': 'a', 'q29': 'a', 'q30': 'b',
        'q31': 'a', 'q32': 'b', 'q33': 'b', 'q34': 'b', 'q35': 'b'
    };

    const explanations = {
        'q1': 'Euclidean distance measures straight-line distance, while Manhattan distance measures grid-based distance. Manhattan is preferred when movement is constrained to grid-like paths or when features have different units/scales.',
        'q2': 'K-means complexity is O(nkti) where n=number of samples, k=number of clusters, t=number of iterations, i=number of dimensions.',
        'q3': 'A gradual decline without a clear elbow suggests the data may not have well-defined natural clusters, or has hierarchical/nested cluster structure.',
        'q4': 'Setting eps too small means fewer points will be within the neighborhood radius, leading to most points being classified as noise/outliers.',
        'q5': 'Ward linkage minimizes within-cluster sum of squared errors and tends to create compact clusters while avoiding the chaining effect.',
        'q6': 'GMM assumes each cluster follows a Gaussian distribution with its own covariance matrix, allowing for elliptical cluster shapes.',
        'q7': 'Adjusted Rand Index (ARI) compares clustering results with ground truth labels to measure agreement.',
        'q8': 'K-means uses Euclidean distance, so features with larger scales will dominate the distance calculation, leading to biased results.',
        'q9': 'DBSCAN is ideal because it doesn\'t require pre-specifying k, can handle varying densities, and is reasonably scalable.',
        'q10': 'In high dimensions, the curse of dimensionality causes all pairwise distances to become similar, making distance-based similarity less meaningful.',
        'q11': 'Effective customer segmentation requires behavioral and transactional features that reflect purchasing patterns and customer value.',
        'q12': 'K-means tends to create clusters of similar sizes due to its objective function, struggling when natural clusters have very different sizes.',
        'q13': 'K-means\' random initialization can lead to different local optima. K-means++ initialization and multiple runs help achieve consistency.',
        'q14': 'Spectral clustering uses eigenvalue decomposition of similarity matrices to project data into lower-dimensional space where clusters are more separable.',
        'q15': 'For very large datasets, traditional algorithms become impractical. Mini-batch K-means or distributed frameworks are necessary.',
        'q16': 'Dynamic Time Warping (DTW) allows elastic matching of time series, handling phase shifts while preserving shape similarity.',
        'q17': 'Deep clustering jointly optimizes representation learning and clustering, potentially discovering better cluster structures.',
        'q18': 'Business success should be measured by actionable outcomes like improved campaign performance or operational efficiency.',
        'q19': 'Ensemble clustering combines multiple clustering results to improve robustness, stability, and often quality.',
        'q20': 'K-means requires computing cluster centroids as the mean of member points, but the mean is undefined for categorical variables.',
        'q21': 'Modularity measures how much more connected nodes within communities are compared to a random network with the same degree distribution.',
        'q22': 'Multiple optimization strategies include sampling, approximate algorithms, distributed computing, or switching to more scalable algorithms.',
        'q23': 'Semi-supervised clustering incorporates limited labeled examples or pairwise constraints to guide the clustering process.',
        'q24': 'Bootstrap resampling assesses how consistent clusters are across different data samples, measuring stability.',
        'q25': 'A large dominant cluster often indicates poor feature selection, need for feature transformation, or hierarchical analysis within the large group.',
        'q26': 'Multi-view clustering must balance preserving unique information from each view while finding consistent cluster structure.',
        'q27': 'Clustering-based anomaly detection identifies outliers as points far from cluster centers or in very small clusters.',
        'q28': 'Data drift monitoring includes tracking cluster assignment distributions, feature statistics, and model performance over time.',
        'q29': 'For new users with no interaction history, clustering existing users allows assignment to similar groups for initial recommendations.',
        'q30': 'Ethical considerations include avoiding discriminatory features, ensuring fairness across groups, and transparency in decision-making.',
        'q31': 'Feature scaling/normalization is critical because many clustering algorithms are sensitive to feature scales, especially distance-based methods.',
        'q32': 'DBSCAN\'s key advantages include handling noise, finding arbitrary shaped clusters, and not requiring predetermined cluster count.',
        'q33': 'When clusters don\'t align with expert expectations, investigate preprocessing, feature selection, and parameters; consider domain knowledge integration.',
        'q34': 'Monitoring for data drift and model performance degradation is crucial for maintaining clustering model effectiveness in production.',
        'q35': 'Effective communication with non-technical stakeholders requires business language, visualizations, and domain-relevant examples.'
    };

    // Collect user answers
    let userAnswers = {};
    let score = 0;
    
    for (let i = 1; i <= 35; i++) {
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
    const percentage = Math.round((score / 35) * 100);
    let performanceLevel = '';
    let feedback = '';

    if (percentage >= 90) {
        performanceLevel = 'Excellent';
        feedback = 'Outstanding! You have mastered clustering concepts and are ready for advanced applications and leadership roles.';
    } else if (percentage >= 80) {
        performanceLevel = 'Very Good';
        feedback = 'Great job! You have strong clustering knowledge. Review the missed questions to reach expert level.';
    } else if (percentage >= 70) {
        performanceLevel = 'Good';
        feedback = 'Good understanding! You grasp most clustering concepts. Focus on the practical application questions.';
    } else if (percentage >= 60) {
        performanceLevel = 'Fair';
        feedback = 'Decent foundation, but review fundamental concepts and algorithm details for better understanding.';
    } else {
        performanceLevel = 'Needs Improvement';
        feedback = 'Consider reviewing the course materials and practicing with real datasets to strengthen your understanding.';
    }

    const scoreColor = percentage >= 70 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336';
    
    document.getElementById('score-display').innerHTML = 
        `<div style="background: ${scoreColor}; color: white; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
            Score: ${score}/35 (${percentage}%) - ${performanceLevel}
            <br><small>${feedback}</small>
        </div>`;

    // Show detailed results
    let detailedHTML = '<h4>Detailed Answer Review:</h4>';
    for (let i = 1; i <= 35; i++) {
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

// Sub-section navigation functionality
function navigateSubSection(direction) {
    const sections = ['algorithm', 'mathematics', 'optimization', 'convergence', 'demo', 'quiz'];
    const currentSection = document.querySelector('.content-section.active').id;
    const currentIndex = sections.indexOf(currentSection);
    
    if (direction === 'next' && currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        showSection(nextSection, document.querySelector(`button[onclick*="${nextSection}"]`));
    } else if (direction === 'prev' && currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        showSection(prevSection, document.querySelector(`button[onclick*="${prevSection}"]`));
    }
    
    // Update navigation button labels
    updateSubSectionNavigation(sections, currentIndex);
}

function updateSubSectionNavigation(sections, currentIndex) {
    const prevBtn = document.getElementById('prev-subsection');
    const nextBtn = document.getElementById('next-subsection');
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');
    
    if (currentIndex > 0) {
        prevBtn.style.display = 'block';
        prevLabel.textContent = sections[currentIndex - 1].charAt(0).toUpperCase() + sections[currentIndex - 1].slice(1);
    } else {
        prevBtn.style.display = 'none';
    }
    
    if (currentIndex < sections.length - 1) {
        nextBtn.style.display = 'block';
        nextLabel.textContent = sections[currentIndex + 1].charAt(0).toUpperCase() + sections[currentIndex + 1].slice(1);
    } else {
        nextBtn.style.display = 'none';
    }
}

// Make functions globally available
window.showSection = showSection;
window.checkQuizAnswers = checkQuizAnswers;
window.navigateSubSection = navigateSubSection;
window.updateSubSectionNavigation = updateSubSectionNavigation;
