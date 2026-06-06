// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ ИНТЕРАКТИВНОГО ГРАФА (CANVAS)
// ==========================================
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: null, y: null, radius: 180 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Объект частицы графа
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.baseRadius = Math.random() * 1.5 + 1;
        this.radius = this.baseRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    }

    update() {
        // Стандартное инерционное движение
        this.x += this.vx;
        this.y += this.vy;

        // Отскок от границ экрана
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Взаимодействие с вектором мыши (магнитный сдвиг)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.03;
            this.y -= dy * force * 0.03;
            this.radius = this.baseRadius * 2;
        } else {
            this.radius = this.baseRadius;
        }
    }
}

// Создание пула узлов графа
function initGraph() {
    particles = [];
    const density = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < Math.min(density, 150); i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

// Отрисовка линий связи между узлами (алгоритм Hashgraph)
function connectNodes() {
    let maxDistance = 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.hypot(dx, dy);

            if (distance < maxDistance) {
                // Изменение прозрачности линий в зависимости от дальности связи
                let alpha = (1 - (distance / maxDistance)) * 0.15;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Цикл рендеринга
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectNodes();
    requestAnimationFrame(animate);
}

initGraph();
animate();

// ==========================================
// 2. СЛЕЖЕНИЕ ЗА КУРСОРOM И ТЕЛЕМЕТРИЯ
// ==========================================
const reticle = document.getElementById('reticle');
const vecX = document.getElementById('vec-x');
const vecY = document.getElementById('vec-y');

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Плавное следование кастомного прицела
    reticle.style.left = `${e.clientX}px`;
    reticle.style.top = `${e.clientY}px`;

    // Вычисление отклонения от центра экрана для блока телеметрии
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    vecX.innerText = ((e.clientX - centerX) / centerX).toFixed(2);
    vecY.innerText = ((centerY - e.clientY) / centerY).toFixed(2);
});

// Отклик прицела при наведении на интерактивные узлы
document.querySelectorAll('.bento-item, .action-trigger').forEach(item => {
    item.addEventListener('mouseenter', () => {
        reticle.style.width = '40px';
        reticle.style.height = '40px';
        reticle.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    item.addEventListener('mouseleave', () => {
        reticle.style.width = '20px';
        reticle.style.height = '20px';
        reticle.style.backgroundColor = 'transparent';
    });
});

// ==========================================
// 3. ФУНКЦИОНАЛ РАЗВЕРТЫВАНИЯ УЗЛА (КЛИК)
// ==========================================
const terminalNode = document.getElementById('terminal-node');
const triggerExpand = document.getElementById('trigger-expand');
const telemetryStatus = document.getElementById('telemetry-status');

triggerExpand.addEventListener('click', () => {
    terminalNode.classList.toggle('expanded');
    
    if (terminalNode.classList.contains('expanded')) {
        triggerExpand.innerText = 'СВЕРНУТЬ МОДУЛЬ';
        telemetryStatus.innerText = 'STATUS: CONFIG_MOD_ACTIVE';
    } else {
        triggerExpand.innerText = 'РАЗВЕРНУТЬ УЗЕЛ';
        telemetryStatus.innerText = 'STATUS: OPERATIONAL';
    }
});

// ==========================================
// 4. ИМПУЛЬСНЫЙ АНАЛИЗАТОР (ЧАСТОТНЫЙ МОНИТОР)
// ==========================================
const matrixNode = document.getElementById('matrix-node');
const bars = document.querySelectorAll('.impulse-bar');

function triggerImpulse() {
    bars.forEach(bar => {
        const targetHeight = Math.floor(Math.random() * 90) + 10;
        bar.style.height = `${targetHeight}%`;
    });
}

// Первичная генерация уровней
triggerImpulse();

// Генерация новой волны высот при клике по карточке
matrixNode.addEventListener('click', triggerImpulse);
