/**
 * Main JavaScript file - Python API Integration
 * This file replaces the original main.js and uses Python APIs instead of local JavaScript functions
 */

// Global configuration
const API_BASE_URL = '/api';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Python API integration...');
    
    // Initialize all components
    initSearch();
    initContactForm();
    initThemeToggle();
    initNavigation();
    initNotifications();
    
    console.log('✅ Python API integration initialized successfully!');
});

/**
 * Search functionality using Python API
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    // Handle search input
    searchInput.addEventListener('input', debounce(performSearch, 300));
    if (searchButton) {
        searchButton.addEventListener('click', () => performSearch());
    }
    
    async function performSearch() {
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        try {
            showSearchLoading();
            
            const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            
            if (response.ok) {
                displaySearchResults(results, query);
            } else {
                showSearchError('Search failed. Please try again.');
            }
        } catch (error) {
            console.error('Search error:', error);
            showSearchError('Search failed. Please check your connection.');
        }
    }
    
    function displaySearchResults(results, query) {
        if (!searchResults) return;
        
        const totalResults = (results.tutorials?.length || 0) + 
                           (results.projects?.length || 0) + 
                           (results.blog_posts?.length || 0);
        
        if (totalResults === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No results found for "${query}"</p>
                </div>
            `;
        } else {
            let html = `<div class="search-results-header">
                <p>Found ${totalResults} results for "${query}"</p>
            </div>`;
            
            // Display tutorials
            if (results.tutorials?.length > 0) {
                html += '<div class="search-section"><h4>Tutorials</h4>';
                results.tutorials.forEach(tutorial => {
                    html += `
                        <div class="search-result-item">
                            <a href="/tutorials/${tutorial.slug}/">
                                <h5>${tutorial.title}</h5>
                                <p>${tutorial.description}</p>
                                <span class="search-category">${tutorial.category}</span>
                            </a>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            // Display projects
            if (results.projects?.length > 0) {
                html += '<div class="search-section"><h4>Projects</h4>';
                results.projects.forEach(project => {
                    html += `
                        <div class="search-result-item">
                            <a href="/projects/${project.name}/">
                                <h5>${project.title}</h5>
                                <p>${project.description}</p>
                                <span class="search-category">${project.category}</span>
                            </a>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            // Display blog posts
            if (results.blog_posts?.length > 0) {
                html += '<div class="search-section"><h4>Blog Posts</h4>';
                results.blog_posts.forEach(post => {
                    html += `
                        <div class="search-result-item">
                            <a href="/blog/${post.slug}">
                                <h5>${post.title}</h5>
                                <p>${post.excerpt}</p>
                                <span class="search-category">${post.category}</span>
                            </a>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            searchResults.innerHTML = html;
        }
        
        showSearchResults();
    }
    
    function showSearchLoading() {
        if (searchResults) {
            searchResults.innerHTML = '<div class="search-loading"><p>Searching...</p></div>';
            showSearchResults();
        }
    }
    
    function showSearchError(message) {
        if (searchResults) {
            searchResults.innerHTML = `<div class="search-error"><p>${message}</p></div>`;
            showSearchResults();
        }
    }
    
    function showSearchResults() {
        if (searchResults) {
            searchResults.style.display = 'block';
        }
    }
    
    function hideSearchResults() {
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
}

/**
 * Contact form handling using Python API
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        try {
            showFormLoading();
            
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification(result.error || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            hideFormLoading();
        }
    });
    
    function showFormLoading() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }
    }
    
    function hideFormLoading() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    }
}

/**
 * Theme toggle using Python API
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Load current theme
    loadCurrentTheme();
    
    themeToggle.addEventListener('click', async function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        
        try {
            const response = await fetch(`${API_BASE_URL}/theme-toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_theme: currentTheme,
                    user_id: 'anonymous' // In a real app, this would be the actual user ID
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                applyTheme(result.theme);
                showNotification(`Theme changed to ${result.theme}`, 'info');
            }
        } catch (error) {
            console.error('Theme toggle error:', error);
            // Fallback to local toggle
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });
    
    function loadCurrentTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button text
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }
}

/**
 * Navigation state management using Python API
 */
function initNavigation() {
    // Save navigation state on page changes
    window.addEventListener('beforeunload', async function() {
        try {
            await fetch(`${API_BASE_URL}/navigation-state`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 'anonymous',
                    current_page: window.location.pathname,
                    theme: document.documentElement.getAttribute('data-theme') || 'light'
                })
            });
        } catch (error) {
            console.error('Navigation state save error:', error);
        }
    });
    
    // Load navigation state on page load
    loadNavigationState();
    
    async function loadNavigationState() {
        try {
            const response = await fetch(`${API_BASE_URL}/navigation-state?user_id=anonymous&page=${window.location.pathname}`);
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Apply any saved navigation state
                if (result.state.theme && typeof applyTheme === 'function') {
                    applyTheme(result.state.theme);
                }
            }
        } catch (error) {
            console.error('Navigation state load error:', error);
        }
    }
}

/**
 * Notification system using Python API
 */
function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Also send to Python API for logging
    sendNotificationToAPI(message, type);
}

async function sendNotificationToAPI(message, type) {
    try {
        await fetch(`${API_BASE_URL}/notification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                type: type,
                duration: 5000
            })
        });
    } catch (error) {
        console.error('Notification API error:', error);
    }
}

/**
 * Form validation using Python API
 */
async function validateField(fieldName, fieldValue, fieldType) {
    try {
        const response = await fetch(`${API_BASE_URL}/form-validation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                field_name: fieldName,
                field_value: fieldValue,
                field_type: fieldType
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Validation error:', error);
        return { valid: true, message: '' }; // Fallback to valid
    }
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export functions for global access
window.showNotification = showNotification;
window.validateField = validateField;
window.scrollToTop = scrollToTop;

