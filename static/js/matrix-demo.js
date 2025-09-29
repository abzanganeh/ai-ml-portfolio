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
                explanation: "Watch how matrix [[3,1],[1,2]] transforms the grid and vectors (inspired by 3Blue1Brown)",
                steps: ["Original grid", "Transform î to [3,1]", "Transform ĵ to [1,2]", "Show component vectors", "Show final result"]
            },
            eigen: {
                name: "Eigenvectors & Eigenvalues",
                explanation: "Watch vectors get squished onto eigenvector lines during transformation",
                steps: ["Introduction", "Transformation squishing", "Eigenvector lines", "Squishing motion", "Eigenvalue scaling", "Mathematical foundation", "Applications"]
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
        this.transformationMatrix = {
            a11: 3, a12: 1,
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
        if (this.currentMode === 'eigen' && this.currentStep > 0) {
            this.animationProgress += this.animationSpeed;
            if (this.animationProgress > 1) {
                this.animationProgress = 1;
            }
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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
                this.ctx.fillText('Matrix transforms î=[1,0] to [3,1]', 30, 40);
                this.ctx.fillText('First column of matrix [[3,1],[1,2]]', 30, 65);
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
                this.ctx.fillText('Second column of matrix [[3,1],[1,2]]', 30, 65);
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
                this.ctx.fillText('Transformed v = 2×[3,1] + 3×[1,2]', 30, 65);
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
                this.ctx.fillText('Transformed v = [2×3+3×1, 2×1+3×2]', 30, 65);
                this.ctx.fillText('= [6+3, 2+6] = [9, 8]', 30, 90);
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
        this.ctx.fillText('Transformed v = [9,8]', endX + 30, endY - 15);
    }
    
    drawEigenDemo() {
        const lambda1 = 4;
        const lambda2 = 1;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        
        switch (this.currentStep) {
            case 0:
                // Introduction - What are eigenvectors?
                this.drawIntroduction();
                break;
                
            case 1:
                // Show the transformation in action - vectors getting squished
                this.drawTransformationSquishing();
                break;
                
            case 2:
                // Show eigenvector lines and how vectors align to them
                this.drawEigenvectorLines(lambda1, lambda2);
                break;
                
            case 3:
                // Show the squishing motion in detail
                this.drawSquishingMotion(lambda1, lambda2);
                break;
                
            case 4:
                // Show both eigenvectors with their scaling
                this.drawEigenvectorScaling(lambda1, lambda2);
                break;
                
            case 5:
                // Show the mathematical relationship
                this.drawMathematicalRelationship(lambda1, lambda2);
                break;
                
            case 6:
                // Show applications
                this.drawApplications(lambda1, lambda2);
                break;
        }
    }
    
    drawIntroduction() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Eigenvectors & Eigenvalues', this.centerX, 50);
        
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Key insight: Some vectors get squished onto lines during transformation', 50, 100);
        this.ctx.fillText('These special lines are called EIGENVECTOR directions', 50, 125);
        this.ctx.fillText('The squishing factor is called EIGENVALUE', 50, 150);
        
        this.ctx.fillText('Matrix equation: Av = λv', 50, 200);
        this.ctx.fillText('where A transforms vector v onto the same line, scaled by λ', 50, 225);
        
        // Draw matrix representation
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Matrix A = [[3,1],[1,2]]', this.centerX, 300);
        
        // Show what we'll discover
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('We will find:', 50, 350);
        this.ctx.fillText('• Eigenvector v₁ = [1,1] with eigenvalue λ₁ = 4', 70, 375);
        this.ctx.fillText('• Eigenvector v₂ = [1,-1] with eigenvalue λ₂ = 1', 70, 400);
    }
    
    drawTransformationSquishing() {
        // Show multiple vectors being transformed to demonstrate squishing
        const testVectors = [
            { x: 2, y: 3, color: '#ff6b35', label: 'a', name: 'Vector A' },
            { x: -1, y: 2, color: '#4ecdc4', label: 'b', name: 'Vector B' },
            { x: 1, y: 1, color: '#9b59b6', label: 'v₁', name: 'Eigenvector v₁' },
            { x: 1, y: -1, color: '#e74c3c', label: 'v₂', name: 'Eigenvector v₂' },
            { x: 3, y: 2, color: '#f39c12', label: 'c', name: 'Vector C' }
        ];
        
        const progress = Math.min(1, this.animationProgress);
        
        testVectors.forEach((vec, index) => {
            // Original vector
            const originalEndX = this.centerX + vec.x * this.scale;
            const originalEndY = this.centerY - vec.y * this.scale;
            
            // Transformed vector
            const transformedX = 3 * vec.x + 1 * vec.y;
            const transformedY = 1 * vec.x + 2 * vec.y;
            const transformedEndX = this.centerX + transformedX * this.scale;
            const transformedEndY = this.centerY - transformedY * this.scale;
            
            // Animate between original and transformed
            const currentEndX = this.centerX + (vec.x + progress * (transformedX - vec.x)) * this.scale;
            const currentEndY = this.centerY - (vec.y + progress * (transformedY - vec.y)) * this.scale;
            
            // Draw original vector (faded)
            this.ctx.strokeStyle = vec.color + '40';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(originalEndX, originalEndY);
            this.ctx.stroke();
            
            // Draw transforming vector
            this.ctx.strokeStyle = vec.color;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(currentEndX, currentEndY);
            this.ctx.stroke();
            
            // Draw arrow head
            this.drawArrowHead(this.centerX, this.centerY, currentEndX, currentEndY, vec.color);
            
            // Label
            this.ctx.fillStyle = vec.color;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(vec.label, currentEndX + 20, currentEndY - 10);
        });
        
        // Draw legend
        this.drawLegend(testVectors);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Watch vectors transform...', 50, 100);
        this.ctx.fillText('Notice how they seem to be pulled toward certain directions!', 50, 125);
        this.ctx.fillText('These directions are the eigenvector lines', 50, 150);
    }
    
    drawLegend(vectors) {
        // Draw legend in top-right corner
        const legendX = this.canvas.width - 200;
        const legendY = 50;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(legendX - 10, legendY - 10, 180, vectors.length * 25 + 20);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Vector Legend:', legendX, legendY);
        
        vectors.forEach((vec, index) => {
            const y = legendY + 20 + index * 25;
            
            // Draw color square
            this.ctx.fillStyle = vec.color;
            this.ctx.fillRect(legendX, y - 8, 12, 12);
            
            // Draw label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(vec.name, legendX + 18, y);
        });
    }
    
    drawEigenvectorLines(lambda1, lambda2) {
        // Draw the eigenvector lines
        const eigen1 = { x: 1, y: 1, color: '#9b59b6', name: 'Eigenvector v₁' };
        const eigen2 = { x: 1, y: -1, color: '#e74c3c', name: 'Eigenvector v₂' };
        
        // Draw eigenvector lines extending beyond the grid
        const lineLength = 8 * this.scale;
        
        // First eigenvector line (v₁ = [1,1])
        this.ctx.strokeStyle = eigen1.color + '80';
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([15, 8]);
        this.ctx.beginPath();
        const eigen1StartX = this.centerX - lineLength * Math.cos(Math.atan2(eigen1.y, eigen1.x));
        const eigen1StartY = this.centerY + lineLength * Math.sin(Math.atan2(eigen1.y, eigen1.x));
        const eigen1EndX = this.centerX + lineLength * Math.cos(Math.atan2(eigen1.y, eigen1.x));
        const eigen1EndY = this.centerY - lineLength * Math.sin(Math.atan2(eigen1.y, eigen1.x));
        this.ctx.moveTo(eigen1StartX, eigen1StartY);
        this.ctx.lineTo(eigen1EndX, eigen1EndY);
        this.ctx.stroke();
        
        // Second eigenvector line (v₂ = [1,-1])
        this.ctx.strokeStyle = eigen2.color + '80';
        this.ctx.beginPath();
        const eigen2StartX = this.centerX - lineLength * Math.cos(Math.atan2(eigen2.y, eigen2.x));
        const eigen2StartY = this.centerY + lineLength * Math.sin(Math.atan2(eigen2.y, eigen2.x));
        const eigen2EndX = this.centerX + lineLength * Math.cos(Math.atan2(eigen2.y, eigen2.x));
        const eigen2EndY = this.centerY - lineLength * Math.sin(Math.atan2(eigen2.y, eigen2.x));
        this.ctx.moveTo(eigen2StartX, eigen2StartY);
        this.ctx.lineTo(eigen2EndX, eigen2EndY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        
        // Show some vectors being transformed toward these lines with more dramatic motion
        const testVectors = [
            { x: 2, y: 3, color: '#ff6b35', label: 'a', name: 'Vector A' },
            { x: -1, y: 2, color: '#4ecdc4', label: 'b', name: 'Vector B' },
            { x: 3, y: 2, color: '#f39c12', label: 'c', name: 'Vector C' }
        ];
        
        // Use a more dramatic animation curve
        const progress = Math.min(1, this.animationProgress);
        const easedProgress = progress * progress * (3 - 2 * progress); // Smooth step function
        
        testVectors.forEach((vec) => {
            // Original vector
            const originalEndX = this.centerX + vec.x * this.scale;
            const originalEndY = this.centerY - vec.y * this.scale;
            
            // Transformed vector
            const transformedX = 3 * vec.x + 1 * vec.y;
            const transformedY = 1 * vec.x + 2 * vec.y;
            const transformedEndX = this.centerX + transformedX * this.scale;
            const transformedEndY = this.centerY - transformedY * this.scale;
            
            // Animate between original and transformed with eased motion
            const currentEndX = this.centerX + (vec.x + easedProgress * (transformedX - vec.x)) * this.scale;
            const currentEndY = this.centerY - (vec.y + easedProgress * (transformedY - vec.y)) * this.scale;
            
            // Draw trajectory line (squishing path)
            this.ctx.strokeStyle = vec.color + '40';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(originalEndX, originalEndY);
            this.ctx.lineTo(transformedEndX, transformedEndY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Draw original vector (faded)
            this.ctx.strokeStyle = vec.color + '40';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(originalEndX, originalEndY);
            this.ctx.stroke();
            
            // Draw transforming vector with pulsing effect
            const pulse = 1 + 0.3 * Math.sin(this.animationProgress * Math.PI * 4);
            this.ctx.strokeStyle = vec.color;
            this.ctx.lineWidth = 3 + pulse;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(currentEndX, currentEndY);
            this.ctx.stroke();
            
            this.drawArrowHead(this.centerX, this.centerY, currentEndX, currentEndY, vec.color);
            
            // Label with better positioning
            this.ctx.fillStyle = vec.color;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(vec.label, currentEndX + 25, currentEndY - 10);
        });
        
        // Draw legend
        this.drawLegend([...testVectors, eigen1, eigen2]);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('These dashed lines are the eigenvector directions!', 50, 100);
        this.ctx.fillText('Watch how vectors get "squished" onto these lines', 50, 125);
        this.ctx.fillText('Purple line: v₁ = [1,1] direction', 50, 150);
        this.ctx.fillText('Red line: v₂ = [1,-1] direction', 50, 175);
    }
    
    drawSquishingMotion(lambda1, lambda2) {
        // Show vectors being squished onto eigenvector lines with dramatic motion
        const eigen1 = { x: 1, y: 1, color: '#9b59b6', name: 'Eigenvector v₁' };
        const eigen2 = { x: 1, y: -1, color: '#e74c3c', name: 'Eigenvector v₂' };
        
        // Draw eigenvector lines
        const lineLength = 7 * this.scale;
        
        // First eigenvector line with animation
        const lineProgress = Math.min(1, this.animationProgress * 2); // Draw lines first
        this.ctx.strokeStyle = eigen1.color + '60';
        this.ctx.lineWidth = 3 + 2 * lineProgress;
        this.ctx.setLineDash([10, 6]);
        this.ctx.beginPath();
        const eigen1StartX = this.centerX - lineLength * Math.cos(Math.atan2(eigen1.y, eigen1.x));
        const eigen1StartY = this.centerY + lineLength * Math.sin(Math.atan2(eigen1.y, eigen1.x));
        const eigen1EndX = this.centerX + lineLength * Math.cos(Math.atan2(eigen1.y, eigen1.x));
        const eigen1EndY = this.centerY - lineLength * Math.sin(Math.atan2(eigen1.y, eigen1.x));
        this.ctx.moveTo(eigen1StartX, eigen1StartY);
        this.ctx.lineTo(eigen1EndX, eigen1EndY);
        this.ctx.stroke();
        
        // Second eigenvector line with animation
        this.ctx.strokeStyle = eigen2.color + '60';
        this.ctx.beginPath();
        const eigen2StartX = this.centerX - lineLength * Math.cos(Math.atan2(eigen2.y, eigen2.x));
        const eigen2StartY = this.centerY + lineLength * Math.sin(Math.atan2(eigen2.y, eigen2.x));
        const eigen2EndX = this.centerX + lineLength * Math.cos(Math.atan2(eigen2.y, eigen2.x));
        const eigen2EndY = this.centerY - lineLength * Math.sin(Math.atan2(eigen2.y, eigen2.x));
        this.ctx.moveTo(eigen2StartX, eigen2StartY);
        this.ctx.lineTo(eigen2EndX, eigen2EndY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        
        // Show vectors being squished with dramatic motion
        const testVectors = [
            { x: 2, y: 3, color: '#ff6b35', label: 'A', name: 'Vector A' },
            { x: -1, y: 2, color: '#4ecdc4', label: 'B', name: 'Vector B' },
            { x: 3, y: 1, color: '#f39c12', label: 'C', name: 'Vector C' },
            { x: 0, y: 3, color: '#2ecc71', label: 'D', name: 'Vector D' }
        ];
        
        const progress = Math.min(1, Math.max(0, this.animationProgress - 0.3)); // Start after lines appear
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic for dramatic effect
        
        testVectors.forEach((vec, index) => {
            // Original vector
            const originalEndX = this.centerX + vec.x * this.scale;
            const originalEndY = this.centerY - vec.y * this.scale;
            
            // Transformed vector
            const transformedX = 3 * vec.x + 1 * vec.y;
            const transformedY = 1 * vec.x + 2 * vec.y;
            const transformedEndX = this.centerX + transformedX * this.scale;
            const transformedEndY = this.centerY - transformedY * this.scale;
            
            // Animate between original and transformed with dramatic easing
            const currentEndX = this.centerX + (vec.x + easedProgress * (transformedX - vec.x)) * this.scale;
            const currentEndY = this.centerY - (vec.y + easedProgress * (transformedY - vec.y)) * this.scale;
            
            // Draw trajectory line showing the squishing path with animation
            const trajectoryProgress = Math.min(1, this.animationProgress * 1.5);
            this.ctx.strokeStyle = vec.color + '40';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([8, 4]);
            this.ctx.beginPath();
            this.ctx.moveTo(originalEndX, originalEndY);
            this.ctx.lineTo(transformedEndX, transformedEndY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Draw original vector (faded)
            this.ctx.strokeStyle = vec.color + '50';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(originalEndX, originalEndY);
            this.ctx.stroke();
            
            // Draw transforming vector with dramatic pulsing
            const pulse = 1 + 0.5 * Math.sin(this.animationProgress * Math.PI * 6);
            this.ctx.strokeStyle = vec.color;
            this.ctx.lineWidth = 4 + pulse;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(currentEndX, currentEndY);
            this.ctx.stroke();
            
            this.drawArrowHead(this.centerX, this.centerY, currentEndX, currentEndY, vec.color);
            
            // Label with better positioning
            this.ctx.fillStyle = vec.color;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(vec.label, currentEndX + 30, currentEndY - 15);
        });
        
        // Draw legend
        this.drawLegend([...testVectors, eigen1, eigen2]);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('The squishing motion!', 50, 100);
        this.ctx.fillText('Vectors get pulled toward eigenvector lines', 50, 125);
        this.ctx.fillText('Notice the trajectory lines showing the squishing path', 50, 150);
        this.ctx.fillText('This is the key insight of eigenvectors!', 50, 175);
    }
    
    drawEigenvectorScaling(lambda1, lambda2) {
        // Show both eigenvectors with their eigenvalue scaling
        const eigen1 = { x: 1, y: 1, color: '#9b59b6' };
        const eigen2 = { x: 1, y: -1, color: '#e74c3c' };
        
        const progress = Math.min(1, this.animationProgress);
        
        // First eigenvector with scaling animation
        const eigen1OriginalEndX = this.centerX + eigen1.x * this.scale;
        const eigen1OriginalEndY = this.centerY - eigen1.y * this.scale;
        const eigen1ScaledEndX = this.centerX + eigen1.x * lambda1 * this.scale;
        const eigen1ScaledEndY = this.centerY - eigen1.y * lambda1 * this.scale;
        
        // Animate scaling
        const eigen1CurrentEndX = this.centerX + eigen1.x * (1 + progress * (lambda1 - 1)) * this.scale;
        const eigen1CurrentEndY = this.centerY - eigen1.y * (1 + progress * (lambda1 - 1)) * this.scale;
        
        // Draw first eigenvector
        this.ctx.strokeStyle = eigen1.color + '60';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(eigen1OriginalEndX, eigen1OriginalEndY);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = eigen1.color;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(eigen1CurrentEndX, eigen1CurrentEndY);
        this.ctx.stroke();
        
        this.drawArrowHead(this.centerX, this.centerY, eigen1CurrentEndX, eigen1CurrentEndY, eigen1.color);
        
        // Second eigenvector with scaling animation
        const eigen2OriginalEndX = this.centerX + eigen2.x * this.scale;
        const eigen2OriginalEndY = this.centerY - eigen2.y * this.scale;
        const eigen2ScaledEndX = this.centerX + eigen2.x * lambda2 * this.scale;
        const eigen2ScaledEndY = this.centerY - eigen2.y * lambda2 * this.scale;
        
        // Animate scaling
        const eigen2CurrentEndX = this.centerX + eigen2.x * (1 + progress * (lambda2 - 1)) * this.scale;
        const eigen2CurrentEndY = this.centerY - eigen2.y * (1 + progress * (lambda2 - 1)) * this.scale;
        
        // Draw second eigenvector
        this.ctx.strokeStyle = eigen2.color + '60';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(eigen2OriginalEndX, eigen2OriginalEndY);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = eigen2.color;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(eigen2CurrentEndX, eigen2CurrentEndY);
        this.ctx.stroke();
        
        this.drawArrowHead(this.centerX, this.centerY, eigen2CurrentEndX, eigen2CurrentEndY, eigen2.color);
        
        // Labels
        this.ctx.fillStyle = eigen1.color;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('v₁=[1,1]', eigen1CurrentEndX + 30, eigen1CurrentEndY - 15);
        this.ctx.fillText('λ₁=4', eigen1CurrentEndX + 30, eigen1CurrentEndY + 5);
        
        this.ctx.fillStyle = eigen2.color;
        this.ctx.fillText('v₂=[1,-1]', eigen2CurrentEndX + 30, eigen2CurrentEndY - 15);
        this.ctx.fillText('λ₂=1', eigen2CurrentEndX + 30, eigen2CurrentEndY + 5);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Eigenvectors scale by their eigenvalues!', 50, 100);
        this.ctx.fillText('v₁=[1,1] stretches by factor 4', 50, 125);
        this.ctx.fillText('v₂=[1,-1] stays the same (factor 1)', 50, 150);
        this.ctx.fillText('Direction never changes - only magnitude!', 50, 175);
    }
    
    drawMathematicalRelationship(lambda1, lambda2) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('The Eigenvalue Equation: Av = λv', this.centerX, 80);
        
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Mathematical Verification:', 50, 120);
        this.ctx.fillText('For v₁=[1,1]:', 70, 145);
        this.ctx.fillText('  Av₁ = [[3,1],[1,2]] × [1,1] = [4,4] = 4×[1,1]', 90, 170);
        this.ctx.fillText('  Therefore λ₁ = 4', 90, 195);
        
        this.ctx.fillText('For v₂=[1,-1]:', 70, 230);
        this.ctx.fillText('  Av₂ = [[3,1],[1,2]] × [1,-1] = [1,-1] = 1×[1,-1]', 90, 255);
        this.ctx.fillText('  Therefore λ₂ = 1', 90, 280);
        
        this.ctx.fillText('Key insight:', 50, 315);
        this.ctx.fillText('• Vectors on eigenvector lines stay on those lines', 70, 340);
        this.ctx.fillText('• They only get scaled by the eigenvalue factor', 70, 365);
        this.ctx.fillText('• This is why eigenvectors are so important!', 70, 390);
    }
    
    drawApplications(lambda1, lambda2) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Why Eigenvectors Matter', this.centerX, 80);
        
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('The squishing insight leads to powerful applications:', 50, 120);
        
        this.ctx.fillText(' Data Analysis:', 50, 155);
        this.ctx.fillText('   PCA finds the main directions of variation in data', 70, 180);
        this.ctx.fillText('   Eigenvectors show which features matter most', 70, 205);
        
        this.ctx.fillText(' Computer Graphics:', 50, 240);
        this.ctx.fillText('   Image compression by keeping only important directions', 70, 265);
        this.ctx.fillText('   Rotation matrices have obvious eigenvectors', 70, 290);
        
        this.ctx.fillText(' Machine Learning:', 50, 325);
        this.ctx.fillText('   Dimensionality reduction without losing information', 70, 350);
        this.ctx.fillText('   Understanding how neural networks transform data', 70, 375);
        
        this.ctx.fillText(' Physics & Engineering:', 50, 410);
        this.ctx.fillText('   Natural vibration modes of structures', 70, 435);
        this.ctx.fillText('   Quantum mechanics and energy states', 70, 460);
        
        this.ctx.fillText('The eigenvectors we discovered:', 50, 495);
        this.ctx.fillText('• v₁=[1,1] with λ₁=4 (stretches by 4×)', 70, 520);
        this.ctx.fillText('• v₂=[1,-1] with λ₂=1 (unchanged)', 70, 545);
        this.ctx.fillText('These are the "natural" directions of our matrix!', 70, 570);
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
    const modeName = select.value;
    
    if (window.vectorDemo) {
        // Reset everything first
        window.vectorDemo.reset();
        
        // Then change mode
        window.vectorDemo.changeMode(modeName);
    }
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.vectorDemo = new VectorWorldDemo();
});