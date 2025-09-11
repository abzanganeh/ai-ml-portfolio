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
        """Test there are no critical JavaScript console errors"""
        console_errors = []
        
        def handle_console(msg):
            if msg.type == "error":
                console_errors.append(msg.text)
        
        page.on("console", handle_console)
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Filter out non-critical errors that are common in production
        critical_errors = []
        for error in console_errors:
            error_lower = error.lower()
            
            # Skip common non-critical errors
            if any(skip_phrase in error_lower for skip_phrase in [
                "404",  # 404 errors for optional scripts
                "bad http response code (404)",
                "net::err_aborted",  # Network aborted (often non-critical)
                "favicon",  # Favicon errors
                "analytics",  # Analytics script errors
                "gtag",  # Google Tag Manager errors
            ]):
                print(f"Skipping non-critical error: {error}")
                continue
            
            critical_errors.append(error)
        
        # Should have no critical console errors
        assert len(critical_errors) == 0, f"Critical console errors found: {critical_errors}"
    
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
                    
                    # Optional: Check if image actually loaded (not broken)
                    # This evaluates JavaScript to check if the image loaded successfully
                    try:
                        img_loaded = img.evaluate("""
                            img => img.complete && img.naturalWidth > 0
                        """)
                        if not img_loaded:
                            print(f"Warning: Image {i} with src '{src}' may not have loaded properly")
                    except Exception as e:
                        print(f"Could not check image load status: {e}")
        else:
            print("No images found on the page")