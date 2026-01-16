// Shared JavaScript for Neural Networks Tutorial
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
    console.log('Neural Networks Tutorial: Initializing...');
    
    // Initialize sections from page content
    initializeSections();

    // Normalize any non-LaTeX formula blocks before KaTeX renders
    normalizeFormulaBlocks();
    
    // Initialize section navigation
    initializeSectionNavigation();
    
    // Initialize progress bars
    initializeProgressBars();
    
    console.log('Neural Networks Tutorial: Initialization complete');
});

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

// Normalize formula-display blocks to KaTeX-friendly content
function normalizeFormulaBlocks() {
    const blocks = document.querySelectorAll('.formula-display');
    if (!blocks.length) {
        return;
    }

    blocks.forEach(block => {
        const html = block.innerHTML;
        if (html.includes('\\[') || html.includes('\\(')) {
            return;
        }

        let latex = html;
        latex = latex.replace(/<br\s*\/?>/gi, ' __BR__ ');
        latex = latex.replace(/<\/p>\s*<p[^>]*>/gi, ' __BR__ ');
        latex = latex.replace(/<\/?strong>/gi, '');
        latex = latex.replace(/<sub>(.*?)<\/sub>/gi, '_{$1}');
        latex = latex.replace(/<sup>(.*?)<\/sup>/gi, '^{$1}');
        latex = latex.replace(/<[^>]+>/g, '');

        const replacements = [
            ['Σ', '\\sum'],
            ['×', '\\times'],
            ['≥', '\\ge'],
            ['≤', '\\le'],
            ['→', '\\rightarrow'],
            ['…', '\\ldots'],
            ['∂', '\\partial'],
            ['δ', '\\delta'],
            ['λ', '\\lambda'],
            ['β', '\\beta'],
            ['η', '\\eta'],
            ['∇', '\\nabla'],
            ['√', '\\sqrt'],
            ['⊙', '\\odot'],
            ['ᵀ', '^T'],
            ['²', '^2'],
            ['ᵢ', '_i'],
            ['₀', '_0'],
            ['₁', '_1'],
            ['₂', '_2'],
            ['₃', '_3'],
            ['₄', '_4'],
            ['₅', '_5'],
            ['₆', '_6'],
            ['₇', '_7'],
            ['₈', '_8'],
            ['₉', '_9']
        ];

        replacements.forEach(([from, to]) => {
            latex = latex.split(from).join(to);
        });

        latex = latex.replace(/\s+/g, ' ').trim();
        latex = latex.replace(/__BR__/g, ' \\\\ ');

        block.innerHTML = `\\[${latex}\\]`;
    });
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

