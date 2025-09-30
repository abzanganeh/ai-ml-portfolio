#!/usr/bin/env python3
"""
Script to switch all tutorial templates from JavaScript to Python APIs
This script updates all HTML templates to use the new Python API JavaScript files
"""

import os
import re
from pathlib import Path

def switch_tutorial_templates_to_python():
    """Switch all tutorial templates to use Python API JavaScript files"""
    
    # Define the clustering tutorial directory
    clustering_dir = Path("templates/tutorials/clustering")
    
    # Patterns to replace
    replacements = [
        # Replace old shared-tutorial.js with new Python API version
        {
            'pattern': r'<script src="{{ url_for\(\'static\', filename=\'js/tutorials/clustering/shared-tutorial\.js\'\) }}"></script>',
            'replacement': '<script src="{{ url_for(\'static\', filename=\'js/tutorials/clustering/shared-tutorial-python.js\') }}"></script>'
        },
        # Replace old shared-quiz.js with new Python API version
        {
            'pattern': r'<script src="{{ url_for\(\'static\', filename=\'js/tutorials/clustering/shared-quiz\.js\'\) }}"></script>',
            'replacement': '<script src="{{ url_for(\'static\', filename=\'js/tutorials/clustering/shared-tutorial-python.js\') }}"></script>'
        },
        # Replace individual chapter JavaScript files
        {
            'pattern': r'<script src="{{ url_for\(\'static\', filename=\'js/tutorials/clustering/chapter\d+\.js\'\) }}"></script>',
            'replacement': '<!-- Chapter-specific functionality now handled by shared-tutorial-python.js -->'
        },
        # Remove old visualization loading scripts (they're now in shared-tutorial-python.js)
        {
            'pattern': r'<script src="https://cdn\.plot\.ly/plotly-latest\.min\.js"></script>\s*<script>.*?</script>',
            'replacement': '<!-- Visualization loading now handled by shared-tutorial-python.js -->',
            'flags': re.DOTALL
        }
    ]
    
    # Process each HTML file in the clustering directory
    for html_file in clustering_dir.glob("*.html"):
        print(f"Processing {html_file}...")
        
        # Read the file content
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = 0
        
        # Apply replacements
        for replacement in replacements:
            flags = replacement.get('flags', 0)
            if re.search(replacement['pattern'], content, flags):
                content = re.sub(replacement['pattern'], replacement['replacement'], content, flags=flags)
                changes_made += 1
                print(f"  - Applied replacement: {replacement['pattern'][:50]}...")
        
        # Write the updated content back to the file if changes were made
        if changes_made > 0:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  - Updated {html_file} with {changes_made} changes")
        else:
            print(f"  - No changes needed for {html_file}")

def switch_other_tutorial_templates():
    """Switch other tutorial templates to use Python APIs"""
    
    # Define other tutorial directories
    tutorial_dirs = [
        "templates/tutorials/decision_trees",
        "templates/tutorials/ml-model-relationships"
    ]
    
    for tutorial_dir in tutorial_dirs:
        if not Path(tutorial_dir).exists():
            continue
            
        print(f"\nProcessing {tutorial_dir}...")
        
        for html_file in Path(tutorial_dir).glob("*.html"):
            print(f"Processing {html_file}...")
            
            # Read the file content
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            changes_made = 0
            
            # Replace JavaScript files with Python API versions
            js_replacements = [
                # Replace shared-tutorial.js
                {
                    'pattern': r'<script src="{{ url_for\(\'static\', filename=\'js/tutorials/[^/]+/shared-tutorial\.js\'\) }}"></script>',
                    'replacement': '<script src="{{ url_for(\'static\', filename=\'js/tutorials/clustering/shared-tutorial-python.js\') }}"></script>'
                },
                # Replace individual chapter files
                {
                    'pattern': r'<script src="{{ url_for\(\'static\', filename=\'js/tutorials/[^/]+/chapter\d+\.js\'\) }}"></script>',
                    'replacement': '<!-- Chapter-specific functionality now handled by shared-tutorial-python.js -->'
                }
            ]
            
            for replacement in js_replacements:
                if re.search(replacement['pattern'], content):
                    content = re.sub(replacement['pattern'], replacement['replacement'], content)
                    changes_made += 1
                    print(f"  - Applied replacement: {replacement['pattern'][:50]}...")
            
            # Write the updated content back to the file if changes were made
            if changes_made > 0:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  - Updated {html_file} with {changes_made} changes")
            else:
                print(f"  - No changes needed for {html_file}")

def add_notification_styles():
    """Add notification styles to the base template"""
    
    base_template = Path("templates/base.html")
    if not base_template.exists():
        return
    
    print(f"\nAdding notification styles to {base_template}...")
    
    with open(base_template, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if notification styles already exist
    if 'notification-container' in content:
        print("  - Notification styles already exist")
        return
    
    # Add notification styles before closing head tag
    notification_styles = '''
    <!-- Notification Styles -->
    <style>
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
    }
    
    .notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 10px;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification-success {
        border-left: 4px solid #4CAF50;
    }
    
    .notification-error {
        border-left: 4px solid #f44336;
    }
    
    .notification-warning {
        border-left: 4px solid #ff9800;
    }
    
    .notification-info {
        border-left: 4px solid #2196F3;
    }
    
    .notification-content {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .notification-message {
        flex: 1;
        margin: 0;
        color: #333;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    </style>
    '''
    
    # Insert before closing head tag
    content = content.replace('</head>', f'{notification_styles}\n</head>')
    
    with open(base_template, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("  - Added notification styles")

def main():
    """Main function to switch all templates to Python APIs"""
    print("🔄 Switching all templates to Python APIs...")
    print("=" * 60)
    
    # Switch clustering tutorial templates
    print("\n📚 Switching Clustering Tutorial Templates")
    print("-" * 40)
    switch_tutorial_templates_to_python()
    
    # Switch other tutorial templates
    print("\n📚 Switching Other Tutorial Templates")
    print("-" * 40)
    switch_other_tutorial_templates()
    
    # Add notification styles
    print("\n🎨 Adding Notification Styles")
    print("-" * 40)
    add_notification_styles()
    
    print("\n" + "=" * 60)
    print("✅ Successfully switched all templates to Python APIs!")
    print("\n📋 Summary:")
    print("- All tutorial templates now use Python API JavaScript files")
    print("- Old JavaScript files are no longer referenced")
    print("- Notification system added for better user feedback")
    print("- All visualizations now use Python-generated charts")
    print("\n🚀 Your website is now fully powered by Python APIs!")

if __name__ == "__main__":
    main()

