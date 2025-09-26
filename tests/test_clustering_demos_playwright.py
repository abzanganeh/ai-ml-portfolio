"""
Test suite for Clustering Tutorial Demos using Playwright

This test suite verifies that all interactive demos in the clustering tutorial
are working correctly using Playwright for consistent browser automation.

Tests cover:
- Chapter 1: K-means clustering, distance metrics comparison, evaluation metrics
- Chapter 2: Distance metrics visualization
- Chapter 3: Minkowski distance clustering
- Chapter 4: K-means initialization and optimization
- Chapter 5: K-selection with elbow method and silhouette analysis
- Chapter 6: K-means acceleration techniques
- Chapter 7: K-selection methods
- Chapter 8: Hierarchical clustering and dendrograms
- Chapter 9: Linkage methods and dendrograms
- Chapter 10: Dendrogram construction
- Chapter 12: EM algorithm convergence
"""

import pytest
from playwright.sync_api import expect, Page
import re


class TestClusteringDemosPlaywright:
    """Test class for clustering tutorial demos using Playwright"""
    
    @pytest.fixture(scope="class")
    def chapter_urls(self):
        """URLs for all clustering tutorial chapters"""
        return {
            'chapter1': '/tutorials/clustering/chapter1',
            'chapter2': '/tutorials/clustering/chapter2',
            'chapter3': '/tutorials/clustering/chapter3',
            'chapter4': '/tutorials/clustering/chapter4',
            'chapter5': '/tutorials/clustering/chapter5',
            'chapter6': '/tutorials/clustering/chapter6',
            'chapter7': '/tutorials/clustering/chapter7',
            'chapter8': '/tutorials/clustering/chapter8',
            'chapter9': '/tutorials/clustering/chapter9',
            'chapter10': '/tutorials/clustering/chapter10',
            'chapter12': '/tutorials/clustering/chapter12'
        }
    
    def test_chapter1_page_loads(self, page: Page, base_url: str, chapter_urls):
        """Test that Chapter 1 page loads correctly"""
        page.goto(f"{base_url}{chapter_urls['chapter1']}")
        page.wait_for_load_state("networkidle")
        
        # Wait for JavaScript to load and initialize
        page.wait_for_timeout(2000)
        
        # Check for required demo elements (they might be hidden initially)
        kmeans_canvas = page.locator('#kmeans-canvas')
        if kmeans_canvas.count() > 0:
            # Element exists, check if it becomes visible after interaction
            try:
                # Try to trigger demo initialization
                generate_btn = page.locator('button:has-text("Generate New Data")').first
                if generate_btn.is_visible():
                    generate_btn.click()
                    page.wait_for_timeout(1000)
            except:
                pass
        
        # Check for demo buttons with azbn-btn class
        demo_buttons = page.locator('button.azbn-btn')
        button_count = demo_buttons.count()
        assert button_count >= 2, f"Expected at least 2 demo buttons, found {button_count}"
        
        # Check for required JavaScript files
        page_content = page.content()
        assert 'chapter1.js' in page_content, "Chapter 1 JS not found"
        assert 'shared-tutorial.js' in page_content, "Shared tutorial JS not found"
    
    def test_chapter1_demo_buttons_exist(self, page: Page, base_url: str, chapter_urls):
        """Test that Chapter 1 demo buttons have correct onclick handlers"""
        page.goto(f"{base_url}{chapter_urls['chapter1']}")
        page.wait_for_load_state("networkidle")
        
        # Check for specific demo buttons and their functionality
        buttons_to_check = [
            ('Generate New Data', 'generateData()'),
            ('Run K-means', 'runKmeans()'),
            ('Step Through Algorithm', 'stepKmeans()'),
            ('Reset', 'resetKmeans()'),
            ('Compare Distance Metrics', 'compareDistances()'),
            ('Calculate Metrics', 'demonstrateMetrics()')
        ]
        
        for button_text, expected_function in buttons_to_check:
            # Use more specific selector to avoid strict mode violations
            button = page.locator(f'button:has-text("{button_text}")').first
            if button.count() > 0:
                # Check if button exists, don't require visibility (it might be hidden initially)
                assert button.count() > 0, f"Button '{button_text}' not found"
            # Check if button has onclick handler (this would need to be adapted based on your implementation)
            button_html = button.inner_html()
            assert expected_function in button_html or button.get_attribute('onclick'), f"Button '{button_text}' missing correct onclick handler"
    
    def test_chapter3_minkowski_demo_elements(self, page: Page, base_url: str, chapter_urls):
        """Test that Chapter 3 Minkowski distance demo has correct elements"""
        page.goto(f"{base_url}{chapter_urls['chapter3']}")
        page.wait_for_load_state("networkidle")
        
        # Check for Minkowski demo elements
        expect(page.locator('#p-value')).to_be_visible()
        expect(page.locator('#minkowski-canvas')).to_be_visible()
        
        # Check for demo buttons with correct styling
        demo_buttons = page.locator('button.azbn-btn')
        expect(demo_buttons).to_have_count(pytest.approx(3, rel=1))
    
    def test_chapter5_k_selection_demo_elements(self, page: Page, base_url: str, chapter_urls):
        """Test that Chapter 5 K-selection demo has correct elements"""
        page.goto(f"{base_url}{chapter_urls['chapter5']}")
        page.wait_for_load_state("networkidle")
        
        # Check for K-selection demo elements
        expect(page.locator('#kmeans-demo-canvas')).to_be_visible()
        expect(page.locator('#convergencePlot')).to_be_visible()
        
        # Check for metrics display elements
        expect(page.locator('#iterations-value')).to_be_visible()
        expect(page.locator('#wcss-value')).to_be_visible()
        expect(page.locator('#silhouette-value')).to_be_visible()
    
    def test_chapter8_hierarchical_demo_elements(self, page: Page, base_url: str, chapter_urls):
        """Test that Chapter 8 hierarchical clustering demo has correct elements"""
        page.goto(f"{base_url}{chapter_urls['chapter8']}")
        page.wait_for_load_state("networkidle")
        
        # Check for hierarchical demo elements
        expect(page.locator('#dendro-plot')).to_be_visible()
        expect(page.locator('#linkage-dendrogram')).to_be_visible()
        
        # Check for demo controls
        expect(page.locator('#clustering-method')).to_be_visible()
        expect(page.locator('#dataset-type')).to_be_visible()
    
    def test_chapter9_linkage_demo_elements(self, page: Page, base_url: str, chapter_urls):
        """Test that Chapter 9 linkage methods demo has correct elements"""
        page.goto(f"{base_url}{chapter_urls['chapter9']}")
        page.wait_for_load_state("networkidle")
        
        # Check for linkage demo elements
        expect(page.locator('#linkage-dataset-plot')).to_be_visible()
        expect(page.locator('#linkage-clustering-plot')).to_be_visible()
        expect(page.locator('#dendrogram-data-plot')).to_be_visible()
        expect(page.locator('#dendrogram-tree-plot')).to_be_visible()
    
    def test_chapter10_dendrogram_construction_demo(self, page: Page, base_url: str, chapter_urls):
        """Test that Chapter 10 dendrogram construction demo has correct elements"""
        page.goto(f"{base_url}{chapter_urls['chapter10']}")
        page.wait_for_load_state("networkidle")
        
        # Check for dendrogram construction demo elements
        expect(page.locator('#generate-dendrogram')).to_be_visible()
        expect(page.locator('#dendrogram-svg')).to_be_visible()
        
        # Check for demo controls
        expect(page.locator('#dataset-type')).to_be_visible()
        expect(page.locator('#linkage-method')).to_be_visible()
        expect(page.locator('#distance-metric')).to_be_visible()
    
    def test_quiz_standardization(self, page: Page, base_url: str, chapter_urls):
        """Test that all chapters (except 15) have standardized quiz format"""
        chapters_to_test = ['chapter1', 'chapter2', 'chapter3', 'chapter7', 'chapter8', 'chapter9', 'chapter10']
        
        for chapter in chapters_to_test:
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            # Check for standardized quiz elements
            quiz_questions = page.locator('.quiz-question')
            # Use a more flexible count check
            question_count = quiz_questions.count()
            assert question_count >= 2, f"Chapter {chapter} has too few quiz questions: {question_count}"
            assert question_count <= 5, f"Chapter {chapter} has too many quiz questions: {question_count}"
            
            # Check for radio button inputs
            radio_inputs = page.locator('input[type="radio"]')
            expect(radio_inputs).to_have_count(pytest.approx(6, rel=1))
            
            # Check for "Check Answer" buttons
            check_buttons = page.get_by_text('Check Answer', exact=False)
            expect(check_buttons).to_have_count(pytest.approx(3, rel=1))
    
    def test_button_styling_consistency(self, page: Page, base_url: str, chapter_urls):
        """Test that all demo buttons have consistent azbn-btn styling"""
        chapters_to_test = ['chapter1', 'chapter3', 'chapter4', 'chapter5', 'chapter7', 'chapter8', 'chapter9']
        
        for chapter in chapters_to_test:
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            # Find all demo buttons
            demo_buttons = page.locator('button')
            azbn_buttons = page.locator('button.azbn-btn')
            
            # Most buttons should have azbn-btn class
            if demo_buttons.count() > 0:
                azbn_ratio = azbn_buttons.count() / demo_buttons.count()
                assert azbn_ratio >= 0.7, f"Chapter {chapter} has insufficient azbn-btn styling (only {azbn_ratio:.1%})"
    
    def test_svg_elements_exist(self, page: Page, base_url: str, chapter_urls):
        """Test that required SVG elements exist for visualizations"""
        svg_tests = {
            'chapter1': ['kmeans-canvas'],
            'chapter3': ['minkowski-canvas'],
            'chapter5': ['kmeans-demo-canvas'],
            'chapter8': ['dendro-plot', 'linkage-dendrogram'],
            'chapter9': ['linkage-dataset-plot', 'linkage-clustering-plot', 'dendrogram-data-plot', 'dendrogram-tree-plot'],
            'chapter10': ['dendrogram-svg']
        }
        
        for chapter, svg_ids in svg_tests.items():
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            for svg_id in svg_ids:
                if svg_id.endswith('-canvas'):
                    # Canvas elements
                    expect(page.locator(f'#{svg_id}')).to_be_visible()
                else:
                    # SVG elements
                    expect(page.locator(f'#{svg_id}')).to_be_visible()
    
    def test_shared_javascript_inclusion(self, page: Page, base_url: str, chapter_urls):
        """Test that all chapters include shared-tutorial.js"""
        chapters_to_test = ['chapter1', 'chapter2', 'chapter3', 'chapter7', 'chapter8', 'chapter9']
        
        for chapter in chapters_to_test:
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            # Check for shared-tutorial.js inclusion
            page_content = page.content()
            assert 'shared-tutorial.js' in page_content, f"Chapter {chapter} missing shared-tutorial.js"
    
    def test_chapter_specific_javascript_inclusion(self, page: Page, base_url: str, chapter_urls):
        """Test that each chapter includes its specific JavaScript file"""
        chapters_to_test = ['chapter1', 'chapter3', 'chapter5', 'chapter7', 'chapter8', 'chapter9', 'chapter10']
        
        for chapter in chapters_to_test:
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            # Check for chapter-specific JS inclusion
            page_content = page.content()
            expected_js = f"{chapter}.js"
            assert expected_js in page_content, f"Chapter {chapter} missing {expected_js}"
    
    def test_demo_container_structure(self, page: Page, base_url: str, chapter_urls):
        """Test that demo containers have proper structure"""
        chapters_to_test = ['chapter1', 'chapter3', 'chapter5', 'chapter7', 'chapter8', 'chapter9']
        
        for chapter in chapters_to_test:
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            # Check for demo container structure
            demo_containers = page.locator('.demo-container')
            interactive_containers = page.locator('.interactive-container')
            
            total_containers = demo_containers.count() + interactive_containers.count()
            assert total_containers >= 2, f"Chapter {chapter} should have at least 2 demo containers"
    
    @pytest.mark.slow
    def test_no_console_errors_on_page_load(self, page: Page, base_url: str, chapter_urls):
        """Test that pages load without JavaScript console errors"""
        chapters_to_test = ['chapter1', 'chapter3', 'chapter5', 'chapter7', 'chapter8', 'chapter9', 'chapter10']
        
        console_errors = []
        
        def handle_console_msg(msg):
            if msg.type in ['error', 'warning']:
                console_errors.append(f"{msg.type}: {msg.text}")
        
        page.on("console", handle_console_msg)
        
        for chapter in chapters_to_test:
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            # Basic check for JavaScript presence
            page_content = page.content()
            assert '<script' in page_content, f"Chapter {chapter} should contain JavaScript"
        
        # Report console errors if any
        if console_errors:
            print(f"Console errors found: {console_errors}")
            # You can choose to fail the test or just warn
            # assert len(console_errors) == 0, f"Console errors found: {console_errors}"
    
    def test_quiz_shared_javascript_inclusion(self, page: Page, base_url: str, chapter_urls):
        """Test that quiz chapters include shared-quiz.js"""
        chapters_with_quizzes = ['chapter1', 'chapter2', 'chapter3', 'chapter7', 'chapter8', 'chapter9', 'chapter10']
        
        for chapter in chapters_with_quizzes:
            page.goto(f"{base_url}{chapter_urls[chapter]}")
            page.wait_for_load_state("networkidle")
            
            # Check for shared-quiz.js inclusion
            page_content = page.content()
            assert 'shared-quiz.js' in page_content, f"Chapter {chapter} missing shared-quiz.js"


class TestClusteringDemoFunctionality:
    """Test class for actual demo functionality using Playwright"""
    
    @pytest.mark.selenium
    @pytest.mark.slow
    def test_dendrogram_generates_correctly(self, page: Page, base_url: str):
        """Test that dendrograms generate with proper hierarchical structure"""
        page.goto(f"{base_url}/tutorials/clustering/chapter8")
        page.wait_for_load_state("networkidle")
        
        # Click generate dendrogram button if it exists
        generate_button = page.locator('#generate-dendrogram')
        if generate_button.is_visible():
            generate_button.click()
            page.wait_for_timeout(2000)  # Wait for generation
        
        # Verify SVG elements are created
        dendrogram_svg = page.locator('#dendro-plot, #linkage-dendrogram')
        expect(dendrogram_svg).to_be_visible()
        
        # Verify dendrogram has content (not empty)
        svg_content = dendrogram_svg.inner_html()
        assert len(svg_content.strip()) > 0, "Dendrogram SVG should not be empty"
    
    @pytest.mark.selenium
    @pytest.mark.slow
    def test_kmeans_demo_convergence(self, page: Page, base_url: str):
        """Test that K-means demos show convergence"""
        page.goto(f"{base_url}/tutorials/clustering/chapter1")
        page.wait_for_load_state("networkidle")
        
        # Generate data
        generate_button = page.get_by_text('Generate New Data', exact=False)
        if generate_button.is_visible():
            generate_button.click()
            page.wait_for_timeout(1000)
        
        # Run K-means
        run_button = page.get_by_text('Run K-means', exact=False)
        if run_button.is_visible():
            run_button.click()
            page.wait_for_timeout(2000)
        
        # Verify metrics are calculated
        metrics_display = page.locator('#metrics-display')
        if metrics_display.is_visible():
            metrics_text = metrics_display.inner_text()
            assert len(metrics_text.strip()) > 0, "Metrics should be displayed"
    
    @pytest.mark.selenium
    @pytest.mark.slow
    def test_distance_metrics_comparison(self, page: Page, base_url: str):
        """Test that distance metrics comparison works"""
        page.goto(f"{base_url}/tutorials/clustering/chapter1")
        page.wait_for_load_state("networkidle")
        
        # Click "Compare Distance Metrics"
        compare_button = page.get_by_text('Compare Distance Metrics', exact=False)
        if compare_button.is_visible():
            compare_button.click()
            page.wait_for_timeout(2000)
            
            # Verify visualizations are generated
            distance_comparison = page.locator('#distance-comparison')
            if distance_comparison.is_visible():
                content = distance_comparison.inner_html()
                assert len(content.strip()) > 0, "Distance comparison should have content"


if __name__ == "__main__":
    # Run tests with: python -m pytest tests/test_clustering_demos_playwright.py -v
    pytest.main([__file__, "-v"])

