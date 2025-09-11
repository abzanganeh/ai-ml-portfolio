import pytest
from playwright.sync_api import Page, expect

class TestSkillsPage:
    """Test suite for skills/about page functionality"""
    
    def test_skills_page_loads(self, page: Page, base_url: str):
        """Test skills page displays correctly"""
        page.goto(f"{base_url}/skills")
        
        expect(page).to_have_title("Skills")
        
        # Check for skills content
        skills_section = page.locator(".skills, .expertise, [data-testid='skills']")
        expect(skills_section.first).to_be_visible()
    
    def test_about_page_loads(self, page: Page, base_url: str):
        """Test about page displays correctly"""
        page.goto(f"{base_url}/about")
        
        expect(page).to_have_title("About")
        
        # Check for about content
        expect(page.locator("h1, h2")).to_be_visible()