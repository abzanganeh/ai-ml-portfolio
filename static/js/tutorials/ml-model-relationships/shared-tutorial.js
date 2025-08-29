/* ===== SHARED TUTORIAL JAVASCRIPT ===== */
/* File: static/js/tutorials/ml-model-relationships/shared-tutorial.js */

// Global variables
let quizAnswers = {};
let currentChapter = 'chapter1';
let completedChapters = new Set();
let totalChapters = 0;
let currentDataset = 'simple';
let currentSection = 'overview'; // Track current section

// ===== SECTION NAVIGATION SYSTEM =====
function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    } else {
        console.error('Section not found:', sectionName);
        return;
    }
    
    // Update navigation buttons
    document.querySelectorAll('.section-nav button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Find and activate the correct button
    const activeButton = document.querySelector(`button[onclick="showSection('${sectionName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update progress tracker
    updateSectionProgress(sectionName);
}

function updateSectionProgress(sectionName) {
    // Get section order from navigation buttons
    const navButtons = document.querySelectorAll('.section-nav button');
    const sectionOrder = Array.from(navButtons).map(btn => {
        const onclick = btn.getAttribute('onclick');
        const match = onclick.match(/showSection\('([^']+)'\)/);
        return match ? match[1] : null;
    }).filter(name => name);
    
    const currentIndex = sectionOrder.indexOf(sectionName);
    
    if (currentIndex === -1) return;
    
    // Update progress dots
    const progressDots = document.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index < currentIndex) {
            dot.classList.add('completed');
        } else if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

// ===== CHAPTER NAVIGATION SYSTEM =====
function initializeChapterNavigation(chapters, defaultChapter = 'chapter1') {
    currentChapter = defaultChapter;
    totalChapters = chapters.length;
    
    // Set up navigation buttons
    chapters.forEach((chapter, index) => {
        const btn = document.querySelector(`[data-chapter="${chapter}"]`);
        if (btn) {
            btn.addEventListener('click', () => showChapter(chapter));
            
            // Mark as completed if user has visited
            if (localStorage.getItem(`completed_${chapter}`)) {
                completedChapters.add(chapter);
                btn.classList.add('completed');
            }
        }
    });
    
    // Show default chapter
    showChapter(defaultChapter);
    updateProgress();
}

function showChapter(chapterId) {
    // Hide all chapter sections
    document.querySelectorAll('.chapter-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target chapter
    const targetSection = document.getElementById(chapterId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation buttons
    document.querySelectorAll('.chapter-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-chapter="${chapterId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Mark as completed
    completedChapters.add(chapterId);
    localStorage.setItem(`completed_${chapterId}`, 'true');
    
    if (activeBtn) {
        activeBtn.classList.add('completed');
    }
    
    currentChapter = chapterId;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const progressFill = document.querySelector('.chapter-progress-fill');
    if (progressFill) {
        const progress = (completedChapters.size / totalChapters) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

// ===== ENHANCED QUIZ SYSTEM =====
function initializeEnhancedQuizzes() {
    document.querySelectorAll('.enhanced-quiz-option').forEach(option => {
        if (!option.dataset.originalText) {
            option.dataset.originalText = option.textContent.trim();
        }
        
        option.addEventListener('click', function() {
            const isCorrect = this.dataset.correct === 'true';
            handleQuizAnswer(this, isCorrect);
        });
    });
}

function handleQuizAnswer(selectedOption, isCorrect) {
    const quizContainer = selectedOption.closest('.enhanced-quiz-container');
    const options = quizContainer.querySelectorAll('.enhanced-quiz-option');
    const explanation = quizContainer.querySelector('.enhanced-quiz-explanation');
    
    // Disable all options
    options.forEach(option => {
        option.classList.add('disabled');
        option.style.pointerEvents = 'none';
    });
    
    // Reset all options to original state
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
        if (option.dataset.originalText) {
            option.textContent = option.dataset.originalText;
        }
    });
    
    // Mark selected option
    if (isCorrect) {
        selectedOption.classList.add('correct');
        selectedOption.textContent = selectedOption.dataset.originalText + ' ✅ Correct!';
    } else {
        selectedOption.classList.add('incorrect');
        selectedOption.textContent = selectedOption.dataset.originalText + ' ❌ Incorrect';
        
        // Find and mark correct answer
        const correctOption = Array.from(options).find(option => 
            option.dataset.correct === 'true'
        );
        if (correctOption) {
            correctOption.classList.add('correct');
            correctOption.textContent = correctOption.dataset.originalText + ' ✅ Correct Answer';
        }
    }
    
    // Show explanation
    if (explanation) {
        explanation.classList.add('show');
        explanation.style.display = 'block';
    }
    
    // Store quiz completion
    const quizId = quizContainer.dataset.quizId || 'default';
    localStorage.setItem(`quiz_completed_${quizId}`, 'true');
}

// ===== INTERACTIVE DEMO FUNCTIONS =====

// Assessment functionality
function updateAssessment() {
    document.getElementById('linear-value').textContent = document.getElementById('linear-understanding').value;
    document.getElementById('ensemble-value').textContent = document.getElementById('ensemble-understanding').value;
    document.getElementById('selection-value').textContent = document.getElementById('selection-understanding').value;
}

function generateRecommendations() {
    const linear = parseInt(document.getElementById('linear-understanding').value);
    const ensemble = parseInt(document.getElementById('ensemble-understanding').value);
    const selection = parseInt(document.getElementById('selection-understanding').value);
    
    const results = document.getElementById('assessment-results');
    results.style.display = 'block';
    
    let recommendations = '<h5>Your Personalized Learning Path:</h5>';
    
    if (linear <= 2) {
        recommendations += '<p><strong>Priority 1:</strong> Focus on Chapters 2-3 (Foundation Models & Regularization)</p>';
    }
    if (ensemble <= 2) {
        recommendations += '<p><strong>Priority 2:</strong> Spend extra time on Chapters 4-6 (Ensemble Methods)</p>';
    }
    if (selection <= 2) {
        recommendations += '<p><strong>Priority 3:</strong> Chapter 8 (Integration) will be crucial for you</p>';
    }
    if (linear >= 4 && ensemble >= 4) {
        recommendations += '<p><strong>Advanced Path:</strong> You can move quickly to Chapters 7-8</p>';
    }
    
    results.innerHTML = recommendations;
}

// Hierarchy exploration
function explainHierarchy() {
    document.getElementById('hierarchy-explanation').style.display = 'block';
}

function showLevelDetails(level) {
    document.querySelectorAll('.connection-node').forEach(node => node.classList.remove('active'));
    event.target.classList.add('active');
    
    const details = document.getElementById('level-details');
    const content = {
        1: '<h4>Level 1: Basic Models</h4><p><strong>Problem:</strong> Need simple, interpretable algorithms</p><p><strong>Solution:</strong> Linear Regression, Decision Trees</p><p><strong>New Problem Created:</strong> These models overfit to training data</p>',
        2: '<h4>Level 2: Regularization</h4><p><strong>Problem:</strong> Basic models overfit</p><p><strong>Solution:</strong> Add penalty terms (L1/L2) to control complexity</p><p><strong>New Problem Created:</strong> Single models still have limitations</p>',
        3: '<h4>Level 3: Ensemble Methods</h4><p><strong>Problem:</strong> Single models are limited</p><p><strong>Solution:</strong> Combine multiple models (Bagging/Boosting)</p><p><strong>New Problem Created:</strong> Need efficient implementations</p>',
        4: '<h4>Level 4: Advanced Implementations</h4><p><strong>Problem:</strong> Ensemble methods need optimization</p><p><strong>Solution:</strong> XGBoost, LightGBM - optimized implementations</p><p><strong>Result:</strong> State-of-the-art performance</p>'
    };
    
    details.innerHTML = content[level];
}

// Cooking metaphor interactions
function highlightStep(stepNumber) {
    document.querySelectorAll('.cooking-step').forEach(step => step.style.background = 'white');
    event.target.closest('.cooking-step').style.background = '#e3f2fd';
    
    const stepDetails = document.getElementById('step-details');
    stepDetails.classList.add('active');
    
    const details = {
        1: {
            title: 'Raw Ingredients = Your Data',
            description: 'Just like cooking starts with quality ingredients, ML starts with quality data. Poor data = poor results, no matter how sophisticated your algorithm.'
        },
        2: {
            title: 'Cooking Method = Algorithm',
            description: 'Different algorithms are like different cooking methods. Grilling (Linear Regression) is simple and fast. Slow cooking (Deep Learning) takes time but handles complex recipes.'
        },
        3: {
            title: 'Seasoning = Regularization',
            description: 'Too little seasoning and the dish is bland (underfitting). Too much and it overwhelms (overfitting). Regularization helps you find the perfect balance.'
        },
        4: {
            title: 'Team Cooking = Ensemble Methods',
            description: 'Multiple chefs bring different strengths. One might be great at appetizers (one model type), another at desserts (another model type). Together they create something amazing.'
        }
    };
    
    document.getElementById('step-title').textContent = details[stepNumber].title;
    document.getElementById('step-description').textContent = details[stepNumber].description;
}

function updateRecipe() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.nextSibling.textContent.trim());
    
    const recommendation = document.getElementById('recipe-recommendation');
    const details = document.getElementById('recipe-details');
    
    if (selected.length === 0) {
        recommendation.style.display = 'none';
        return;
    }
    
    recommendation.style.display = 'block';
    
    let recipe = '';
    if (selected.includes('Noisy data')) recipe += '<p>🧂 <strong>Add regularization</strong> (L1/L2) to handle noise</p>';
    if (selected.includes('Many features')) recipe += '<p>🔪 <strong>Feature selection</strong> with L1 regularization</p>';
    if (selected.includes('Complex patterns')) recipe += '<p>🌳 <strong>Decision trees</strong> or ensemble methods</p>';
    if (selected.includes('Need high accuracy')) recipe += '<p>👥 <strong>Ensemble methods</strong> (Random Forest, XGBoost)</p>';
    if (selected.includes('Must be interpretable')) recipe += '<p>📊 <strong>Linear models</strong> or single decision trees</p>';
    
    details.innerHTML = recipe;
}

// Connection web interactions
function showConnections(technique) {
    document.querySelectorAll('.connection-details').forEach(detail => detail.classList.remove('active'));
    document.querySelectorAll('.connection-node').forEach(node => node.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('connection-' + technique).classList.add('active');
}

// ===== LEGACY FUNCTIONS FOR COMPATIBILITY =====

// Model Recommendation System
function updateModelRecommendation() {
    const complexity = parseInt(document.getElementById('data-complexity')?.value || 3);
    const size = parseInt(document.getElementById('data-size')?.value || 3);
    const interpretability = parseInt(document.getElementById('interpretability')?.value || 3);
    
    // Update display values if elements exist
    if (document.getElementById('complexity-value')) {
        document.getElementById('complexity-value').textContent = complexity;
        document.getElementById('size-value').textContent = size;
        document.getElementById('interp-value').textContent = interpretability;
    }
    
    const details = document.getElementById('recommendation-details');
    if (!details) return;
    
    let recommendation = '';
    
    if (complexity <= 2 && interpretability >= 4) {
        recommendation = '<strong>Linear Regression</strong><br>Your data is simple and you need interpretability. Linear models are perfect!';
    } else if (complexity >= 4 && size >= 3 && interpretability <= 2) {
        recommendation = '<strong>Decision Tree (with ensemble later)</strong><br>Complex data needs flexible models, but single trees will overfit. Consider Random Forest!';
    } else if (interpretability >= 4) {
        recommendation = '<strong>Simple Decision Tree</strong><br>High interpretability need suggests a shallow tree with clear rules.';
    } else {
        recommendation = '<strong>Hybrid Approach</strong><br>Try both models and compare! This is common in real projects.';
    }
    
    details.innerHTML = recommendation;
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Shared tutorial system loaded');
    
    // Initialize enhanced quizzes
    initializeEnhancedQuizzes();
    
    // Initialize section navigation if elements exist
    if (document.querySelector('.section-nav')) {
        // Set first section as active by default
        const firstSection = document.querySelector('.content-section');
        if (firstSection && !document.querySelector('.content-section.active')) {
            firstSection.classList.add('active');
            updateSectionProgress(firstSection.id || 'overview');
        }
    }
    
    // Auto-initialize chapter navigation if elements exist
    const chapterButtons = document.querySelectorAll('.chapter-nav-btn');
    if (chapterButtons.length > 0) {
        const chapters = Array.from(chapterButtons).map(btn => btn.dataset.chapter);
        const defaultChapter = document.querySelector('.chapter-nav-btn.active')?.dataset.chapter || chapters[0];
        initializeChapterNavigation(chapters, defaultChapter);
    }
    
    // Load completed chapters from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('completed_')) {
            const chapterId = key.replace('completed_', '');
            completedChapters.add(chapterId);
            
            const btn = document.querySelector(`[data-chapter="${chapterId}"]`);
            if (btn) {
                btn.classList.add('completed');
            }
        }
    }
    
    // Update progress on load
    if (totalChapters > 0) {
        updateProgress();
    }
    
    // Initialize demo functions if elements exist
    updateModelRecommendation();
});

// Export functions for global access
window.TutorialUtils = {
    showSection,
    showChapter,
    handleQuizAnswer,
    updateAssessment,
    generateRecommendations,
    explainHierarchy,
    showLevelDetails,
    highlightStep,
    updateRecipe,
    showConnections,
    updateModelRecommendation
};