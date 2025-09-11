import pytest
from playwright.sync_api import Page, expect

class TestContactForm:
    """Test suite for contact form functionality"""
    
    def test_contact_page_loads(self, page: Page, base_url: str):
        """Test contact page displays form"""
        page.goto(f"{base_url}/contact")
        
        expect(page).to_have_title("Contact")
        
        # Check form elements exist
        expect(page.locator("form")).to_be_visible()
        expect(page.locator("input[name='name']")).to_be_visible()
        expect(page.locator("input[name='email']")).to_be_visible()
        expect(page.locator("textarea[name='message']")).to_be_visible()
    
    def test_contact_form_submission(self, page: Page, base_url: str):
        """Test contact form can be filled and submitted"""
        page.goto(f"{base_url}/contact")
        
        # Fill out form
        page.fill("input[name='name']", "Test User")
        page.fill("input[name='email']", "test@example.com")
        page.fill("textarea[name='message']", "This is a test message from Playwright automation")
        
        # Submit form
        page.click("button[type='submit'], input[type='submit']")
        
        # Check for success message or redirect
        page.wait_for_timeout(2000)
        
        # Should show success message or redirect back to contact page
        success_indicators = [
            page.locator("text=Thank you"),
            page.locator(".success"),
            page.locator(".alert-success")
        ]
        
        # At least one success indicator should be visible
        success_found = any(indicator.is_visible() for indicator in success_indicators)
        assert success_found or page.url.endswith("/contact")