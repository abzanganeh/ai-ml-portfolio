function initializeSectionNavigation(sections, labels) {
    const sectionButtons = document.querySelectorAll(".section-nav-btn");
    const contentSections = document.querySelectorAll(".content-section");

    sectionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const sectionId = button.dataset.section;
            if (sectionId) {
                showSection(sectionId, sectionButtons, contentSections);
            }
        });
    });

    window.decisionTreeSections = sections;
    window.decisionTreeSectionLabels = labels;
}

function showSection(sectionId, sectionButtons, contentSections) {
    const buttons = sectionButtons || document.querySelectorAll(".section-nav-btn");
    const sections = contentSections || document.querySelectorAll(".content-section");

    sections.forEach((section) => {
        section.classList.toggle("active", section.id === sectionId);
    });

    buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.section === sectionId);
    });

    updateBottomNavigation(sectionId);
}

function updateBottomNavigation(sectionId) {
    const sections = window.decisionTreeSections || [];
    const labels = window.decisionTreeSectionLabels || [];
    const currentIndex = sections.indexOf(sectionId);
    const previousButton = document.getElementById("prev-subsection");
    const nextButton = document.getElementById("next-subsection");
    const previousLabel = document.getElementById("prev-label");
    const nextLabel = document.getElementById("next-label");

    if (!previousButton || !nextButton) {
        return;
    }

    previousButton.style.display = currentIndex > 0 ? "inline-flex" : "none";
    nextButton.style.display = currentIndex >= 0 && currentIndex < sections.length - 1 ? "inline-flex" : "none";

    if (previousLabel && currentIndex > 0) {
        previousLabel.textContent = labels[currentIndex - 1] || sections[currentIndex - 1];
    }

    if (nextLabel && currentIndex >= 0 && currentIndex < sections.length - 1) {
        nextLabel.textContent = labels[currentIndex + 1] || sections[currentIndex + 1];
    }

    previousButton.onclick = () => {
        if (currentIndex > 0) {
            showSection(sections[currentIndex - 1]);
        }
    };

    nextButton.onclick = () => {
        if (currentIndex >= 0 && currentIndex < sections.length - 1) {
            showSection(sections[currentIndex + 1]);
        }
    };
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToSectionNav() {
    const sectionNav = document.querySelector(".section-nav");
    if (sectionNav) {
        sectionNav.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
