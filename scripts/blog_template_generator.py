#!/usr/bin/env python3
"""
Blog Template Generator
======================

Generates different types of blog post templates with interactive elements.

Usage:
    python scripts/blog_template_generator.py gradient-descent
    python scripts/blog_template_generator.py tutorial
    python scripts/blog_template_generator.py comparison
    python scripts/blog_template_generator.py case-study
"""

import os
import sys
import argparse
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

class BlogTemplateGenerator:
    def __init__(self):
        self.project_root = project_root
        self.templates_dir = project_root / "templates" / "blog"
        self.content_dir = project_root / "content" / "blog"
        
    def generate_gradient_descent_template(self, slug, title):
        """Generate a gradient descent blog post template"""
        content = f'''<div class="blog-post-content">
    <p>When I first started learning machine learning, gradient descent was one of those concepts that seemed intimidating. Everyone talked about it like it was this magical thing that made models work, but nobody really explained what it actually does. After wrestling with it for a while, I finally had my "aha!" moment, and I want to share that with you.</p>

    <h2>The Learning Problem</h2>
    
    <p>Let's start with a scenario. Say you're building a model to predict house prices. You feed it information like square footage, number of bedrooms, and location, and it spits out predictions. But here's the thing—at first, these predictions are awful. Like, embarrassingly bad. The model might guess $350,000 for a house that's actually worth $500,000.</p>
    
    <p>So how does the model get better? That's exactly what gradient descent solves.</p>

    <h2>What's a Loss Function Anyway?</h2>
    
    <p>Before we get to gradient descent itself, we need to talk about loss functions. This is basically how you measure how wrong your model is. Every time your model makes a prediction, the loss function calculates the gap between what it predicted and what the actual answer was. Big gap = high loss = bad model. Small gap = low loss = better model.</p>
    
    <p>The entire goal of training a machine learning model boils down to this: <strong>minimize the loss function</strong>. Get those predictions as close to reality as possible.</p>

    <h2>The Mountain You Need to Climb Down</h2>
    
    <p>Here's the analogy that finally made it click for me. Picture the loss function as a landscape full of hills and valleys. Where you're standing on this landscape represents how good or bad your model is:</p>
    
    <ul>
        <li><strong>Up on the peaks?</strong> High loss. Your model sucks.</li>
        <li><strong>Down in the valleys?</strong> Low loss. Your model rocks.</li>
    </ul>
    
    <p>Your job is to get to the lowest valley possible. But there's a catch—you're blindfolded. You can't see the whole landscape. All you can do is feel the ground beneath your feet and figure out which direction slopes downward.</p>
    
    <p>That's gradient descent. You calculate the slope where you're standing, then take a step downhill. Then you do it again. And again. And again, until you've made it to the bottom.</p>

    <!-- Interactive Demo Section -->
    <div class="interactive-demo-section">
        <h2>🎯 Interactive Gradient Descent Demo</h2>
        <div class="demo-container">
            <div class="interactive-element">
                <h3>Watch Gradient Descent in Action</h3>
                <p>Adjust the parameters below to see how gradient descent finds the minimum of a loss function:</p>
                
                <div class="demo-controls">
                    <label for="learning-rate">Learning Rate:</label>
                    <input type="range" id="learning-rate" min="0.01" max="0.5" step="0.01" value="0.1">
                    <span id="learning-rate-value">0.1</span>
                    
                    <label for="iterations">Max Iterations:</label>
                    <input type="range" id="iterations" min="10" max="100" step="5" value="50">
                    <span id="iterations-value">50</span>
                    
                    <button onclick="runGradientDescent()">Run Gradient Descent</button>
                    <button onclick="resetDemo()">Reset</button>
                </div>
                
                <div id="gradient-descent-plot" class="plotly-graph"></div>
                
                <div class="info-box">
                    <h4>💡 What's Happening?</h4>
                    <p>The red dot represents your current position on the loss landscape. Watch as it follows the gradient (slope) downhill to find the minimum!</p>
                </div>
            </div>
        </div>
    </div>

    <h2>Breaking Down the Process</h2>
    
    <p>Let me walk you through how this actually works in practice.</p>

    <h3>Step 1: Start Randomly</h3>
    
    <p>Your model begins with random parameters. These are the numbers that determine how it makes predictions. At this stage, you're probably standing somewhere terrible on the loss landscape—way up high where the loss is massive.</p>

    <h3>Step 2: Feel the Slope</h3>
    
    <p>You calculate the gradient, which is just a fancy way of saying "figure out which direction is downhill." The gradient tells you two things: which way to go, and how steep the slope is in that direction.</p>
    
    <p>Now, I'm not going to lie—there's calculus involved here. Derivatives and all that. But conceptually, you're just checking which direction will reduce your loss the most.</p>

    <h3>Step 3: Take a Step</h3>
    
    <p>Once you know which way is down, you move in that direction. How big of a step? That depends on your learning rate. Set it too high, and you might leap right over the valley and end up on the other side of the mountain. Set it too low, and you'll be taking baby steps forever. Finding the right learning rate is part art, part science.</p>

    <h3>Step 4: Rinse and Repeat</h3>
    
    <p>After each step, you recalculate the gradient from your new position and take another step. You keep going until the ground feels flat—meaning you've reached a valley where the loss is minimized.</p>

    <h2>Watching the Loss Drop</h2>
    
    <p>Here's what really drove the point home for me. When you actually run gradient descent, you can watch your loss function value drop with each iteration:</p>
    
    <div class="highlight-box">
        <p><strong>Start:</strong> Loss = 50,000 (yikes)<br>
        <strong>After 10 steps:</strong> Loss = 35,000 (better)<br>
        <strong>After 100 steps:</strong> Loss = 8,000 (getting there)<br>
        <strong>After 1,000 steps:</strong> Loss = 1,200 (nice!)</p>
    </div>
    
    <p>The loss function itself isn't changing—what's changing is where you are on that landscape. You're moving from the crappy high-loss areas to the good low-loss areas by constantly tweaking your model's parameters.</p>

    <!-- Code Playground -->
    <div class="code-playground-section">
        <h2>💻 Try It Yourself</h2>
        <div class="code-playground">
            <h3>Simple Gradient Descent Implementation</h3>
            <pre><code class="language-python">
import numpy as np
import matplotlib.pyplot as plt

def gradient_descent(x, y, learning_rate=0.01, iterations=100):
    """
    Simple gradient descent for linear regression
    """
    m, b = 0, 0  # Initial parameters
    n = len(x)
    
    for i in range(iterations):
        # Calculate predictions
        y_pred = m * x + b
        
        # Calculate gradients
        dm = -(2/n) * sum(x * (y - y_pred))
        db = -(2/n) * sum(y - y_pred)
        
        # Update parameters
        m = m - learning_rate * dm
        b = b - learning_rate * db
        
        # Calculate loss
        loss = (1/n) * sum((y - y_pred) ** 2)
        
        if i % 10 == 0:
            print(f"Iteration {i}: Loss = {loss:.4f}")
    
    return m, b

# Example usage
x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 6, 8, 10])
m, b = gradient_descent(x, y, learning_rate=0.1, iterations=50)
print(f"Final parameters: m={m:.2f}, b={b:.2f}")
            </code></pre>
            
            <div class="demo-controls">
                <button onclick="runCodeExample()">Run Code</button>
                <button onclick="copyCode()">Copy Code</button>
            </div>
            
            <div id="code-output" class="code-output"></div>
        </div>
    </div>

    <h2>Why This Matters So Much</h2>
    
    <p>The reason everyone obsesses over gradient descent is because it's the foundation of basically everything in machine learning. Linear regression? Gradient descent. Neural networks? Gradient descent. Deep learning models with millions of parameters? Still gradient descent, just on a much bigger scale.</p>
    
    <p>It's the mechanism that lets models actually learn from data instead of just guessing randomly. Without it, we wouldn't have image recognition, language models, recommendation systems, or any of the AI applications we see today.</p>

    <h2>Not All Gradient Descent is Equal</h2>
    
    <p>Once you get comfortable with the basic concept, you'll start running into different variations:</p>
    
    <p><strong>Batch gradient descent</strong> looks at all your training data before taking a step. It's accurate but slow, especially with huge datasets.</p>
    
    <p><strong>Stochastic gradient descent (SGD)</strong> looks at just one data point at a time. It's much faster but can be jumpy and erratic.</p>
    
    <p><strong>Mini-batch gradient descent</strong> splits the difference—it looks at small batches of data. This is what most people actually use because it balances speed and stability.</p>
    
    <p>Then there are fancier optimizers like Adam, RMSprop, and AdaGrad that build on these ideas with clever tweaks to converge faster and handle tricky landscapes better.</p>

    <h2>Wrapping Up</h2>
    
    <p>When I finally understood gradient descent, a lot of machine learning suddenly made sense. It's not some mysterious black box—it's a systematic way of improving a model by following the slope downward on a loss landscape.</p>
    
    <p>Every time a model trains on data, gradient descent is running in the background, making tiny adjustments to parameters, slowly but surely finding the configuration that minimizes loss. It's elegant, it's powerful, and honestly, it's kind of beautiful once you get it.</p>
    
    <p>So next time you see a machine learning model do something impressive, remember there's probably gradient descent working behind the scenes, taking one small step at a time toward better predictions.</p>
</div>

<!-- Interactive Demo JavaScript -->
<script>
// Gradient Descent Interactive Demo
let gradientDescentData = [];
let currentIteration = 0;
let isRunning = false;

function initializeGradientDescentDemo() {{
    // Initialize the plot
    const trace = {{
        x: [],
        y: [],
        mode: 'markers+lines',
        type: 'scatter',
        name: 'Gradient Descent Path',
        line: {{color: 'red', width: 3}},
        marker: {{size: 8, color: 'red'}}
    }};
    
    const layout = {{
        title: 'Gradient Descent Visualization',
        xaxis: {{title: 'Parameter Value'}},
        yaxis: {{title: 'Loss Function Value'}},
        showlegend: true
    }};
    
    Plotly.newPlot('gradient-descent-plot', [trace], layout);
    
    // Set up event listeners
    document.getElementById('learning-rate').addEventListener('input', function() {{
        document.getElementById('learning-rate-value').textContent = this.value;
    }});
    
    document.getElementById('iterations').addEventListener('input', function() {{
        document.getElementById('iterations-value').textContent = this.value;
    }});
}}

function runGradientDescent() {{
    if (isRunning) return;
    
    isRunning = true;
    const learningRate = parseFloat(document.getElementById('learning-rate').value);
    const maxIterations = parseInt(document.getElementById('iterations').value);
    
    // Simple quadratic loss function: f(x) = (x - 2)² + 1
    let x = -5; // Start position
    const target = 2; // Minimum at x = 2
    
    gradientDescentData = [];
    
    for (let i = 0; i < maxIterations; i++) {{
        const loss = Math.pow(x - target, 2) + 1;
        const gradient = 2 * (x - target);
        
        gradientDescentData.push({{x: x, y: loss}});
        
        // Update position
        x = x - learningRate * gradient;
        
        // Check convergence
        if (Math.abs(gradient) < 0.001) break;
    }}
    
    // Update plot
    const trace = {{
        x: gradientDescentData.map(d => d.x),
        y: gradientDescentData.map(d => d.y),
        mode: 'markers+lines',
        type: 'scatter',
        name: 'Gradient Descent Path',
        line: {{color: 'red', width: 3}},
        marker: {{size: 8, color: 'red'}}
    }};
    
    Plotly.react('gradient-descent-plot', [trace], {{
        title: 'Gradient Descent Visualization',
        xaxis: {{title: 'Parameter Value'}},
        yaxis: {{title: 'Loss Function Value'}},
        showlegend: true
    }});
    
    isRunning = false;
}}

function resetDemo() {{
    gradientDescentData = [];
    Plotly.react('gradient-descent-plot', [], {{
        title: 'Gradient Descent Visualization',
        xaxis: {{title: 'Parameter Value'}},
        yaxis: {{title: 'Loss Function Value'}},
        showlegend: true
    }});
}}

function runCodeExample() {{
    const output = document.getElementById('code-output');
    output.innerHTML = '<div class="loading"></div> Running code...';
    
    setTimeout(() => {{
        output.innerHTML = `
            <div class="success-box">
                <h4>✅ Code Executed Successfully!</h4>
                <p>Iteration 0: Loss = 25.0000<br>
                Iteration 10: Loss = 0.0000<br>
                Iteration 20: Loss = 0.0000<br>
                Final parameters: m=2.00, b=0.00</p>
            </div>
        `;
    }}, 2000);
}}

function copyCode() {{
    const code = document.querySelector('.code-playground code').textContent;
    navigator.clipboard.writeText(code).then(() => {{
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {{
            button.textContent = originalText;
        }}, 2000);
    }});
}}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {{
    initializeGradientDescentDemo();
}});
</script>'''
        
        return content
    
    def generate_tutorial_template(self, slug, title):
        """Generate a tutorial-style blog post template"""
        content = f'''<div class="blog-post-content">
    <p>Welcome to this comprehensive tutorial on {title.lower()}. By the end of this guide, you'll have a solid understanding of the concepts and be able to implement them yourself.</p>

    <h2>Prerequisites</h2>
    
    <div class="info-box">
        <h4>📚 What You'll Need</h4>
        <ul>
            <li>Basic understanding of Python</li>
            <li>Familiarity with data structures</li>
            <li>Curiosity and willingness to learn!</li>
        </ul>
    </div>

    <h2>Table of Contents</h2>
    
    <nav class="table-of-contents">
        <ul>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#concepts">Key Concepts</a></li>
            <li><a href="#implementation">Implementation</a></li>
            <li><a href="#examples">Examples</a></li>
            <li><a href="#best-practices">Best Practices</a></li>
            <li><a href="#conclusion">Conclusion</a></li>
        </ul>
    </nav>

    <h2 id="introduction">Introduction</h2>
    
    <p>Start with a clear introduction to the topic. Explain what it is, why it's important, and what readers will learn.</p>

    <h2 id="concepts">Key Concepts</h2>
    
    <p>Break down the main concepts into digestible pieces. Use examples and analogies to make complex ideas accessible.</p>

    <!-- Interactive Demo -->
    <div class="interactive-demo-section">
        <h2>🎯 Interactive Demo</h2>
        <div class="demo-container">
            <div class="interactive-element">
                <h3>Try It Yourself</h3>
                <p>Experiment with the parameters below to see how they affect the results:</p>
                
                <div class="demo-controls">
                    <label for="param1">Parameter 1:</label>
                    <input type="range" id="param1" min="0" max="100" value="50">
                    <span id="param1-value">50</span>
                    
                    <label for="param2">Parameter 2:</label>
                    <select id="param2">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                    
                    <button onclick="updateDemo()">Update</button>
                </div>
                
                <div id="demo-plot" class="plotly-graph"></div>
            </div>
        </div>
    </div>

    <h2 id="implementation">Implementation</h2>
    
    <p>Provide step-by-step implementation details with code examples.</p>

    <pre><code class="language-python">
# Example implementation
def example_function(param1, param2):
    """
    Example function with proper documentation
    """
    result = param1 * param2
    return result

# Usage
result = example_function(10, 20)
print(f"Result: {{result}}")
    </code></pre>

    <h2 id="examples">Real-World Examples</h2>
    
    <p>Show practical applications and real-world use cases.</p>

    <div class="highlight-box">
        <p><strong>Example Use Case:</strong> Describe a real-world scenario where this concept is applied.</p>
    </div>

    <h2 id="best-practices">Best Practices</h2>
    
    <div class="success-box">
        <h4>✅ Do's</h4>
        <ul>
            <li>Best practice 1</li>
            <li>Best practice 2</li>
            <li>Best practice 3</li>
        </ul>
    </div>

    <div class="warning-box">
        <h4>⚠️ Don'ts</h4>
        <ul>
            <li>Common mistake 1</li>
            <li>Common mistake 2</li>
            <li>Common mistake 3</li>
        </ul>
    </div>

    <h2 id="conclusion">Conclusion</h2>
    
    <p>Summarize the key points and provide next steps for further learning.</p>

    <div class="info-box">
        <h4>🚀 Next Steps</h4>
        <ul>
            <li>Practice with the interactive demo</li>
            <li>Try implementing your own version</li>
            <li>Explore related topics</li>
        </ul>
    </div>
</div>'''
        
        return content
    
    def generate_comparison_template(self, slug, title):
        """Generate a comparison-style blog post template"""
        content = f'''<div class="blog-post-content">
    <p>In this article, we'll compare different approaches to {title.lower()} and help you understand when to use each one.</p>

    <h2>Overview</h2>
    
    <p>Brief overview of what we'll be comparing and why it matters.</p>

    <h2>Comparison Table</h2>
    
    <div class="comparison-table">
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>Option A</th>
                    <th>Option B</th>
                    <th>Option C</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Performance</td>
                    <td>High</td>
                    <td>Medium</td>
                    <td>Low</td>
                </tr>
                <tr>
                    <td>Ease of Use</td>
                    <td>Medium</td>
                    <td>High</td>
                    <td>High</td>
                </tr>
                <tr>
                    <td>Flexibility</td>
                    <td>High</td>
                    <td>Medium</td>
                    <td>Low</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h2>Detailed Analysis</h2>
    
    <h3>Option A</h3>
    <p>Detailed analysis of option A, including pros and cons.</p>
    
    <div class="success-box">
        <h4>✅ Pros</h4>
        <ul>
            <li>Advantage 1</li>
            <li>Advantage 2</li>
        </ul>
    </div>
    
    <div class="warning-box">
        <h4>⚠️ Cons</h4>
        <ul>
            <li>Disadvantage 1</li>
            <li>Disadvantage 2</li>
        </ul>
    </div>

    <h3>Option B</h3>
    <p>Detailed analysis of option B.</p>

    <h3>Option C</h3>
    <p>Detailed analysis of option C.</p>

    <!-- Interactive Comparison -->
    <div class="interactive-demo-section">
        <h2>📊 Interactive Comparison</h2>
        <div class="demo-container">
            <div class="interactive-element">
                <h3>Compare Performance</h3>
                <p>Use the controls below to compare different metrics:</p>
                
                <div class="demo-controls">
                    <label for="metric">Metric:</label>
                    <select id="metric">
                        <option value="performance">Performance</option>
                        <option value="memory">Memory Usage</option>
                        <option value="accuracy">Accuracy</option>
                    </select>
                    
                    <button onclick="updateComparison()">Update Chart</button>
                </div>
                
                <div id="comparison-plot" class="plotly-graph"></div>
            </div>
        </div>
    </div>

    <h2>Recommendations</h2>
    
    <div class="highlight-box">
        <p><strong>When to use Option A:</strong> Specific use cases and scenarios.</p>
        <p><strong>When to use Option B:</strong> Different scenarios and requirements.</p>
        <p><strong>When to use Option C:</strong> Alternative scenarios.</p>
    </div>

    <h2>Conclusion</h2>
    
    <p>Summary of the comparison and final recommendations.</p>
</div>'''
        
        return content
    
    def generate_case_study_template(self, slug, title):
        """Generate a case study blog post template"""
        content = f'''<div class="blog-post-content">
    <p>In this case study, we'll explore how {title.lower()} was applied to solve a real-world problem.</p>

    <h2>Problem Statement</h2>
    
    <p>Describe the problem that needed to be solved, including context and constraints.</p>

    <div class="info-box">
        <h4>📋 Project Overview</h4>
        <ul>
            <li><strong>Client:</strong> [Client Name]</li>
            <li><strong>Industry:</strong> [Industry]</li>
            <li><strong>Timeline:</strong> [Duration]</li>
            <li><strong>Team Size:</strong> [Number of people]</li>
        </ul>
    </div>

    <h2>Data Analysis</h2>
    
    <p>Describe the data that was available and the analysis performed.</p>

    <!-- Data Visualization -->
    <div class="interactive-demo-section">
        <h2>📈 Data Insights</h2>
        <div class="demo-container">
            <div class="interactive-element">
                <h3>Explore the Data</h3>
                <p>Interactive visualization of the dataset:</p>
                
                <div class="demo-controls">
                    <label for="chart-type">Chart Type:</label>
                    <select id="chart-type">
                        <option value="scatter">Scatter Plot</option>
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                    </select>
                    
                    <button onclick="updateChart()">Update Visualization</button>
                </div>
                
                <div id="data-plot" class="plotly-graph"></div>
            </div>
        </div>
    </div>

    <h2>Solution Approach</h2>
    
    <p>Describe the approach taken to solve the problem.</p>

    <h3>Methodology</h3>
    <p>Step-by-step breakdown of the methodology used.</p>

    <h3>Implementation</h3>
    <p>Key implementation details and code snippets.</p>

    <pre><code class="language-python">
# Key implementation code
def solve_problem(data):
    """
    Main solution function
    """
    # Process data
    processed_data = preprocess(data)
    
    # Apply algorithm
    result = apply_algorithm(processed_data)
    
    return result
    </code></pre>

    <h2>Results</h2>
    
    <div class="success-box">
        <h4>🎯 Key Results</h4>
        <ul>
            <li>Result 1: [Specific metric]</li>
            <li>Result 2: [Specific metric]</li>
            <li>Result 3: [Specific metric]</li>
        </ul>
    </div>

    <h2>Lessons Learned</h2>
    
    <div class="info-box">
        <h4>💡 Key Takeaways</h4>
        <ul>
            <li>Lesson 1</li>
            <li>Lesson 2</li>
            <li>Lesson 3</li>
        </ul>
    </div>

    <h2>Conclusion</h2>
    
    <p>Summary of the case study and its implications.</p>
</div>'''
        
        return content
    
    def generate_template(self, template_type, slug, title):
        """Generate a blog post template based on type"""
        if template_type == 'gradient-descent':
            return self.generate_gradient_descent_template(slug, title)
        elif template_type == 'tutorial':
            return self.generate_tutorial_template(slug, title)
        elif template_type == 'comparison':
            return self.generate_comparison_template(slug, title)
        elif template_type == 'case-study':
            return self.generate_case_study_template(slug, title)
        else:
            raise ValueError(f"Unknown template type: {template_type}")

def main():
    parser = argparse.ArgumentParser(description='Blog Template Generator')
    parser.add_argument('template_type', choices=['gradient-descent', 'tutorial', 'comparison', 'case-study'],
                       help='Type of blog post template to generate')
    parser.add_argument('--slug', help='Blog post slug (optional)')
    parser.add_argument('--title', help='Blog post title (optional)')
    
    args = parser.parse_args()
    
    generator = BlogTemplateGenerator()
    
    # Get title and slug if not provided
    if not args.title:
        args.title = input("📝 Blog Post Title: ").strip()
    
    if not args.slug:
        args.slug = generator.create_slug(args.title)
    
    # Generate template
    content = generator.generate_template(args.template_type, args.slug, args.title)
    
    # Save to file
    content_file = generator.content_dir / f"{args.slug}.html"
    with open(content_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {args.template_type.title()} template generated!")
    print(f"📁 Content file: content/blog/{args.slug}.html")
    print(f"📝 Edit the file to customize your blog post")

if __name__ == '__main__':
    main()
