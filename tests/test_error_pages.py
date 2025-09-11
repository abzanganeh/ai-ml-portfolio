import pytest
from playwright.sync_api import Page, expect

class TestErrorPages:
    """Test error page handling"""
    
    def test_404_page(self, page: Page, base_url: str):
        """Test 404 error page displays correctly"""
        # Try to navigate to a non-existent page
        page.goto(f"{base_url}/this-page-does-not-exist")
        page.wait_for_load_state("networkidle")
        
        # Should show 404 page
        page_content = page.content().lower()
        assert "404" in page_content or "not found" in page_content, "404 page should contain '404' or 'not found'"
        
        # Optional: Check that the page title also indicates error
        page_title = page.title().lower()
        assert "404" in page_title or "not found" in page_title or "error" in page_title, "404 page title should indicate error"
    
    def test_invalid_project_404(self, page: Page, base_url: str):
        """Test accessing non-existent project returns 404"""
        page.goto(f"{base_url}/projects/non-existent-project/")
        page.wait_for_load_state("networkidle")
        
        # Should return 404 or redirect to projects page
        page_content = page.content().lower()
        current_url = page.url
        
        # Either should show 404 content or redirect to projects listing
        is_404_page = "404" in page_content or "not found" in page_content
        is_redirected = current_url == f"{base_url}/projects/" or current_url.endswith("/projects")
        
        assert is_404_page or is_redirected, f"Should show 404 or redirect to projects page. Current URL: {current_url}"