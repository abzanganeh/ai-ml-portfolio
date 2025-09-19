// Chapter 1: Introduction to Clustering - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Chapter 1: Introduction to Clustering loaded ===');
    console.log('DOM is ready, initializing...');
    
    // Initialize chapter-specific functionality
    initializeChapter1();
    
    // Test if showSection function is available
    if (typeof window.showSection === 'function') {
        console.log('✅ showSection function is available');
    } else {
        console.error('❌ showSection function is NOT available');
    }
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
    
    // Set up the showSection function to be called from HTML onclick
    window.showSection = showSection;
    
    // Debug: Check if elements exist
    const sectionButtons = document.querySelectorAll('.section-nav button');
    const sections = document.querySelectorAll('.section-content');
    
    console.log('Found section buttons:', sectionButtons.length);
    console.log('Found sections:', sections.length);
    
    // Initialize with the first section active
    const firstButton = document.querySelector('.section-nav button');
    if (firstButton) {
        firstButton.classList.add('active');
        console.log('Set first button as active:', firstButton.textContent);
    }
    
    // Make sure first section is visible
    const firstSection = document.getElementById('clustering');
    if (firstSection) {
        firstSection.classList.add('active');
        console.log('Set first section as active: clustering');
        console.log('First section classes:', firstSection.className);
        console.log('First section computed display:', getComputedStyle(firstSection).display);
        
        // Force display style as backup
        firstSection.style.display = 'block';
        console.log('Forced first section display to block');
    }
    
    // Add click event listeners as backup
    sectionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('onclick').match(/showSection\('([^']+)'/)[1];
            console.log('Button clicked, section:', sectionName);
            showSection(sectionName, this);
        });
    });
}

// Global function for section navigation (called from HTML onclick)
// This function is defined later in the file to avoid duplication

function updateSectionProgress(sectionName) {
    const sections = ['clustering', 'unsupervised', 'types', 'applications', 'challenges', 'mathematical', 'demo', 'quiz'];
    const currentIndex = sections.indexOf(sectionName);
    const progress = ((currentIndex + 1) / sections.length) * 100;
    
    const progressBar = document.querySelector('.section-progress-fill');
    if (progressBar) {
        progressBar.style.width = progress + '%';
        console.log(`Updated section progress to ${progress}%`);
    }
}

// Global variables for quiz and demo
let quizAnswers = {};
let currentData = [];
let currentCentroids = [];
let currentClusters = [];
let kmeans_iteration = 0;
let isRunning = false;

// Quiz Functions
function checkAnswer(questionNum, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const resultDiv = document.getElementById(`q${questionNum}-result`);
    
    if (!selectedAnswer) {
        resultDiv.innerHTML = '<p style="color: red;">Please select an answer!</p>';
        return;
    }
    
    const isCorrect = selectedAnswer.value === correctAnswer;
    quizAnswers[questionNum] = isCorrect;
    
    if (isCorrect) {
        resultDiv.innerHTML = '<p style="color: green;">✓ Correct! Well done!</p>';
    } else {
        resultDiv.innerHTML = '<p style="color: red;">✗ Incorrect. The correct answer is: ' + 
            document.querySelector(`input[name="q${questionNum}"][value="${correctAnswer}"]`).nextSibling.textContent + '</p>';
    }
}

function submitQuiz() {
    const totalQuestions = 5;
    const answeredQuestions = Object.keys(quizAnswers).length;
    
    if (answeredQuestions < totalQuestions) {
        alert(`Please answer all questions! You have answered ${answeredQuestions} out of ${totalQuestions} questions.`);
        return;
    }
    
    const correctAnswers = Object.values(quizAnswers).filter(answer => answer).length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4>Quiz Results</h4>
                <p><strong>Score:</strong> ${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)</p>
                <p><strong>Grade:</strong> ${percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'}</p>
                ${percentage >= 80 ? 
                    '<p style="color: green;">🎉 Excellent work! You have a strong understanding of clustering fundamentals.</p>' :
                    percentage >= 60 ? 
                        '<p style="color: blue;">👍 Good job! Review the material and try again for a higher score.</p>' :
                        '<p style="color: orange;">📚 Review the material and try again!</p>'}
            </div>
        `;
    }
}

function initializeQuiz() {
    console.log('Initializing quiz functionality...');
    
    // Set up global quiz functions
    window.checkAnswer = checkAnswer;
    window.submitQuiz = submitQuiz;
    
    const submitBtn = document.querySelector('button[onclick="submitQuiz()"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuiz);
    }
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

// Section switching function - This is the correct one that handles clickedElement
function showSection(sectionName, clickedElement) {
    console.log('=== showSection called ===');
    console.log('Section name:', sectionName);
    console.log('Clicked element:', clickedElement);
    
    // Prevent multiple rapid calls
    if (window.showSectionInProgress) {
        console.log('⚠️ showSection already in progress, ignoring call');
        return;
    }
    window.showSectionInProgress = true;
    
    // Hide all sections
    const allSections = document.querySelectorAll('.section-content');
    console.log('Found sections to hide:', allSections.length);
    
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; // Force hide
        console.log('Removed active from:', section.id);
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        // Force display style as backup
        targetSection.style.display = 'block';
        console.log(`✅ Showing section: ${sectionName}`);
        console.log('Target section element:', targetSection);
        console.log('Target section classes after adding active:', targetSection.className);
        console.log('Target section computed display:', getComputedStyle(targetSection).display);
    } else {
        console.error(`❌ Section not found: ${sectionName}`);
        console.log('Available sections:', Array.from(allSections).map(s => s.id));
    }
    
    // Update navigation buttons
    const allButtons = document.querySelectorAll('.section-nav button');
    console.log('Found buttons to update:', allButtons.length);
    
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (clickedElement) {
        clickedElement.classList.add('active');
        console.log(`✅ Activated button for: ${sectionName}`);
        console.log('Button classes after adding active:', clickedElement.className);
        console.log('Button element:', clickedElement);
    } else {
        console.error('❌ No clicked element provided to showSection');
    }
    
    // Update section progress bar
    updateSectionProgress(sectionName);
    
    // Update sub-section navigation
    updateSubSectionNavigation();
    
    // Clear the progress flag
    window.showSectionInProgress = false;
    
    console.log('=== showSection completed ===');
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

// Sub-section navigation function
function navigateSubSection(direction) {
    const sections = ['clustering', 'unsupervised', 'types', 'applications', 'challenges', 'mathematical', 'demo', 'quiz'];
    const currentSection = document.querySelector('.section-content.active');
    const currentIndex = sections.indexOf(currentSection.id);
    
    let newIndex;
    if (direction === 'prev') {
        newIndex = currentIndex - 1;
    } else {
        newIndex = currentIndex + 1;
    }
    
    if (newIndex >= 0 && newIndex < sections.length) {
        const newSection = sections[newIndex];
        const newSectionElement = document.getElementById(newSection);
        const newButton = document.querySelector(`button[onclick*="${newSection}"]`);
        
        if (newSectionElement && newButton) {
            showSection(newSection, newButton);
            updateSubSectionNavigation();
        }
    }
}

function updateSubSectionNavigation() {
    const sections = ['clustering', 'unsupervised', 'types', 'applications', 'challenges', 'mathematical', 'demo', 'quiz'];
    const currentSection = document.querySelector('.section-content.active');
    const currentIndex = sections.indexOf(currentSection.id);
    
    const prevBtn = document.getElementById('prev-subsection');
    const nextBtn = document.getElementById('next-subsection');
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');
    
    // Update previous button
    if (currentIndex > 0) {
        prevBtn.style.display = 'flex';
        const prevSectionName = getSectionDisplayName(sections[currentIndex - 1]);
        prevLabel.textContent = prevSectionName;
    } else {
        prevBtn.style.display = 'none';
    }
    
    // Update next button
    if (currentIndex < sections.length - 1) {
        nextBtn.style.display = 'flex';
        const nextSectionName = getSectionDisplayName(sections[currentIndex + 1]);
        nextLabel.textContent = nextSectionName;
    } else {
        nextBtn.style.display = 'none';
    }
}

function getSectionDisplayName(sectionId) {
    const displayNames = {
        'clustering': 'What is Clustering?',
        'unsupervised': 'Unsupervised Learning',
        'types': 'Types of Clustering',
        'applications': 'Real-World Applications',
        'challenges': 'Challenges & Assumptions',
        'mathematical': 'Mathematical Foundations',
        'demo': 'Interactive Demo',
        'quiz': 'Quiz'
    };
    return displayNames[sectionId] || sectionId;
}

// Make functions globally available
window.showSection = showSection;
window.submitQuiz = submitQuiz;
window.navigateToPreviousChapter = navigateToPreviousChapter;
window.navigateToNextChapter = navigateToNextChapter;
window.navigateSubSection = navigateSubSection;
