import pytest
from playwright.sync_api import Page, expect

class TestErrorPages:
    """Test error page handling"""
    
    def test_404_page(self, page: Page, base_url: str):
        """Test 404 error page displays correctly"""
        page.goto(f"{base_url}/this-page-does-not-exist", wait_until="networkidle")
        
        # Should show 404 page
        page_content = page.content().lower()
        assert "404" in page_content or "not found" in page_content
    
    def test_invalid_project_404(self, page: Page, base_url: str):
        """Test accessing non-existent project returns 404"""
        page.goto(f"{base_url}/projects/non-existent-project/", wait_until="networkidle")
        
        # Should return 404 or redirect
        page_content = page.content().lower()
        assert "404" in page_content or "not found" in page_content or page.url == f"{base_url}/projects/"
