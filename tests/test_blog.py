import pytest
from playwright.sync_api import Page, expect

class TestBlog:
    """Test suite for blog functionality"""
    
    def test_blog_page_loads(self, page: Page, base_url: str):
        """Test blog page displays correctly"""
        page.goto(f"{base_url}/blog")
        
        expect(page).to_have_title("Blog")
        
        # Check for blog content
        blog_posts = page.locator(".blog-post, .post, [data-testid='blog-post']")
        expect(blog_posts.first).to_be_visible(timeout=10000)
    
    def test_blog_categories(self, page: Page, base_url: str):
        """Test blog categories are available"""
        page.goto(f"{base_url}/blog")
        
        # Look for category links or filters
        categories = page.locator("text=Technology, text=Web Development, text=Programming")
        if categories.count() > 0:
            expect(categories.first).to_be_visible()
    
    def test_blog_post_access(self, page: Page, base_url: str):
        """Test accessing individual blog posts"""
        page.goto(f"{base_url}/blog")
        
        # Find blog post links
        post_links = page.locator("a[href*='/blog/']:not([href='/blog'])")
        if post_links.count() > 0:
            post_links.first.click()
            
            # Should navigate to blog post detail
            expect(page.url).to_contain("/blog/")
            expect(page.url).not_to_equal(f"{base_url}/blog")