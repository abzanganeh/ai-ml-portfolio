/**
 * Universal Quiz Handler for All Tutorials
 * Works with both onclick="checkAnswer(this, true/false)" and data-correct="true/false" patterns
 */

// Universal checkAnswer function - works with onclick pattern
function checkAnswer(element, isCorrect) {
    if (!element) {
        console.error('checkAnswer: element is null');
        return;
    }
    
    // Store original text for all options before modifying
    const questionContainer = element.closest('.quiz-question') || element.closest('.enhanced-quiz-container');
    if (!questionContainer) {
        console.error('Quiz question container not found for element:', element);
        return;
    }
    
    const allOptions = questionContainer.querySelectorAll('.quiz-option, .enhanced-quiz-option');
    
    if (allOptions.length === 0) {
        console.error('No quiz options found');
        return;
    }
    
    // Restore original text and remove classes from all options
    allOptions.forEach(opt => {
        if (!opt.dataset.originalText) {
            opt.dataset.originalText = opt.textContent.trim();
        }
        opt.textContent = opt.dataset.originalText;
        opt.classList.remove('correct', 'incorrect');
        opt.style.pointerEvents = 'none'; // Disable further clicks
    });
    
    if (isCorrect) {
        // Correct answer selected - add green glow
        element.classList.add('correct');
        element.textContent = element.dataset.originalText + ' ✓ Correct!';
        // Force reflow to ensure animation triggers
        element.offsetHeight;
    } else {
        // Wrong answer selected - add red glow
        element.classList.add('incorrect');
        element.textContent = element.dataset.originalText + ' ✗ Incorrect';
        // Force reflow to ensure animation triggers
        element.offsetHeight;
        
        // Find and highlight the correct answer with green glow
        const correctOption = Array.from(allOptions).find(opt => {
            // Check for onclick pattern: checkAnswer(this, true)
            const onclick = opt.getAttribute('onclick') || '';
            if (onclick.includes('checkAnswer(this, true)')) {
                return true;
            }
            // Check for data-correct pattern
            if (opt.dataset.correct === 'true') {
                return true;
            }
            return false;
        });
        
        if (correctOption) {
            correctOption.classList.add('correct');
            correctOption.textContent = correctOption.dataset.originalText + ' ✓ Correct Answer';
            // Force reflow to ensure animation triggers
            correctOption.offsetHeight;
        }
    }
    
    // Show explanation if it exists
    const explanation = questionContainer.querySelector('.enhanced-quiz-explanation, .quiz-explanation');
    if (explanation) {
        explanation.classList.add('show');
        explanation.style.display = 'block';
    }
}

// Enhanced quiz handler for data-correct pattern
function handleQuizAnswer(selectedOption, isCorrect) {
    // If isCorrect is not provided, check data-correct attribute
    if (isCorrect === undefined) {
        isCorrect = selectedOption.dataset.correct === 'true';
    }
    
    const quizContainer = selectedOption.closest('.enhanced-quiz-container') || selectedOption.closest('.quiz-question');
    if (!quizContainer) {
        console.error('Quiz container not found');
        return;
    }
    
    const options = quizContainer.querySelectorAll('.enhanced-quiz-option, .quiz-option');
    const explanation = quizContainer.querySelector('.enhanced-quiz-explanation, .quiz-explanation');
    
    // Disable all options
    options.forEach(option => {
        option.classList.add('disabled');
        option.style.pointerEvents = 'none';
        
        // Store original text
        if (!option.dataset.originalText) {
            option.dataset.originalText = option.textContent.trim();
        }
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
        const correctOption = Array.from(options).find(option => {
            // Check data-correct attribute
            if (option.dataset.correct === 'true') {
                return true;
            }
            // Check onclick pattern
            const onclick = option.getAttribute('onclick') || '';
            if (onclick.includes('checkAnswer(this, true)') || onclick.includes('handleQuizAnswer(this, true)')) {
                return true;
            }
            return false;
        });
        
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

// Initialize quizzes on page load - auto-detect pattern
function initializeQuizzes() {
    // Initialize enhanced-quiz-option pattern (data-correct)
    document.querySelectorAll('.enhanced-quiz-option').forEach(option => {
        if (!option.dataset.originalText) {
            option.dataset.originalText = option.textContent.trim();
        }
        
        // Remove any existing event listeners by cloning
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
        
        newOption.addEventListener('click', function() {
            const isCorrect = this.dataset.correct === 'true';
            handleQuizAnswer(this, isCorrect);
        });
    });
    
    // Initialize quiz-option pattern (onclick) - ensure checkAnswer is available globally
    // The onclick handlers should already be in place, but we ensure the function exists
    window.checkAnswer = checkAnswer;
    window.handleQuizAnswer = handleQuizAnswer;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQuizzes);
} else {
    initializeQuizzes();
}

// Export for global access
window.QuizUtils = {
    checkAnswer,
    handleQuizAnswer,
    initializeQuizzes
};
