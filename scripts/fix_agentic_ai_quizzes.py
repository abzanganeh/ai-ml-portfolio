#!/usr/bin/env python3
"""
Fix Agentic AI quiz issues:
1. Replace inline checkAnswer with shared-quiz.js
2. Create topic-specific wrong answers with varied lengths
"""

import re
import random
from pathlib import Path

# Topic-specific wrong answers for Agentic AI
WRONG_ANSWERS = {
    'agent_basics': {
        'short': [
            "Agents are faster than LLMs",
            "Agents have more parameters",
            "Agents use less memory",
            "There is no difference"
        ],
        'medium': [
            "While agents can process text faster in some scenarios, speed is not the fundamental difference between agents and traditional LLMs",
            "Although agents may use different model architectures, the number of parameters doesn't define what makes an agent different from a standard language model",
            "Agents actually require more memory to store state and context, so reduced memory usage is not a characteristic that distinguishes them",
            "While both agents and LLMs can generate text, the key difference lies in their ability to take actions and interact with external systems, not just in their text generation capabilities"
        ],
        'long': [
            "While processing speed and model size can vary between implementations, the fundamental distinction between agents and traditional LLMs is their ability to autonomously use tools, access real-time data, make decisions, and take actions that affect the environment, not just generate text responses",
            "Although parameter count and model architecture are important technical details, what truly differentiates agents from traditional LLMs is their autonomous decision-making capability, tool-using functionality, memory systems, and ability to execute actions beyond text generation",
            "Memory usage patterns differ between agents and LLMs, but the critical difference is that agents maintain persistent state, use external tools, and can autonomously interact with systems, whereas traditional LLMs are limited to generating text based on their training data without taking actions"
        ]
    },
    'capabilities': {
        'short': [
            "Speed, Accuracy, Efficiency, and Cost",
            "Text generation, translation, summarization, and Q&A",
            "Learning, training, inference, and deployment"
        ],
        'medium': [
            "While speed, accuracy, efficiency, and cost are important considerations in agent design, they are not the core capabilities that define what an agent can do",
            "Text generation, translation, summarization, and Q&A are capabilities that both agents and traditional LLMs share, but agents have additional capabilities beyond these",
            "Learning, training, inference, and deployment are stages in the ML lifecycle, not the core capabilities that enable agents to function autonomously"
        ],
        'long': [
            "While performance metrics like speed, accuracy, efficiency, and cost are crucial for evaluating agent systems, the four core capabilities that enable agent functionality are reasoning (thinking through problems), tool use (interacting with external systems), memory (maintaining context), and planning (creating multi-step strategies), which go beyond simple performance characteristics",
            "Text generation, translation, summarization, and Q&A are natural language processing capabilities that both agents and traditional LLMs possess, but agents additionally have reasoning capabilities to break down tasks, tool-using capabilities to interact with external systems, memory systems to maintain context, and planning capabilities to create multi-step strategies",
            "Learning, training, inference, and deployment represent different phases of machine learning system development, but the core agent capabilities are reasoning (step-by-step thinking), tool use (external system interaction), memory (context retention), and planning (multi-step task breakdown), which enable autonomous behavior"
        ]
    },
    'decision_loop': {
        'short': [
            "Input → Process → Output",
            "Train → Validate → Test",
            "Plan → Execute → Review"
        ],
        'medium': [
            "While input-process-output describes a general computation pattern, the agent decision loop specifically involves observing the environment, reasoning about actions, executing actions, and checking if goals are achieved",
            "Training, validation, and testing are phases in model development, not the operational loop that agents use to make decisions and take actions autonomously",
            "Planning, execution, and review are components of the agent loop, but the complete loop includes observation of the environment and continuous checking until goals are achieved"
        ],
        'long': [
            "While input-process-output describes a general computational pattern, the agent decision loop is specifically designed for autonomous behavior: it continuously observes the environment, reasons about what action to take, executes that action, checks if the goal is achieved, and repeats this cycle until the goal is reached or a termination condition is met",
            "Training, validation, and testing are important phases in machine learning model development, but the agent decision loop is the operational cycle that agents use during runtime to autonomously make decisions, take actions, observe results, and adapt their behavior based on outcomes",
            "While planning, execution, and review are important components, the complete agent decision loop includes observation (perceiving current state), reasoning (deciding what to do), acting (executing actions), and checking (determining if goal is achieved), with the loop continuing until the goal is reached"
        ]
    },
    'utility_function': {
        'short': [
            "The immediate reward from the action",
            "The cost of executing the action",
            "The probability of success"
        ],
        'medium': [
            "While the immediate reward R(state, action) is part of the utility function, V(future_state) specifically represents the expected long-term value, not the immediate reward",
            "The cost C(action) is subtracted in the utility function, but V(future_state) represents the expected value of the resulting state, which is different from the execution cost",
            "While probability of success might be used in calculating V(future_state), V itself represents the expected value or benefit of reaching that future state, not just the probability"
        ],
        'long': [
            "While R(state, action) represents the immediate reward from taking the action, V(future_state) specifically captures the expected long-term value or benefit of reaching the state that results from this action, enabling the agent to make strategic decisions that consider future outcomes beyond immediate gains",
            "The cost C(action) represents resources consumed (time, tokens, API calls) and is subtracted from utility, but V(future_state) represents the predicted value or benefit of the resulting state after the action, allowing agents to evaluate strategic moves that may have lower immediate reward but better long-term outcomes",
            "While probability of success might factor into calculating V(future_state), V itself represents the expected value, benefit, or utility of reaching that future state, which enables agents to make decisions that balance immediate rewards with long-term strategic value"
        ]
    },
    'agent_types': {
        'short': [
            "Simple reactive agents",
            "Tool-using agents",
            "All agents are equally capable"
        ],
        'medium': [
            "Simple reactive agents respond immediately without planning, which makes them unsuitable for complex multi-step tasks that require sequential execution and strategic planning",
            "While tool-using agents can interact with external systems, they may not have the planning capabilities needed for complex multi-step tasks that require breaking down goals into sequential sub-tasks",
            "Different agent types have different capabilities - planning agents are specifically designed for tasks requiring multi-step planning and sequential execution, making them better suited than reactive or simple tool-using agents"
        ],
        'long': [
            "Simple reactive agents respond immediately to current input without creating multi-step plans, which makes them efficient for simple tasks but inadequate for complex tasks that require breaking down goals into sequential steps, coordinating multiple actions, and adapting plans based on intermediate results",
            "While tool-using agents can interact with external systems and APIs, they may lack the sophisticated planning capabilities needed for complex tasks that require creating multi-step strategies, managing task dependencies, and executing sequential actions in a coordinated manner",
            "Different agent architectures have distinct capabilities - planning agents are specifically designed with planning modules that can break down complex goals into sequential sub-tasks, create execution strategies, manage dependencies between steps, and adapt plans based on results, making them uniquely suited for multi-step planning and sequential execution tasks"
        ]
    },
    'multi_agent': {
        'short': [
            "They are faster",
            "They require less memory",
            "They are easier to implement"
        ],
        'medium': [
            "While multi-agent systems can sometimes achieve faster results through parallelization, speed is not the primary advantage - the key benefit is specialization and coordinated task processing",
            "Multi-agent systems actually require more memory to maintain state for each agent, so reduced memory usage is not an advantage",
            "Multi-agent systems are more complex to implement due to coordination requirements, so ease of implementation is not an advantage"
        ],
        'long': [
            "While parallel execution in multi-agent systems can lead to faster completion times for some tasks, the primary advantage is that different agents can specialize in different domains (research, writing, analysis), work on different aspects simultaneously, and coordinate their efforts to handle complex tasks that would be difficult for a single general-purpose agent",
            "Multi-agent systems actually require more memory and computational resources to maintain state, communication channels, and coordination mechanisms for each agent, so reduced memory usage is not an advantage - the benefit comes from specialized agents working together",
            "Multi-agent systems are significantly more complex to implement due to the need for agent coordination, communication protocols, task distribution, state synchronization, and conflict resolution, so ease of implementation is not an advantage - the benefit is the ability to handle complex tasks through specialized agent collaboration"
        ]
    },
    'memory': {
        'short': [
            "Only a vector database for embeddings",
            "Just storing all conversations in a list",
            "Using only the LLM's context window"
        ],
        'medium': [
            "While vector databases are useful for long-term memory, a complete memory system requires both short-term buffers for recent context and retrieval mechanisms",
            "Storing conversations in a list provides basic history but doesn't distinguish between short-term context and long-term persistent facts that need to be retrieved",
            "Relying only on the LLM's context window is limited and doesn't provide the persistent long-term memory that agents need for maintaining context across sessions"
        ],
        'long': [
            "While vector databases are excellent for storing and retrieving long-term memory embeddings, a complete agent memory system requires a short-term memory buffer for recent conversation context, a long-term memory store (vector database or knowledge graph) for persistent facts and learned information, and a retrieval mechanism to access relevant memories when needed",
            "Simply storing all conversations in a list provides basic conversation history but doesn't distinguish between ephemeral short-term context (recent turns) and important long-term facts that should persist, and lacks efficient retrieval mechanisms to find relevant information from past interactions",
            "Using only the LLM's context window severely limits memory capacity and doesn't provide persistent storage across sessions - a proper agent memory system needs short-term buffers for immediate context, long-term storage for important facts, and retrieval mechanisms to access relevant memories"
        ]
    },
    'state_update': {
        'short': [
            "To calculate the reward",
            "To select the next action",
            "To terminate the agent loop"
        ],
        'medium': [
            "While rewards might be calculated based on state, the state update function specifically evolves the agent's understanding by incorporating new observations",
            "State updates inform action selection, but the function itself is responsible for evolving the agent's internal representation based on actions and observations",
            "State updates don't terminate the loop - they prepare the state for the next iteration, with termination happening when goals are achieved"
        ],
        'long': [
            "While rewards might be calculated based on the updated state, the state update function's primary purpose is to evolve the agent's internal representation by incorporating the results of actions and new observations, updating beliefs, knowledge, and progress tracking to reflect the current understanding of the environment and task status",
            "State updates provide information that influences action selection, but the function itself is responsible for transforming the agent's state by incorporating action results and observations, updating memory, progress tracking, and beliefs to create a new state representation that reflects the agent's current understanding",
            "State updates don't terminate the agent loop - they prepare the state for the next decision cycle by incorporating action results and observations, updating the agent's knowledge and progress. Termination occurs separately when goals are achieved or termination conditions are met"
        ]
    },
    'infinite_loop': {
        'short': [
            "There's no way to prevent it",
            "Only allow one action per turn",
            "Disable the agent's reasoning capability"
        ],
        'medium': [
            "While infinite loops are a risk, there are multiple strategies to prevent them including iteration limits, state tracking, and timeout mechanisms",
            "Limiting to one action per turn would severely restrict agent capabilities and isn't necessary - proper loop prevention uses iteration limits and state detection",
            "Disabling reasoning would defeat the purpose of having an agent - proper prevention uses iteration limits, state tracking, and goal progress monitoring"
        ],
        'long': [
            "While infinite loops are a real risk in agent systems, they can be prevented through multiple mechanisms: implementing max_iterations limits to cap the number of cycles, detecting repeated states to identify when the agent is stuck, using timeout mechanisms to prevent indefinite execution, and tracking goal progress to recognize when the agent is making no meaningful advancement toward the objective",
            "Limiting agents to one action per turn would severely restrict their ability to handle complex multi-step tasks and isn't necessary for preventing infinite loops - effective prevention uses iteration limits to cap execution cycles, state repetition detection to identify when the agent is cycling, timeout mechanisms for safety, and goal progress tracking to ensure meaningful advancement",
            "Disabling the agent's reasoning capability would completely undermine the purpose of having an intelligent agent - proper infinite loop prevention uses max_iterations limits to bound execution, repeated state detection to identify cycles, timeout mechanisms for safety, and goal progress monitoring to ensure the agent is advancing toward objectives rather than getting stuck"
        ]
    },
    'autonomy': {
        'short': [
            "It responds faster",
            "It has more training data",
            "It uses a larger model"
        ],
        'medium': [
            "While response speed can vary, autonomy is defined by the ability to make decisions and take actions independently, not by speed",
            "Training data size affects model knowledge but doesn't define autonomy - autonomy comes from decision-making and action-taking capabilities",
            "Model size affects capacity but not autonomy - autonomy requires decision-making, tool use, and adaptive behavior capabilities"
        ],
        'long': [
            "While response speed can be a performance characteristic, autonomy is fundamentally defined by the agent's ability to make independent decisions, take actions that affect the environment, adapt behavior based on results, and operate without constant human intervention, not by how quickly it responds",
            "Training data size affects the knowledge base available to the model but doesn't define autonomy - true autonomy requires the ability to reason about situations, make decisions, use tools, take actions, and adapt behavior based on outcomes, which goes beyond just having more training data",
            "Model size affects the capacity and capabilities of the language model component, but autonomy is defined by the agent's ability to make independent decisions, interact with external systems, take actions, and adapt behavior without constant human oversight, not by the size of the underlying model"
        ]
    },
    'reactive_vs_planning': {
        'short': [
            "They are the same thing",
            "Reactive agents are always better",
            "Planning agents are always better"
        ],
        'medium': [
            "Reactive and planning agents have fundamentally different architectures and use cases - reactive agents respond immediately while planning agents create multi-step strategies",
            "Reactive agents are better for simple, immediate-response tasks, but planning agents are necessary for complex tasks requiring sequential actions",
            "Planning agents excel at complex multi-step tasks, but reactive agents are more efficient for simple tasks that don't require planning"
        ],
        'long': [
            "Reactive and planning agents are fundamentally different architectures: reactive agents respond immediately to current input without creating plans, making them suitable for simple tasks requiring quick responses, while planning agents create multi-step strategies, break down complex goals, and execute sequential actions, making them suitable for complex tasks that require coordination and strategic thinking",
            "Reactive agents are more efficient for simple tasks that require immediate responses without complex reasoning, but planning agents are essential for complex tasks that require breaking down goals into sequential steps, managing dependencies, coordinating multiple actions, and adapting strategies based on intermediate results",
            "Planning agents excel at complex multi-step tasks that require strategic thinking, task decomposition, and sequential execution, but reactive agents are more efficient and appropriate for simple tasks that need immediate responses without the overhead of planning and multi-step coordination"
        ]
    },
    'goal_parameter': {
        'short': [
            "It stores the agent's training data",
            "It contains the agent's weights",
            "It's not used in decision-making"
        ],
        'medium': [
            "Training data is used during model training, but the goal parameter represents the current task objective that guides runtime decision-making",
            "Model weights are part of the trained model, but the goal parameter is a runtime input that specifies what the agent is trying to achieve",
            "The goal parameter is central to decision-making - it guides the agent's reasoning about what actions to take to achieve the desired outcome"
        ],
        'long': [
            "Training data is used during the model training phase to learn patterns and knowledge, but the goal parameter is a runtime input that specifies the current task objective, desired outcome, or mission that the agent is trying to accomplish, which directly guides the agent's decision-making process during execution",
            "Model weights are learned parameters stored in the trained neural network that encode the model's knowledge, but the goal parameter is a dynamic runtime input that specifies the specific task, objective, or desired outcome for the current execution, which the agent uses to guide its reasoning and action selection",
            "The goal parameter is absolutely central to decision-making - it defines the desired outcome or task that the agent is trying to achieve, directly influences the agent's reasoning process, guides action selection by helping the agent evaluate which actions move toward the goal, and enables the agent to determine when the task is complete"
        ]
    }
}

def get_topic_from_question(question_text):
    """Determine topic from question text."""
    text_lower = question_text.lower()
    
    if 'difference between' in text_lower and 'agent' in text_lower and 'llm' in text_lower:
        return 'agent_basics'
    elif 'four core capabilities' in text_lower or 'capabilities of ai agents' in text_lower:
        return 'capabilities'
    elif 'decision loop' in text_lower or 'agent loop' in text_lower:
        return 'decision_loop'
    elif 'utility function' in text_lower and 'future_state' in text_lower:
        return 'utility_function'
    elif 'type of agent' in text_lower and 'planning' in text_lower:
        return 'agent_types'
    elif 'multi-agent' in text_lower or 'multi agent' in text_lower:
        return 'multi_agent'
    elif 'memory' in text_lower and ('short-term' in text_lower or 'long-term' in text_lower):
        return 'memory'
    elif 'state update' in text_lower or 'state_{t+1}' in text_lower:
        return 'state_update'
    elif 'infinite loop' in text_lower or 'prevent' in text_lower and 'loop' in text_lower:
        return 'infinite_loop'
    elif 'autonomous' in text_lower or 'autonomy' in text_lower:
        return 'autonomy'
    elif 'reactive' in text_lower and 'planning' in text_lower:
        return 'reactive_vs_planning'
    elif 'goal' in text_lower and 'parameter' in text_lower:
        return 'goal_parameter'
    
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

def fix_quiz_script(file_path):
    """Replace inline checkAnswer with shared-quiz.js script."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Check if shared-quiz.js is already included
    if 'shared-quiz.js' in content:
        print(f"  ✓ shared-quiz.js already included")
    else:
        # Find the script section before closing body tag
        # Look for the agentic-ai shared-tutorial.js script
        script_pattern = r'(<script src="\{\{ url_for\(\'static\', filename=\'js/tutorials/agentic-ai/shared-tutorial\.js\'\) \}\}"></script>)'
        script_match = re.search(script_pattern, content)
        
        if script_match:
            # Add shared-quiz.js right after shared-tutorial.js
            new_script = f'''<script src="{{{{ url_for('static', filename='js/tutorials/shared-quiz.js') }}}}?v=2"></script>
    {script_match.group(1)}'''
            content = content.replace(script_match.group(1), new_script)
            print(f"  ✓ Added shared-quiz.js script")
        else:
            print(f"  ⚠ Could not find script section to add shared-quiz.js")
    
    # Remove inline checkAnswer function
    inline_checkanswer_pattern = r'        function checkAnswer\(element, isCorrect\) \{.*?\n        \}'
    if re.search(inline_checkanswer_pattern, content, re.DOTALL):
        content = re.sub(inline_checkanswer_pattern, '', content, flags=re.DOTALL)
        print(f"  ✓ Removed inline checkAnswer function")
    
    return content

def process_file(file_path):
    """Process a single chapter file."""
    print(f"Processing {file_path.name}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Fix quiz script
    content = fix_quiz_script(file_path)
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        # Re-read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    
    # 2. Randomize quiz with topic-specific wrong answers
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
        
        random.seed(600 + ch_num)  # Different seed per chapter
        process_file(file_path)

if __name__ == '__main__':
    main()
