import re
import pytest
from playwright.sync_api import Page, expect

class TestProjects:
    """Test suite for projects functionality based on your actual structure"""
    
    def test_projects_page_loads(self, page: Page, base_url: str):
        """Test projects page loads with correct structure"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Check page title and header from your template
        expect(page.locator(".page-header h1")).to_contain_text("My Projects")
        expect(page.locator(".page-header p")).to_contain_text("Explore my data science and machine learning projects")
        
        # Check if projects grid exists
        expect(page.locator(".projects-grid")).to_be_visible()
        
    def test_project_cards_display(self, page: Page, base_url: str):
        """Test project cards display correctly"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Check if project cards exist (conditional since depends on data)
        project_cards = page.locator(".project-card")
        if project_cards.count() > 0:
            first_card = project_cards.first
            expect(first_card).to_be_visible()
            
            # Check project card structure from your template
            expect(first_card.locator(".project-info")).to_be_visible()
            expect(first_card.locator(".project-title")).to_be_visible()
            expect(first_card.locator(".project-description")).to_be_visible()
            expect(first_card.locator(".project-actions")).to_be_visible()
            
            # Check for action buttons
            view_details_btn = first_card.locator('.project-actions a:has-text("View Details")')
            expect(view_details_btn).to_be_visible()
    
    def test_category_filter_section(self, page: Page, base_url: str):
        """Test category filtering functionality"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Check filter section exists
        expect(page.locator(".filter-section")).to_be_visible()
        expect(page.locator(".filter-section h3")).to_contain_text("Filter by Category")
        
        # Check filter buttons exist
        filter_buttons = page.locator(".filter-btn")
        if filter_buttons.count() > 0:
            expect(filter_buttons.first).to_be_visible()
            
            # Check "All Projects" button exists and is active
            all_projects_btn = page.locator('.filter-btn:has-text("All Projects")')
            expect(all_projects_btn).to_be_visible()
            # Fix: Check if class contains "active" rather than exact match
            expect(all_projects_btn).to_have_class(re.compile(r".*active.*"))
    
    def test_category_filtering_functionality(self, page: Page, base_url: str):
        """Test that category filtering works via JavaScript"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Get all filter buttons except "All Projects"
        category_buttons = page.locator('.filter-btn:not(:has-text("All Projects"))')
        
        if category_buttons.count() > 0:
            # Click first category button
            first_category_btn = category_buttons.first
            category_text = first_category_btn.text_content()
            first_category_btn.click()
            
            # Check button becomes active - fix the class check
            expect(first_category_btn).to_have_class(re.compile(r".*active.*"))
            
            # Wait for filtering to complete
            page.wait_for_timeout(500)
            
            # Go back to "All Projects" to reset
            page.locator('.filter-btn:has-text("All Projects")').click()
            expect(page.locator('.filter-btn:has-text("All Projects")')).to_have_class(re.compile(r".*active.*"))
    
    def test_project_images_and_overlays(self, page: Page, base_url: str):
        """Test project images and overlay functionality"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        project_cards = page.locator(".project-card")
        if project_cards.count() > 0:
            # Check for project images
            project_images = page.locator(".project-image")
            if project_images.count() > 0:
                first_image = project_images.first
                expect(first_image).to_be_visible()
                
                # Check image has proper src attribute - fix the assertion
                img_element = first_image.locator("img")
                if img_element.count() > 0:
                    # Check that src attribute exists and is not empty
                    src_value = img_element.get_attribute("src")
                    assert src_value is not None and src_value != "", "Image src attribute should not be empty"
                    
                    # Check alt attribute exists
                    alt_value = img_element.get_attribute("alt")
                    assert alt_value is not None, "Image alt attribute should exist"
                
                # Check for overlay and button
                overlay = first_image.locator(".project-overlay")
                if overlay.count() > 0:
                    expect(overlay.locator('a:has-text("View Project")')).to_be_visible()
    
    def test_featured_project_badges(self, page: Page, base_url: str):
        """Test featured project badges display"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Check for featured badges if any projects are featured
        featured_badges = page.locator(".featured-badge")
        if featured_badges.count() > 0:
            expect(featured_badges.first).to_contain_text("Featured")
    
    def test_project_technology_tags(self, page: Page, base_url: str):
        """Test technology stack tags display"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        project_cards = page.locator(".project-card")
        if project_cards.count() > 0:
            # Check for technology tags
            tech_sections = page.locator(".project-tech")
            if tech_sections.count() > 0:
                first_tech_section = tech_sections.first
                expect(first_tech_section).to_be_visible()
                
                # Check for tech tags
                tech_tags = first_tech_section.locator(".tech-tag")
                if tech_tags.count() > 0:
                    expect(tech_tags.first).to_be_visible()
    
    def test_project_detail_navigation(self, page: Page, base_url: str):
        """Test navigation to project detail pages"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Find "View Details" links
        view_details_links = page.locator('.project-actions a:has-text("View Details")')
        
        if view_details_links.count() > 0:
            # Get the href of the first link
            first_link = view_details_links.first
            href = first_link.get_attribute("href")
            
            if href:
                # Click the link
                first_link.click()
                page.wait_for_load_state("networkidle")
                
                # Should navigate to project detail page - fix the assertion
                expect(page).to_have_url(re.compile(r".*/projects/.*"))
                # Also check that we're not on the main projects page
                assert page.url != f"{base_url}/projects/", "Should navigate away from main projects page"
    
    def test_external_links(self, page: Page, base_url: str):
        """Test external links (GitHub, Demo) have correct attributes"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Check GitHub links
        github_links = page.locator('a[href*="github.com"]')
        if github_links.count() > 0:
            first_github_link = github_links.first
            expect(first_github_link).to_have_attribute("target", "_blank")
            expect(first_github_link).to_contain_text("Code")
        
        # Check Demo links
        demo_links = page.locator('.project-actions a:has-text("Demo")')
        if demo_links.count() > 0:
            first_demo_link = demo_links.first
            expect(first_demo_link).to_have_attribute("target", "_blank")
    
    def test_empty_state_handling(self, page: Page, base_url: str):
        """Test handling when no projects are available"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Check if no-projects section exists (in case there are no projects)
        no_projects_section = page.locator(".no-projects")
        if no_projects_section.count() > 0:
            expect(no_projects_section).to_be_visible()
            expect(no_projects_section).to_contain_text("No projects found")
    
    def test_project_meta_information(self, page: Page, base_url: str):
        """Test project metadata displays correctly"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        project_cards = page.locator(".project-card")
        if project_cards.count() > 0:
            first_card = project_cards.first
            
            # Check for project meta section
            project_meta = first_card.locator(".project-meta")
            if project_meta.count() > 0:
                expect(project_meta).to_be_visible()
                
                # Check for category and status
                category = project_meta.locator(".project-category")
                if category.count() > 0:
                    expect(category).to_be_visible()
    
    def test_responsive_projects_grid(self, page: Page, base_url: str):
        """Test projects grid is responsive"""
        page.goto(f"{base_url}/projects/")
        page.wait_for_load_state("networkidle")
        
        # Test mobile viewport - fix the syntax
        page.set_viewport_size({"width": 375, "height": 667})
        expect(page.locator(".projects-grid")).to_be_visible()
        
        # Test tablet viewport - fix the syntax
        page.set_viewport_size({"width": 768, "height": 1024})
        expect(page.locator(".projects-grid")).to_be_visible()
        
        # Test desktop viewport - fix the syntax
        page.set_viewport_size({"width": 1280, "height": 720})
        expect(page.locator(".projects-grid")).to_be_visible()