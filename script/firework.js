const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let fireworks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y, color, angle, speed) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = angle;
    this.speed = speed;
    this.size = Math.random() * 2 + 1;
    this.alpha = 1;
    this.gravity = 0.02;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.speed *= 0.98;
    this.alpha -= 0.015;
    this.speed -= this.gravity;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class Firework {
  constructor(x, y, particleCount = 50) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.colors = ["#ff5733", "#ffbd33", "#33ff57", "#3357ff", "#f033ff"];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 2;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push(new Particle(this.x, this.y, color, angle, speed));
    }
  }

  update() {
    this.particles = this.particles.filter(p => {
      p.update();
      return p.alpha > 0;
    });
  }

  draw() {
    this.particles.forEach(p => p.draw());
  }
}

function animate() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks = fireworks.filter(fw => {
    fw.update();
    fw.draw();
    return fw.particles.length > 0;
  });

  requestAnimationFrame(animate);
}

document.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  fireworks.push(new Firework(x, y, 30));
});

animate();
