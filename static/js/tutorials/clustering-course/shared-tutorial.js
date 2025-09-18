// Shared JavaScript for Clustering Course Tutorial
// This file contains common functionality used across all chapters

document.addEventListener('DOMContentLoaded', function() {
    console.log('Clustering Course: Shared tutorial script loaded');
    
    // Initialize common functionality
    initializeProgressTracking();
    initializeNavigation();
    initializeAnimations();
    initializeTooltips();
});

// Progress Tracking
function initializeProgressTracking() {
    console.log('Initializing progress tracking...');
    
    // Get current chapter from URL
    const currentPath = window.location.pathname;
    const chapterMatch = currentPath.match(/chapter(\d+)/);
    
    if (chapterMatch) {
        const currentChapter = parseInt(chapterMatch[1]);
        updateProgressBar(currentChapter);
        updateChapterNavigation(currentChapter);
    }
}

function updateProgressBar(currentChapter) {
    const totalChapters = 15;
    const progressPercentage = (currentChapter / totalChapters) * 100;
    
    // Create or update progress bar
    let progressBar = document.getElementById('chapter-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'chapter-progress';
        progressBar.className = 'chapter-progress';
        document.body.insertBefore(progressBar, document.body.firstChild);
    }
    
    progressBar.innerHTML = `
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-text">Chapter ${currentChapter} of ${totalChapters}</div>
        </div>
    `;
}

function updateChapterNavigation(currentChapter) {
    // Update previous/next chapter links
    const prevChapter = currentChapter > 1 ? currentChapter - 1 : null;
    const nextChapter = currentChapter < 15 ? currentChapter + 1 : null;
    
    // Update navigation buttons if they exist
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');
    
    if (prevBtn && prevChapter) {
        prevBtn.href = `/tutorials/clustering-course/chapter${prevChapter}`;
        prevBtn.style.display = 'inline-block';
    } else if (prevBtn) {
        prevBtn.style.display = 'none';
    }
    
    if (nextBtn && nextChapter) {
        nextBtn.href = `/tutorials/clustering-course/chapter${nextChapter}`;
        nextBtn.style.display = 'inline-block';
    } else if (nextBtn) {
        nextBtn.style.display = 'none';
    }
}

// Navigation Functions
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateToPreviousChapter();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateToNextChapter();
                    break;
            }
        }
    });
}

function navigateToPreviousChapter() {
    const currentPath = window.location.pathname;
    const chapterMatch = currentPath.match(/chapter(\d+)/);
    
    if (chapterMatch) {
        const currentChapter = parseInt(chapterMatch[1]);
        if (currentChapter > 1) {
            window.location.href = `/tutorials/clustering-course/chapter${currentChapter - 1}`;
        }
    }
}

function navigateToNextChapter() {
    const currentPath = window.location.pathname;
    const chapterMatch = currentPath.match(/chapter(\d+)/);
    
    if (chapterMatch) {
        const currentChapter = parseInt(chapterMatch[1]);
        if (currentChapter < 15) {
            window.location.href = `/tutorials/clustering-course/chapter${currentChapter + 1}`;
        }
    }
}

// Animation Functions
function initializeAnimations() {
    console.log('Initializing animations...');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}

// Tooltip Functions
function initializeTooltips() {
    console.log('Initializing tooltips...');
    
    // Add tooltips to mathematical terms
    const mathTerms = document.querySelectorAll('[data-tooltip]');
    mathTerms.forEach(term => {
        term.addEventListener('mouseenter', showTooltip);
        term.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = e.target.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'math-tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: #2d3748;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target._tooltip) {
        document.body.removeChild(e.target._tooltip);
        e.target._tooltip = null;
    }
}

// Mathematical Formula Rendering
function renderMathFormulas() {
    console.log('Rendering mathematical formulas...');
    
    // Simple LaTeX-like formula rendering
    const formulas = document.querySelectorAll('.math-formula');
    formulas.forEach(formula => {
        const text = formula.textContent;
        const rendered = renderSimpleMath(text);
        formula.innerHTML = rendered;
    });
}

function renderSimpleMath(text) {
    // Basic math rendering for common symbols
    return text
        .replace(/\\sum/g, '∑')
        .replace(/\\int/g, '∫')
        .replace(/\\sqrt/g, '√')
        .replace(/\\pi/g, 'π')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\gamma/g, 'γ')
        .replace(/\\delta/g, 'δ')
        .replace(/\\epsilon/g, 'ε')
        .replace(/\\theta/g, 'θ')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\mu/g, 'μ')
        .replace(/\\sigma/g, 'σ')
        .replace(/\\phi/g, 'φ')
        .replace(/\\omega/g, 'ω')
        .replace(/\^(\d+)/g, '<sup>$1</sup>')
        .replace(/_(\d+)/g, '<sub>$1</sub>');
}

// Code Syntax Highlighting
function initializeCodeHighlighting() {
    console.log('Initializing code highlighting...');
    
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => copyCode(block);
        
        const container = document.createElement('div');
        container.className = 'code-container';
        block.parentNode.insertBefore(container, block);
        container.appendChild(block);
        container.appendChild(copyBtn);
    });
}

function copyCode(codeBlock) {
    const text = codeBlock.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = codeBlock.parentNode.querySelector('.copy-code-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#48bb78';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

// Interactive Elements
function initializeInteractiveElements() {
    console.log('Initializing interactive elements...');
    
    // Add click handlers for interactive formulas
    const interactiveFormulas = document.querySelectorAll('.interactive-formula');
    interactiveFormulas.forEach(formula => {
        formula.addEventListener('click', () => {
            formula.classList.toggle('expanded');
        });
    });
    
    // Add hover effects for algorithm steps
    const algorithmSteps = document.querySelectorAll('.algorithm-step');
    algorithmSteps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            step.classList.add('highlighted');
        });
        step.addEventListener('mouseleave', () => {
            step.classList.remove('highlighted');
        });
    });
}

// Utility Functions
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

function generateRandomData(n, dimensions = 2) {
    const data = [];
    for (let i = 0; i < n; i++) {
        const point = [];
        for (let j = 0; j < dimensions; j++) {
            point.push(Math.random() * 100);
        }
        data.push(point);
    }
    return data;
}

function calculateDistance(point1, point2, metric = 'euclidean') {
    switch (metric) {
        case 'euclidean':
            return Math.sqrt(
                point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
            );
        case 'manhattan':
            return point1.reduce((sum, val, i) => sum + Math.abs(val - point2[i]), 0);
        case 'minkowski':
            const p = 3; // Default p value
            return Math.pow(
                point1.reduce((sum, val, i) => sum + Math.pow(Math.abs(val - point2[i]), p), 0),
                1/p
            );
        default:
            return 0;
    }
}

// Export functions for use in chapter-specific scripts
window.ClusteringCourse = {
    updateProgressBar,
    updateChapterNavigation,
    navigateToPreviousChapter,
    navigateToNextChapter,
    renderMathFormulas,
    initializeCodeHighlighting,
    initializeInteractiveElements,
    formatNumber,
    generateRandomData,
    calculateDistance
};
