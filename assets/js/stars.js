(() => {
    if (window.__starfieldInitialized) {
        return;
    }
    window.__starfieldInitialized = true;

    const canvas = document.getElementById('starfield');
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = {
        width: 0,
        height: 0,
        stars: [],
        lastTime: 0,
        animationId: 0,
        density: 0.0002,
    };

    function getPalette() {
        const isDark = document.body.classList.contains('dark-theme');
        return {
            background: isDark ? 'rgba(8, 12, 20, 0.55)' : 'rgba(235, 242, 252, 0.45)',
            starColor: isDark ? '255, 255, 255' : '30, 60, 120',
        };
    }

    let palette = getPalette();

    function createStar() {
        return {
            x: Math.random() * state.width,
            y: Math.random() * state.height,
            radius: Math.random() * 1.4 + 0.6,
            speed: Math.random() * 18 + 6,
            drift: (Math.random() - 0.5) * 4,
            twinkleSpeed: Math.random() * 1.5 + 0.6,
            twinkleOffset: Math.random() * Math.PI * 2,
            baseAlpha: Math.random() * 0.3 + 0.35,
        };
    }

    function resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (width === state.width && height === state.height) {
            return;
        }

        state.width = width;
        state.height = height;

        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        const targetCount = Math.max(80, Math.floor(width * height * state.density));
        state.stars = Array.from({ length: targetCount }, createStar);
    }

    function drawBackground() {
        if (palette.background === 'rgba(255, 255, 255, 0)') {
            ctx.clearRect(0, 0, state.width, state.height);
            return;
        }

        ctx.fillStyle = palette.background;
        ctx.fillRect(0, 0, state.width, state.height);
    }

    function updateStars(deltaSeconds) {
        for (const star of state.stars) {
            star.y += star.speed * deltaSeconds;
            star.x += star.drift * deltaSeconds;

            if (star.y > state.height + 10) {
                star.y = -10;
                star.x = Math.random() * state.width;
            }

            if (star.x < -10) {
                star.x = state.width + 10;
            } else if (star.x > state.width + 10) {
                star.x = -10;
            }
        }
    }

    function renderStars(time) {
        drawBackground();

        for (const star of state.stars) {
            const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset);
            const alpha = Math.max(0.12, Math.min(0.7, star.baseAlpha + twinkle * 0.25));

            ctx.beginPath();
            ctx.fillStyle = `rgba(${palette.starColor}, ${alpha})`;
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function step(time) {
        if (!state.lastTime) {
            state.lastTime = time;
        }

        const deltaSeconds = Math.min((time - state.lastTime) / 1000, 0.05);
        state.lastTime = time;

        updateStars(deltaSeconds);
        renderStars(time);
        state.animationId = window.requestAnimationFrame(step);
    }

    function start() {
        stop();
        state.lastTime = 0;

        if (prefersReducedMotion.matches) {
            renderStars(performance.now());
            return;
        }

        state.animationId = window.requestAnimationFrame(step);
    }

    function stop() {
        if (state.animationId) {
            window.cancelAnimationFrame(state.animationId);
            state.animationId = 0;
        }
    }

    const themeObserver = new MutationObserver(() => {
        palette = getPalette();
    });

    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('resize', () => {
        resizeCanvas();
        start();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
            return;
        }

        start();
    });

    prefersReducedMotion.addEventListener('change', () => {
        start();
    });

    resizeCanvas();
    start();
})();
