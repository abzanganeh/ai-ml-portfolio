// Shared JavaScript for Agentic AI Tutorial
// Handles all common functionality across chapters

// Section navigation functionality - dynamically determined from page
let sections = [];
let sectionLabels = [];

function initializeSections() {
    const sectionButtons = document.querySelectorAll('.section-nav-btn');
    sections = [];
    sectionLabels = [];
    
    sectionButtons.forEach(button => {
        const sectionId = button.getAttribute('data-section');
        const sectionLabel = button.textContent.trim();
        sections.push(sectionId);
        sectionLabels.push(sectionLabel);
    });
    
    console.log('Initialized sections:', sections);
    console.log('Initialized labels:', sectionLabels);
}

// Initialize tutorial functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Agentic AI Tutorial: Initializing...');
    
    // Initialize sections from page content
    initializeSections();
    
    // Initialize section navigation
    initializeSectionNavigation();
    
    // Initialize progress bars
    initializeProgressBars();
    
    // Initialize KaTeX rendering for the entire page
    initializeKaTeX();
    
    console.log('Agentic AI Tutorial: Initialization complete');
});

// Initialize KaTeX rendering
function initializeKaTeX() {
    function initKaTeX() {
        if (typeof renderMathInElement !== 'undefined') {
            // Render math in all active sections
            const activeSection = document.querySelector('.content-section.active');
            if (activeSection) {
                renderKaTeXInElement(activeSection);
            }
            // Also render in the entire body for any math outside sections
            renderKaTeXInElement(document.body);
        } else {
            // Retry if KaTeX not loaded yet
            setTimeout(initKaTeX, 100);
        }
    }
    
    // Wait for KaTeX to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", initKaTeX);
    } else {
        initKaTeX();
    }
}

// Render KaTeX math in a specific element
function renderKaTeXInElement(element) {
    if (typeof renderMathInElement !== 'undefined' && element) {
        renderMathInElement(element, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "\\[", right: "\\]", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false}
            ],
            throwOnError: false
        });
    }
}

// Section Navigation Functions
function initializeSectionNavigation() {
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
    
    // Add click event listeners to section navigation buttons
    sectionNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection, this);
        });
    });
}

function showSection(sectionName, clickedElement) {
    console.log('Showing section:', sectionName);
    
    // Hide all content sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all navigation buttons
    const allButtons = document.querySelectorAll('.section-nav-btn');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Section shown:', sectionName);
        
        // Re-render KaTeX math in the newly shown section
        renderKaTeXInElement(targetSection);
    } else {
        console.error('❌ Section not found:', sectionName);
    }
    
    // Add active class to clicked button
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
    
    // Update section progress
    updateSectionProgress(sectionName);
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function updateSectionProgress(sectionName) {
    const sectionIndex = sections.indexOf(sectionName);
    if (sectionIndex !== -1) {
        const progress = ((sectionIndex + 1) / sections.length) * 100;
        const progressFill = document.querySelector('.section-progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }
}

// Progress Bar Functions
function initializeProgressBars() {
    // CRITICAL: Initialize chapter progress from data-progress attribute
    const chapterProgressFill = document.querySelector('.chapter-progress-fill');
    if (chapterProgressFill) {
        const progress = chapterProgressFill.getAttribute('data-progress');
        if (progress) {
            chapterProgressFill.style.width = progress + '%';
        }
    }
    
    // Initialize section progress for first section
    if (sections.length > 0) {
        updateSectionProgress(sections[0]);
    }
}

// Scroll to Section Navigation
function scrollToSectionNav() {
    const sectionNav = document.querySelector('.section-nav');
    const tutorialHeader = document.querySelector('.tutorial-header');
    
    // Try to find section-nav first, then tutorial-header as fallback
    const targetElement = sectionNav || tutorialHeader;
    
    if (targetElement) {
        // Get the header height (fixed header is 70px, but get it dynamically)
        const header = document.querySelector('.azbn-header');
        const headerHeight = header ? header.offsetHeight : 70;
        
        // Get the position of the target element
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        // Scroll to the position accounting for fixed header
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

