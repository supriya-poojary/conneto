// PARTICLE CANVAS
const canvas = document.getElementById('pCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [[124, 58, 237], [168, 85, 247], [192, 38, 211], [232, 121, 249], [99, 102, 241], [129, 140, 248]];
  const particles = Array.from({ length: 72 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.4 + 0.1
  }));

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const glow = document.getElementById('cGlow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(${p.color}, ${0.1 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// SCROLL EFFECTS
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Parallax Background Layers
  const bgLayers = document.querySelectorAll('.bg-l');
  bgLayers.forEach((layer, i) => {
    const speed = (i + 1) * 0.02;
    layer.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.rev, .revL, .revR, .stgg');
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
    }
  });
}, observerOptions);

reveals.forEach(r => revealObserver.observe(r));

// COUNTER ANIMATION
function animateCounter(el, target, suffix, duration = 2000) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const currentCount = Math.floor(easeProgress * target);

    if (target >= 1000) {
      el.textContent = (currentCount / 1000).toFixed(currentCount % 1000 === 0 ? 0 : 0) + 'K' + suffix;
    } else {
      el.textContent = currentCount + suffix;
    }

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = target >= 1000 ? (target / 1000) + 'K' + suffix : target + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stgrid');
if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stn[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}
