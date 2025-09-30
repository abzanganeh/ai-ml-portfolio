#!/usr/bin/env python3
"""
Comprehensive test script for all new Python APIs
Tests all endpoints to ensure they're working correctly
"""

import requests
import json
import time

# Base URL for the Flask app
BASE_URL = "http://localhost:8000"

def test_api_endpoint(method, endpoint, data=None, expected_status=200):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=10)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=10)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        if response.status_code == expected_status:
            print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            return True
        else:
            print(f"❌ {method} {endpoint} - Expected: {expected_status}, Got: {response.status_code}")
            if response.text:
                print(f"   Response: {response.text[:200]}...")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ {method} {endpoint} - Error: {e}")
        return False

def test_visualization_api(endpoint, data, description):
    """Test visualization API endpoints"""
    print(f"\n🧪 Testing {description}")
    url = f"{BASE_URL}{endpoint}"
    
    try:
        response = requests.post(url, json=data, timeout=15)
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print(f"✅ {description} - Generated successfully")
                return True
            else:
                print(f"❌ {description} - API returned success=False: {result.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ {description} - HTTP {response.status_code}: {response.text[:200]}...")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {description} - Error: {e}")
        return False

def main():
    """Run comprehensive API tests"""
    print("🚀 Starting comprehensive API testing...")
    print("=" * 60)
    
    # Wait a moment for the server to fully start
    time.sleep(2)
    
    # Test results tracking
    total_tests = 0
    passed_tests = 0
    
    # Test Core APIs
    print("\n📋 Testing Core APIs")
    print("-" * 30)
    
    core_tests = [
        ("GET", "/api/health", None, 200),
        ("GET", "/api/search?q=clustering", None, 200),
        ("POST", "/api/contact", {
            "name": "Test User",
            "email": "test@example.com",
            "message": "This is a test message"
        }, 200),
        ("GET", "/api/navigation-state?user_id=test", None, 200),
        ("POST", "/api/theme-toggle", {
            "current_theme": "light",
            "user_id": "test"
        }, 200),
        ("POST", "/api/form-validation", {
            "field_name": "email",
            "field_value": "test@example.com",
            "field_type": "email"
        }, 200),
    ]
    
    for method, endpoint, data, expected_status in core_tests:
        total_tests += 1
        if test_api_endpoint(method, endpoint, data, expected_status):
            passed_tests += 1
    
    # Test Tutorial APIs
    print("\n📚 Testing Tutorial APIs")
    print("-" * 30)
    
    tutorial_tests = [
        ("GET", "/api/tutorials/list", None, 200),
        ("GET", "/api/tutorials/clustering/progress?user_id=test", None, 200),
        ("POST", "/api/tutorials/clustering/progress?user_id=test", {
            "chapter_id": "chapter1",
            "progress_percentage": 50.0
        }, 200),
        ("POST", "/api/tutorials/clustering/quiz/quiz1?user_id=test", {
            "chapter_id": "chapter1",
            "answers": {"q1": "A", "q2": "B"}
        }, 200),
        ("GET", "/api/tutorials/clustering/recommendations?user_id=test", None, 200),
        ("POST", "/api/tutorials/clustering/chapter/chapter1/complete?user_id=test", None, 200),
        ("GET", "/api/tutorials/clustering/analytics?user_id=test", None, 200),
    ]
    
    for method, endpoint, data, expected_status in tutorial_tests:
        total_tests += 1
        if test_api_endpoint(method, endpoint, data, expected_status):
            passed_tests += 1
    
    # Test Demo State APIs
    print("\n🎮 Testing Demo State APIs")
    print("-" * 30)
    
    demo_tests = [
        ("GET", "/api/tutorials/clustering/demo/demo1?session_id=test", None, 200),
        ("POST", "/api/tutorials/clustering/demo/demo1?session_id=test", {
            "parameters": {"k": 3, "data": [{"x": 1, "y": 2}]},
            "results": {"clusters": 3}
        }, 200),
    ]
    
    for method, endpoint, data, expected_status in demo_tests:
        total_tests += 1
        if test_api_endpoint(method, endpoint, data, expected_status):
            passed_tests += 1
    
    # Test Visualization APIs
    print("\n📊 Testing Visualization APIs")
    print("-" * 30)
    
    # Clustering visualization
    total_tests += 1
    if test_visualization_api("/api/visualizations/clustering", {
        "data": [
            {"x": 1, "y": 2, "cluster": 0},
            {"x": 2, "y": 3, "cluster": 1},
            {"x": 3, "y": 4, "cluster": 2}
        ],
        "parameters": {
            "centroids": [
                {"x": 1.5, "y": 2.5},
                {"x": 2.5, "y": 3.5},
                {"x": 3.5, "y": 4.5}
            ]
        }
    }, "Clustering Visualization"):
        passed_tests += 1
    
    # Elbow method visualization
    total_tests += 1
    if test_visualization_api("/api/visualizations/elbow-method", {
        "wcss_values": [1000, 800, 600, 450, 350, 300, 280, 270, 265, 263],
        "k_values": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, "Elbow Method Visualization"):
        passed_tests += 1
    
    # Silhouette analysis visualization
    total_tests += 1
    if test_visualization_api("/api/visualizations/silhouette-analysis", {
        "silhouette_scores": [0.2, 0.4, 0.6, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
        "k_values": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, "Silhouette Analysis Visualization"):
        passed_tests += 1
    
    # Convergence visualization
    total_tests += 1
    if test_visualization_api("/api/visualizations/convergence", {
        "iterations": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "objective_values": [1000, 800, 650, 550, 480, 430, 400, 385, 375, 370]
    }, "Convergence Visualization"):
        passed_tests += 1
    
    # Linkage comparison visualization
    total_tests += 1
    if test_visualization_api("/api/visualizations/linkage-comparison", {
        "data": [{"x": 1, "y": 2}, {"x": 2, "y": 3}, {"x": 3, "y": 4}],
        "linkage_methods": ["Single Linkage", "Complete Linkage", "Average Linkage", "Ward's Method", "Centroid Linkage", "Median Linkage"]
    }, "Linkage Comparison Visualization"):
        passed_tests += 1
    
    # Matrix-vector visualization
    total_tests += 1
    if test_visualization_api("/api/visualizations/matrix-vector", {
        "matrix": [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        "vector": [1, 2, 3]
    }, "Matrix-Vector Visualization"):
        passed_tests += 1
    
    # Decision tree visualization
    total_tests += 1
    if test_visualization_api("/api/visualizations/decision-tree", {
        "tree_data": {
            "nodes": [
                {"id": "root", "label": "Root", "level": 0, "position": 0},
                {"id": "left", "label": "Left", "level": 1, "position": 0},
                {"id": "right", "label": "Right", "level": 1, "position": 1}
            ],
            "edges": [
                {"from": "root", "to": "left"},
                {"from": "root", "to": "right"}
            ]
        }
    }, "Decision Tree Visualization"):
        passed_tests += 1
    
    # EDA visualizations
    eda_tests = [
        ("/api/visualizations/eda/missing_data", {
            "labels": ["Feature1", "Feature2", "Feature3", "Feature4"],
            "values": [0.1, 0.05, 0.2, 0.0]
        }, "Missing Data Chart"),
        ("/api/visualizations/eda/correlation_heatmap", {
            "correlation_matrix": [[1.0, 0.5, -0.3], [0.5, 1.0, 0.2], [-0.3, 0.2, 1.0]],
            "labels": ["Feature1", "Feature2", "Feature3"]
        }, "Correlation Heatmap"),
        ("/api/visualizations/eda/distribution", {
            "values": [1, 2, 2, 3, 3, 3, 4, 4, 5],
            "bins": 5
        }, "Distribution Chart"),
        ("/api/visualizations/eda/outlier_boxplot", {
            "datasets": {
                "Dataset1": [1, 2, 3, 4, 5, 100],
                "Dataset2": [2, 3, 4, 5, 6, 7]
            }
        }, "Outlier Box Plot")
    ]
    
    for endpoint, data, description in eda_tests:
        total_tests += 1
        if test_visualization_api(endpoint, data, description):
            passed_tests += 1
    
    # Test Cache APIs
    print("\n💾 Testing Cache APIs")
    print("-" * 30)
    
    cache_tests = [
        ("GET", "/api/visualizations/cache/stats", None, 200),
        ("POST", "/api/visualizations/cache/clear", None, 200),
    ]
    
    for method, endpoint, data, expected_status in cache_tests:
        total_tests += 1
        if test_api_endpoint(method, endpoint, data, expected_status):
            passed_tests += 1
    
    # Test Preview APIs
    print("\n👁️ Testing Preview APIs")
    print("-" * 30)
    
    preview_tests = [
        ("GET", "/api/visualizations/preview/difficulty", None, 200),
        ("GET", "/api/visualizations/preview/acceptance", None, 200),
        ("GET", "/api/visualizations/preview/likes", None, 200),
        ("GET", "/api/visualizations/preview/companies", None, 200),
    ]
    
    for method, endpoint, data, expected_status in preview_tests:
        total_tests += 1
        if test_api_endpoint(method, endpoint, data, expected_status):
            passed_tests += 1
    
    # Test Export API
    print("\n📤 Testing Export API")
    print("-" * 30)
    
    export_tests = [
        ("GET", "/api/visualizations/export/viz123?format=png", None, 200),
        ("GET", "/api/visualizations/export/viz123?format=svg", None, 200),
    ]
    
    for method, endpoint, data, expected_status in export_tests:
        total_tests += 1
        if test_api_endpoint(method, endpoint, data, expected_status):
            passed_tests += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! Your JavaScript-to-Python migration is working perfectly!")
    elif passed_tests > total_tests * 0.8:
        print(f"\n✅ Most tests passed! {total_tests - passed_tests} tests need attention.")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} tests failed. Please review the issues above.")
    
    return passed_tests == total_tests

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

