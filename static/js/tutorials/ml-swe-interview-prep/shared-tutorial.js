/**
 * Minimal section navigator for ML SWE interview prep chapters.
 * Expects `.section-nav button` pairs with onclick="showSection('id')"`
 * and matching `.content-section` elements by id.
 */
function showSection(sectionName) {
    const root = document.querySelector(".mip-prep-root") || document;

    root.querySelectorAll(".content-section").forEach(function (section) {
        section.classList.remove("active");
    });

    const target = document.getElementById(sectionName);
    if (target) {
        target.classList.add("active");
    }

    root.querySelectorAll(".section-nav button").forEach(function (btn) {
        btn.classList.remove("active");
    });

    const candidates = root.querySelectorAll('.section-nav button[onclick*="showSection(\'' + sectionName + '\')"]');
    if (candidates.length) {
        candidates[0].classList.add("active");
    }
}

window.showSection = showSection;
