// Chapter 1: Introduction to Clustering - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chapter 1: Introduction to Clustering loaded');
    
    // Initialize chapter-specific functionality
    initializeChapter1();
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
}

function initializeSectionNavigation() {
    console.log('Initializing section navigation...');
    
    const sectionButtons = document.querySelectorAll('.section-nav button');
    const sections = document.querySelectorAll('.content-section');
    
    sectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.textContent.toLowerCase().replace(/\s+/g, '-');
            
            // Remove active class from all buttons and sections
            sectionButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show target section
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                console.log(`Switched to section: ${targetSection}`);
            }
        });
    });
}

function initializeQuiz() {
    console.log('Initializing quiz functionality...');
    
    const submitBtn = document.querySelector('.quiz-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuiz);
    }
}

function submitQuiz() {
    console.log('Submitting quiz...');
    
    const answers = {
        q1: document.querySelector('input[name="q1"]:checked')?.value,
        q2: document.querySelector('input[name="q2"]:checked')?.value,
        q3: document.querySelector('input[name="q3"]:checked')?.value
    };
    
    const correctAnswers = {
        q1: 'a', // Supervised learning uses labeled data, unsupervised learning doesn't
        q2: 'c', // Linear Regression is NOT a clustering algorithm
        q3: 'b'  // C₁ ∪ C₂ ∪ ... ∪ Cₖ = X represents coverage (all data points are covered)
    };
    
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;
    
    // Check answers
    Object.keys(answers).forEach(question => {
        if (answers[question] === correctAnswers[question]) {
            score++;
        }
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Display results
    const resultsDiv = document.getElementById('quiz-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <div class="quiz-score">
                <h4>Quiz Results</h4>
                <p><strong>Score:</strong> ${score}/${totalQuestions} (${percentage}%)</p>
                <p><strong>Performance:</strong> ${getPerformanceMessage(percentage)}</p>
                <div class="answer-feedback">
                    <h5>Answer Explanations:</h5>
                    <ul>
                        <li><strong>Question 1:</strong> Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.</li>
                        <li><strong>Question 2:</strong> Linear Regression is a supervised learning algorithm for regression, not a clustering method.</li>
                        <li><strong>Question 3:</strong> The union of all clusters equals the entire dataset, ensuring every data point is covered.</li>
                    </ul>
                </div>
            </div>
        `;
        resultsDiv.style.display = 'block';
        resultsDiv.className = 'quiz-results ' + getScoreClass(percentage);
    }
    
    console.log(`Quiz completed: ${score}/${totalQuestions} (${percentage}%)`);
}

function getPerformanceMessage(percentage) {
    if (percentage >= 90) return 'Excellent! You have a strong understanding of clustering fundamentals.';
    if (percentage >= 70) return 'Good job! You understand the basic concepts well.';
    if (percentage >= 50) return 'Not bad! Review the concepts and try again.';
    return 'Keep studying! Review the chapter content and try the quiz again.';
}

function getScoreClass(percentage) {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'fair';
    return 'poor';
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

// Section switching function
function showSection(sectionName) {
    console.log(`Showing section: ${sectionName}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation buttons
    const buttons = document.querySelectorAll('.section-nav button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase().replace(/\s+/g, '-') === sectionName) {
            button.classList.add('active');
        }
    });
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

// Make functions globally available
window.showSection = showSection;
window.submitQuiz = submitQuiz;
window.navigateToPreviousChapter = navigateToPreviousChapter;
window.navigateToNextChapter = navigateToNextChapter;
