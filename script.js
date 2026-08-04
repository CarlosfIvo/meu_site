const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const mouse = { x: null, y: null, radius: 180 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
});

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const numParticles = (width * height) / 9000;
    
    for (let i = 0; i < numParticles; i++) {
        const size = (Math.random() * 2) + 0.5;
        const x = Math.random() * (width - size * 2) + size * 2;
        const y = Math.random() * (height - size * 2) + size * 2;
        const dirX = (Math.random() * 1.5) - 0.75;
        const dirY = (Math.random() * 1.5) - 0.75;
        const color = '#0ea5e9';
        particles.push({ x, y, dirX, dirY, size, color });
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        p.x += p.dirX;
        p.y += p.dirY;

        if (p.x > width || p.x < 0) p.dirX = -p.dirX;
        if (p.y > height || p.y < 0) p.dirY = -p.dirY;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            if (mouse.x < p.x && p.x < width - p.size * 10) p.x += 3;
            if (mouse.x > p.x && p.x > p.size * 10) p.x -= 3;
            if (mouse.y < p.y && p.y < height - p.size * 10) p.y += 3;
            if (mouse.y > p.y && p.y > p.size * 10) p.y -= 3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    connectParticles();
}

function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                             ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            if (distance < (width/8) * (height/8)) {
                opacityValue = 1 - (distance / 18000);
                ctx.strokeStyle = `rgba(14, 165, 233, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

initParticles();
animateParticles();

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});