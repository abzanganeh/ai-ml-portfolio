import pytest
from playwright.sync_api import Page, expect

class TestHomepage:
    """Test suite for the main homepage functionality"""
    
    def test_homepage_loads_successfully(self, page: Page, base_url: str):
        """Test that homepage loads with expected elements"""
        page.goto(base_url)
        
        # Check page loads with the actual title from your app.py
        expect(page).to_have_title("Alireza Barzin Zanganeh - ML/Data Science Portfolio")
        
        # Check main navigation exists
        expect(page.locator("nav, .navbar, .navigation")).to_be_visible()
        
    def test_hero_section_content(self, page: Page, base_url: str):
        """Test hero section displays correctly based on your index.html"""
        page.goto(base_url)
        
        # Check for hero section and title from your template
        expect(page.locator(".hero")).to_be_visible()
        expect(page.locator("h1.hero-title")).to_contain_text("Machine Learning & Data Science Portfolio")
        expect(page.locator(".hero-subtitle")).to_contain_text("Transforming data into insights")
        
        # Check hero action buttons
        expect(page.locator('.hero-actions a[href="/projects/"]')).to_be_visible()
        expect(page.locator('.hero-actions a[href="/about"]')).to_be_visible()
        
    def test_featured_projects_section(self, page: Page, base_url: str):
        """Test featured projects section matches your structure"""
        page.goto(base_url)
        
        # Check featured projects section exists
        expect(page.locator(".featured-projects")).to_be_visible()
        expect(page.locator('h2:has-text("Featured Projects")')).to_be_visible()
        
        # Check if project cards exist (conditional since they depend on data)
        project_cards = page.locator(".project-card.featured")
        if project_cards.count() > 0:
            expect(project_cards.first).to_be_visible()
            # Check project card structure
            expect(project_cards.first.locator(".project-title")).to_be_visible()
            expect(project_cards.first.locator(".project-description")).to_be_visible()
    
    def test_recent_tutorials_section(self, page: Page, base_url: str):
        """Test recent tutorials section from your template"""
        page.goto(base_url)
        
        # Check recent tutorials section
        expect(page.locator(".recent-tutorials")).to_be_visible()
        expect(page.locator('h2:has-text("Latest Tutorials")')).to_be_visible()
        
        # Check if tutorial cards exist
        tutorial_cards = page.locator(".tutorial-card")
        if tutorial_cards.count() > 0:
            expect(tutorial_cards.first).to_be_visible()
    
    def test_navigation_links_work(self, page: Page, base_url: str):
        """Test main navigation links work correctly"""
        page.goto(base_url)
        
        # Test Projects link from hero section
        page.click('.hero-actions a[href="/projects/"]')
        expect(page).to_have_url(f"{base_url}/projects/")
        
        # Go back and test About link
        page.goto(base_url)
        page.click('.hero-actions a[href="/about"]')
        expect(page).to_have_url(f"{base_url}/about")
        
        # Test "View All Projects" link if it exists
        page.goto(base_url)
        view_all_projects = page.locator('a[href="/projects/"]:has-text("View All Projects")')
        if view_all_projects.count() > 0:
            view_all_projects.click()
            expect(page).to_have_url(f"{base_url}/projects/")
    
    def test_cta_section(self, page: Page, base_url: str):
        """Test call-to-action section"""
        page.goto(base_url)
        
        # Check CTA section exists
        cta_section = page.locator(".cta")
        if cta_section.count() > 0:
            expect(cta_section).to_be_visible()
            expect(cta_section.locator('a[href="/contact"]')).to_be_visible()
    
    def test_section_footers_links(self, page: Page, base_url: str):
        """Test section footer links work"""
        page.goto(base_url)
        
        # Test "View All Tutorials" link if it exists
        view_all_tutorials = page.locator('a[href="/tutorials/"]:has-text("View All Tutorials")')
        if view_all_tutorials.count() > 0:
            view_all_tutorials.click()
            expect(page).to_have_url(f"{base_url}/tutorials/")
    
    def test_responsive_hero_elements(self, page: Page, base_url: str):
        """Test hero elements are responsive"""
        page.goto(base_url)
        
        # Test on mobile viewport
        page.set_viewport_size({"width": 375, "height": 667})
        expect(page.locator(".hero")).to_be_visible()
        expect(page.locator(".hero-title")).to_be_visible()
        
        # Test on desktop viewport
        page.set_viewport_size({"width": 1280, "height": 720})
        expect(page.locator(".hero")).to_be_visible()
        expect(page.locator(".hero-actions")).to_be_visible()