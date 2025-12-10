#!/usr/bin/env python3
"""
Final version: Properly randomize quiz with good wrong answers.
"""

import re
import random
from pathlib import Path

# Topic-specific wrong answers that are plausible but incorrect
WRONG_ANSWERS_BY_TOPIC = {
    'chunking': {
        'short': [
            "To reduce file size",
            "To speed up processing",
            "To compress documents",
            "To organize files better"
        ],
        'medium': [
            "Chunking is primarily used to reduce storage costs by compressing document content, though this doesn't address the main RAG requirements",
            "The main purpose of chunking is to organize documents into categories and folders for better file management in storage systems",
            "Chunking helps reduce network bandwidth by sending smaller pieces of data, which improves transmission speed but isn't the core reason in RAG",
            "Document chunking is mainly about formatting and styling text for better presentation, which is useful but not critical for retrieval"
        ],
        'long': [
            "While chunking can help with storage optimization and file organization, the primary reason in RAG systems is actually to enable efficient embedding generation and retrieval, not just to make documents smaller or reduce storage costs",
            "Although chunking does result in smaller document pieces, the main purpose in RAG is to ensure that retrieved content fits within LLM context windows while maintaining semantic coherence, rather than simply reducing file sizes or storage requirements",
            "Chunking serves multiple purposes including document organization and storage efficiency, but in RAG systems the critical function is breaking documents into semantically meaningful units that can be effectively embedded and retrieved, not just reducing document size"
        ]
    },
    'vector_db': {
        'short': [
            "A regular SQL database",
            "A text storage system",
            "A file system",
            "A caching system"
        ],
        'medium': [
            "Vector databases are essentially the same as traditional relational databases, just with a different storage format for data organization",
            "A vector database is primarily a text indexing system that stores documents as plain text files with basic search capabilities",
            "Vector databases are file systems optimized for storing large amounts of data, similar to cloud storage services but with faster access",
            "Vector databases are caching layers that temporarily store frequently accessed data to improve response times in applications"
        ],
        'long': [
            "While vector databases do store data like traditional databases, they're specifically designed for high-dimensional vector similarity search using algorithms like HNSW and IVF, which is fundamentally different from SQL query-based retrieval",
            "Although vector databases handle storage similar to file systems, their core functionality is optimized approximate nearest neighbor search for embeddings, not just file organization or basic text storage",
            "Vector databases share some characteristics with caching systems in terms of fast access, but they're specialized for semantic similarity search using vector embeddings, which requires completely different indexing and query mechanisms"
        ]
    },
    'retrieval': {
        'short': [
            "Only keyword search",
            "Only semantic search",
            "Random selection",
            "Sequential search"
        ],
        'medium': [
            "The main retrieval strategies involve only using keyword matching without any semantic understanding, which works well for exact term searches",
            "Retrieval in RAG systems relies solely on semantic embeddings without any keyword-based methods, which provides good results for all use cases",
            "The primary retrieval approach is to randomly select documents from the knowledge base, which ensures fair distribution of results",
            "Retrieval strategies focus on sequential scanning of all documents in order, which guarantees comprehensive coverage of the knowledge base"
        ],
        'long': [
            "While keyword-only search is fast and effective for exact term matching, RAG systems benefit from combining it with semantic search to handle synonyms and paraphrasing, making pure keyword search insufficient for comprehensive retrieval",
            "Although semantic search alone provides good results for many queries, combining it with keyword-based methods like BM25 creates hybrid retrieval that captures both semantic meaning and exact term matches, which is more effective than either method alone",
            "Random or sequential document selection might seem straightforward, but effective RAG retrieval requires similarity-based ranking using embeddings or keyword scores to find the most relevant documents, not arbitrary selection methods"
        ]
    },
    'advanced': {
        'short': [
            "Only using better models",
            "Only using more data",
            "No advanced techniques exist",
            "Only fine-tuning models"
        ],
        'medium': [
            "Advanced RAG techniques primarily involve using larger and more powerful language models, which automatically improves all aspects of the system without other modifications",
            "The main way to improve RAG is to add more training data to the knowledge base, which increases the amount of information available for retrieval",
            "There are no advanced techniques beyond basic retrieval and generation - the standard RAG pipeline is sufficient for all use cases",
            "Advanced RAG improvements come mainly from fine-tuning the language model on domain-specific data, which is the primary optimization method"
        ],
        'long': [
            "While using better models can improve performance, advanced RAG techniques like query expansion, multi-query retrieval, and context compression provide significant improvements independent of model choice, making model selection only one part of optimization",
            "Adding more data helps, but advanced techniques like parent-child chunking, iterative retrieval, and metadata filtering can dramatically improve results even with the same knowledge base, showing that data volume isn't the only factor",
            "Although basic RAG works for simple cases, advanced techniques like query expansion, multi-query retrieval, and context compression are essential for production systems dealing with complex queries and large knowledge bases"
        ]
    },
    'production': {
        'short': [
            "Only speed",
            "Only cost",
            "No special considerations",
            "Only model selection"
        ],
        'medium': [
            "Production RAG systems only need to focus on response speed, as faster answers are always better regardless of accuracy or reliability",
            "The main consideration for production is minimizing costs by using the cheapest models and infrastructure, which is sufficient for all use cases",
            "Production RAG systems don't require special considerations beyond basic setup - the same approach works for all environments",
            "Production optimization is primarily about selecting the best language model, which automatically handles all other aspects of the system"
        ],
        'long': [
            "While speed is important, production RAG systems require comprehensive considerations including scalability for millions of documents, monitoring for quality degradation, error handling for reliability, and performance optimization beyond just response time",
            "Cost optimization is valuable, but production systems must also address scalability, monitoring, error handling, and reliability to ensure 99.9%+ uptime and consistent quality, not just minimize expenses",
            "Production RAG systems need extensive considerations beyond basic setup, including horizontal scaling, comprehensive monitoring, graceful error handling, caching strategies, and reliability measures to handle real-world usage patterns"
        ]
    }
}

def get_topic_from_question(question_text):
    """Determine topic from question text."""
    text_lower = question_text.lower()
    if 'chunk' in text_lower or 'document processing' in text_lower:
        return 'chunking'
    elif 'vector database' in text_lower or 'vector db' in text_lower or 'pinecone' in text_lower or 'chroma' in text_lower or 'hnsw' in text_lower or 'ivf' in text_lower:
        return 'vector_db'
    elif 'retrieval' in text_lower or 'bm25' in text_lower or 'dense' in text_lower or 'sparse' in text_lower or 'hybrid' in text_lower or 'rerank' in text_lower:
        return 'retrieval'
    elif 'advanced' in text_lower or 'query expansion' in text_lower or 'multi-query' in text_lower or 'context compression' in text_lower or 'iterative' in text_lower:
        return 'advanced'
    elif 'production' in text_lower or 'monitoring' in text_lower or 'scalability' in text_lower or 'evaluation' in text_lower or 'precision' in text_lower or 'recall' in text_lower:
        return 'production'
    return 'general'

def get_wrong_answers(topic, num=3):
    """Get wrong answers with varied lengths for a topic."""
    templates = WRONG_ANSWERS_BY_TOPIC.get(topic, {
        'short': ["This is incorrect", "Not applicable", "This doesn't work"],
        'medium': ["While this might seem reasonable, it's not the correct approach"],
        'long': ["This comprehensive approach has been considered but doesn't work well in practice"]
    })
    
    return [
        random.choice(templates['short']),
        random.choice(templates['medium']),
        random.choice(templates['long'])
    ]

def randomize_question_block(question_html):
    """Randomize options in a question block."""
    # Extract question header and text
    header_match = re.search(r'(<div class="quiz-question"[^>]*>.*?<h3>Question \d+:\s*(.*?)</h3>)', question_html, re.DOTALL)
    if not header_match:
        return question_html
    
    header = header_match.group(1)
    question_text = header_match.group(2).strip()
    
    # Determine topic
    topic = get_topic_from_question(question_text)
    
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
        return question_html
    
    # Separate correct and wrong
    correct = [o for o in options if o['is_correct']][0]
    wrong = [o for o in options if not o['is_correct']]
    
    if len(wrong) < 3:
        return question_html
    
    # Get topic-appropriate wrong answers with varied lengths
    wrong_texts = get_wrong_answers(topic, 3)
    
    # Get correct answer text (remove label)
    correct_text = re.sub(r'^[A-D]\)\s*', '', correct['text']).strip()
    
    # Combine all options
    all_options = [
        {'is_correct': True, 'text': correct_text},
        {'is_correct': False, 'text': wrong_texts[0]},
        {'is_correct': False, 'text': wrong_texts[1]},
        {'is_correct': False, 'text': wrong_texts[2]}
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
    
    # Find quiz container boundaries
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
        
        # Different seed per chapter for variety
        random.seed(400 + ch_num)
        new_content = process_file(file_path)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated {file_path.name}\n")

if __name__ == '__main__':
    main()
