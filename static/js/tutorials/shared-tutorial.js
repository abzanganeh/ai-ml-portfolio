/* ===== SHARED TUTORIAL JAVASCRIPT ===== */
/* Reusable JavaScript for all tutorial chapters with improved functionality */

// Global variables for chapter navigation
let currentChapter = 'chapter1';
let completedChapters = new Set();
let totalChapters = 0;

// Chapter navigation system
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
    
    // Update progress
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
    
    // Update progress
    currentChapter = chapterId;
    updateProgress();
    
    // Scroll to top of chapter
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const progressFill = document.querySelector('.chapter-progress-fill');
    if (progressFill) {
        const progress = (completedChapters.size / totalChapters) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

// Enhanced quiz system
function initializeEnhancedQuizzes() {
    // Set up all quiz options
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
    
    // Show explanation if available
    if (explanation) {
        explanation.classList.add('show');
        if (isCorrect) {
            explanation.classList.add('correct');
        } else {
            explanation.classList.add('incorrect');
        }
    }
    
    // Store quiz completion
    const quizId = quizContainer.dataset.quizId || 'default';
    localStorage.setItem(`quiz_completed_${quizId}`, 'true');
}

// Legacy quiz compatibility (for existing quizzes)
function checkAnswer(element, isCorrect) {
    if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent.trim();
    }
    
    const quizContainer = element.closest('.quiz-container, .enhanced-quiz-container');
    const options = quizContainer.querySelectorAll('.quiz-option, .enhanced-quiz-option');
    
    // Reset all options
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
        if (option.dataset.originalText) {
            option.textContent = option.dataset.originalText;
        }
    });
    
    if (isCorrect) {
        element.classList.add('correct');
        element.textContent = element.dataset.originalText + ' ✅ Correct!';
    } else {
        element.classList.add('incorrect');
        element.textContent = element.dataset.originalText + ' ❌ Incorrect';
        
        // Find and mark correct answer
        const correctOption = Array.from(options).find(option => {
            const onclickStr = option.getAttribute('onclick') || '';
            return onclickStr.includes('true');
        });
        if (correctOption) {
            correctOption.classList.add('correct');
            correctOption.textContent = correctOption.dataset.originalText + ' ✅ Correct Answer';
        }
    }
}

// Progress tracking
function markChapterComplete(chapterId) {
    completedChapters.add(chapterId);
    localStorage.setItem(`completed_${chapterId}`, 'true');
    
    const btn = document.querySelector(`[data-chapter="${chapterId}"]`);
    if (btn) {
        btn.classList.add('completed');
    }
    
    updateProgress();
}

function getChapterProgress() {
    return {
        completed: completedChapters.size,
        total: totalChapters,
        percentage: Math.round((completedChapters.size / totalChapters) * 100)
    };
}

// Utility functions
function scrollToChapter(chapterId) {
    const element = document.getElementById(chapterId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function resetProgress() {
    completedChapters.clear();
    localStorage.clear();
    
    // Reset all chapter buttons
    document.querySelectorAll('.chapter-nav-btn').forEach(btn => {
        btn.classList.remove('completed');
    });
    
    updateProgress();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced quizzes
    initializeEnhancedQuizzes();
    
    // Set up legacy quiz options
    document.querySelectorAll('.quiz-option').forEach(option => {
        if (!option.dataset.originalText) {
            option.dataset.originalText = option.textContent.trim();
        }
    });
    
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
});

// Export functions for use in other scripts
window.TutorialUtils = {
    showChapter,
    handleQuizAnswer,
    checkAnswer,
    markChapterComplete,
    getChapterProgress,
    scrollToChapter,
    resetProgress,
    initializeChapterNavigation,
    initializeEnhancedQuizzes
};
