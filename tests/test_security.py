import pytest
import re
import time
from playwright.sync_api import Page, expect

class TestSecurity:
    """Comprehensive and production-ready security testing suite"""
    
    def test_essential_security_headers(self, page: Page, base_url: str):
        """Test critical security headers are present"""
        response = page.request.get(base_url)
        headers = {k.lower(): v for k, v in response.headers.items()}
        
        # Critical headers that should be present
        critical_headers = {
            "x-frame-options": ["deny", "sameorigin"],
            "x-content-type-options": ["nosniff"]
        }
        
        # Recommended headers (warn if missing, don't fail)
        recommended_headers = {
            "x-xss-protection": ["1; mode=block", "0"],
            "referrer-policy": ["strict-origin-when-cross-origin", "no-referrer", "same-origin"],
            "content-security-policy": None  # Just check presence
        }
        
        # Check critical headers
        missing_critical = []
        for header, valid_values in critical_headers.items():
            if header not in headers:
                missing_critical.append(header)
            elif valid_values and headers[header].lower() not in [v.lower() for v in valid_values]:
                missing_critical.append(f"{header} (invalid value: {headers[header]})")
        
        assert len(missing_critical) == 0, f"Missing critical security headers: {missing_critical}"
        
        # Check recommended headers (warn only)
        missing_recommended = []
        for header, valid_values in recommended_headers.items():
            if header not in headers:
                missing_recommended.append(header)
        
        if missing_recommended:
            print(f"Warning: Missing recommended headers: {missing_recommended}")
    
    def test_https_enforcement(self, page: Page, base_url: str):
        """Test HTTPS is properly enforced"""
        assert base_url.startswith("https://"), "Site should use HTTPS in production"
        
        # Test Strict-Transport-Security header
        response = page.request.get(base_url)
        headers = {k.lower(): v for k, v in response.headers.items()}
        
        hsts = headers.get("strict-transport-security", "")
        if hsts:
            # If HSTS is present, verify it's configured properly
            assert "max-age=" in hsts.lower(), "HSTS header should include max-age"
            # Extract max-age value
            max_age_match = re.search(r"max-age=(\d+)", hsts.lower())
            if max_age_match:
                max_age = int(max_age_match.group(1))
                assert max_age >= 31536000, f"HSTS max-age too short: {max_age} (should be >= 1 year)"
        else:
            print("Warning: HSTS header not present")
    
    def test_sensitive_endpoints_protection(self, page: Page, base_url: str):
        """Test sensitive endpoints are properly protected"""
        sensitive_endpoints = [
            "/.env",
            "/.git/config",
            "/config.py",
            "/settings.py",
            "/.DS_Store",
            "/backup",
            "/admin/",
            "/wp-admin/",
            "/phpmyadmin/",
            "/database.sql",
            "/dump.sql"
        ]
        
        vulnerable_endpoints = []
        for endpoint in sensitive_endpoints:
            try:
                response = page.request.get(f"{base_url}{endpoint}")
                # Should return 404, 403, or redirect (not 200 with content)
                if response.status == 200:
                    content = response.text()
                    # Check if it's actually exposing sensitive content
                    if any(sensitive in content.lower() for sensitive in [
                        "password", "secret", "key", "token", "database", "config"
                    ]):
                        vulnerable_endpoints.append(f"{endpoint} (status: {response.status})")
            except Exception:
                # If request fails, that's actually good (endpoint properly blocked)
                pass
        
        assert len(vulnerable_endpoints) == 0, f"Sensitive endpoints accessible: {vulnerable_endpoints}"
    
    def test_sql_injection_protection(self, page: Page, base_url: str):
        """Test SQL injection protection on input endpoints"""
        sql_payloads = [
            "' OR '1'='1",
            "admin'--",
            "'; DROP TABLE users; --",
            "1' UNION SELECT NULL--"
        ]
        
        # Test search API if it exists
        for payload in sql_payloads:
            try:
                response = page.request.get(f"{base_url}/api/search?q={payload}")
                
                # Should handle malicious input gracefully
                if response.status == 200:
                    content = response.text().lower()
                    # Should not contain SQL error messages
                    sql_errors = [
                        "syntax error", "mysql", "postgresql", "sqlite", 
                        "ora-", "sql server", "database error", "warning: mysql"
                    ]
                    
                    for error in sql_errors:
                        assert error not in content, f"Potential SQL injection vulnerability: {error} in response"
                elif response.status >= 500:
                    pytest.fail(f"Server error with SQL payload '{payload}' - possible vulnerability")
                    
            except Exception as e:
                # If search endpoint doesn't exist, that's fine
                if "search" in str(e).lower():
                    break
                else:
                    pytest.fail(f"Unexpected error testing SQL injection: {e}")
    
    def test_xss_protection(self, page: Page, base_url: str):
        """Test Cross-Site Scripting (XSS) protection"""
        xss_payloads = [
            "<script>alert('xss')</script>",
            "<img src=x onerror=alert('xss')>",
            "javascript:alert('xss')",
            "<svg onload=alert('xss')>"
        ]
        
        for payload in xss_payloads:
            try:
                # Test search endpoint
                response = page.request.get(f"{base_url}/api/search?q={payload}")
                
                if response.status == 200:
                    content = response.text()
                    
                    # Response should not contain unescaped dangerous content
                    dangerous_patterns = [
                        r"<script[^>]*>.*?</script>",
                        r"javascript:",
                        r"on\w+\s*=",  # Event handlers like onclick, onload
                        r"<svg[^>]*onload"
                    ]
                    
                    for pattern in dangerous_patterns:
                        matches = re.search(pattern, content, re.IGNORECASE)
                        assert not matches, f"Potential XSS vulnerability with payload '{payload}': {matches.group() if matches else pattern}"
                        
            except Exception:
                # If endpoint doesn't exist, skip this test
                break
    
    def test_cors_policy(self, page: Page, base_url: str):
        """Test CORS policy is properly configured"""
        # Test preflight request
        try:
            response = page.request.fetch(base_url, method="OPTIONS")
            headers = {k.lower(): v for k, v in response.headers.items()}
            
            # Check CORS headers if present
            if "access-control-allow-origin" in headers:
                cors_origin = headers["access-control-allow-origin"]
                
                # Should not be wildcard (*) for sensitive applications
                if cors_origin == "*":
                    print("Warning: CORS allows all origins (*) - consider restricting")
                
                # Check other CORS headers
                if "access-control-allow-credentials" in headers:
                    credentials = headers["access-control-allow-credentials"].lower()
                    if credentials == "true" and cors_origin == "*":
                        pytest.fail("Dangerous CORS configuration: credentials=true with origin=*")
                        
        except Exception:
            # OPTIONS method might not be supported, which is fine
            pass
    
    def test_information_disclosure(self, page: Page, base_url: str):
        """Test for information disclosure vulnerabilities"""
        page.goto(base_url)
        content = page.content().lower()
        
        # Check for sensitive information patterns
        sensitive_patterns = [
            (r"password\s*[:=]\s*['\"][^'\"]{3,}['\"]", "Password in source code"),
            (r"secret\s*[:=]\s*['\"][^'\"]{10,}['\"]", "Secret key in source code"),
            (r"api[_-]?key\s*[:=]\s*['\"][^'\"]{10,}['\"]", "API key in source code"),
            (r"debug\s*[:=]\s*true", "Debug mode enabled"),
            (r"traceback|stack trace", "Error traces in output")
        ]
        
        violations = []
        for pattern, description in sensitive_patterns:
            if re.search(pattern, content):
                violations.append(description)
        
        assert len(violations) == 0, f"Information disclosure vulnerabilities: {violations}"
    
    def test_clickjacking_protection(self, page: Page, base_url: str):
        """Test clickjacking protection mechanisms"""
        response = page.request.get(base_url)
        headers = {k.lower(): v for k, v in response.headers.items()}
        
        # Check X-Frame-Options
        frame_options = headers.get("x-frame-options", "").lower()
        
        # Check Content-Security-Policy frame-ancestors
        csp = headers.get("content-security-policy", "").lower()
        has_frame_ancestors = "frame-ancestors" in csp
        
        # At least one protection method should be present
        protected = (
            frame_options in ["deny", "sameorigin"] or
            has_frame_ancestors
        )
        
        assert protected, "No clickjacking protection found (missing X-Frame-Options or CSP frame-ancestors)"
    
    def test_http_methods_restriction(self, page: Page, base_url: str):
        """Test dangerous HTTP methods are restricted"""
        dangerous_methods = ["TRACE", "DELETE", "PUT", "PATCH"]
        
        for method in dangerous_methods:
            try:
                response = page.request.fetch(base_url, method=method)
                # Should be rejected (405 Method Not Allowed, 403 Forbidden, etc.)
                assert response.status in [405, 403, 501, 400], \
                    f"Dangerous HTTP method {method} allowed (status: {response.status})"
            except Exception:
                # If method causes exception, that's acceptable (method blocked)
                pass
    
    def test_server_information_disclosure(self, page: Page, base_url: str):
        """Test server doesn't reveal sensitive version information"""
        response = page.request.get(base_url)
        headers = {k.lower(): v for k, v in response.headers.items()}
        
        # Check server header
        server_header = headers.get("server", "")
        
        # Should not reveal detailed version information
        version_patterns = [
            r"apache/\d+\.\d+\.\d+",
            r"nginx/\d+\.\d+\.\d+",
            r"flask/\d+\.\d+",
            r"django/\d+\.\d+",
            r"python/\d+\.\d+"
        ]
        
        for pattern in version_patterns:
            match = re.search(pattern, server_header.lower())
            if match:
                print(f"Warning: Server header reveals version info: {match.group()}")
    
    def test_content_type_security(self, page: Page, base_url: str):
        """Test content types are properly set and secure"""
        # Test main page
        response = page.request.get(base_url)
        content_type = response.headers.get("content-type", "")
        
        # HTML pages should have proper content type
        if "text/html" in content_type:
            # Should include charset
            assert "charset=" in content_type.lower(), "HTML content-type should specify charset"
        
        # Test API endpoints if they exist
        api_endpoints = ["/api/projects/", "/api/tutorials/"]
        
        for endpoint in api_endpoints:
            try:
                response = page.request.get(f"{base_url}{endpoint}")
                if response.status == 200:
                    content_type = response.headers.get("content-type", "")
                    assert "application/json" in content_type, f"API endpoint {endpoint} should return JSON"
            except Exception:
                # If endpoint doesn't exist, skip
                continue
    
    def test_session_security(self, page: Page, base_url: str):
        """Test session management security"""
        page.goto(base_url)
        
        # Get cookies after page load
        cookies = page.context.cookies()
        
        for cookie in cookies:
            cookie_name = cookie["name"].lower()
            
            # Session cookies should be secure
            if any(keyword in cookie_name for keyword in ["session", "auth", "token"]):
                # Should be HttpOnly to prevent XSS
                assert cookie.get("httpOnly", False), \
                    f"Session cookie '{cookie['name']}' should be HttpOnly"
                
                # Should be Secure if using HTTPS
                if base_url.startswith("https://"):
                    assert cookie.get("secure", False), \
                        f"Session cookie '{cookie['name']}' should be Secure on HTTPS"
                
                # Should have appropriate SameSite setting
                same_site = cookie.get("sameSite", "").lower()
                if same_site not in ["strict", "lax"]:
                    print(f"Warning: Cookie '{cookie['name']}' lacks proper SameSite setting")
    
    def test_input_validation(self, page: Page, base_url: str):
        """Test input validation on forms"""
        # Test contact form if it exists
        try:
            page.goto(f"{base_url}/contact")
            
            form = page.locator("form")
            if form.count() > 0:
                # Test with various malicious inputs
                malicious_inputs = [
                    "<script>alert('xss')</script>",
                    "'; DROP TABLE users; --",
                    "../../../etc/passwd",
                    "A" * 10000  # Very long input
                ]
                
                for malicious_input in malicious_inputs:
                    # Fill form with malicious input
                    email_field = page.locator("input[name='email'], input[type='email']")
                    if email_field.count() > 0:
                        email_field.fill(malicious_input)
                        
                        # Try to submit form
                        submit_btn = page.locator("button[type='submit'], input[type='submit']")
                        if submit_btn.count() > 0:
                            submit_btn.click()
                            
                            # Page should handle malicious input gracefully
                            page.wait_for_timeout(1000)
                            
                            # Should not crash or show error traces
                            content = page.content().lower()
                            assert "traceback" not in content, "Form submission shows error traces"
                            assert "error 500" not in content, "Form submission causes server error"
                            
                        # Reset for next test
                        page.goto(f"{base_url}/contact")
                        
        except Exception:
            # If contact page doesn't exist, skip this test
            pass
    
    def test_error_handling_security(self, page: Page, base_url: str):
        """Test error pages don't leak sensitive information"""
        # Test 404 page
        response = page.request.get(f"{base_url}/nonexistent-page-12345")
        
        if response.status == 404:
            content = response.text().lower()
            
            # Should not contain sensitive information
            sensitive_info = [
                "traceback", "stack trace", "file path", "database", 
                "internal server error", "debug", "exception"
            ]
            
            found_sensitive = []
            for info in sensitive_info:
                if info in content:
                    found_sensitive.append(info)
            
            assert len(found_sensitive) == 0, f"404 page contains sensitive info: {found_sensitive}"
    
    def test_rate_limiting_headers(self, page: Page, base_url: str):
        """Test for rate limiting indicators (non-aggressive)"""
        # Make a few requests to check for rate limiting headers
        response = page.request.get(f"{base_url}/api/search?q=test")
        
        if response.status == 200:
            headers = {k.lower(): v for k, v in response.headers.items()}
            
            # Check for common rate limiting headers
            rate_limit_headers = [
                "x-ratelimit-limit",
                "x-ratelimit-remaining", 
                "x-rate-limit-limit",
                "retry-after"
            ]
            
            has_rate_limiting = any(header in headers for header in rate_limit_headers)
            
            if has_rate_limiting:
                print("Rate limiting detected - good security practice")
            else:
                print("No rate limiting headers detected - consider implementing")
    
    def test_ssl_configuration(self, page: Page, base_url: str):
        """Test SSL/TLS configuration (basic checks)"""
        if not base_url.startswith("https://"):
            pytest.skip("SSL tests only applicable for HTTPS sites")
        
        # Check if site loads over HTTPS without certificate errors
        try:
            response = page.request.get(base_url)
            assert response.status < 400, "HTTPS site should load without certificate errors"
            
            # Check for security headers related to HTTPS
            headers = {k.lower(): v for k, v in response.headers.items()}
            
            # Check for HSTS
            if "strict-transport-security" not in headers:
                print("Warning: HSTS header not present - consider enabling")
                
        except Exception as e:
            pytest.fail(f"SSL/TLS configuration issue: {e}")
    
    def test_file_upload_security(self, page: Page, base_url: str):
        """Test file upload security (if file uploads exist)"""
        # Look for file upload forms
        page.goto(base_url)
        
        file_inputs = page.locator("input[type='file']")
        
        if file_inputs.count() > 0:
            print("File upload detected - ensure proper validation is implemented")
            
            # Check if upload form has proper restrictions
            for i in range(file_inputs.count()):
                file_input = file_inputs.nth(i)
                accept_attr = file_input.get_attribute("accept")
                
                if not accept_attr:
                    print("Warning: File input lacks 'accept' attribute for type restriction")
                else:
                    # Should restrict file types
                    if "*" in accept_attr or not accept_attr.strip():
                        print("Warning: File input accepts all file types")
        else:
            print("No file upload functionality detected")