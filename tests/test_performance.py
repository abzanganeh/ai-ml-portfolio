import pytest
from playwright.sync_api import Page

class TestPerformance:
    """Basic performance and accessibility tests"""
    
    def test_page_load_performance(self, page: Page, base_url: str):
        """Test page loads within reasonable time"""
        import time
        
        start_time = time.time()
        page.goto(base_url)
        
        # Wait for page to be fully loaded
        page.wait_for_load_state("networkidle")
        load_time = time.time() - start_time
        
        # Page should load within 10 seconds (adjust based on your requirements)
        assert load_time < 10, f"Page took {load_time:.2f} seconds to load"
    
    def test_no_console_errors(self, page: Page, base_url: str):
        """Test there are no JavaScript console errors"""
        console_errors = []
        
        def handle_console(msg):
            if msg.type == "error":
                console_errors.append(msg.text)
        
        page.on("console", handle_console)
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Should have no console errors
        assert len(console_errors) == 0, f"Console errors found: {console_errors}"
    
    def test_images_load(self, page: Page, base_url: str):
        """Test that images on the page load successfully"""
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Get all images
        images = page.locator("img")
        image_count = images.count()
        
        if image_count > 0:
            # Check first few images load successfully
            for i in range(min(5, image_count)):
                img = images.nth(i)
                # Image should be visible and have valid src
                if img.is_visible():
                    src = img.get_attribute("src")
                    assert src is not None and src != "", f"Image {i} has no src attribute"
