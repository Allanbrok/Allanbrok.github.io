// source/js/math-graph.js
document.addEventListener('DOMContentLoaded', function() {
    // 创建画图工具容器
    const container = document.getElementById('math-graph-container');

    // 添加HTML结构
    container.innerHTML = `
        <h1>数学函数绘图工具</h1>
        <div class="math-graph-wrapper">
            <div class="graph-area">
                <canvas id="graphCanvas" class="math-graph-canvas"></canvas>
            </div>
            
            <div class="graph-controls">
                <label for="functionInput">函数表达式 (使用x作为变量):</label>
                <input type="text" id="functionInput" value="Math.sin(x)" placeholder="例如: Math.sin(x), x*x, Math.log(x)">
                
                <label for="colorSelect">线条颜色:</label>
                <select id="colorSelect">
                    <option value="#3498db">蓝色</option>
                    <option value="#e74c3c">红色</option>
                    <option value="#2ecc71">绿色</option>
                    <option value="#f39c12">橙色</option>
                    <option value="#9b59b6">紫色</option>
                </select>
                
                <label for="xMin">X最小值:</label>
                <input type="number" id="xMin" value="-10">
                
                <label for="xMax">X最大值:</label>
                <input type="number" id="xMax" value="10">
                
                <label for="yMin">Y最小值:</label>
                <input type="number" id="yMin" value="-5">
                
                <label for="yMax">Y最大值:</label>
                <input type="number" id="yMax" value="5">
                
                <button id="drawButton">绘制图形</button>
                
                <div class="examples">
                    <p>示例函数:</p>
                    <div class="example-btn" data-example="Math.sin(x)">正弦函数</div>
                    <div class="example-btn" data-example="Math.cos(x)">余弦函数</div>
                    <div class="example-btn" data-example="x*x">二次函数</div>
                    <div class="example-btn" data-example="Math.sqrt(x)">平方根</div>
                    <div class="example-btn" data-example="Math.abs(x)">绝对值</div>
                    <div class="example-btn" data-example="Math.log(x)">对数函数</div>
                    <div class="example-btn" data-example="Math.exp(x)">指数函数</div>
                    <div class="example-btn" data-example="Math.tan(x)">正切函数</div>
                </div>
            </div>
        </div>
    `;

    // 以下是原来的绘图逻辑
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        drawGraph();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawAxes() {
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        const xMin = parseFloat(document.getElementById('xMin').value);
        const xMax = parseFloat(document.getElementById('xMax').value);
        const yMin = parseFloat(document.getElementById('yMin').value);
        const yMax = parseFloat(document.getElementById('yMax').value);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        // X轴
        const yZero = height * (1 - (0 - yMin) / (yMax - yMin));
        ctx.beginPath();
        ctx.moveTo(0, yZero);
        ctx.lineTo(width, yZero);
        ctx.stroke();

        // Y轴
        const xZero = width * (0 - xMin) / (xMax - xMin);
        ctx.beginPath();
        ctx.moveTo(xZero, 0);
        ctx.lineTo(xZero, height);
        ctx.stroke();

        // 绘制刻度
        ctx.font = '10px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // X轴刻度
        const xStep = (xMax - xMin) / 10;
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            const screenX = width * (x - xMin) / (xMax - xMin);
            ctx.beginPath();
            ctx.moveTo(screenX, yZero - 5);
            ctx.lineTo(screenX, yZero + 5);
            ctx.stroke();
            ctx.fillText(x.toFixed(1), screenX, yZero + 8);
        }

        // Y轴刻度
        const yStep = (yMax - yMin) / 10;
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            const screenY = height * (1 - (y - yMin) / (yMax - yMin));
            ctx.beginPath();
            ctx.moveTo(xZero - 5, screenY);
            ctx.lineTo(xZero + 5, screenY);
            ctx.stroke();
            ctx.textAlign = 'right';
            ctx.fillText(y.toFixed(1), xZero - 8, screenY - 6);
        }
    }

    function drawFunction() {
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        const xMin = parseFloat(document.getElementById('xMin').value);
        const xMax = parseFloat(document.getElementById('xMax').value);
        const yMin = parseFloat(document.getElementById('yMin').value);
        const yMax = parseFloat(document.getElementById('yMax').value);
        const color = document.getElementById('colorSelect').value;
        const funcStr = document.getElementById('functionInput').value;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        let firstPoint = true;
        const step = (xMax - xMin) / width;

        for (let x = xMin; x <= xMax; x += step) {
            try {
                const func = new Function('x', 'return ' + funcStr + ';');
                let y = func(x);

                if (!isFinite(y)) {
                    firstPoint = true;
                    continue;
                }

                const screenX = width * (x - xMin) / (xMax - xMin);
                const screenY = height * (1 - (y - yMin) / (yMax - yMin));

                if (firstPoint) {
                    ctx.moveTo(screenX, screenY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            } catch (e) {
                console.error("函数计算错误:", e);
                firstPoint = true;
            }
        }

        ctx.stroke();
    }

    function drawGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAxes();
        drawFunction();
    }

    document.getElementById('drawButton').addEventListener('click', drawGraph);

    // 示例按钮事件处理
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('functionInput').value = this.getAttribute('data-example');
            drawGraph();
        });
    });

    // 初始绘制
    drawGraph();
});