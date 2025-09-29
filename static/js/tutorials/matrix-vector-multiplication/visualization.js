/**
 * Interactive 2D Matrix-Vector Multiplication Visualization
 * Inspired by 3Blue1Brown's linear algebra series
 */

class MatrixVectorVisualization {
    constructor() {
        this.canvas = document.getElementById('visualizationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isAnimating = false;
        this.animationId = null;
        
        // Matrix and vector values
        this.matrix = {
            a11: 2, a12: 1,
            a21: 0, a22: 1
        };
        this.vector = { x: 1, y: 1 };
        this.transformedVector = { x: 0, y: 0 };
        
        // Canvas dimensions and scaling
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.scale = 40; // pixels per unit
        this.gridSize = 1;
        
        // Animation properties
        this.animationProgress = 0;
        this.animationSpeed = 0.02;
        this.isFocused = false;
        
        // Vector endpoints for dragging
        this.vectorHandle = {
            x: this.centerX + this.vector.x * this.scale,
            y: this.centerY - this.vector.y * this.scale,
            radius: 8,
            isDragging: false
        };
        
        this.initializeEventListeners();
        this.calculateTransformation();
        this.draw();
    }
    
    initializeEventListeners() {
        // Matrix input listeners
        const matrixInputs = ['a11', 'a12', 'a21', 'a22'];
        matrixInputs.forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => this.updateMatrix());
            input.addEventListener('focus', () => this.startAnimation());
            input.addEventListener('blur', () => this.stopAnimation());
        });
        
        // Vector input listeners
        const vectorInputs = ['vx', 'vy'];
        vectorInputs.forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => this.updateVector());
            input.addEventListener('focus', () => this.startAnimation());
            input.addEventListener('blur', () => this.stopAnimation());
        });
        
        // Canvas interaction
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Canvas focus events
        this.canvas.addEventListener('focus', () => this.startAnimation());
        this.canvas.addEventListener('blur', () => this.stopAnimation());
        this.canvas.tabIndex = 0; // Make canvas focusable
        
        // Preset button listeners
        document.querySelectorAll('.btn-preset').forEach(btn => {
            btn.addEventListener('click', () => this.startAnimation());
        });
        
        // Practice button listeners
        document.querySelectorAll('.btn-practice').forEach(btn => {
            btn.addEventListener('click', () => this.startAnimation());
        });
    }
    
    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.isFocused = true;
            this.animate();
        }
    }
    
    stopAnimation() {
        // Delay stopping to allow for smooth transitions
        setTimeout(() => {
            this.isAnimating = false;
            this.isFocused = false;
            this.animationProgress = 0;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            this.draw(); // Final draw without animation
        }, 500);
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.animationProgress += this.animationSpeed;
        if (this.animationProgress > 1) {
            this.animationProgress = 1;
        }
        
        this.draw();
        
        if (this.animationProgress < 1) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    updateMatrix() {
        this.matrix.a11 = parseFloat(document.getElementById('a11').value) || 0;
        this.matrix.a12 = parseFloat(document.getElementById('a12').value) || 0;
        this.matrix.a21 = parseFloat(document.getElementById('a21').value) || 0;
        this.matrix.a22 = parseFloat(document.getElementById('a22').value) || 0;
        
        this.calculateTransformation();
        this.updateMathDisplay();
        this.updateCalculationSteps();
    }
    
    updateVector() {
        this.vector.x = parseFloat(document.getElementById('vx').value) || 0;
        this.vector.y = parseFloat(document.getElementById('vy').value) || 0;
        
        // Update vector handle position
        this.vectorHandle.x = this.centerX + this.vector.x * this.scale;
        this.vectorHandle.y = this.centerY - this.vector.y * this.scale;
        
        this.calculateTransformation();
        this.updateMathDisplay();
        this.updateCalculationSteps();
    }
    
    calculateTransformation() {
        // Matrix-vector multiplication: Av = [a11*vx + a12*vy, a21*vx + a22*vy]
        this.transformedVector.x = this.matrix.a11 * this.vector.x + this.matrix.a12 * this.vector.y;
        this.transformedVector.y = this.matrix.a21 * this.vector.x + this.matrix.a22 * this.vector.y;
        
        // Update display elements
        this.updateVectorDisplay();
        this.updateTransformationInfo();
    }
    
    updateVectorDisplay() {
        document.getElementById('originalVector').textContent = 
            `v = [${this.vector.x.toFixed(2)}, ${this.vector.y.toFixed(2)}]`;
        document.getElementById('transformedVector').textContent = 
            `Av = [${this.transformedVector.x.toFixed(2)}, ${this.transformedVector.y.toFixed(2)}]`;
    }
    
    updateTransformationInfo() {
        const determinant = this.matrix.a11 * this.matrix.a22 - this.matrix.a12 * this.matrix.a21;
        document.getElementById('determinant').textContent = determinant.toFixed(2);
        
        // Calculate angle of transformation
        const angle = Math.atan2(this.transformedVector.y, this.transformedVector.x) * 180 / Math.PI;
        document.getElementById('angle').textContent = `${angle.toFixed(0)}°`;
    }
    
    updateMathDisplay() {
        // Update mathematical notation
        document.getElementById('math-a11').textContent = this.matrix.a11.toFixed(1);
        document.getElementById('math-a12').textContent = this.matrix.a12.toFixed(1);
        document.getElementById('math-a21').textContent = this.matrix.a21.toFixed(1);
        document.getElementById('math-a22').textContent = this.matrix.a22.toFixed(1);
        
        document.getElementById('math-vx').textContent = this.vector.x.toFixed(1);
        document.getElementById('math-vy').textContent = this.vector.y.toFixed(1);
        
        document.getElementById('math-result1').textContent = 
            `${this.matrix.a11.toFixed(1)}×${this.vector.x.toFixed(1)} + ${this.matrix.a12.toFixed(1)}×${this.vector.y.toFixed(1)}`;
        document.getElementById('math-result2').textContent = 
            `${this.matrix.a21.toFixed(1)}×${this.vector.x.toFixed(1)} + ${this.matrix.a22.toFixed(1)}×${this.vector.y.toFixed(1)}`;
    }
    
    updateCalculationSteps() {
        document.getElementById('step-matrix').textContent = 
            `A = [[${this.matrix.a11.toFixed(1)}, ${this.matrix.a12.toFixed(1)}], [${this.matrix.a21.toFixed(1)}, ${this.matrix.a22.toFixed(1)}]]`;
        document.getElementById('step-vector').textContent = 
            `v = [${this.vector.x.toFixed(1)}, ${this.vector.y.toFixed(1)}]`;
        
        document.getElementById('step-calc1').textContent = 
            `${this.matrix.a11.toFixed(1)}×${this.vector.x.toFixed(1)} + ${this.matrix.a12.toFixed(1)}×${this.vector.y.toFixed(1)} = ${this.transformedVector.x.toFixed(1)}`;
        document.getElementById('step-calc2').textContent = 
            `${this.matrix.a21.toFixed(1)}×${this.vector.x.toFixed(1)} + ${this.matrix.a22.toFixed(1)}×${this.vector.y.toFixed(1)} = ${this.transformedVector.y.toFixed(1)}`;
        
        document.getElementById('step-result').textContent = 
            `Av = [${this.transformedVector.x.toFixed(1)}, ${this.transformedVector.y.toFixed(1)}]`;
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const distance = Math.sqrt(
            Math.pow(mouseX - this.vectorHandle.x, 2) + 
            Math.pow(mouseY - this.vectorHandle.y, 2)
        );
        
        if (distance <= this.vectorHandle.radius) {
            this.vectorHandle.isDragging = true;
            this.canvas.style.cursor = 'grabbing';
            this.startAnimation();
        }
    }
    
    handleMouseMove(e) {
        if (this.vectorHandle.isDragging) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Convert mouse coordinates to vector coordinates
            this.vector.x = (mouseX - this.centerX) / this.scale;
            this.vector.y = (this.centerY - mouseY) / this.scale;
            
            // Update vector inputs
            document.getElementById('vx').value = this.vector.x.toFixed(2);
            document.getElementById('vy').value = this.vector.y.toFixed(2);
            
            this.calculateTransformation();
            this.updateMathDisplay();
            this.updateCalculationSteps();
        } else {
            // Check if hovering over vector handle
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - this.vectorHandle.x, 2) + 
                Math.pow(mouseY - this.vectorHandle.y, 2)
            );
            
            this.canvas.style.cursor = distance <= this.vectorHandle.radius ? 'grab' : 'crosshair';
        }
    }
    
    handleMouseUp(e) {
        if (this.vectorHandle.isDragging) {
            this.vectorHandle.isDragging = false;
            this.canvas.style.cursor = 'crosshair';
        }
    }
    
    handleCanvasClick(e) {
        if (!this.vectorHandle.isDragging) {
            this.startAnimation();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw axes
        this.drawAxes();
        
        // Draw basis vectors (if not animating or focused)
        if (this.isAnimating || this.isFocused) {
            this.drawBasisVectors();
        }
        
        // Draw vectors with animation
        this.drawVectors();
        
        // Draw vector handle
        this.drawVectorHandle();
        
        // Draw labels
        this.drawLabels();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.scale * this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.scale * this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawAxes() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.centerY);
        this.ctx.lineTo(this.canvas.width, this.centerY);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX, this.canvas.height);
        this.ctx.stroke();
        
        // Axis labels
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('x', this.canvas.width - 20, this.centerY - 10);
        this.ctx.textAlign = 'left';
        this.ctx.fillText('y', this.centerX + 10, 20);
    }
    
    drawBasisVectors() {
        if (!this.isAnimating && !this.isFocused) return;
        
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
        // i-hat (unit vector in x direction)
        const iHatX = this.centerX + this.scale;
        const iHatY = this.centerY;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(iHatX, iHatY);
        this.ctx.stroke();
        
        // j-hat (unit vector in y direction)
        const jHatX = this.centerX;
        const jHatY = this.centerY - this.scale;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(jHatX, jHatY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    drawVectors() {
        const progress = this.isAnimating ? this.animationProgress : 1;
        
        // Original vector (blue)
        this.ctx.strokeStyle = '#0066cc';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        
        const originalEndX = this.centerX + this.vector.x * this.scale * progress;
        const originalEndY = this.centerY - this.vector.y * this.scale * progress;
        this.ctx.lineTo(originalEndX, originalEndY);
        this.ctx.stroke();
        
        // Arrow head for original vector
        this.drawArrowHead(this.centerX, this.centerY, originalEndX, originalEndY, '#0066cc');
        
        // Transformed vector (red) with animation
        if (progress > 0.3) {
            this.ctx.strokeStyle = '#cc0000';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            
            const transformedEndX = this.centerX + this.transformedVector.x * this.scale;
            const transformedEndY = this.centerY - this.transformedVector.y * this.scale;
            
            // Animate the transformed vector appearance
            const transformedProgress = Math.min(1, (progress - 0.3) / 0.7);
            const animatedEndX = this.centerX + (this.transformedVector.x * this.scale * transformedProgress);
            const animatedEndY = this.centerY - (this.transformedVector.y * this.scale * transformedProgress);
            
            this.ctx.lineTo(animatedEndX, animatedEndY);
            this.ctx.stroke();
            
            // Arrow head for transformed vector
            if (transformedProgress > 0.5) {
                this.drawArrowHead(this.centerX, this.centerY, animatedEndX, animatedEndY, '#cc0000');
            }
        }
        
        // Draw transformation path with animation
        if (progress > 0.5) {
            this.ctx.strokeStyle = '#ff6600';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([3, 3]);
            this.ctx.beginPath();
            
            const pathProgress = (progress - 0.5) / 0.5;
            const pathEndX = this.centerX + (this.transformedVector.x * this.scale * pathProgress);
            const pathEndY = this.centerY - (this.transformedVector.y * this.scale * pathProgress);
            
            this.ctx.moveTo(originalEndX, originalEndY);
            this.ctx.lineTo(pathEndX, pathEndY);
            this.ctx.stroke();
            
            this.ctx.setLineDash([]);
        }
    }
    
    drawArrowHead(startX, startY, endX, endY, color) {
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;
        
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
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
    
    drawVectorHandle() {
        // Update handle position
        this.vectorHandle.x = this.centerX + this.vector.x * this.scale;
        this.vectorHandle.y = this.centerY - this.vector.y * this.scale;
        
        // Draw handle
        this.ctx.fillStyle = this.vectorHandle.isDragging ? '#ff6600' : '#0066cc';
        this.ctx.beginPath();
        this.ctx.arc(this.vectorHandle.x, this.vectorHandle.y, this.vectorHandle.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw handle border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawLabels() {
        this.ctx.fillStyle = '#0066cc';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        
        // Label for original vector
        const originalEndX = this.centerX + this.vector.x * this.scale;
        const originalEndY = this.centerY - this.vector.y * this.scale;
        this.ctx.fillText('v', originalEndX + 15, originalEndY - 10);
        
        // Label for transformed vector
        this.ctx.fillStyle = '#cc0000';
        const transformedEndX = this.centerX + this.transformedVector.x * this.scale;
        const transformedEndY = this.centerY - this.transformedVector.y * this.scale;
        this.ctx.fillText('Av', transformedEndX + 15, transformedEndY - 10);
    }
}

// Global function for preset buttons
function setMatrix(a11, a12, a21, a22) {
    document.getElementById('a11').value = a11;
    document.getElementById('a12').value = a12;
    document.getElementById('a21').value = a21;
    document.getElementById('a22').value = a22;
    
    if (window.visualization) {
        window.visualization.updateMatrix();
        window.visualization.startAnimation();
    }
}

// Initialize visualization when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.visualization = new MatrixVectorVisualization();
});

