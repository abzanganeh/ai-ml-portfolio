/**
 * Vector World Demo - Linear Algebra Fundamentals
 * Brain warm-up for ML students
 */

class VectorWorldDemo {
    constructor() {
        this.canvas = document.getElementById('matrixDemoCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.isAnimating = false;
        this.animationId = null;
        this.animationProgress = 0;
        this.animationSpeed = 0.02;
        
        // Canvas setup
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.scale = 49; // pixels per unit (35 * 1.4 = 49)
        
        // Demo modes
        this.demoModes = {
            decomposition: {
                name: "Vector Decomposition",
                explanation: "See how v=[2,3] breaks down into horizontal [2,0] + vertical [0,3] components",
                steps: ["Show v=[2,3]", "Break into [2,0]", "Add [0,3]", "Show sum"]
            },
            addition: {
                name: "Vector Addition",
                explanation: "Watch v=[2,3] + u=[-1,2] = [1,5] using tail-to-head method",
                steps: ["Show v=[2,3]", "Show u=[-1,2]", "Move u to v's tip", "Draw result"]
            },
            scalar: {
                name: "Scalar Multiplication",
                explanation: "See how 1.5×v scales the vector (inspired by 3Blue1Brown)",
                steps: ["Show v=[2,3]", "Multiply by 1.5", "Show scaling", "Show result"]
            },
            basis: {
                name: "Basis Vectors",
                explanation: "Understand î=[1,0] and ĵ=[0,1] as fundamental building blocks (inspired by 1)",
                steps: ["Show î=[1,0]", "Show ĵ=[0,1]", "Build v=[2,3]", "Show combination"]
            },
            span: {
                name: "Vector Span",
                explanation: "Explore all combinations aV + bU - the span of two vectors (inspired by 3Blue1Brown)",
                steps: ["Show v and u", "Generate combinations", "Fill the plane", "Show span"]
            },
            transformation: {
                name: "Matrix Transformation",
                explanation: "Watch how matrix [[2,1],[1,2]] transforms the grid and vectors (inspired by 3Blue1Brown)",
                steps: ["Original grid", "Transform î to [2,1]", "Transform ĵ to [1,2]", "Show component vectors", "Show final result"]
            },
            eigen: {
                name: "Eigenvectors & Eigenvalues",
                explanation: "Discover special vectors that keep their direction when transformed - the foundation of many ML algorithms",
                steps: ["What are eigenvectors?", "Visual transformation", "Find eigenvector directions", "Calculate eigenvalues", "Mathematical proof", "Real-world applications"]
            }
        };
        
        this.currentMode = 'decomposition';
        this.currentStep = 0;
        this.isPaused = false;
        
        // Animation properties for eigenvector demo
        this.animationProgress = 0;
        this.animationSpeed = 0.03; // Faster animation
        
        // Vector data
        this.vectors = {
            v: { x: 2, y: 3, color: '#ff6600', label: 'v' },
            u: { x: -1, y: 2, color: '#0066cc', label: 'u' },
            i: { x: 1, y: 0, color: '#00cc66', label: 'î' },
            j: { x: 0, y: 1, color: '#cc0066', label: 'ĵ' },
            eigen1: { x: 1, y: 1, color: '#9b59b6', label: 'v₁' },
            eigen2: { x: 1, y: -1, color: '#e74c3c', label: 'v₂' }
        };
        
        this.scalarValues = [1.5, 0.3, -2];
        this.currentScalar = 0;
        
        // Matrix transformation properties
        // Using [[2,1],[1,2]] so that [1,1] and [1,-1] are actual eigenvectors
        // with eigenvalues 3 and 1 respectively
        this.transformationMatrix = {
            a11: 2, a12: 1,
            a21: 1, a22: 2
        };
        this.animationProgress = 0;
        this.isTransforming = false;
        
        this.initializeEventListeners();
        this.reset();
        this.draw();
        
        // Start animation loop for smooth eigenvector animations
        this.animate();
    }
    
    animate() {
        // Animation loop for smooth transitions
        if (this.currentMode === 'eigen' && this.currentStep > 0 && this.currentStep < 6) {
            this.draw();
            requestAnimationFrame(() => this.animate());
        }
    }
    
    initializeEventListeners() {
        // Demo controls
        const stepBtn = document.getElementById('stepBtn');
        if (stepBtn) {
            stepBtn.addEventListener('click', () => {
                this.nextStep();
            });
        }
        
        const resetBtn = document.getElementById('resetDemoBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.reset();
            });
        }
        
        // Make canvas focusable
        this.canvas.tabIndex = 0;
    }
    
    reset() {
        this.isAnimating = false;
        this.animationProgress = 0;
        this.currentStep = 0;
        this.isPaused = false;
        this.currentScalar = 0;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.updateDisplay();
        this.draw();
        
        // Reset buttons
        const stepBtn = document.getElementById('stepBtn');
        const resetBtn = document.getElementById('resetDemoBtn');
        
        if (stepBtn) {
            stepBtn.textContent = 'Next Step';
            stepBtn.disabled = false;
        }
        if (resetBtn) {
            resetBtn.disabled = false;
        }
    }
    
    nextStep() {
        const totalSteps = this.demoModes[this.currentMode].steps.length;
        
        if (this.currentStep < totalSteps - 1) {
            this.currentStep++;
            this.animationProgress = 0; // Reset animation for new step
            this.updateStepIndicator();
            this.draw();
        } else {
            // Last step - show completion
            this.updateStepIndicator('Complete!');
            this.draw();
            
            // Disable step button
            const stepBtn = document.getElementById('stepBtn');
            if (stepBtn) {
                stepBtn.disabled = true;
                stepBtn.textContent = 'Done';
            }
        }
    }
    
    draw() {
        // Update animation progress for eigenvector demo
        if (this.currentMode === 'eigen' && [1, 2, 4].includes(this.currentStep)) {
            this.animationProgress += this.animationSpeed;
            if (this.animationProgress > 1) {
                this.animationProgress = 0;
            }
        } else if (this.currentMode === 'eigen' && this.currentStep > 0) {
            this.animationProgress += this.animationSpeed;
            if (this.animationProgress > 1) {
                this.animationProgress = 1;
            }
        }
        
        // Clear canvas and fill with dark background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw based on current mode and step
        switch (this.currentMode) {
            case 'decomposition':
                this.drawDecompositionDemo();
                break;
            case 'addition':
                this.drawAdditionDemo();
                break;
            case 'scalar':
                this.drawScalarDemo();
                break;
            case 'basis':
                this.drawBasisDemo();
                break;
            case 'span':
                this.drawSpanDemo();
                break;
            case 'transformation':
                this.drawTransformationDemo();
                break;
            case 'eigen':
                this.drawEigenDemo();
                break;
        }
    }
    
    drawGrid() {
        // Draw coordinate grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        
        const gridSize = 6; // 12x12 grid (6 units in each direction)
        
        // Vertical lines (every unit)
        for (let x = this.centerX - gridSize * this.scale; x <= this.centerX + gridSize * this.scale; x += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.centerY - gridSize * this.scale);
            this.ctx.lineTo(x, this.centerY + gridSize * this.scale);
            this.ctx.stroke();
        }
        
        // Horizontal lines (every unit)
        for (let y = this.centerY - gridSize * this.scale; y <= this.centerY + gridSize * this.scale; y += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - gridSize * this.scale, y);
            this.ctx.lineTo(this.centerX + gridSize * this.scale, y);
            this.ctx.stroke();
        }
        
        // Center axes
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 2;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - gridSize * this.scale, this.centerY);
        this.ctx.lineTo(this.centerX + gridSize * this.scale, this.centerY);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - gridSize * this.scale);
        this.ctx.lineTo(this.centerX, this.centerY + gridSize * this.scale);
        this.ctx.stroke();
        
        // Origin point
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 3, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawVector(startX, startY, endX, endY, color, label, showComponents = false) {
        // Draw vector line
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        // Draw arrow head
        this.drawArrowHead(startX, startY, endX, endY, color);
        
        // Draw label with vector arrow
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        
        // Calculate label position to avoid overlaps
        const labelOffsetX = 35;
        const labelOffsetY = -20;
        
        // Add vector arrow symbol positioned above the vector letter
        if (label.includes('v=') || label.includes('u=') || label.includes('×v') || label.includes('×u') || label.includes('×î') || label.includes('×ĵ') || label.includes('v₁') || label.includes('v₂')) {
            // Draw the base label first
            let baseLabel;
            let vectorLetter;
            
            if (label.includes('×v') || label.includes('×u')) {
                // Handle scalar multiplication like "1.5×v=[3,4.5]"
                baseLabel = label;
                vectorLetter = label.includes('×v') ? 'v' : 'u';
            } else if (label.includes('×î') || label.includes('×ĵ')) {
                // Handle scalar multiplication of basis vectors like "2×î"
                baseLabel = label;
                vectorLetter = label.includes('×î') ? 'î' : 'ĵ';
            } else if (label.includes('v₁') || label.includes('v₂')) {
                // Handle eigenvector labels like "v₁=[1,1]"
                baseLabel = label;
                vectorLetter = label.includes('v₁') ? 'v₁' : 'v₂';
            } else {
                // Handle regular vectors like "v=[2,3]"
                baseLabel = label.replace('v=', 'v =').replace('u=', 'u =');
                vectorLetter = label.includes('v=') ? 'v' : 'u';
            }
            
            this.ctx.fillText(baseLabel, endX + labelOffsetX, endY + labelOffsetY);
            
            // Calculate precise position of the vector letter
            const textMetrics = this.ctx.measureText(baseLabel);
            let letterX;
            
            if (label.includes('×v') || label.includes('×u') || label.includes('×î') || label.includes('×ĵ')) {
                // For scalar multiplication, find position of vector letter after '×'
                const beforeVector = baseLabel.substring(0, baseLabel.indexOf('×' + vectorLetter));
                const beforeVectorWidth = this.ctx.measureText(beforeVector).width;
                const vectorLetterWidth = this.ctx.measureText(vectorLetter).width;
                letterX = endX + labelOffsetX - (textMetrics.width / 2) + beforeVectorWidth + (vectorLetterWidth / 2);
            } else if (label.includes('v₁') || label.includes('v₂')) {
                // For eigenvectors, find position of 'v₁' or 'v₂'
                const beforeVector = baseLabel.substring(0, baseLabel.indexOf(vectorLetter));
                const beforeVectorWidth = this.ctx.measureText(beforeVector).width;
                const vectorLetterWidth = this.ctx.measureText(vectorLetter).width;
                letterX = endX + labelOffsetX - (textMetrics.width / 2) + beforeVectorWidth + (vectorLetterWidth / 2);
            } else {
                // For regular vectors, find position of 'v' or 'u'
                const letterWidth = this.ctx.measureText(baseLabel.charAt(0)).width;
                letterX = endX + labelOffsetX - (textMetrics.width / 2) + (letterWidth / 2);
            }
            
            // Draw arrow above the vector letter with more spacing
            this.drawVectorArrow(letterX, endY + labelOffsetY - 15, color);
        } else if (label.includes('î') || label.includes('ĵ')) {
            this.ctx.fillText(label.replace('î', 'î').replace('ĵ', 'ĵ'), endX + labelOffsetX, endY + labelOffsetY);
        } else {
            this.ctx.fillText(label, endX + labelOffsetX, endY + labelOffsetY);
        }
        
        // Draw components if requested
        if (showComponents) {
            const dx = endX - startX;
            const dy = endY - startY;
            
            // Horizontal component
            this.ctx.strokeStyle = '#ffaa00';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(startX + dx, startY);
            this.ctx.stroke();
            
            // Vertical component
            this.ctx.strokeStyle = '#00aaff';
            this.ctx.beginPath();
            this.ctx.moveTo(startX + dx, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            
            this.ctx.setLineDash([]);
        }
    }
    
    drawDecompositionDemo() {
        const v = this.vectors.v;
        const endX = this.centerX + v.x * this.scale;
        const endY = this.centerY - v.y * this.scale;
        
        switch (this.currentStep) {
            case 0:
                // Show v=[2,3]
                this.drawVector(this.centerX, this.centerY, endX, endY, v.color, 'v=[2,3]');
                break;
            case 1:
                // Show horizontal component [2,0]
                this.drawVector(this.centerX, this.centerY, this.centerX + v.x * this.scale, this.centerY, '#ffaa00', '[2,0]');
                break;
            case 2:
                // Show vertical component [0,3]
                this.drawVector(this.centerX + v.x * this.scale, this.centerY, endX, endY, '#00aaff', '[0,3]');
                break;
            case 3:
                // Show complete decomposition
                this.drawVector(this.centerX, this.centerY, endX, endY, v.color, 'v=[2,3]', true);
                break;
        }
    }
    
    drawAdditionDemo() {
        const v = this.vectors.v;
        const u = this.vectors.u;
        
        const vEndX = this.centerX + v.x * this.scale;
        const vEndY = this.centerY - v.y * this.scale;
        
        const uEndX = this.centerX + u.x * this.scale;
        const uEndY = this.centerY - u.y * this.scale;
        
        const resultX = this.centerX + (v.x + u.x) * this.scale;
        const resultY = this.centerY - (v.y + u.y) * this.scale;
        
        switch (this.currentStep) {
            case 0:
                // Show v=[2,3] with components
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, v.color, 'v=[2,3]', true);
                break;
            case 1:
                // Show u=[-1,2] with components
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, '#666', 'v=[2,3]', true);
                this.drawVector(this.centerX, this.centerY, uEndX, uEndY, u.color, 'u=[-1,2]', true);
                break;
            case 2:
                // Move u to v's tip (tail-to-head method)
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, '#666', 'v=[2,3]', true);
                this.drawVector(this.centerX, this.centerY, uEndX, uEndY, '#666', 'u=[-1,2]', true);
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, v.color, 'v=[2,3]');
                this.drawVector(vEndX, vEndY, resultX, resultY, u.color, 'u=[-1,2]');
                break;
            case 3:
                // Show final result
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, '#666', 'v=[2,3]', true);
                this.drawVector(this.centerX, this.centerY, uEndX, uEndY, '#666', 'u=[-1,2]', true);
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, v.color, 'v=[2,3]');
                this.drawVector(vEndX, vEndY, resultX, resultY, u.color, 'u=[-1,2]');
                this.drawVector(this.centerX, this.centerY, resultX, resultY, '#00ff00', 'v+u=[1,5]');
                
                // Show numerical calculation
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '18px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('[2,3] + [-1,2] = [1,5]', 30, 40);
                break;
        }
    }
    
    drawScalarDemo() {
        const v = this.vectors.v;
        const scalar = 1.5; // Only show 1.5 multiplication
        
        const originalEndX = this.centerX + v.x * this.scale;
        const originalEndY = this.centerY - v.y * this.scale;
        
        const scaledEndX = this.centerX + v.x * scalar * this.scale;
        const scaledEndY = this.centerY - v.y * scalar * this.scale;
        
        switch (this.currentStep) {
            case 0:
                // Show original v=[2,3]
                this.drawVector(this.centerX, this.centerY, originalEndX, originalEndY, v.color, 'v=[2,3]');
                break;
            case 1:
                // Show both original and scaled
                this.drawVector(this.centerX, this.centerY, originalEndX, originalEndY, '#666', 'v=[2,3]');
                this.drawVector(this.centerX, this.centerY, scaledEndX, scaledEndY, v.color, '1.5×v=[3,4.5]');
                
                // Show calculation
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '18px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('1.5 × [2, 3] = [3, 4.5]', 30, 40);
                this.ctx.fillText('Component-wise: [2×1.5, 3×1.5]', 30, 65);
                break;
            case 2:
                // Show scaling animation effect
                this.drawVector(this.centerX, this.centerY, originalEndX, originalEndY, '#666', 'v=[2,3]');
                this.drawVector(this.centerX, this.centerY, scaledEndX, scaledEndY, v.color, '1.5×v=[3,4.5]');
                
                // Show visual scaling effect
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '18px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('1.5 × [2, 3] = [3, 4.5]', 30, 40);
                this.ctx.fillText('Vector grows by factor of 1.5', 30, 65);
                break;
        }
    }
    
    drawBasisDemo() {
        const i = this.vectors.i;
        const j = this.vectors.j;
        const v = this.vectors.v;
        
        const iEndX = this.centerX + i.x * this.scale;
        const iEndY = this.centerY - i.y * this.scale;
        
        const jEndX = this.centerX + j.x * this.scale;
        const jEndY = this.centerY - j.y * this.scale;
        
        const vEndX = this.centerX + v.x * this.scale;
        const vEndY = this.centerY - v.y * this.scale;
        
        switch (this.currentStep) {
            case 0:
                // Show i=[1,0]
                this.drawVector(this.centerX, this.centerY, iEndX, iEndY, i.color, 'î=[1,0]');
                break;
            case 1:
                // Show j=[0,1]
                this.drawVector(this.centerX, this.centerY, iEndX, iEndY, i.color, 'î=[1,0]');
                this.drawVector(this.centerX, this.centerY, jEndX, jEndY, j.color, 'ĵ=[0,1]');
                break;
            case 2:
                // Build v=[2,3] using basis vectors
                this.drawVector(this.centerX, this.centerY, iEndX, iEndY, i.color, 'î=[1,0]');
                this.drawVector(this.centerX, this.centerY, jEndX, jEndY, j.color, 'ĵ=[0,1]');
                
                // Show 2×i
                this.drawVector(this.centerX, this.centerY, this.centerX + 2 * this.scale, this.centerY, i.color, '2×î');
                
                // Show 3×j
                this.drawVector(this.centerX, this.centerY, this.centerX, this.centerY - 3 * this.scale, j.color, '3×ĵ');
                break;
            case 3:
                // Show final combination
                this.drawVector(this.centerX, this.centerY, iEndX, iEndY, '#666', 'î=[1,0]');
                this.drawVector(this.centerX, this.centerY, jEndX, jEndY, '#666', 'ĵ=[0,1]');
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, v.color, 'v=2î+3ĵ=[2,3]');
                break;
        }
    }
    
    drawSpanDemo() {
        const v = this.vectors.v;
        const u = this.vectors.u;
        
        const vEndX = this.centerX + v.x * this.scale;
        const vEndY = this.centerY - v.y * this.scale;
        
        const uEndX = this.centerX + u.x * this.scale;
        const uEndY = this.centerY - u.y * this.scale;
        
        switch (this.currentStep) {
            case 0:
                // Show v and u
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, v.color, 'v=[2,3]');
                this.drawVector(this.centerX, this.centerY, uEndX, uEndY, u.color, 'u=[-1,2]');
                break;
            case 1:
            case 2:
                // Generate some combinations
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, v.color, 'v=[2,3]');
                this.drawVector(this.centerX, this.centerY, uEndX, uEndY, u.color, 'u=[-1,2]');
                
                // Show some combinations
                for (let a = -1; a <= 1; a++) {
                    for (let b = -1; b <= 1; b++) {
                        if (a === 0 && b === 0) continue;
                        
                        const comboX = this.centerX + (a * v.x + b * u.x) * this.scale;
                        const comboY = this.centerY - (a * v.y + b * u.y) * this.scale;
                        
                        this.ctx.strokeStyle = '#666';
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.centerX, this.centerY);
                        this.ctx.lineTo(comboX, comboY);
                        this.ctx.stroke();
                    }
                }
                break;
            case 3:
                // Fill the plane (span)
                this.drawVector(this.centerX, this.centerY, vEndX, vEndY, v.color, 'v=[2,3]');
                this.drawVector(this.centerX, this.centerY, uEndX, uEndY, u.color, 'u=[-1,2]');
                
                // Draw span area
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
                this.ctx.beginPath();
                this.ctx.moveTo(this.centerX, this.centerY);
                this.ctx.lineTo(vEndX, vEndY);
                this.ctx.lineTo(vEndX + u.x * this.scale, vEndY - u.y * this.scale);
                this.ctx.lineTo(uEndX, uEndY);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.fillStyle = '#ffff00';
                this.ctx.font = 'bold 18px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Span = all aV + bU', this.centerX, 70);
                break;
        }
    }
    
    drawTransformationDemo() {
        const v = this.vectors.v;
        
        switch (this.currentStep) {
            case 0:
                // Show original grid and vectors
                this.drawOriginalGrid();
                this.drawVector(this.centerX, this.centerY, this.centerX + v.x * this.scale, this.centerY - v.y * this.scale, v.color, 'v=[2,3]');
                this.drawOriginalAxes();
                
                // Show explanation
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('Original coordinate system with v=[2,3]', 30, 40);
                break;
            case 1:
                // Transform i-hat and show grid transformation
                this.drawTransformingGrid(1);
                this.drawOriginalAxes();
                this.drawTransformedIHat();
                
                // Show explanation
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('Matrix transforms î=[1,0] to [2,1]', 30, 40);
                this.ctx.fillText('First column of matrix [[2,1],[1,2]]', 30, 65);
                this.ctx.fillText('Grid starts transforming based on î', 30, 90);
                break;
            case 2:
                // Transform j-hat and show full grid transformation
                this.drawTransformingGrid(2);
                this.drawOriginalAxes();
                this.drawTransformedIHat();
                this.drawTransformedJHat();
                
                // Show explanation
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('Matrix transforms ĵ=[0,1] to [1,2]', 30, 40);
                this.ctx.fillText('Second column of matrix [[2,1],[1,2]]', 30, 65);
                this.ctx.fillText('Grid fully transforms to new coordinate system!', 30, 90);
                break;
            case 3:
                // Show component vectors
                this.drawOriginalGrid();
                this.drawOriginalAxes();
                this.drawTransformedAxes();
                this.drawComponentVectors(v);
                
                // Show explanation
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('v=[2,3] = 2×î + 3×ĵ in original basis', 30, 40);
                this.ctx.fillText('Transformed v = 2×[2,1] + 3×[1,2]', 30, 65);
                this.ctx.fillText('= 2×Transformed î + 3×Transformed ĵ', 30, 90);
                break;
            case 4:
                // Show final result with transformed grid
                this.drawTransformedGrid();
                this.drawTransformedAxes();
                this.drawComponentVectors(v);
                this.drawTransformedVector(v);
                
                // Show calculation
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.fillText('Final calculation:', 30, 40);
                this.ctx.fillText('Transformed v = [2×2+3×1, 2×1+3×2]', 30, 65);
                this.ctx.fillText('= [4+3, 2+6] = [7, 8]', 30, 90);
                break;
        }
    }
    
    drawOriginalGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 0.5;
        
        const gridSize = 6;
        
        // Vertical lines
        for (let x = this.centerX - gridSize * this.scale; x <= this.centerX + gridSize * this.scale; x += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.centerY - gridSize * this.scale);
            this.ctx.lineTo(x, this.centerY + gridSize * this.scale);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = this.centerY - gridSize * this.scale; y <= this.centerY + gridSize * this.scale; y += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - gridSize * this.scale, y);
            this.ctx.lineTo(this.centerX + gridSize * this.scale, y);
            this.ctx.stroke();
        }
        
        // Center axes
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - gridSize * this.scale, this.centerY);
        this.ctx.lineTo(this.centerX + gridSize * this.scale, this.centerY);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - gridSize * this.scale);
        this.ctx.lineTo(this.centerX, this.centerY + gridSize * this.scale);
        this.ctx.stroke();
    }
    
    drawTransformingGrid(step) {
        this.ctx.strokeStyle = 'rgba(102, 170, 255, 0.6)';
        this.ctx.lineWidth = 0.5;
        
        const gridSize = 6;
        
        if (step === 1) {
            // Partial transformation - only i-hat affects grid
            for (let i = -gridSize; i <= gridSize; i++) {
                // Vertical lines partially transformed
                this.ctx.beginPath();
                const startX = this.centerX + i * this.scale;
                const startY = this.centerY - gridSize * this.scale;
                const endX = this.centerX + i * this.scale;
                const endY = this.centerY + gridSize * this.scale;
                
                // Partial transformation based on i-hat only
                const transformedStart = this.partialTransformPoint(startX, startY, 1);
                const transformedEnd = this.partialTransformPoint(endX, endY, 1);
                
                this.ctx.moveTo(transformedStart.x, transformedStart.y);
                this.ctx.lineTo(transformedEnd.x, transformedEnd.y);
                this.ctx.stroke();
            }
            
            // Horizontal lines still original
            for (let i = -gridSize; i <= gridSize; i++) {
                this.ctx.beginPath();
                const startX = this.centerX - gridSize * this.scale;
                const startY = this.centerY + i * this.scale;
                const endX = this.centerX + gridSize * this.scale;
                const endY = this.centerY + i * this.scale;
                
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            }
        } else if (step === 2) {
            // Full transformation - both i-hat and j-hat affect grid
            for (let i = -gridSize; i <= gridSize; i++) {
                // Vertical lines of transformed grid
                this.ctx.beginPath();
                const startX = this.centerX + i * this.scale;
                const startY = this.centerY - gridSize * this.scale;
                const endX = this.centerX + i * this.scale;
                const endY = this.centerY + gridSize * this.scale;
                
                const transformedStart = this.transformPoint(startX, startY);
                const transformedEnd = this.transformPoint(endX, endY);
                
                this.ctx.moveTo(transformedStart.x, transformedStart.y);
                this.ctx.lineTo(transformedEnd.x, transformedEnd.y);
                this.ctx.stroke();
            }
            
            // Horizontal lines of transformed grid
            for (let i = -gridSize; i <= gridSize; i++) {
                this.ctx.beginPath();
                const startX = this.centerX - gridSize * this.scale;
                const startY = this.centerY + i * this.scale;
                const endX = this.centerX + gridSize * this.scale;
                const endY = this.centerY + i * this.scale;
                
                const transformedStart = this.transformPoint(startX, startY);
                const transformedEnd = this.transformPoint(endX, endY);
                
                this.ctx.moveTo(transformedStart.x, transformedStart.y);
                this.ctx.lineTo(transformedEnd.x, transformedEnd.y);
                this.ctx.stroke();
            }
        }
    }
    
    drawTransformedGrid() {
        this.drawTransformingGrid(2); // Use full transformation
    }
    
    partialTransformPoint(x, y, step) {
        const mathX = (x - this.centerX) / this.scale;
        const mathY = (this.centerY - y) / this.scale;
        
        let transformedX, transformedY;
        
        if (step === 1) {
            // Only i-hat transformation affects the grid
            transformedX = this.transformationMatrix.a11 * mathX; // Only x-component from i-hat
            transformedY = this.transformationMatrix.a21 * mathX; // Only y-component from i-hat
        } else {
            // Full transformation
            transformedX = this.transformationMatrix.a11 * mathX + this.transformationMatrix.a12 * mathY;
            transformedY = this.transformationMatrix.a21 * mathX + this.transformationMatrix.a22 * mathY;
        }
        
        const canvasX = this.centerX + transformedX * this.scale;
        const canvasY = this.centerY - transformedY * this.scale;
        
        return { x: canvasX, y: canvasY };
    }
    
    transformPoint(x, y) {
        const mathX = (x - this.centerX) / this.scale;
        const mathY = (this.centerY - y) / this.scale;
        
        const transformedX = this.transformationMatrix.a11 * mathX + this.transformationMatrix.a12 * mathY;
        const transformedY = this.transformationMatrix.a21 * mathX + this.transformationMatrix.a22 * mathY;
        
        const canvasX = this.centerX + transformedX * this.scale;
        const canvasY = this.centerY - transformedY * this.scale;
        
        return { x: canvasX, y: canvasY };
    }
    
    drawOriginalAxes() {
        // Original i-hat
        this.ctx.strokeStyle = '#00cc66';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(this.centerX + this.scale, this.centerY);
        this.ctx.stroke();
        this.drawArrowHead(this.centerX, this.centerY, this.centerX + this.scale, this.centerY, '#00cc66');
        this.ctx.fillStyle = '#00cc66';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('î', this.centerX + this.scale + 8, this.centerY - 12);
        
        // Original j-hat
        this.ctx.strokeStyle = '#cc0066';
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(this.centerX, this.centerY - this.scale);
        this.ctx.stroke();
        this.drawArrowHead(this.centerX, this.centerY, this.centerX, this.centerY - this.scale, '#cc0066');
        this.ctx.fillStyle = '#cc0066';
        this.ctx.fillText('ĵ', this.centerX + 12, this.centerY - this.scale - 8);
    }
    
    drawTransformedIHat() {
        const transformedIHatX = this.centerX + this.transformationMatrix.a11 * this.scale;
        const transformedIHatY = this.centerY - this.transformationMatrix.a21 * this.scale;
        
        this.ctx.strokeStyle = '#00cc66';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(transformedIHatX, transformedIHatY);
        this.ctx.stroke();
        this.drawArrowHead(this.centerX, this.centerY, transformedIHatX, transformedIHatY, '#00cc66');
        this.ctx.fillStyle = '#00cc66';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('Transformed î', transformedIHatX + 20, transformedIHatY - 12);
    }
    
    drawTransformedJHat() {
        const transformedJHatX = this.centerX + this.transformationMatrix.a12 * this.scale;
        const transformedJHatY = this.centerY - this.transformationMatrix.a22 * this.scale;
        
        this.ctx.strokeStyle = '#cc0066';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(transformedJHatX, transformedJHatY);
        this.ctx.stroke();
        this.drawArrowHead(this.centerX, this.centerY, transformedJHatX, transformedJHatY, '#cc0066');
        this.ctx.fillStyle = '#cc0066';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('Transformed ĵ', transformedJHatX + 20, transformedJHatY - 12);
    }
    
    drawTransformedAxes() {
        this.drawTransformedIHat();
        this.drawTransformedJHat();
    }
    
    drawComponentVectors(v) {
        // Draw 2×Transformed î
        const scaledIHatX = this.centerX + 2 * this.transformationMatrix.a11 * this.scale;
        const scaledIHatY = this.centerY - 2 * this.transformationMatrix.a21 * this.scale;
        
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([8, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(scaledIHatX, scaledIHatY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.drawArrowHead(this.centerX, this.centerY, scaledIHatX, scaledIHatY, '#ff6b6b');
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('2×Transformed î', scaledIHatX + 20, scaledIHatY - 12);
        
        // Draw 3×Transformed ĵ
        const scaledJHatX = this.centerX + 3 * this.transformationMatrix.a12 * this.scale;
        const scaledJHatY = this.centerY - 3 * this.transformationMatrix.a22 * this.scale;
        
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([8, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(scaledJHatX, scaledJHatY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.drawArrowHead(this.centerX, this.centerY, scaledJHatX, scaledJHatY, '#4ecdc4');
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('3×Transformed ĵ', scaledJHatX + 20, scaledJHatY - 12);
        
        // Draw parallelogram construction
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);
        this.ctx.beginPath();
        this.ctx.moveTo(scaledIHatX, scaledIHatY);
        this.ctx.lineTo(scaledIHatX + scaledJHatX - this.centerX, scaledIHatY + scaledJHatY - this.centerY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(scaledJHatX, scaledJHatY);
        this.ctx.lineTo(scaledIHatX + scaledJHatX - this.centerX, scaledIHatY + scaledJHatY - this.centerY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawTransformedVector(v) {
        const transformedX = this.transformationMatrix.a11 * v.x + this.transformationMatrix.a12 * v.y;
        const transformedY = this.transformationMatrix.a21 * v.x + this.transformationMatrix.a22 * v.y;
        
        const endX = this.centerX + transformedX * this.scale;
        const endY = this.centerY - transformedY * this.scale;
        
        this.ctx.strokeStyle = v.color;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.drawArrowHead(this.centerX, this.centerY, endX, endY, v.color);
        this.ctx.fillStyle = v.color;
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('Transformed v = [7,8]', endX + 30, endY - 15);
    }
    
    drawEigenDemo() {
        const lambda1 = 3;
        const lambda2 = 1;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#111827';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawEigenHeader();

        switch (this.currentStep) {
            case 0:
                this.drawEigenvectorConcept();
                break;
            case 1:
                this.drawTransformationComparison();
                break;
            case 2:
                this.drawEigenvectorDiscovery(lambda1, lambda2);
                break;
            case 3:
                this.drawEigenvalueCalculation(lambda1, lambda2);
                break;
            case 4:
                this.drawMathematicalProof(lambda1, lambda2);
                break;
            case 5:
                this.drawRealWorldApplications();
                break;
        }
    }

    drawEigenHeader() {
        const title = this.demoModes.eigen.steps[this.currentStep] || 'Eigenvectors and Eigenvalues';
        this.drawPanel(32, 24, this.canvas.width - 64, 72, 'rgba(17, 24, 39, 0.92)', '#334155');
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Step ${this.currentStep + 1}: ${title}`, 56, 58);
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Matrix A = [[2, 1], [1, 2]]   |   Eigenvectors: [1, 1] and [1, -1]', 56, 82);
    }

    drawEigenvectorConcept() {
        this.drawPanel(48, 128, 350, 310, 'rgba(15, 23, 42, 0.9)', '#2563eb');
        this.drawTextBlock(72, 166, [
            { text: 'What makes a vector special?', color: '#38bdf8', font: 'bold 20px Arial' },
            { text: 'Most vectors rotate or tilt when A transforms them.', color: '#e5e7eb' },
            { text: 'Eigenvectors keep the same line of direction.', color: '#e5e7eb' },
            { text: 'Only their length changes by a scaling factor.', color: '#e5e7eb' },
            { text: 'That scaling factor is the eigenvalue.', color: '#e5e7eb' },
        ], 27);

        this.drawPanel(48, 468, 350, 190, 'rgba(15, 23, 42, 0.86)', '#7c3aed');
        this.drawTextBlock(72, 504, [
            { text: 'Why ML cares', color: '#c084fc', font: 'bold 18px Arial' },
            { text: 'PCA uses eigenvectors as principal directions.', color: '#f8fafc' },
            { text: 'PageRank uses eigenvectors to score importance.', color: '#f8fafc' },
            { text: 'Many models look for stable directions in data.', color: '#f8fafc' },
        ], 27);

        this.drawDirectionComparisonScene();
    }

    drawTransformationComparison() {
        const progress = this.easeInOut(this.animationProgress);
        this.drawPanel(48, 124, 285, 150, 'rgba(15, 23, 42, 0.9)', '#0ea5e9');
        this.drawTextBlock(72, 160, [
            { text: 'Before to after', color: '#38bdf8', font: 'bold 20px Arial' },
            { text: 'The moving arrow shows Av as A is applied.', color: '#e5e7eb' },
            { text: 'Red vector changes direction.', color: '#f87171' },
            { text: 'Green vector keeps its direction.', color: '#4ade80' },
        ], 27);

        this.drawEigenLines(0.32);
        const vectors = [
            { x: 2, y: 1, color: '#ef4444', label: 'regular [2,1]' },
            { x: 1, y: 1, color: '#22c55e', label: 'eigen [1,1]' },
            { x: -1, y: 2, color: '#f59e0b', label: 'regular [-1,2]' },
        ];

        vectors.forEach((vector, index) => {
            const transformed = this.applyEigenMatrix(vector);
            const current = {
                x: vector.x + (transformed.x - vector.x) * progress,
                y: vector.y + (transformed.y - vector.y) * progress,
            };

            this.drawEigenVector(vector, vector.color, '', 0.35, 2);
            this.drawTransformationTrail(vector, transformed, vector.color);
            this.drawEigenVector(current, vector.color, vector.label, 1, 4);

            if (index === 1) {
                const point = this.toCanvasPoint(current);
                this.drawBadge(point.x + 18, point.y - 46, 'same direction', '#22c55e');
            }
        });

        this.drawProgressMeter(690, 132, progress, 'Transformation progress');
    }

    drawEigenvectorDiscovery(lambda1, lambda2) {
        const progress = this.easeInOut(this.animationProgress);
        this.drawPanel(48, 122, 330, 170, 'rgba(15, 23, 42, 0.9)', '#22c55e');
        this.drawTextBlock(72, 158, [
            { text: 'Finding the directions', color: '#4ade80', font: 'bold 20px Arial' },
            { text: 'The dashed lines are the natural axes of A.', color: '#e5e7eb' },
            { text: `[1, 1] scales by ${lambda1}.`, color: '#bbf7d0' },
            { text: `[1, -1] scales by ${lambda2}.`, color: '#fecaca' },
        ], 27);

        this.drawEigenLines(0.72);

        [
            { x: 1, y: 1, color: '#22c55e', label: 'v1, lambda=3' },
            { x: 1, y: -1, color: '#ef4444', label: 'v2, lambda=1' },
        ].forEach((vector) => {
            const transformed = this.applyEigenMatrix(vector);
            const current = {
                x: vector.x + (transformed.x - vector.x) * progress,
                y: vector.y + (transformed.y - vector.y) * progress,
            };
            this.drawEigenVector(vector, vector.color, '', 0.28, 2);
            this.drawEigenVector(current, vector.color, vector.label, 1, 5);
        });

        [
            { x: 2, y: 1, color: '#60a5fa', label: 'tilts' },
            { x: -1, y: 2, color: '#f59e0b', label: 'tilts' },
        ].forEach((vector) => {
            const transformed = this.applyEigenMatrix(vector);
            const current = {
                x: vector.x + (transformed.x - vector.x) * progress,
                y: vector.y + (transformed.y - vector.y) * progress,
            };
            this.drawTransformationTrail(vector, transformed, vector.color);
            this.drawEigenVector(current, vector.color, vector.label, 0.9, 3);
        });
    }

    drawEigenvalueCalculation(lambda1, lambda2) {
        this.drawPanel(48, 118, 420, 430, 'rgba(15, 23, 42, 0.92)', '#f59e0b');
        this.drawTextBlock(72, 154, [
            { text: 'Calculating eigenvalues', color: '#fbbf24', font: 'bold 20px Arial' },
            { text: 'Characteristic equation: det(A - lambda I) = 0', color: '#67e8f9' },
            { text: 'A - lambda I = [[2-lambda, 1], [1, 2-lambda]]', color: '#f8fafc' },
            { text: 'det(A - lambda I) = (2-lambda)^2 - 1', color: '#f8fafc' },
            { text: '= lambda^2 - 4lambda + 3', color: '#f8fafc' },
            { text: 'lambda^2 - 4lambda + 3 = 0', color: '#fbbf24', font: 'bold 17px Arial' },
            { text: '(lambda - 3)(lambda - 1) = 0', color: '#f8fafc' },
            { text: `lambda1 = ${lambda1}, lambda2 = ${lambda2}`, color: '#4ade80', font: 'bold 18px Arial' },
        ], 31);

        this.drawEigenLines(0.45);
        this.drawEigenVector({ x: 3, y: 3 }, '#22c55e', '3 x [1,1]', 1, 4);
        this.drawEigenVector({ x: 1, y: -1 }, '#ef4444', '1 x [1,-1]', 1, 4);
        this.drawBadge(610, 690, 'eigenvalues are scale factors', '#f59e0b');
    }

    drawMathematicalProof(lambda1, lambda2) {
        const progress = this.easeInOut(this.animationProgress);
        this.drawPanel(48, 118, 430, 485, 'rgba(15, 23, 42, 0.92)', '#22c55e');
        this.drawTextBlock(72, 154, [
            { text: 'Proof: Av = lambda v', color: '#86efac', font: 'bold 20px Arial' },
            { text: `For v1 = [1, 1], lambda1 = ${lambda1}`, color: '#bbf7d0', font: 'bold 16px Arial' },
            { text: 'A[1,1] = [2*1 + 1*1, 1*1 + 2*1]', color: '#f8fafc' },
            { text: '= [3, 3] = 3[1, 1]', color: '#f8fafc' },
            { text: `For v2 = [1, -1], lambda2 = ${lambda2}`, color: '#fecaca', font: 'bold 16px Arial' },
            { text: 'A[1,-1] = [2*1 + 1*(-1), 1*1 + 2*(-1)]', color: '#f8fafc' },
            { text: '= [1, -1] = 1[1, -1]', color: '#f8fafc' },
            { text: 'Both vectors stay on their original lines.', color: '#67e8f9', font: 'bold 16px Arial' },
        ], 31);

        this.drawEigenLines(0.45);
        [
            { x: 1, y: 1, color: '#22c55e', label: 'v1 -> 3v1' },
            { x: 1, y: -1, color: '#ef4444', label: 'v2 -> 1v2' },
        ].forEach((vector) => {
            const transformed = this.applyEigenMatrix(vector);
            const current = {
                x: vector.x + (transformed.x - vector.x) * progress,
                y: vector.y + (transformed.y - vector.y) * progress,
            };
            this.drawEigenVector(vector, vector.color, '', 0.25, 2);
            this.drawEigenVector(current, vector.color, vector.label, 1, 5);
        });
    }

    drawRealWorldApplications() {
        this.drawPanel(60, 126, 860, 540, 'rgba(15, 23, 42, 0.92)', '#38bdf8');
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Where eigenvectors show up', this.centerX, 168);

        const cards = [
            ['PCA', 'Finds the strongest directions of variation in data.', '#22c55e'],
            ['PageRank', 'Scores web pages by stable importance flow.', '#60a5fa'],
            ['Vibration analysis', 'Finds natural modes of mechanical systems.', '#f87171'],
            ['Quantum mechanics', 'Represents stable states of operators.', '#c084fc'],
            ['Machine learning', 'Supports compression, denoising, and embeddings.', '#f59e0b'],
        ];

        cards.forEach((card, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = 105 + col * 405;
            const y = 215 + row * 120;
            this.drawPanel(x, y, 350, 86, 'rgba(30, 41, 59, 0.88)', card[2]);
            this.ctx.fillStyle = card[2];
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(card[0], x + 22, y + 32);
            this.ctx.fillStyle = '#e5e7eb';
            this.ctx.font = '14px Arial';
            this.ctx.fillText(card[1], x + 22, y + 58);
        });

        this.drawBadge(330, 605, 'Core idea: find directions that stay stable under transformation', '#38bdf8');
    }

    drawDirectionComparisonScene() {
        const regular = { x: 2, y: 1 };
        const regularAfter = this.applyEigenMatrix(regular);
        const eigen = { x: 1, y: 1 };
        const eigenAfter = this.applyEigenMatrix(eigen);

        this.drawPanel(445, 132, 440, 360, 'rgba(15, 23, 42, 0.72)', '#334155');
        this.drawEigenVector(regular, '#ef4444', 'regular v', 0.35, 3);
        this.drawTransformationTrail(regular, regularAfter, '#ef4444');
        this.drawEigenVector({ x: 3.2, y: 2.4 }, '#ef4444', 'direction changes', 1, 4);
        this.drawEigenVector(eigen, '#22c55e', 'eigen v', 0.35, 3);
        this.drawEigenVector(eigenAfter, '#22c55e', 'same line, scaled', 1, 4);
        this.drawBadge(605, 440, 'Av = lambda v', '#f59e0b');
    }

    drawEigenLines(alpha = 0.55) {
        const lines = [
            { vector: { x: 1, y: 1 }, color: `rgba(34, 197, 94, ${alpha})` },
            { vector: { x: 1, y: -1 }, color: `rgba(239, 68, 68, ${alpha})` },
        ];

        lines.forEach((line) => {
            const start = this.toCanvasPoint({ x: -7 * line.vector.x, y: -7 * line.vector.y });
            const end = this.toCanvasPoint({ x: 7 * line.vector.x, y: 7 * line.vector.y });
            this.ctx.strokeStyle = line.color;
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 8]);
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }

    drawEigenVector(vector, color, label = '', alpha = 1, width = 4) {
        const end = this.toCanvasPoint(vector);
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.drawArrowHead(this.centerX, this.centerY, end.x, end.y, color);
        this.ctx.restore();

        if (label) {
            this.ctx.fillStyle = color;
            this.ctx.font = 'bold 15px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, end.x + 42, end.y - 14);
        }
    }

    drawTransformationTrail(fromVector, toVector, color) {
        const from = this.toCanvasPoint(fromVector);
        const to = this.toCanvasPoint(toVector);
        this.ctx.strokeStyle = `${color}66`;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([6, 6]);
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawPanel(x, y, width, height, fill, stroke) {
        this.ctx.save();
        this.ctx.fillStyle = fill;
        this.ctx.strokeStyle = stroke;
        this.ctx.lineWidth = 1.5;
        this.roundRect(x, y, width, height, 14);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawTextBlock(x, y, lines, lineHeight = 26) {
        lines.forEach((line, index) => {
            this.ctx.fillStyle = line.color || '#f8fafc';
            this.ctx.font = line.font || '15px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(line.text, x, y + index * lineHeight);
        });
    }

    drawProgressMeter(x, y, progress, label) {
        this.drawPanel(x, y, 210, 70, 'rgba(15, 23, 42, 0.9)', '#38bdf8');
        this.ctx.fillStyle = '#e5e7eb';
        this.ctx.font = '13px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(label, x + 16, y + 24);
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(x + 16, y + 40, 178, 10);
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(x + 16, y + 40, 178 * progress, 10);
    }

    drawBadge(x, y, text, color) {
        this.ctx.font = 'bold 14px Arial';
        const width = this.ctx.measureText(text).width + 28;
        this.drawPanel(x, y, width, 34, 'rgba(15, 23, 42, 0.92)', color);
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(text, x + 14, y + 22);
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    applyEigenMatrix(vector) {
        return {
            x: this.transformationMatrix.a11 * vector.x + this.transformationMatrix.a12 * vector.y,
            y: this.transformationMatrix.a21 * vector.x + this.transformationMatrix.a22 * vector.y,
        };
    }

    toCanvasPoint(vector) {
        return {
            x: this.centerX + vector.x * this.scale,
            y: this.centerY - vector.y * this.scale,
        };
    }

    easeInOut(t) {
        return t * t * (3 - 2 * t);
    }

    drawArrowHead(startX, startY, endX, endY, color) {
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;
        
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - arrowLength * Math.cos(angle - arrowAngle),
            endY - arrowLength * Math.sin(angle - arrowAngle)
        );
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - arrowLength * Math.cos(angle + arrowAngle),
            endY - arrowLength * Math.sin(angle + arrowAngle)
        );
        this.ctx.stroke();
    }
    
    drawArrow(endX, endY, startX, startY, color) {
        // Draw arrowhead at the end point
        // Note: Parameters are in reverse order (endX, endY, startX, startY, color)
        // because the line is already drawn, we just need to add the arrowhead
        this.drawArrowHead(startX, startY, endX, endY, color);
    }
    
    drawVectorArrow(x, y, color) {
        // Draw a small horizontal arrow above the vector label
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        // Arrow shaft (horizontal line)
        this.ctx.moveTo(x - 8, y);
        this.ctx.lineTo(x + 8, y);
        
        // Arrow head (pointing right)
        this.ctx.moveTo(x + 8, y);
        this.ctx.lineTo(x + 4, y - 3);
        this.ctx.moveTo(x + 8, y);
        this.ctx.lineTo(x + 4, y + 3);
        
        this.ctx.stroke();
    }
    
    updateDisplay() {
        const mode = this.demoModes[this.currentMode];
        this.updateStepIndicator('Ready to Explore!');
        this.updateExplanation(mode.explanation);
        this.updateVectorDisplay();
    }
    
    updateStepIndicator(stepText) {
        const stepIndicator = document.getElementById('currentStep');
        if (stepIndicator) {
            if (stepText) {
                stepIndicator.textContent = stepText;
            } else {
                // Auto-generate step text based on current mode and step
                const mode = this.demoModes[this.currentMode];
                if (mode && mode.steps && mode.steps[this.currentStep]) {
                    stepIndicator.textContent = `Step ${this.currentStep + 1}: ${mode.steps[this.currentStep]}`;
                }
            }
        }
    }
    
    updateExplanation(explanation) {
        const explanationText = document.getElementById('transformationText');
        if (explanationText) {
            explanationText.textContent = explanation;
        }
    }
    
    updateVectorDisplay() {
        const vectorDisplay = document.getElementById('vectorDisplay');
        if (vectorDisplay) {
            vectorDisplay.textContent = `v = [2, 3]`;
        }
    }
    
    changeMode(modeName) {
        this.currentMode = modeName;
        this.currentStep = 0; // Reset to first step
        this.currentScalar = 0;
        this.updateDisplay();
        this.draw();
    }
}

// Global function for mode selection
function changeDemoMode() {
    const select = document.getElementById('demoMode');
    if (!select) return;
    
    const modeName = select.value;
    
    if (window.vectorDemo) {
        // Reset everything first
        window.vectorDemo.reset();
        
        // Then change mode
        window.vectorDemo.changeMode(modeName);
    }
}

// Make function globally available
window.changeDemoMode = changeDemoMode;

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.vectorDemo = new VectorWorldDemo();
});