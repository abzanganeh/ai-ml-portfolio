#!/usr/bin/env python3
"""
Script to fix Jinja2 template conflicts in mathematical formulas
across all clustering tutorial chapters.
"""

import os
import re
import glob

def fix_formula_patterns(content):
    """Fix problematic mathematical formula patterns that conflict with Jinja2."""
    
    # Patterns to fix - these are the common problematic patterns
    patterns = [
        # Pattern: {{ "{{' }}x∈Cᵢ{{ '}}" }}
        (r'\{\{\s*"?\{\{\'\s*\}\}([^{}]*)\{\{\s*\'\}\}"\s*\}\}', r'{% raw %}{\1}{% endraw %}'),
        
        # Pattern: {{ "{{' }}...{{ '}}" }}
        (r'\{\{\s*"?\{\{\'\s*\}\}([^{}]*)\{\{\s*\'\}\}"\s*\}\}', r'{% raw %}{\1}{% endraw %}'),
        
        # More specific patterns for mathematical notation
        (r'\{\{\s*"\{\{\'\s*\}\}([^{}]*)\{\{\s*\'\}\}"\s*\}\}', r'{% raw %}{\1}{% endraw %}'),
        
        # Pattern for subscripts and mathematical expressions
        (r'\{\{\s*"\{\{\'\s*\}\}([x∈Cᵢₖₜ₊₁₋₀₁₂₃₄₅₆₇₈₉\w\s,\.₁₂₃₄₅₆₇₈₉₀]*)\{\{\s*\'\}\}"\s*\}\}', r'{% raw %}{\1}{% endraw %}'),
    ]
    
    # Apply each pattern
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    
    return content

def process_file(filepath):
    """Process a single HTML file to fix formula patterns."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        fixed_content = fix_formula_patterns(content)
        
        if original_content != fixed_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print(f"✅ Fixed formulas in: {filepath}")
            return True
        else:
            print(f"⏭️  No changes needed in: {filepath}")
            return False
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False

def main():
    """Main function to process all clustering tutorial files."""
    
    # Find all clustering chapter HTML files (excluding raw_html folder)
    pattern = "/Users/admin/Desktop/flask_portfolio/templates/tutorials/clustering/chapter*.html"
    files = glob.glob(pattern)
    
    if not files:
        print("No clustering chapter files found!")
        return
    
    print(f"Found {len(files)} clustering chapter files to process...")
    print()
    
    fixed_count = 0
    for filepath in sorted(files):
        if process_file(filepath):
            fixed_count += 1
    
    print()
    print(f"✅ Processing complete! Fixed {fixed_count} out of {len(files)} files.")
    
    if fixed_count > 0:
        print("\nTo commit the changes, run:")
        print("git add templates/tutorials/clustering/chapter*.html")
        print('git commit -m "Fix Jinja2 template conflicts in mathematical formulas"')
        print("git push origin main")

if __name__ == "__main__":
    main()
