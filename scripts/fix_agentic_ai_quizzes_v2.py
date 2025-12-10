#!/usr/bin/env python3
"""
Improved script to fix Agentic AI quiz issues with better topic detection.
"""

import re
import random
from pathlib import Path

# Expanded topic-specific wrong answers
WRONG_ANSWERS = {
    'agent_basics': {
        'short': ["Agents are faster than LLMs", "Agents have more parameters", "There is no difference"],
        'medium': ["While agents can process text faster in some scenarios, speed is not the fundamental difference between agents and traditional LLMs", "Although agents may use different model architectures, the number of parameters doesn't define what makes an agent different"],
        'long': ["While processing speed and model size can vary between implementations, the fundamental distinction between agents and traditional LLMs is their ability to autonomously use tools, access real-time data, make decisions, and take actions that affect the environment, not just generate text responses"]
    },
    'capabilities': {
        'short': ["Speed, Accuracy, Efficiency, and Cost", "Text generation, translation, summarization, and Q&A", "Learning, training, inference, and deployment"],
        'medium': ["While speed, accuracy, efficiency, and cost are important considerations in agent design, they are not the core capabilities that define what an agent can do", "Text generation, translation, summarization, and Q&A are capabilities that both agents and traditional LLMs share, but agents have additional capabilities beyond these"],
        'long': ["While performance metrics like speed, accuracy, efficiency, and cost are crucial for evaluating agent systems, the four core capabilities that enable agent functionality are reasoning (thinking through problems), tool use (interacting with external systems), memory (maintaining context), and planning (creating multi-step strategies), which go beyond simple performance characteristics"]
    },
    'decision_loop': {
        'short': ["Input → Process → Output", "Train → Validate → Test", "Plan → Execute → Review"],
        'medium': ["While input-process-output describes a general computation pattern, the agent decision loop specifically involves observing the environment, reasoning about actions, executing actions, and checking if goals are achieved", "Training, validation, and testing are phases in model development, not the operational loop that agents use to make decisions and take actions autonomously"],
        'long': ["While input-process-output describes a general computational pattern, the agent decision loop is specifically designed for autonomous behavior: it continuously observes the environment, reasons about what action to take, executes that action, checks if the goal is achieved, and repeats this cycle until the goal is reached or a termination condition is met"]
    },
    'utility_function': {
        'short': ["The immediate reward from the action", "The cost of executing the action", "The probability of success"],
        'medium': ["While the immediate reward R(state, action) is part of the utility function, V(future_state) specifically represents the expected long-term value, not the immediate reward", "The cost C(action) is subtracted in the utility function, but V(future_state) represents the expected value of the resulting state, which is different from the execution cost"],
        'long': ["While R(state, action) represents the immediate reward from taking the action, V(future_state) specifically captures the expected long-term value or benefit of reaching the state that results from this action, enabling the agent to make strategic decisions that consider future outcomes beyond immediate gains"]
    },
    'agent_types': {
        'short': ["Simple reactive agents", "Tool-using agents", "All agents are equally capable"],
        'medium': ["Simple reactive agents respond immediately without planning, which makes them unsuitable for complex multi-step tasks that require sequential execution and strategic planning", "While tool-using agents can interact with external systems, they may not have the planning capabilities needed for complex multi-step tasks"],
        'long': ["Simple reactive agents respond immediately to current input without creating multi-step plans, which makes them efficient for simple tasks but inadequate for complex tasks that require breaking down goals into sequential steps, coordinating multiple actions, and adapting plans based on intermediate results"]
    },
    'multi_agent': {
        'short': ["They are faster", "They require less memory", "They are easier to implement"],
        'medium': ["While multi-agent systems can sometimes achieve faster results through parallelization, speed is not the primary advantage - the key benefit is specialization and coordinated task processing", "Multi-agent systems actually require more memory to maintain state for each agent, so reduced memory usage is not an advantage"],
        'long': ["While parallel execution in multi-agent systems can lead to faster completion times for some tasks, the primary advantage is that different agents can specialize in different domains (research, writing, analysis), work on different aspects simultaneously, and coordinate their efforts to handle complex tasks that would be difficult for a single general-purpose agent"]
    },
    'memory': {
        'short': ["Only a vector database for embeddings", "Just storing all conversations in a list", "Using only the LLM's context window"],
        'medium': ["While vector databases are useful for long-term memory, a complete memory system requires both short-term buffers for recent context and retrieval mechanisms", "Storing conversations in a list provides basic history but doesn't distinguish between short-term context and long-term persistent facts that need to be retrieved"],
        'long': ["While vector databases are excellent for storing and retrieving long-term memory embeddings, a complete agent memory system requires a short-term memory buffer for recent conversation context, a long-term memory store (vector database or knowledge graph) for persistent facts and learned information, and a retrieval mechanism to access relevant memories when needed"]
    },
    'state_update': {
        'short': ["To calculate the reward", "To select the next action", "To terminate the agent loop"],
        'medium': ["While rewards might be calculated based on state, the state update function specifically evolves the agent's understanding by incorporating new observations", "State updates inform action selection, but the function itself is responsible for evolving the agent's internal representation based on actions and observations"],
        'long': ["While rewards might be calculated based on the updated state, the state update function's primary purpose is to evolve the agent's internal representation by incorporating the results of actions and new observations, updating beliefs, knowledge, and progress tracking to reflect the current understanding of the environment and task status"]
    },
    'infinite_loop': {
        'short': ["There's no way to prevent it", "Only allow one action per turn", "Disable the agent's reasoning capability"],
        'medium': ["While infinite loops are a risk, there are multiple strategies to prevent them including iteration limits, state tracking, and timeout mechanisms", "Limiting to one action per turn would severely restrict agent capabilities and isn't necessary - proper loop prevention uses iteration limits and state detection"],
        'long': ["While infinite loops are a real risk in agent systems, they can be prevented through multiple mechanisms: implementing max_iterations limits to cap the number of cycles, detecting repeated states to identify when the agent is stuck, using timeout mechanisms to prevent indefinite execution, and tracking goal progress to recognize when the agent is making no meaningful advancement toward the objective"]
    },
    'autonomy': {
        'short': ["It responds faster", "It has more training data", "It uses a larger model"],
        'medium': ["While response speed can vary, autonomy is defined by the ability to make decisions and take actions independently, not by speed", "Training data size affects model knowledge but doesn't define autonomy - autonomy comes from decision-making and action-taking capabilities"],
        'long': ["While response speed can be a performance characteristic, autonomy is fundamentally defined by the agent's ability to make independent decisions, take actions that affect the environment, adapt behavior based on results, and operate without constant human intervention, not by how quickly it responds"]
    },
    'reactive_vs_planning': {
        'short': ["They are the same thing", "Reactive agents are always better", "Planning agents are always better"],
        'medium': ["Reactive and planning agents have fundamentally different architectures and use cases - reactive agents respond immediately while planning agents create multi-step strategies", "Reactive agents are better for simple, immediate-response tasks, but planning agents are necessary for complex tasks requiring sequential actions"],
        'long': ["Reactive and planning agents are fundamentally different architectures: reactive agents respond immediately to current input without creating plans, making them suitable for simple tasks requiring quick responses, while planning agents create multi-step strategies, break down complex goals, and execute sequential actions, making them suitable for complex tasks that require coordination and strategic thinking"]
    },
    'goal_parameter': {
        'short': ["It stores the agent's training data", "It contains the agent's weights", "It's not used in decision-making"],
        'medium': ["Training data is used during model training, but the goal parameter represents the current task objective that guides runtime decision-making", "Model weights are part of the trained model, but the goal parameter is a runtime input that specifies what the agent is trying to achieve"],
        'long': ["Training data is used during the model training phase to learn patterns and knowledge, but the goal parameter is a runtime input that specifies the current task objective, desired outcome, or mission that the agent is trying to accomplish, which directly guides the agent's decision-making process during execution"]
    },
    'architecture_components': {
        'short': ["Only the LLM", "Just memory and tools", "Only planning and execution"],
        'medium': ["While the LLM is crucial, a complete agent architecture requires memory systems, tool interfaces, planning modules, and action executors working together", "Memory and tools are important, but agents also need LLM reasoning, planning capabilities, and action execution components"],
        'long': ["While the LLM provides the reasoning engine, a complete agent architecture integrates multiple components: the LLM for reasoning, memory systems for context retention, tool interfaces for external interactions, planning modules for task decomposition, and action executors for implementing decisions, all working in coordination"]
    },
    'memory_types': {
        'short': ["They are the same", "Short-term is faster", "Long-term is larger"],
        'medium': ["While both store information, short-term memory holds recent conversation context while long-term memory stores persistent facts and learned information", "Short-term memory provides immediate context for the current conversation, while long-term memory maintains important information across multiple sessions"],
        'long': ["Short-term and long-term memory serve different purposes: short-term memory maintains recent conversation context and immediate state for the current interaction, while long-term memory stores persistent facts, learned patterns, user preferences, and important information that should be accessible across multiple sessions and conversations"]
    },
    'tool_interface': {
        'short': ["It generates text", "It stores memory", "It plans tasks"],
        'medium': ["While text generation is handled by the LLM, the tool interface specifically manages registration, selection, and execution of external tools and APIs", "Memory storage is handled by the memory system, while the tool interface focuses on managing interactions with external systems and services"],
        'long': ["The tool interface is specifically responsible for managing agent interactions with external systems: it registers available tools, provides tool descriptions to the LLM for selection, handles tool execution with proper parameter passing, manages error handling for tool failures, and integrates tool results back into the agent's reasoning process"]
    },
    'planner': {
        'short': ["It executes actions", "It stores memory", "It generates text"],
        'medium': ["Action execution is handled by the action executor, while the planner focuses on breaking down goals into actionable steps", "Memory storage is managed by the memory system, while the planner creates execution strategies and task sequences"],
        'long': ["The planner component is responsible for task decomposition and strategy creation: it breaks down complex goals into sequences of actionable steps, identifies dependencies between tasks, creates execution plans, adapts plans based on intermediate results, and coordinates multi-step task execution, while action execution itself is handled by the action executor component"]
    },
    'react': {
        'short': ["Only action", "Only reasoning", "Action and observation only"],
        'medium': ["ReAct combines reasoning (explicit thoughts) with action execution, but also includes observation of results to inform the next reasoning step", "While reasoning and action are important, ReAct's key innovation is the explicit thought-action-observation loop that enables transparent reasoning and adaptive behavior"],
        'long': ["ReAct (Reasoning + Acting) is a framework where agents explicitly write reasoning thoughts before taking actions, observe the results of those actions, and use observations to inform subsequent reasoning steps, creating a transparent and adaptive decision-making loop that enables better error handling and strategic thinking"]
    },
    'frameworks': {
        'short': ["Only LangChain", "Only AutoGPT", "They are all the same"],
        'medium': ["While LangChain is popular, there are multiple agent frameworks including AutoGPT, BabyAGI, and LlamaIndex, each with different strengths and use cases", "AutoGPT is one framework, but LangChain, LlamaIndex, and custom frameworks also provide agent capabilities with different approaches"],
        'long': ["There are multiple agent frameworks available: LangChain provides comprehensive agent toolkits with extensive integrations, AutoGPT focuses on autonomous goal-oriented agents, BabyAGI emphasizes task management and prioritization, and LlamaIndex offers specialized retrieval-augmented agents, each with different architectures and strengths for various use cases"]
    },
    'orchestration': {
        'short': ["Only sequential execution", "Only parallel execution", "No coordination needed"],
        'medium': ["Orchestration supports both sequential and parallel execution patterns, choosing the appropriate pattern based on task dependencies and requirements", "While coordination is essential, orchestration provides structured coordination through workflow management, task allocation, and state synchronization"],
        'long': ["Agent orchestration manages complex multi-agent workflows by supporting both sequential execution (for dependent tasks) and parallel execution (for independent tasks), implementing workflow management to handle task dependencies, coordinating agent activities through task allocation and scheduling, and maintaining shared state across agents to ensure consistent progress toward goals"]
    },
    'production': {
        'short': ["Only speed matters", "Only cost matters", "No special considerations"],
        'medium': ["While speed is important, production agents require comprehensive considerations including reliability, monitoring, error handling, and scalability", "Cost optimization is valuable, but production systems must also address reliability, monitoring, security, and proper deployment infrastructure"],
        'long': ["Production agent systems require comprehensive considerations beyond just speed or cost: reliable error handling with retry mechanisms and fallbacks, comprehensive monitoring for performance and quality, scalability to handle varying loads, security measures to protect data and systems, proper testing frameworks, and robust deployment infrastructure to ensure 99.9%+ uptime"]
    }
}

def get_topic_from_question(question_text):
    """Determine topic from question text with improved detection."""
    text_lower = question_text.lower()
    
    # More specific patterns first
    if 'react' in text_lower or 'reasoning and acting' in text_lower:
        return 'react'
    if 'orchestration' in text_lower or 'workflow' in text_lower:
        return 'orchestration'
    if 'production' in text_lower or 'deployment' in text_lower or 'monitoring' in text_lower:
        return 'production'
    if 'framework' in text_lower or 'langchain' in text_lower or 'autogpt' in text_lower:
        return 'frameworks'
    if 'multi-agent' in text_lower or 'multi agent' in text_lower:
        return 'multi_agent'
    if 'tool' in text_lower and ('interface' in text_lower or 'selection' in text_lower or 'execution' in text_lower):
        return 'tool_interface'
    if 'planner' in text_lower or 'planning' in text_lower and 'component' in text_lower:
        return 'planner'
    if 'memory' in text_lower:
        if 'short-term' in text_lower and 'long-term' in text_lower:
            return 'memory_types'
        return 'memory'
    if 'five core components' in text_lower or 'architecture components' in text_lower:
        return 'architecture_components'
    if 'utility function' in text_lower and ('future_state' in text_lower or 'v(' in text_lower):
        return 'utility_function'
    if 'state update' in text_lower or 'state_{t+1}' in text_lower:
        return 'state_update'
    if 'infinite loop' in text_lower or ('prevent' in text_lower and 'loop' in text_lower):
        return 'infinite_loop'
    if 'autonomous' in text_lower or 'autonomy' in text_lower:
        return 'autonomy'
    if 'reactive' in text_lower and 'planning' in text_lower:
        return 'reactive_vs_planning'
    if 'goal' in text_lower and 'parameter' in text_lower:
        return 'goal_parameter'
    if 'decision loop' in text_lower or 'agent loop' in text_lower:
        return 'decision_loop'
    if 'four core capabilities' in text_lower or 'capabilities of ai agents' in text_lower:
        return 'capabilities'
    if 'difference between' in text_lower and 'agent' in text_lower and 'llm' in text_lower:
        return 'agent_basics'
    if 'type of agent' in text_lower and 'planning' in text_lower:
        return 'agent_types'
    
    return 'agent_basics'  # Default

def get_wrong_answers(topic, num=3):
    """Get wrong answers with varied lengths for a topic."""
    templates = WRONG_ANSWERS.get(topic, WRONG_ANSWERS['agent_basics'])
    
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
    """Process a single chapter file."""
    print(f"Processing {file_path.name}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Randomize quiz with topic-specific wrong answers
    quiz_pattern = r'(<div id="quiz"[^>]*>.*?</div>\s*</div>\s*</div>)'
    quiz_match = re.search(quiz_pattern, content, re.DOTALL)
    
    if not quiz_match:
        print(f"  ⚠ No quiz section found")
        return
    
    quiz_section = quiz_match.group(1)
    original_quiz = quiz_section
    
    # Find quiz container boundaries
    container_start = re.search(r'(<div id="quiz"[^>]*>.*?<div class="quiz-container">)', quiz_section, re.DOTALL)
    container_end = re.search(r'(</div>\s*</div>\s*</div>)', quiz_section, re.DOTALL)
    
    if not container_start or not container_end:
        print(f"  ⚠ Could not find quiz container boundaries")
        return
    
    # Find all questions
    question_pattern = r'(<div class="quiz-question"[^>]*>.*?</div>\s*</div>)'
    questions = re.findall(question_pattern, quiz_section, re.DOTALL)
    
    print(f"  Found {len(questions)} questions")
    
    # Process each question
    new_questions = []
    for i, q_html in enumerate(questions, 1):
        new_q = randomize_question_block(q_html)
        new_questions.append(new_q)
        print(f"  Question {i}: Randomized with topic-specific wrong answers")
    
    # Rebuild quiz section
    new_quiz = container_start.group(1) + "\n                        "
    for i, q in enumerate(new_questions):
        if i > 0:
            q = q.replace('<div class="quiz-question">', '<div class="quiz-question" style="margin-top: 2rem;">')
        new_quiz += q + "\n                        "
    new_quiz += container_end.group(1)
    
    # Replace in content
    content = content.replace(original_quiz, new_quiz)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated {file_path.name}\n")

def main():
    base_dir = Path(__file__).parent.parent
    chapters_dir = base_dir / 'templates' / 'tutorials' / 'agentic-ai'
    
    chapters = [1, 2, 3, 4, 5, 6, 7, 8]
    
    for ch_num in chapters:
        file_path = chapters_dir / f'chapter{ch_num}.html'
        if not file_path.exists():
            continue
        
        random.seed(700 + ch_num)  # Different seed per chapter
        process_file(file_path)

if __name__ == '__main__':
    main()
