#!/usr/bin/env python3
"""
Script to randomize quiz options in RAG tutorial chapters.
Ensures:
1. Correct answer appears in random positions (A, B, C, D)
2. Wrong answers have varied lengths (some long, some short)
3. Correct answer is not always the longest
"""

import re
import random
from pathlib import Path

def extract_quiz_question(html_content, question_num):
    """Extract a single quiz question with all its options."""
    # Pattern to match quiz question blocks
    pattern = rf'<div class="quiz-question"[^>]*>.*?<h3>Question {question_num}:.*?</h3>(.*?)</div>\s*</div>'
    match = re.search(pattern, html_content, re.DOTALL)
    if not match:
        return None, None
    
    question_block = match.group(0)
    question_content = match.group(1)
    
    # Extract all options
    option_pattern = r'<div class="quiz-option"[^>]*onclick="checkAnswer\(this, (true|false)\)">([A-D]\)[^<]+)</div>'
    options = re.findall(option_pattern, question_content)
    
    return question_block, options

def parse_quiz_options(question_content):
    """Parse quiz options from question content."""
    option_pattern = r'<div class="quiz-option"[^>]*onclick="checkAnswer\(this, (true|false)\)">([A-D]\)[^<]+)</div>'
    options = []
    
    for match in re.finditer(option_pattern, question_content):
        is_correct = match.group(1) == 'true'
        option_text = match.group(2)
        options.append({
            'is_correct': is_correct,
            'text': option_text,
            'full_match': match.group(0)
        })
    
    return options

def enhance_wrong_answers(correct_answer_text, topic):
    """Generate better wrong answers with varied lengths."""
    # Remove the A/B/C/D) prefix and get the core text
    core_text = re.sub(r'^[A-D]\)\s*', '', correct_answer_text)
    
    # Generate wrong answers with varied lengths
    wrong_answers = []
    
    # Short wrong answers
    short_wrong = [
        "This is incorrect",
        "Not applicable",
        "Only partially correct",
        "This approach doesn't work",
        "Incorrect method",
        "Not the right answer",
        "This is wrong",
        "Does not apply"
    ]
    
    # Medium wrong answers
    medium_wrong = [
        "This method is not suitable for RAG systems and would lead to poor performance",
        "While this seems reasonable, it actually causes more problems than it solves in practice",
        "This approach is outdated and has been replaced by better techniques in modern systems",
        "This is a common misconception that doesn't hold true for production environments",
        "Although this might work in theory, practical implementation shows significant limitations",
        "This technique is not recommended because it fails to address the core requirements",
        "While partially correct, this answer misses several critical aspects of the solution"
    ]
    
    # Long wrong answers (plausible but incorrect)
    long_wrong = [
        "This comprehensive approach involves multiple steps including preprocessing, normalization, and validation, but it's not the correct method for this specific use case in RAG systems",
        "While this technique has been successfully used in other domains like natural language processing and information retrieval, it doesn't directly apply to the RAG architecture we're discussing here",
        "This method requires extensive setup including database configuration, caching layers, and monitoring systems, but it's not the primary solution for the problem at hand",
        "Although this approach seems comprehensive and covers many important aspects like scalability, performance, and reliability, it actually addresses a different problem than what we're solving",
        "This solution involves complex algorithms and data structures that work well in theory, but practical implementation in RAG systems reveals significant limitations and edge cases",
        "While this technique provides good results in certain scenarios with specific data types and query patterns, it's not the recommended approach for general-purpose RAG applications"
    ]
    
    # Select wrong answers with varied lengths
    wrong_answers = [
        random.choice(short_wrong),
        random.choice(medium_wrong),
        random.choice(long_wrong),
        random.choice(medium_wrong if random.random() > 0.5 else short_wrong)
    ]
    
    return wrong_answers

def randomize_quiz_question(question_block, options):
    """Randomize the order of quiz options."""
    if not options or len(options) < 4:
        return question_block
    
    # Find correct answer
    correct_option = None
    wrong_options = []
    
    for opt in options:
        if opt['is_correct']:
            correct_option = opt
        else:
            wrong_options.append(opt)
    
    if not correct_option:
        return question_block
    
    # Enhance wrong answers if they're too short
    if len(wrong_options) < 3:
        # Generate better wrong answers
        enhanced_wrong = enhance_wrong_answers(correct_option['text'], 'RAG')
        wrong_options = [
            {'is_correct': False, 'text': f"{label}) {text}", 'full_match': ''}
            for label, text in zip(['B', 'C', 'D'], enhanced_wrong[:3])
        ]
    else:
        # Enhance existing wrong answers to have varied lengths
        enhanced_wrong = enhance_wrong_answers(correct_option['text'], 'RAG')
        for i, opt in enumerate(wrong_options[:3]):
            if len(opt['text']) < 50:  # If too short, replace with longer
                opt['text'] = f"{chr(66+i)}) {enhanced_wrong[i]}"
    
    # Combine all options
    all_options = [correct_option] + wrong_options[:3]
    
    # Shuffle options
    random.shuffle(all_options)
    
    # Assign new labels A, B, C, D
    labels = ['A', 'B', 'C', 'D']
    for i, opt in enumerate(all_options):
        # Remove old label and add new one
        opt['text'] = re.sub(r'^[A-D]\)\s*', '', opt['text'])
        opt['text'] = f"{labels[i]}) {opt['text']}"
        opt['new_label'] = labels[i]
    
    # Rebuild the question block
    question_header_pattern = r'(<div class="quiz-question"[^>]*>.*?<h3>.*?</h3>)'
    header_match = re.search(question_header_pattern, question_block, re.DOTALL)
    if not header_match:
        return question_block
    
    header = header_match.group(1)
    
    # Build new options HTML
    new_options_html = ""
    for opt in all_options:
        is_correct_str = 'true' if opt['is_correct'] else 'false'
        new_options_html += f'<div class="quiz-option" onclick="checkAnswer(this, {is_correct_str})">{opt["text"]}</div>\n                                '
    
    # Reconstruct question block
    new_question_block = f"""{header}
                                {new_options_html.strip()}
                            </div>"""
    
    return new_question_block

def process_chapter_file(file_path):
    """Process a single chapter file to randomize all quiz questions."""
    print(f"Processing {file_path.name}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all quiz questions
    quiz_section_pattern = r'(<div id="quiz"[^>]*>.*?</div>\s*</div>\s*</div>)'
    quiz_match = re.search(quiz_section_pattern, content, re.DOTALL)
    
    if not quiz_match:
        print(f"  No quiz section found in {file_path.name}")
        return content
    
    quiz_section = quiz_match.group(1)
    
    # Find all questions
    question_pattern = r'(<div class="quiz-question"[^>]*>.*?</div>\s*</div>)'
    questions = re.findall(question_pattern, quiz_section, re.DOTALL)
    
    print(f"  Found {len(questions)} questions")
    
    # Process each question
    new_questions = []
    for i, question_block in enumerate(questions, 1):
        # Parse options
        options = parse_quiz_options(question_block)
        
        if len(options) < 4:
            print(f"  Question {i}: Only {len(options)} options, skipping")
            new_questions.append(question_block)
            continue
        
        # Randomize
        new_question = randomize_quiz_question(question_block, options)
        new_questions.append(new_question)
        print(f"  Question {i}: Randomized (correct answer now at random position)")
    
    # Rebuild quiz section
    # Extract header and footer of quiz section
    quiz_header_pattern = r'(<div id="quiz"[^>]*>.*?<div class="quiz-container">)'
    quiz_footer_pattern = r'(</div>\s*</div>\s*</div>)'
    
    header_match = re.search(quiz_header_pattern, quiz_section, re.DOTALL)
    footer_match = re.search(quiz_footer_pattern, quiz_section, re.DOTALL)
    
    if header_match and footer_match:
        new_quiz_section = header_match.group(1) + "\n                        "
        for q in new_questions:
            new_quiz_section += q + "\n                        "
        new_quiz_section += footer_match.group(1)
        
        # Replace in content
        content = content.replace(quiz_section, new_quiz_section)
    
    return content

def main():
    """Main function to process all chapter files."""
    base_dir = Path(__file__).parent.parent
    chapters_dir = base_dir / 'templates' / 'tutorials' / 'rag'
    
    chapters = [3, 4, 5, 6, 7]  # Chapters to fix
    
    for chapter_num in chapters:
        file_path = chapters_dir / f'chapter{chapter_num}.html'
        
        if not file_path.exists():
            print(f"File not found: {file_path}")
            continue
        
        # Set random seed for reproducibility (but different per chapter)
        random.seed(42 + chapter_num)
        
        new_content = process_chapter_file(file_path)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated {file_path.name}\n")

if __name__ == '__main__':
    main()

