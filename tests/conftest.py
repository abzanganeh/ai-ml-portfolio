import pytest
import os
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page

def pytest_addoption(parser):
    """Add custom command line options"""
    parser.addoption(
        "--browser", 
        action="store", 
        default="chromium",
        help="Browser to run tests on: chromium, firefox, webkit"
    )
    parser.addoption(
        "--headed", 
        action="store", 
        default="false",
        help="Run tests in headed mode: true, false"
    )
    parser.addoption(
        "--base-url", 
        action="store", 
        default="https://www.zanganehai.com",
        help="Base URL for testing"
    )

@pytest.fixture(scope="session")
def browser_name(request):
    return request.config.getoption("--browser")

@pytest.fixture(scope="session") 
def headed_mode(request):
    return request.config.getoption("--headed").lower() == "true"

@pytest.fixture(scope="session")
def base_url(request):
    return request.config.getoption("--base-url")

@pytest.fixture(scope="session")
def browser():
    """Browser instance for the entire test session"""
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=os.getenv("HEADLESS", "true").lower() == "true",
            args=["--no-sandbox", "--disable-dev-shm-usage"]  # For CI environments
        )
        yield browser
        browser.close()

@pytest.fixture(scope="function")
def context(browser: Browser):
    """Fresh browser context for each test"""
    context = browser.new_context(
        viewport={"width": 1280, "height": 720},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    )
    yield context
    context.close()

@pytest.fixture(scope="function")
def page(context: BrowserContext):
    """Fresh page for each test"""
    page = context.new_page()
    yield page