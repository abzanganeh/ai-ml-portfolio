#!/usr/bin/env python3
"""
Properly randomize quiz options while preserving original wrong answers
and ensuring varied lengths.
"""

import re
import random
from pathlib import Path

def parse_question_options(question_html):
    """Parse all options from a question HTML block."""
    pattern = r'<div class="quiz-option"[^>]*onclick="checkAnswer\(this, (true|false)\)">([A-D]\)[^<]+)</div>'
    
    options = []
    for match in re.finditer(pattern, question_html):
        is_correct = match.group(1) == 'true'
        text = match.group(2)
        full_html = match.group(0)
        
        options.append({
            'is_correct': is_correct,
            'text': text,
            'html': full_html,
            'length': len(text)
        })
    
    return options

def enhance_short_wrong_answer(original_text, topic_context):
    """Enhance a short wrong answer to be longer while keeping it plausible."""
    # If already long enough, return as is
    if len(original_text) > 80:
        return original_text
    
    # Remove label prefix
    core = re.sub(r'^[A-D]\)\s*', '', original_text).strip()
    
    # Enhancement templates based on original content
    enhancements = [
        f"While {core.lower()} might seem reasonable at first, this approach actually introduces significant complications in RAG systems and doesn't address the core requirements effectively",
        f"Although {core.lower()} appears to be a valid solution, practical implementation in production RAG environments reveals that this method fails to meet performance and accuracy standards",
        f"This approach of {core.lower()} has been considered in the past, but extensive testing shows it doesn't scale well and creates more problems than it solves for modern retrieval-augmented generation systems",
        f"While {core.lower()} could theoretically work in some scenarios, it's not the recommended approach because it doesn't align with best practices for RAG architecture and introduces unnecessary complexity",
        f"Although {core.lower()} seems like a straightforward solution, this method is actually counterproductive for RAG systems as it undermines the semantic understanding that makes retrieval effective"
    ]
    
    return random.choice(enhancements)

def randomize_question(question_html):
    """Randomize a single question's options."""
    options = parse_question_options(question_html)
    
    if len(options) != 4:
        return question_html  # Skip if not 4 options
    
    # Separate correct and wrong
    correct = [o for o in options if o['is_correct']]
    wrong = [o for o in options if not o['is_correct']]
    
    if not correct or len(wrong) < 3:
        return question_html
    
    correct_option = correct[0]
    
    # Enhance wrong answers to have varied lengths
    # Keep one short, make one medium, make one long
    enhanced_wrong = []
    
    # First wrong: keep original if reasonable, otherwise enhance slightly
    if len(wrong[0]['text']) < 40:
        enhanced_wrong.append(enhance_short_wrong_answer(wrong[0]['text'], 'RAG'))
    else:
        enhanced_wrong.append(re.sub(r'^[A-D]\)\s*', '', wrong[0]['text']))
    
    # Second wrong: make it medium length
    if len(wrong[1]['text']) < 60:
        enhanced_wrong.append(enhance_short_wrong_answer(wrong[1]['text'], 'RAG'))
    else:
        enhanced_wrong.append(re.sub(r'^[A-D]\)\s*', '', wrong[1]['text']))
    
    # Third wrong: make it long
    if len(wrong[2]['text']) < 100:
        enhanced_wrong.append(enhance_short_wrong_answer(wrong[2]['text'], 'RAG'))
    else:
        enhanced_wrong.append(re.sub(r'^[A-D]\)\s*', '', wrong[2]['text']))
    
    # Prepare all options
    correct_text = re.sub(r'^[A-D]\)\s*', '', correct_option['text'])
    all_options = [
        {'is_correct': True, 'text': correct_text},
        {'is_correct': False, 'text': enhanced_wrong[0]},
        {'is_correct': False, 'text': enhanced_wrong[1]},
        {'is_correct': False, 'text': enhanced_wrong[2]}
    ]
    
    # Shuffle
    random.shuffle(all_options)
    
    # Build new HTML
    labels = ['A', 'B', 'C', 'D']
    new_options_html = ""
    for i, opt in enumerate(all_options):
        is_correct_str = 'true' if opt['is_correct'] else 'false'
        new_options_html += f'<div class="quiz-option" onclick="checkAnswer(this, {is_correct_str})">{labels[i]}) {opt["text"]}</div>\n                                '
    
    # Replace options in question
    question_header = re.search(r'(<div class="quiz-question"[^>]*>.*?<h3>.*?</h3>)', question_html, re.DOTALL)
    if question_header:
        header = question_header.group(1)
        new_question = f"""{header}
                                {new_options_html.strip()}
                            </div>"""
        return new_question
    
    return question_html

def process_file(file_path):
    """Process a chapter file."""
    print(f"Processing {file_path.name}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find quiz section
    quiz_pattern = r'(<div id="quiz"[^>]*>.*?</div>\s*</div>\s*</div>\s*</main>)'
    quiz_match = re.search(quiz_pattern, content, re.DOTALL)
    
    if not quiz_match:
        print(f"  No quiz section found")
        return content
    
    quiz_section = quiz_match.group(1)
    
    # Find all questions
    question_pattern = r'(<div class="quiz-question"[^>]*>.*?</div>\s*</div>)'
    questions = re.findall(question_pattern, quiz_section, re.DOTALL)
    
    print(f"  Found {len(questions)} questions")
    
    # Process each question
    new_questions = []
    for i, q_html in enumerate(questions, 1):
        new_q = randomize_question(q_html)
        new_questions.append(new_q)
    
    # Rebuild quiz section
    quiz_header = re.search(r'(<div id="quiz"[^>]*>.*?<div class="quiz-container">)', quiz_section, re.DOTALL)
    quiz_footer = re.search(r'(</div>\s*</div>\s*</div>\s*</main>)', quiz_section, re.DOTALL)
    
    if quiz_header and quiz_footer:
        new_quiz = quiz_header.group(1) + "\n                        "
        for q in new_questions:
            new_quiz += q + "\n                        "
        new_quiz += quiz_footer.group(1)
        
        content = content.replace(quiz_section, new_quiz)
    
    return content

def main():
    base_dir = Path(__file__).parent.parent
    chapters_dir = base_dir / 'templates' / 'tutorials' / 'rag'
    
    chapters = [3, 4, 5, 6, 7]
    
    for ch_num in chapters:
        file_path = chapters_dir / f'chapter{ch_num}.html'
        if not file_path.exists():
            continue
        
        random.seed(100 + ch_num)  # Different seed per chapter
        new_content = process_file(file_path)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated {file_path.name}\n")

if __name__ == '__main__':
    main()

