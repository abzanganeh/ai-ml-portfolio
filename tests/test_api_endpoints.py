import pytest
from playwright.sync_api import Page, APIRequestContext

class TestAPIEndpoints:
    """Test suite for API endpoints based on your Flask app structure"""
    
    def test_api_projects_endpoint(self, page: Page, base_url: str):
        """Test /api/projects/ returns valid JSON with correct structure"""
        response = page.request.get(f"{base_url}/api/projects/")
        
        assert response.status == 200
        assert "application/json" in response.headers.get("content-type", "")
        
        projects = response.json()
        assert isinstance(projects, list)
        
        # If projects exist, validate structure
        if len(projects) > 0:
            project = projects[0]
            # Based on your Project model's to_dict method
            required_fields = ["title", "description", "category", "url"]
            for field in required_fields:
                assert field in project, f"Missing required field: {field}"
            
            # Check optional fields exist if they should
            optional_fields = ["github_url", "demo_url", "featured", "technology_list"]
            for field in optional_fields:
                # Don't assert these exist, just check types if they do
                if field in project:
                    if field == "featured":
                        assert isinstance(project[field], bool)
                    elif field == "technology_list":
                        assert isinstance(project[field], list)
                    elif field in ["github_url", "demo_url"]:
                        assert isinstance(project[field], (str, type(None)))
    
    def test_api_tutorials_endpoint(self, page: Page, base_url: str):
        """Test /api/tutorials/ returns valid JSON with correct structure"""
        response = page.request.get(f"{base_url}/api/tutorials/")
        
        assert response.status == 200
        assert "application/json" in response.headers.get("content-type", "")
        
        tutorials = response.json()
        assert isinstance(tutorials, list)
        
        # If tutorials exist, validate structure
        if len(tutorials) > 0:
            tutorial = tutorials[0]
            # Based on your Tutorial model's to_dict method
            required_fields = ["title", "description", "category", "difficulty", "duration", "url"]
            for field in required_fields:
                assert field in tutorial, f"Missing required field: {field}"
            
            # Check specific field types
            assert isinstance(tutorial["difficulty"], str)
            assert isinstance(tutorial["duration"], str)
            assert isinstance(tutorial["category"], str)
            
            # Check optional fields
            optional_fields = ["published", "has_dedicated_template", "excerpt", "tags"]
            for field in optional_fields:
                if field in tutorial:
                    if field in ["published", "has_dedicated_template"]:
                        assert isinstance(tutorial[field], bool)
    
    def test_search_api_functionality(self, page: Page, base_url: str):
        """Test search API with query parameters matches your app structure"""
        # Test search with a common term
        response = page.request.get(f"{base_url}/api/search?q=project")
        
        assert response.status == 200
        search_results = response.json()
        
        # Check response structure matches your app.py return format
        expected_keys = ["tutorials", "projects", "blog_posts"]
        for key in expected_keys:
            assert key in search_results, f"Missing key in search results: {key}"
            assert isinstance(search_results[key], list)
        
        # Test search with machine learning term
        response = page.request.get(f"{base_url}/api/search?q=machine learning")
        assert response.status == 200
        ml_results = response.json()
        
        # Should return same structure
        for key in expected_keys:
            assert key in ml_results
            assert isinstance(ml_results[key], list)
    
    def test_search_api_empty_query(self, page: Page, base_url: str):
        """Test search API handles empty queries gracefully"""
        response = page.request.get(f"{base_url}/api/search?q=")
        
        assert response.status == 200
        search_results = response.json()
        
        # Should still return proper structure even with empty query
        expected_keys = ["tutorials", "projects", "blog_posts"]
        for key in expected_keys:
            assert key in search_results
            assert isinstance(search_results[key], list)
    
    def test_search_api_no_results(self, page: Page, base_url: str):
        """Test search API with query that should return no results"""
        response = page.request.get(f"{base_url}/api/search?q=veryrareunlikelysearchterm12345")
        
        assert response.status == 200
        search_results = response.json()
        
        # Should return empty lists but proper structure
        expected_keys = ["tutorials", "projects", "blog_posts"]
        for key in expected_keys:
            assert key in search_results
            assert isinstance(search_results[key], list)
            # Results should be empty for this unlikely search term
            assert len(search_results[key]) == 0
    
    def test_search_api_case_insensitive(self, page: Page, base_url: str):
        """Test search API is case insensitive"""
        # Test same search with different cases
        lower_response = page.request.get(f"{base_url}/api/search?q=data")
        upper_response = page.request.get(f"{base_url}/api/search?q=DATA")
        mixed_response = page.request.get(f"{base_url}/api/search?q=Data")
        
        assert lower_response.status == 200
        assert upper_response.status == 200
        assert mixed_response.status == 200
        
        lower_results = lower_response.json()
        upper_results = upper_response.json()
        mixed_results = mixed_response.json()
        
        # Results should be the same regardless of case
        assert lower_results == upper_results == mixed_results
    
    def test_api_projects_published_only(self, page: Page, base_url: str):
        """Test projects API only returns published projects"""
        response = page.request.get(f"{base_url}/api/projects/")
        projects = response.json()
        
        # All returned projects should be published (based on your filter in app.py)
        for project in projects:
            if "published" in project:
                assert project["published"] is True
    
    def test_api_tutorials_published_only(self, page: Page, base_url: str):
        """Test tutorials API only returns published tutorials"""
        response = page.request.get(f"{base_url}/api/tutorials/")
        tutorials = response.json()
        
        # All returned tutorials should be published
        for tutorial in tutorials:
            if "published" in tutorial:
                assert tutorial["published"] is True
    
    def test_api_response_headers(self, page: Page, base_url: str):
        """Test API endpoints return proper headers"""
        endpoints = ["/api/projects/", "/api/tutorials/", "/api/search?q=test"]
        
        for endpoint in endpoints:
            response = page.request.get(f"{base_url}{endpoint}")
            
            # Check content type
            content_type = response.headers.get("content-type", "")
            assert "application/json" in content_type
            
            # Check response is not cached inappropriately for dynamic data
            # (You might want to add cache headers in your Flask app)
    
    def test_api_endpoints_performance(self, page: Page, base_url: str):
        """Test API endpoints respond within reasonable time"""
        import time
        
        endpoints = ["/api/projects/", "/api/tutorials/", "/api/search?q=data"]
        
        for endpoint in endpoints:
            start_time = time.time()
            response = page.request.get(f"{base_url}{endpoint}")
            response_time = time.time() - start_time
            
            assert response.status == 200
            # API should respond within 5 seconds (adjust based on your requirements)
            assert response_time < 5.0, f"API endpoint {endpoint} took {response_time:.2f} seconds"
    
    def test_search_special_characters(self, page: Page, base_url: str):
        """Test search API handles special characters"""
        # Test with special characters that might break search
        special_queries = ["python+machine", "data&science", "ml/ai", "test%20space"]
        
        for query in special_queries:
            response = page.request.get(f"{base_url}/api/search?q={query}")
            assert response.status == 200
            
            search_results = response.json()
            expected_keys = ["tutorials", "projects", "blog_posts"]
            for key in expected_keys:
                assert key in search_results
                assert isinstance(search_results[key], list)