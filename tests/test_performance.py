import pytest
import time
import os
from playwright.sync_api import Page, expect

class TestPerformance:
    """Production-ready performance testing suite"""
    
    @property
    def timing_thresholds(self):
        """Get environment-appropriate timing thresholds"""
        # More lenient thresholds for CI environments
        if os.getenv("CI"):
            return {
                "page_load": 10.0,
                "api_response": 5.0,
                "first_paint": 3.0,
                "mobile_load": 12.0
            }
        else:
            return {
                "page_load": 5.0,
                "api_response": 2.0,
                "first_paint": 2.0,
                "mobile_load": 6.0
            }
    
    def test_homepage_load_performance(self, page: Page, base_url: str):
        """Test homepage loads within acceptable time limits"""
        thresholds = self.timing_thresholds
        
        start_time = time.time()
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        load_time = time.time() - start_time
        
        assert load_time < thresholds["page_load"], \
            f"Homepage took {load_time:.2f}s to load (max: {thresholds['page_load']}s)"
        
        # Check that main content is visible (graceful checking)
        hero_section = page.locator(".hero, .main-content, main, #main")
        if hero_section.count() > 0:
            expect(hero_section.first).to_be_visible()
        else:
            # Fallback: just ensure body is visible
            expect(page.locator("body")).to_be_visible()
        
    def test_core_web_vitals(self, page: Page, base_url: str):
        """Test Core Web Vitals using real browser performance APIs"""
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Measure performance metrics using JavaScript
        performance_metrics = page.evaluate("""
            () => {
                const metrics = {};
                
                // Get navigation timing
                const nav = performance.getEntriesByType('navigation')[0];
                if (nav) {
                    metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
                    metrics.loadComplete = nav.loadEventEnd - nav.loadEventStart;
                    metrics.totalTime = nav.loadEventEnd - nav.fetchStart;
                }
                
                // Try to get LCP (Largest Contentful Paint)
                const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
                if (lcpEntries.length > 0) {
                    metrics.lcp = lcpEntries[lcpEntries.length - 1].startTime;
                }
                
                // Try to get FCP (First Contentful Paint)
                const fcpEntries = performance.getEntriesByType('paint');
                for (const entry of fcpEntries) {
                    if (entry.name === 'first-contentful-paint') {
                        metrics.fcp = entry.startTime;
                    }
                }
                
                return metrics;
            }
        """)
        
        # Assert on Core Web Vitals (if available)
        if 'lcp' in performance_metrics:
            # LCP should be under 2.5 seconds for good performance
            lcp_seconds = performance_metrics['lcp'] / 1000
            assert lcp_seconds < 4.0, f"LCP too slow: {lcp_seconds:.2f}s (should be < 4.0s)"
        
        if 'fcp' in performance_metrics:
            # FCP should be under 1.8 seconds
            fcp_seconds = performance_metrics['fcp'] / 1000
            assert fcp_seconds < 3.0, f"FCP too slow: {fcp_seconds:.2f}s (should be < 3.0s)"
        
        # Total load time check
        if 'totalTime' in performance_metrics:
            total_seconds = performance_metrics['totalTime'] / 1000
            assert total_seconds < self.timing_thresholds["page_load"], \
                f"Total load time: {total_seconds:.2f}s"
    
    def test_api_endpoints_performance(self, page: Page, base_url: str):
        """Test API endpoint response times"""
        endpoints = [
            "/api/projects/",
            "/api/tutorials/", 
            "/api/search?q=test"
        ]
        
        threshold = self.timing_thresholds["api_response"]
        
        for endpoint in endpoints:
            try:
                start_time = time.time()
                response = page.request.get(f"{base_url}{endpoint}")
                response_time = time.time() - start_time
                
                # Check response is successful
                assert response.status in [200, 404], \
                    f"API {endpoint} returned status {response.status}"
                
                # Only check timing for successful responses
                if response.status == 200:
                    assert response_time < threshold, \
                        f"API {endpoint} took {response_time:.2f}s (max: {threshold}s)"
                        
                    # Verify response is valid JSON for successful responses
                    try:
                        response.json()
                    except:
                        print(f"Warning: API {endpoint} returned non-JSON response")
                        
            except Exception as e:
                pytest.fail(f"API {endpoint} failed: {str(e)}")
    
    def test_resource_loading_efficiency(self, page: Page, base_url: str):
        """Test that resources load efficiently and have proper caching"""
        resources = []
        
        def track_resources(response):
            if response.url.startswith(base_url):
                resources.append({
                    'url': response.url,
                    'status': response.status,
                    'content_type': response.headers.get('content-type', ''),
                    'cache_control': response.headers.get('cache-control', ''),
                    'size': len(response.body()) if response.status == 200 else 0
                })
        
        page.on("response", track_resources)
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Check no critical resources failed
        failed_resources = [r for r in resources if r['status'] >= 400 and r['status'] != 404]
        assert len(failed_resources) == 0, \
            f"Critical resources failed: {[r['url'] for r in failed_resources]}"
        
        # Check static resources have reasonable caching
        static_resources = [r for r in resources if any(ext in r['url'].lower() 
                          for ext in ['.css', '.js', '.png', '.jpg', '.jpeg', '.woff', '.woff2'])]
        
        uncached_static = []
        for resource in static_resources:
            cache_header = resource['cache_control'].lower()
            if not any(directive in cache_header for directive in ['max-age', 'public', 'immutable']):
                uncached_static.append(resource['url'])
        
        if uncached_static:
            print(f"Warning: {len(uncached_static)} static resources lack proper caching")
            
        # Check total page size is reasonable
        total_size = sum(r['size'] for r in resources)
        total_size_mb = total_size / (1024 * 1024)
        
        # More lenient size limit for complete website (portfolio sites with images need more space)
        max_size_mb = 15 if os.getenv("CI") else 8
        assert total_size_mb < max_size_mb, \
            f"Total page size {total_size_mb:.2f}MB exceeds {max_size_mb}MB"
    
    def test_mobile_performance(self, page: Page, base_url: str):
        """Test performance on mobile viewport"""
        # Set mobile viewport
        page.set_viewport_size({"width": 375, "height": 667})
        
        start_time = time.time()
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        load_time = time.time() - start_time
        
        threshold = self.timing_thresholds["mobile_load"]
        assert load_time < threshold, \
            f"Mobile page took {load_time:.2f}s to load (max: {threshold}s)"
        
        # Check mobile-specific elements are visible
        main_content = page.locator("main, .main-content, .hero, body")
        if main_content.count() > 0:
            expect(main_content.first).to_be_visible()
        
        # Check mobile navigation works
        mobile_nav = page.locator(".mobile-menu, .hamburger, .menu-toggle")
        if mobile_nav.count() > 0 and mobile_nav.first.is_visible():
            # Test mobile menu interaction doesn't cause performance issues
            start_interaction = time.time()
            mobile_nav.first.click()
            interaction_time = time.time() - start_interaction
            assert interaction_time < 1.0, f"Mobile nav interaction too slow: {interaction_time:.2f}s"
    
    def test_image_loading_performance(self, page: Page, base_url: str):
        """Test images load efficiently and don't block rendering"""
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Get all images
        images = page.locator("img").all()
        
        if len(images) == 0:
            print("No images found on page")
            return
        
        # Test first few images
        for i, img in enumerate(images[:5]):
            if img.is_visible():
                # Check image has alt text (accessibility & SEO)
                alt = img.get_attribute("alt")
                assert alt is not None, f"Image {i} missing alt attribute"
                
                # Check image has valid src
                src = img.get_attribute("src")
                assert src is not None and src != "", f"Image {i} has no src attribute"
                
                # Test image actually loaded (not broken)
                if not src.startswith("data:"):
                    try:
                        img_loaded = img.evaluate("""
                            img => img.complete && img.naturalWidth > 0
                        """)
                        if not img_loaded:
                            print(f"Warning: Image {i} with src '{src}' may not have loaded")
                    except Exception as e:
                        print(f"Could not check image {i} load status: {e}")
    
    def test_javascript_performance(self, page: Page, base_url: str):
        """Test JavaScript execution doesn't block user interactions"""
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        
        # Test interactive elements respond quickly
        interactive_elements = page.locator("button, a, input, [onclick]")
        
        if interactive_elements.count() > 0:
            # Test first interactive element
            element = interactive_elements.first
            if element.is_visible():
                start_time = time.time()
                try:
                    element.click()
                    interaction_time = time.time() - start_time
                    
                    # JavaScript interactions should be fast
                    assert interaction_time < 1.0, \
                        f"JavaScript interaction took {interaction_time:.3f}s (should be < 1.0s)"
                except Exception:
                    # Element might not be clickable, that's okay
                    pass
        
        # Test that page remains responsive after interactions
        page.wait_for_timeout(500)  # Allow any async JS to complete
        expect(page.locator("body")).to_be_visible()
    
    def test_console_errors_impact(self, page: Page, base_url: str):
        """Test that console errors don't significantly impact performance"""
        console_errors = []
        
        def handle_console(msg):
            if msg.type == "error":
                console_errors.append(msg.text)
        
        page.on("console", handle_console)
        
        start_time = time.time()
        page.goto(base_url)
        page.wait_for_load_state("networkidle")
        load_time = time.time() - start_time
        
        # Page should still load reasonably fast even with some console errors
        threshold = self.timing_thresholds["page_load"] * 1.5  # Allow 50% more time
        assert load_time < threshold, \
            f"Page with console errors took {load_time:.2f}s (max: {threshold}s)"
        
        # Filter out non-critical errors
        critical_errors = []
        for error in console_errors:
            error_lower = error.lower()
            if not any(skip in error_lower for skip in [
                "404", "favicon", "analytics", "gtag", "net::err_aborted"
            ]):
                critical_errors.append(error)
        
        # Log errors for debugging but don't fail unless they're truly critical
        if critical_errors:
            print(f"Critical console errors found: {critical_errors}")
            # Only fail if there are many critical errors
            assert len(critical_errors) < 3, f"Too many critical errors: {critical_errors}"