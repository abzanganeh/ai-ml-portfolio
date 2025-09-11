import pytest
from playwright.sync_api import Page, expect

class TestResponsiveDesign:
    """Test suite for responsive design across different viewport sizes"""
    
    @pytest.mark.parametrize("viewport", [
        {"width": 375, "height": 667},   # Mobile
        {"width": 768, "height": 1024},  # Tablet
        {"width": 1280, "height": 720},  # Desktop
        {"width": 1920, "height": 1080}  # Large Desktop
    ])
    def test_responsive_layout(self, page: Page, base_url: str, viewport: dict):
        """Test layout works across different screen sizes"""
        # Fix: Use dictionary format for set_viewport_size
        page.set_viewport_size(viewport)
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Check page loads
        expect(page.locator("body")).to_be_visible()
        
        # Check navigation is accessible (might be hamburger menu on mobile)
        nav = page.locator("nav, .navbar, .navigation")
        expect(nav).to_be_visible()
        
        # Check main content area
        main_content = page.locator("main, .main-content, .content")
        if main_content.count() > 0:
            expect(main_content).to_be_visible()
    
    def test_mobile_navigation(self, page: Page, base_url: str):
        """Test mobile navigation functionality"""
        # Fix: Use dictionary format for set_viewport_size
        page.set_viewport_size({"width": 375, "height": 667})  # Mobile viewport
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Look for mobile menu toggle
        mobile_toggle = page.locator(".menu-toggle, .hamburger, .mobile-menu-btn, [data-testid='mobile-menu']")
        
        if mobile_toggle.count() > 0 and mobile_toggle.is_visible():
            # Click mobile menu toggle
            mobile_toggle.click()
            
            # Wait a moment for animation
            page.wait_for_timeout(300)
            
            # Navigation menu should become visible
            nav_menu = page.locator(".mobile-menu, .nav-menu.open, .navigation.open")
            expect(nav_menu).to_be_visible()
        else:
            # If no mobile toggle found, just verify navigation is still accessible
            nav = page.locator("nav, .navbar, .navigation")
            expect(nav).to_be_visible()