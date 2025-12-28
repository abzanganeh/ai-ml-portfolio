#!/usr/bin/env python3
"""
Properly randomize quiz options while preserving HTML structure.
"""

import re
import random
from pathlib import Path

def enhance_wrong_answer(original, make_long=False):
    """Enhance a wrong answer, optionally making it longer."""
    # Remove label prefix
    core = re.sub(r'^[A-D]\)\s*', '', original).strip()
    
    # If already long enough and we don't need to make it longer, return as is
    if len(core) > 80 and not make_long:
        return core
    
    # Enhancement templates
    if make_long:
        enhancements = [
            f"While {core.lower()} might seem reasonable at first glance, this approach actually introduces significant complications in RAG systems and doesn't address the core requirements effectively, leading to degraded performance and increased complexity",
            f"Although {core.lower()} appears to be a valid solution on the surface, practical implementation in production RAG environments reveals that this method fails to meet performance standards, accuracy requirements, and scalability needs",
            f"This approach of {core.lower()} has been considered in various contexts, but extensive testing and real-world deployment show it doesn't scale well and creates more problems than it solves for modern retrieval-augmented generation systems",
            f"While {core.lower()} could theoretically work in some limited scenarios with specific data types, it's not the recommended approach because it doesn't align with best practices for RAG architecture and introduces unnecessary complexity that undermines system reliability"
        ]
        return random.choice(enhancements)
    elif len(core) < 40:
        # Make it medium length
        enhancements = [
            f"While {core.lower()} might seem reasonable, this approach doesn't work well in practice for RAG systems",
            f"Although {core.lower()} could theoretically work, it's not recommended for production RAG environments",
            f"This method of {core.lower()} is not suitable for RAG systems and would lead to poor performance",
            f"While {core.lower()} appears straightforward, it actually introduces complications in RAG implementations"
        ]
        return random.choice(enhancements)
    else:
        return core  # Keep as is if already reasonable length

def randomize_question_block(question_html):
    """Randomize options in a question block."""
    # Extract question header
    header_match = re.search(r'(<div class="quiz-question"[^>]*>.*?<h3>.*?</h3>)', question_html, re.DOTALL)
    if not header_match:
        return question_html
    
    header = header_match.group(1)
    
    # Extract all options
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
        return question_html  # Skip if not 4 options
    
    # Separate correct and wrong
    correct = [o for o in options if o['is_correct']][0]
    wrong = [o for o in options if not o['is_correct']]
    
    if len(wrong) < 3:
        return question_html
    
    # Enhance wrong answers to have varied lengths
    # Keep one short, make one medium, make one long
    wrong_texts = [re.sub(r'^[A-D]\)\s*', '', w['text']).strip() for w in wrong]
    
    enhanced_wrong = [
        wrong_texts[0] if len(wrong_texts[0]) > 30 else enhance_wrong_answer(wrong[0]['text'], make_long=False),  # Keep short or make medium
        enhance_wrong_answer(wrong[1]['text'], make_long=False) if len(wrong_texts[1]) < 60 else wrong_texts[1],  # Make medium
        enhance_wrong_answer(wrong[2]['text'], make_long=True) if len(wrong_texts[2]) < 100 else wrong_texts[2]  # Make long
    ]
    
    # Get correct answer text
    correct_text = re.sub(r'^[A-D]\)\s*', '', correct['text']).strip()
    
    # Combine all options
    all_options = [
        {'is_correct': True, 'text': correct_text},
        {'is_correct': False, 'text': enhanced_wrong[0]},
        {'is_correct': False, 'text': enhanced_wrong[1]},
        {'is_correct': False, 'text': enhanced_wrong[2]}
    ]
    
    # Shuffle
    random.shuffle(all_options)
    
    # Build new options HTML
    labels = ['A', 'B', 'C', 'D']
    options_html = ""
    for i, opt in enumerate(all_options):
        is_correct_str = 'true' if opt['is_correct'] else 'false'
        options_html += f'<div class="quiz-option" onclick="checkAnswer(this, {is_correct_str})">{labels[i]}) {opt["text"]}</div>\n                                '
    
    # Rebuild question
    new_question = f"""{header}
                                {options_html.strip()}
                            </div>"""
    
    return new_question

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
    original_quiz = quiz_section
    
    # Find quiz container start
    container_start = re.search(r'(<div id="quiz"[^>]*>.*?<div class="quiz-container">)', quiz_section, re.DOTALL)
    container_end = re.search(r'(</div>\s*</div>\s*</div>\s*</main>)', quiz_section, re.DOTALL)
    
    if not container_start or not container_end:
        return content
    
    # Find all questions
    question_pattern = r'(<div class="quiz-question"[^>]*>.*?</div>\s*</div>)'
    questions = re.findall(question_pattern, quiz_section, re.DOTALL)
    
    print(f"  Found {len(questions)} questions")
    
    # Process each question
    new_questions = []
    for i, q_html in enumerate(questions, 1):
        new_q = randomize_question_block(q_html)
        new_questions.append(new_q)
        print(f"  Question {i}: Randomized")
    
    # Rebuild quiz section
    new_quiz = container_start.group(1) + "\n                        "
    for i, q in enumerate(new_questions):
        if i > 0:
            # Add margin-top style for questions after first
            q = q.replace('<div class="quiz-question">', '<div class="quiz-question" style="margin-top: 2rem;">')
        new_quiz += q + "\n                        "
    new_quiz += container_end.group(1)
    
    # Replace in content
    content = content.replace(original_quiz, new_quiz)
    
    return content

def main():
    base_dir = Path(__file__).parent.parent
    chapters_dir = base_dir / 'templates' / 'tutorials' / 'rag'
    
    chapters = [3, 4, 5, 6, 7]
    
    for ch_num in chapters:
        file_path = chapters_dir / f'chapter{ch_num}.html'
        if not file_path.exists():
            continue
        
        # Different seed per chapter
        random.seed(300 + ch_num)
        new_content = process_file(file_path)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated {file_path.name}\n")

if __name__ == '__main__':
    main()

