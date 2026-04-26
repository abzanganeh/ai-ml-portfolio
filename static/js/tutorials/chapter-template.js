class TutorialChapterTemplate {
    constructor(documentRoot = document) {
        this.documentRoot = documentRoot;
        this.sectionLinks = Array.from(
            this.documentRoot.querySelectorAll('.tutorial-template-section-nav__link')
        );
        this.sections = this.sectionLinks
            .map((link) => this.getLinkedSection(link))
            .filter(Boolean);
        this.activeSectionClass = 'is-active';
        this.observer = null;
    }

    initialize() {
        this.initializeSectionNavigation();
        this.initializeSectionObserver();
        this.initializeLabResetControls();
        this.initializeHashTarget();
    }

    initializeSectionNavigation() {
        this.sectionLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const target = this.getLinkedSection(link);

                if (!target) {
                    return;
                }

                event.preventDefault();
                this.activateLegacyContentSection(target);
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.setActiveSection(link);
            });
        });
    }

    initializeSectionObserver() {
        if (!('IntersectionObserver' in window) || this.sections.length === 0) {
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries.find((entry) => entry.isIntersecting);

                if (!visibleEntry) {
                    return;
                }

                const activeLink = this.sectionLinks.find(
                    (link) => link.getAttribute('href') === `#${visibleEntry.target.id}`
                );

                if (activeLink) {
                    this.setActiveSection(activeLink);
                }
            },
            {
                rootMargin: '-25% 0px -65% 0px',
                threshold: 0,
            }
        );

        this.sections.forEach((section) => this.observer.observe(section));
    }

    initializeLabResetControls() {
        const resetButtons = this.documentRoot.querySelectorAll('[data-tutorial-lab-reset]');

        resetButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const lab = button.closest('.tutorial-template-lab');

                if (!lab) {
                    return;
                }

                lab.querySelectorAll('input, select, textarea').forEach((field) => {
                    if (field instanceof HTMLInputElement && ['checkbox', 'radio'].includes(field.type)) {
                        field.checked = field.defaultChecked;
                        return;
                    }

                    if (field instanceof HTMLSelectElement) {
                        Array.from(field.options).forEach((option) => {
                            option.selected = option.defaultSelected;
                        });
                        return;
                    }

                    field.value = field.defaultValue;
                });

                lab.dispatchEvent(new CustomEvent('tutorial:lab-reset', { bubbles: true }));
            });
        });
    }

    initializeHashTarget() {
        if (!window.location.hash) {
            return;
        }

        const target = this.documentRoot.querySelector(window.location.hash);
        if (target) {
            this.activateLegacyContentSection(target);
        }
    }

    activateLegacyContentSection(target) {
        if (!target.classList.contains('content-section')) {
            return;
        }

        this.documentRoot.querySelectorAll('.content-section').forEach((section) => {
            section.classList.toggle('active', section === target);
        });

        this.documentRoot.querySelectorAll('.section-nav-btn').forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-section') === target.id);
        });
    }

    setActiveSection(activeLink) {
        this.sectionLinks.forEach((link) => {
            link.classList.toggle(this.activeSectionClass, link === activeLink);
        });
    }

    getLinkedSection(link) {
        const selector = link.getAttribute('href');

        if (!selector || !selector.startsWith('#')) {
            return null;
        }

        return this.documentRoot.querySelector(selector);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const template = new TutorialChapterTemplate();
    template.initialize();
    window.TutorialChapterTemplate = template;
});
