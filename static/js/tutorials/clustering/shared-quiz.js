// Shared Quiz Functionality for All Clustering Chapters
// This file provides standardized quiz functionality across all chapters

// Quiz functionality
window.checkAnswer = function(questionNum, correctAnswer) {
    console.log('checkAnswer called for question', questionNum);
    const selectedAnswer = document.querySelector(`input[name="q${questionNum}"]:checked`);
    const resultDiv = document.getElementById(`q${questionNum}-result`);
    
    if (!selectedAnswer) {
        resultDiv.innerHTML = '<p style="color: orange;">Please select an answer first.</p>';
        return;
    }
    
    const isCorrect = selectedAnswer.value === correctAnswer;
    
    if (isCorrect) {
        resultDiv.innerHTML = '<p style="color: green;">✓ Correct!</p>';
    } else {
        resultDiv.innerHTML = '<p style="color: red;">✗ Incorrect. Try again!</p>';
    }
    
    updateQuizScore();
};

window.updateQuizScore = function() {
    const correct = document.querySelectorAll('[id$="-result"] p[style*="green"]').length;
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = correct;
    }
};

window.resetQuiz = function() {
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    document.querySelectorAll('[id$="-result"]').forEach(div => {
        div.innerHTML = '';
    });
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = '0';
    }
};

// Scroll to top function for navigation
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
