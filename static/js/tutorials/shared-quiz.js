/**
 * Universal Quiz Handler for All Tutorials
 * Works with legacy radio quizzes, onclick="checkAnswer(this, true/false)", and data-correct patterns.
 */

const QUIZ_FEEDBACK = Object.freeze({
    correct: 'Correct',
    incorrect: 'Incorrect',
    correctAnswer: 'Correct answer'
});

// Universal checkAnswer function - works with onclick pattern
function checkAnswer(element, isCorrect) {
    if (!isElementLike(element)) {
        checkLegacyRadioAnswer(element, isCorrect);
        return;
    }

    if (!element) {
        console.error('checkAnswer: element is null');
        return;
    }
    
    // Store original text for all options before modifying
    const questionContainer = getQuizQuestionScope(element);
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
        opt.dataset.selected = 'false';
        opt.classList.remove('correct', 'incorrect');
        opt.style.pointerEvents = 'none'; // Disable further clicks
    });

    element.dataset.selected = 'true';
    
    if (isCorrect) {
        element.classList.add('correct');
        element.textContent = `${element.dataset.originalText} ${QUIZ_FEEDBACK.correct}`;
        element.offsetHeight;
    } else {
        element.classList.add('incorrect');
        element.textContent = `${element.dataset.originalText} ${QUIZ_FEEDBACK.incorrect}`;
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
            correctOption.textContent = `${correctOption.dataset.originalText} ${QUIZ_FEEDBACK.correctAnswer}`;
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

function isElementLike(value) {
    return value && typeof value.closest === 'function';
}

function getQuizQuestionScope(element) {
    return (
        element.closest('.enhanced-quiz-question')
        || element.closest('.enhanced-quiz-container')
        || element.closest('.quiz-question')
        || element.closest('.quiz-container')
    );
}

function checkLegacyRadioAnswer(questionNum, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const resultDiv = document.getElementById(`q${questionNum}-result`) || document.getElementById(`feedback${questionNum}`);

    if (!resultDiv) {
        console.error(`Quiz result container not found for question ${questionNum}`);
        return;
    }

    if (!selectedAnswer) {
        resultDiv.innerHTML = '<p style="color: orange;">Please select an answer first.</p>';
        return;
    }

    const isCorrect = selectedAnswer.value === correctAnswer;
    resultDiv.innerHTML = isCorrect
        ? `<p style="color: green;">${QUIZ_FEEDBACK.correct}</p>`
        : `<p style="color: red;">${QUIZ_FEEDBACK.incorrect}. Try again.</p>`;

    if (typeof window.updateQuizScore === 'function') {
        window.updateQuizScore();
    }
}

// Enhanced quiz handler for data-correct pattern
function handleQuizAnswer(selectedOption, isCorrect) {
    // If isCorrect is not provided, check data-correct attribute
    if (isCorrect === undefined) {
        isCorrect = selectedOption.dataset.correct === 'true';
    }
    
    const quizContainer = getQuizQuestionScope(selectedOption);
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
        option.dataset.selected = 'false';
        
        // Store original text
        if (!option.dataset.originalText) {
            option.dataset.originalText = option.textContent.trim();
        }
    });

    selectedOption.dataset.selected = 'true';
    
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
        selectedOption.textContent = `${selectedOption.dataset.originalText} ${QUIZ_FEEDBACK.correct}`;
    } else {
        selectedOption.classList.add('incorrect');
        selectedOption.textContent = `${selectedOption.dataset.originalText} ${QUIZ_FEEDBACK.incorrect}`;
        
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
            correctOption.textContent = `${correctOption.dataset.originalText} ${QUIZ_FEEDBACK.correctAnswer}`;
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
    // Initialize shared data-correct pattern for both current and legacy quiz markup.
    document.querySelectorAll('.enhanced-quiz-option[data-correct], .quiz-option[data-correct]').forEach(option => {
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
    
    // Keep the legacy onclick entrypoints available while older pages migrate.
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
    initializeQuizzes,
    checkLegacyRadioAnswer,
    getQuizQuestionScope
};
