#!/usr/bin/env python3
"""
Final script to properly randomize quiz options with varied wrong answer lengths.
"""

import re
import random
from pathlib import Path

# Better wrong answer templates organized by topic
WRONG_ANSWER_TEMPLATES = {
    'general': {
        'short': [
            "This is incorrect",
            "Not applicable here",
            "This doesn't apply",
            "Incorrect approach",
            "Not the right method"
        ],
        'medium': [
            "While this might seem reasonable, it's not the correct approach for RAG systems",
            "This method doesn't work well in practice and introduces unnecessary complexity",
            "Although this could theoretically work, it's not recommended for production RAG systems",
            "This approach is outdated and has been replaced by better techniques",
            "While partially correct, this answer misses several critical aspects"
        ],
        'long': [
            "This comprehensive approach involves multiple steps including preprocessing, normalization, and validation, but it's not the correct method for this specific use case in RAG systems and would actually degrade performance",
            "While this technique has been successfully used in other domains like traditional information retrieval and database systems, it doesn't directly apply to the RAG architecture we're discussing and fails to address the semantic understanding requirements",
            "This method requires extensive setup including complex algorithms, additional infrastructure, and specialized tools, but it's not the primary solution for the problem at hand and would introduce more problems than it solves",
            "Although this approach seems comprehensive and covers many important aspects like scalability, performance, and reliability, it actually addresses a different problem than what we're solving in RAG systems and doesn't align with best practices"
        ]
    }
}

def get_wrong_answers_varied_lengths(topic='general'):
    """Get wrong answers with varied lengths."""
    templates = WRONG_ANSWER_TEMPLATES.get(topic, WRONG_ANSWER_TEMPLATES['general'])
    return [
        random.choice(templates['short']),
        random.choice(templates['medium']),
        random.choice(templates['long'])
    ]

def extract_question_data(question_html):
    """Extract question number, text, and all options."""
    # Extract question number and text
    q_match = re.search(r'<h3>Question (\d+):\s*(.*?)</h3>', question_html, re.DOTALL)
    if not q_match:
        return None
    
    q_num = q_match.group(1)
    q_text = q_match.group(2).strip()
    
    # Extract all options
    option_pattern = r'<div class="quiz-option"[^>]*onclick="checkAnswer\(this, (true|false)\)">([A-D]\)[^<]+)</div>'
    options = []
    
    for match in re.finditer(option_pattern, question_html):
        is_correct = match.group(1) == 'true'
        text = match.group(2)
        # Remove label prefix to get core text
        core_text = re.sub(r'^[A-D]\)\s*', '', text).strip()
        
        options.append({
            'is_correct': is_correct,
            'original_text': text,
            'core_text': core_text,
            'length': len(core_text)
        })
    
    return {
        'number': q_num,
        'text': q_text,
        'options': options
    }

def create_enhanced_wrong_answers(original_wrong, correct_text):
    """Create enhanced wrong answers with varied lengths, keeping original if good."""
    enhanced = []
    
    # Sort wrong answers by length
    sorted_wrong = sorted(original_wrong, key=lambda x: x['length'])
    
    # First: keep shortest or enhance to short
    if sorted_wrong[0]['length'] < 30:
        enhanced.append(random.choice(WRONG_ANSWER_TEMPLATES['general']['short']))
    else:
        enhanced.append(sorted_wrong[0]['core_text'])
    
    # Second: make it medium length
    if sorted_wrong[1]['length'] < 60:
        enhanced.append(random.choice(WRONG_ANSWER_TEMPLATES['general']['medium']))
    else:
        enhanced.append(sorted_wrong[1]['core_text'])
    
    # Third: make it long
    if sorted_wrong[2]['length'] < 100:
        enhanced.append(random.choice(WRONG_ANSWER_TEMPLATES['general']['long']))
    else:
        enhanced.append(sorted_wrong[2]['core_text'])
    
    return enhanced

def rebuild_question(question_data):
    """Rebuild question with randomized options."""
    correct = [o for o in question_data['options'] if o['is_correct']]
    wrong = [o for o in question_data['options'] if not o['is_correct']]
    
    if not correct or len(wrong) < 3:
        return None
    
    correct_text = correct[0]['core_text']
    enhanced_wrong = create_enhanced_wrong_answers(wrong, correct_text)
    
    # Combine and shuffle
    all_options = [
        {'is_correct': True, 'text': correct_text},
        {'is_correct': False, 'text': enhanced_wrong[0]},
        {'is_correct': False, 'text': enhanced_wrong[1]},
        {'is_correct': False, 'text': enhanced_wrong[2]}
    ]
    
    random.shuffle(all_options)
    
    # Build HTML
    labels = ['A', 'B', 'C', 'D']
    options_html = ""
    for i, opt in enumerate(all_options):
        is_correct_str = 'true' if opt['is_correct'] else 'false'
        options_html += f'<div class="quiz-option" onclick="checkAnswer(this, {is_correct_str})">{labels[i]}) {opt["text"]}</div>\n                                '
    
    question_html = f"""<div class="quiz-question">
                                <h3>Question {question_data['number']}: {question_data['text']}</h3>
                                {options_html.strip()}
                            </div>"""
    
    return question_html

def process_chapter(file_path):
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
    
    # Extract all questions
    question_pattern = r'(<div class="quiz-question"[^>]*>.*?</div>\s*</div>)'
    question_matches = list(re.finditer(question_pattern, quiz_section, re.DOTALL))
    
    print(f"  Found {len(question_matches)} questions")
    
    # Process each question
    new_questions = []
    for match in question_matches:
        question_html = match.group(1)
        question_data = extract_question_data(question_html)
        
        if not question_data:
            new_questions.append(question_html)
            continue
        
        new_question = rebuild_question(question_data)
        if new_question:
            new_questions.append(new_question)
            print(f"  Question {question_data['number']}: Randomized")
        else:
            new_questions.append(question_html)
    
    # Rebuild quiz section
    quiz_header = re.search(r'(<div id="quiz"[^>]*>.*?<div class="quiz-container">)', quiz_section, re.DOTALL)
    quiz_footer = re.search(r'(</div>\s*</div>\s*</div>\s*</main>)', quiz_section, re.DOTALL)
    
    if quiz_header and quiz_footer:
        new_quiz = quiz_header.group(1) + "\n                        "
        for q in new_questions:
            # Add spacing for questions after first
            if new_questions.index(q) > 0:
                new_quiz += '<div class="quiz-question" style="margin-top: 2rem;">\n                                '
                # Extract just the h3 and options from the question
                q_content = re.search(r'(<h3>.*?</h3>.*?</div>)', q, re.DOTALL)
                if q_content:
                    new_quiz += q_content.group(1) + "\n                            </div>\n                        "
                else:
                    new_quiz += q + "\n                        "
            else:
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
        
        # Different seed per chapter for variety
        random.seed(200 + ch_num)
        new_content = process_chapter(file_path)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated {file_path.name}\n")

if __name__ == '__main__':
    main()

