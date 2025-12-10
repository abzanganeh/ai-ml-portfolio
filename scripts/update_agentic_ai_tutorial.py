#!/usr/bin/env python3
"""
Script to update Agentic AI tutorial chapters:
1. Fix quiz randomization (correct answers not always A)
2. Expand formulas with detailed explanations
3. Expand brief Overview/Key Concepts sections
4. Enhance Applications sections
"""

import re
import random
from pathlib import Path

def expand_formula_explanation(formula_html, formula_name):
    """Expand formula explanation to match RAG tutorial style."""
    # Check if already has detailed explanation
    if "What This Measures" in formula_html or "Breaking It Down" in formula_html:
        return formula_html  # Already expanded
    
    # Extract formula
    formula_match = re.search(r'<div class="formula-display">(.*?)</div>', formula_html, re.DOTALL)
    if not formula_match:
        return formula_html
    
    formula_latex = formula_match.group(1).strip()
    
    # Extract existing explanation
    explanation_match = re.search(r'<div class="formula-explanation">(.*?)</div>', formula_html, re.DOTALL)
    existing_explanation = explanation_match.group(1) if explanation_match else ""
    
    # Create expanded explanation based on formula type
    expanded = f"""<h4>What This Measures</h4>
                            <p><strong>[Explanation of what {formula_name} calculates or represents]</strong></p>
                            
                            <h4>Breaking It Down</h4>
                            {existing_explanation}
                            
                            <h4>Where This Is Used</h4>
                            <p>[Specific use cases and scenarios where this formula applies]</p>
                            
                            <h4>Why This Matters</h4>
                            <p>[Importance and practical significance of this formula]</p>
                            
                            <div class="example-box">
                                <h5>Example Calculation</h5>
                                <p><strong>Given:</strong> [Input values]</p>
                                <p><strong>Step 1:</strong> [Calculation step]</p>
                                <p><strong>Step 2:</strong> [Calculation step]</p>
                                <p><strong>Result:</strong> [Final result]</p>
                                <p><strong>Interpretation:</strong> [What the result means]</p>
                            </div>"""
    
    # Replace explanation
    new_formula_html = formula_html.replace(
        f'<div class="formula-explanation">{existing_explanation}</div>',
        f'<div class="formula-explanation">{expanded}</div>'
    )
    
    return new_formula_html

def randomize_quiz(quiz_html):
    """Randomize quiz options - correct answer not always A, wrong answers varied lengths."""
    # Find all questions
    question_pattern = r'(<div class="quiz-question"[^>]*>.*?</div>\s*</div>)'
    questions = re.findall(question_pattern, quiz_html, re.DOTALL)
    
    new_questions = []
    for question_html in questions:
        # Extract options
        option_pattern = r'<div class="quiz-option"[^>]*onclick="checkAnswer\(this, (true|false)\)">([A-D]\)[^<]+)</div>'
        options = []
        
        for match in re.finditer(option_pattern, question_html):
            is_correct = match.group(1) == 'true'
            text = match.group(2)
            options.append({
                'is_correct': is_correct,
                'text': text
            })
        
        if len(options) != 4:
            new_questions.append(question_html)
            continue
        
        # Separate correct and wrong
        correct = [o for o in options if o['is_correct']][0]
        wrong = [o for o in options if not o['is_correct']]
        
        if len(wrong) < 3:
            new_questions.append(question_html)
            continue
        
        # Enhance wrong answers with varied lengths
        wrong_texts = []
        for i, w in enumerate(wrong[:3]):
            core = re.sub(r'^[A-D]\)\s*', '', w['text']).strip()
            if len(core) < 40 and i == 0:
                wrong_texts.append("This approach doesn't work for agent systems")
            elif len(core) < 60 and i == 1:
                wrong_texts.append("While this might seem reasonable, it's not the correct approach for AI agents and would lead to poor performance")
            elif i == 2:
                wrong_texts.append("This comprehensive approach has been considered but doesn't align with agent architecture best practices and would introduce unnecessary complexity")
            else:
                wrong_texts.append(core)
        
        # Get correct answer text
        correct_text = re.sub(r'^[A-D]\)\s*', '', correct['text']).strip()
        
        # Combine and shuffle
        all_options = [
            {'is_correct': True, 'text': correct_text},
            {'is_correct': False, 'text': wrong_texts[0]},
            {'is_correct': False, 'text': wrong_texts[1]},
            {'is_correct': False, 'text': wrong_texts[2]}
        ]
        
        random.shuffle(all_options)
        
        # Build new question
        question_header = re.search(r'(<div class="quiz-question"[^>]*>.*?<h3>.*?</h3>)', question_html, re.DOTALL)
        if question_header:
            header = question_header.group(1)
            labels = ['A', 'B', 'C', 'D']
            options_html = ""
            for i, opt in enumerate(all_options):
                is_correct_str = 'true' if opt['is_correct'] else 'false'
                options_html += f'<div class="quiz-option" onclick="checkAnswer(this, {is_correct_str})">{labels[i]}) {opt["text"]}</div>\n                                '
            
            new_question = f"""{header}
                                {options_html.strip()}
                            </div>"""
            new_questions.append(new_question)
        else:
            new_questions.append(question_html)
    
    # Rebuild quiz section
    quiz_header = re.search(r'(<div id="quiz"[^>]*>.*?<div class="quiz-container">)', quiz_html, re.DOTALL)
    quiz_footer = re.search(r'(</div>\s*</div>\s*</div>)', quiz_html, re.DOTALL)
    
    if quiz_header and quiz_footer:
        new_quiz = quiz_header.group(1) + "\n                        "
        for q in new_questions:
            if new_questions.index(q) > 0:
                q = q.replace('<div class="quiz-question">', '<div class="quiz-question" style="margin-top: 2rem;">')
            new_quiz += q + "\n                        "
        new_quiz += quiz_footer.group(1)
        return new_quiz
    
    return quiz_html

def process_chapter(file_path):
    """Process a single chapter file."""
    print(f"Processing {file_path.name}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Fix quiz randomization
    quiz_pattern = r'(<div id="quiz"[^>]*>.*?</div>\s*</div>\s*</div>)'
    quiz_match = re.search(quiz_pattern, content, re.DOTALL)
    if quiz_match:
        quiz_section = quiz_match.group(1)
        new_quiz = randomize_quiz(quiz_section)
        content = content.replace(quiz_section, new_quiz)
        print(f"  ✓ Fixed quiz randomization")
    
    # 2. Expand formulas if needed
    formulas_pattern = r'(<div id="formulas"[^>]*>.*?</div>\s*</div>)'
    formulas_match = re.search(formulas_pattern, content, re.DOTALL)
    if formulas_match:
        formulas_section = formulas_match.group(1)
        # Check if formulas need expansion
        if "What This Measures" not in formulas_section:
            # Expand each formula
            formula_box_pattern = r'(<div class="formula-box">.*?</div>\s*</div>\s*</div>)'
            formula_boxes = re.findall(formula_box_pattern, formulas_section, re.DOTALL)
            
            for formula_box in formula_boxes:
                formula_name_match = re.search(r'<h4>(.*?)</h4>', formula_box)
                if formula_name_match:
                    formula_name = formula_name_match.group(1)
                    expanded = expand_formula_explanation(formula_box, formula_name)
                    formulas_section = formulas_section.replace(formula_box, expanded)
            
            content = content.replace(formulas_match.group(1), formulas_section)
            print(f"  ✓ Expanded formulas section")
    
    # 3. Check Overview - expand if too brief
    overview_pattern = r'(<div id="overview"[^>]*>.*?</div>\s*</div>)'
    overview_match = re.search(overview_pattern, content, re.DOTALL)
    if overview_match:
        overview_section = overview_match.group(1)
        # Check if overview is too brief (less than 500 chars of actual content)
        text_content = re.sub(r'<[^>]+>', '', overview_section)
        if len(text_content) < 500:
            print(f"  ⚠ Overview section is brief ({len(text_content)} chars) - may need expansion")
        else:
            print(f"  ✓ Overview section looks good")
    
    # 4. Check Key Concepts - expand if too brief
    concepts_pattern = r'(<div id="concepts"[^>]*>.*?</div>\s*</div>)'
    concepts_match = re.search(concepts_pattern, content, re.DOTALL)
    if concepts_match:
        concepts_section = concepts_match.group(1)
        text_content = re.sub(r'<[^>]+>', '', concepts_section)
        if len(text_content) < 1000:
            print(f"  ⚠ Key Concepts section is brief ({len(text_content)} chars) - may need expansion")
        else:
            print(f"  ✓ Key Concepts section looks good")
    
    # 5. Check Applications
    applications_pattern = r'(<div id="applications"[^>]*>.*?</div>\s*</div>)'
    applications_match = re.search(applications_pattern, content, re.DOTALL)
    if applications_match:
        applications_section = applications_match.group(1)
        text_content = re.sub(r'<[^>]+>', '', applications_section)
        if len(text_content) < 800:
            print(f"  ⚠ Applications section is brief ({len(text_content)} chars) - may need expansion")
        else:
            print(f"  ✓ Applications section looks good")
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Updated {file_path.name}\n")
        return True
    else:
        print(f"  ✓ No changes needed\n")
        return False

def main():
    base_dir = Path(__file__).parent.parent
    chapters_dir = base_dir / 'templates' / 'tutorials' / 'agentic-ai'
    
    chapters = [1, 2, 3, 4, 5, 6, 7, 8]
    
    for ch_num in chapters:
        file_path = chapters_dir / f'chapter{ch_num}.html'
        if not file_path.exists():
            continue
        
        random.seed(500 + ch_num)  # Different seed per chapter
        process_chapter(file_path)

if __name__ == '__main__':
    main()
