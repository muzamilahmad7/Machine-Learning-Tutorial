/* ═══════════════════════════════════════════════════════════════
   SVM Kernels Tutorial · Interactive JavaScript
   by Muhammad Muzamil
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 0. Micro-Sound Engine (Web Audio API) ───────────────── */
    let audioCtx = null;
    let soundEnabled = true;

    function getAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    function playTone(freq, duration, type = 'sine', vol = 0.06, detune = 0) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            osc.detune.value = detune;
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) { /* silently fail if audio unavailable */ }
    }

    // Sound presets
    const sound = {
        // Soft chime when entering a new section (pentatonic scale)
        chime: (index) => {
            const notes = [523, 587, 659, 784, 880, 988, 1047];
            const note = notes[index % notes.length];
            playTone(note, 0.25, 'sine', 0.04);
            setTimeout(() => playTone(note * 1.5, 0.15, 'sine', 0.02), 60);
        },
        // Soft pop for slider/button interactions
        pop: () => {
            playTone(880, 0.08, 'sine', 0.05);
            playTone(1320, 0.06, 'sine', 0.03, 5);
        },
        // Click for code copy
        click: () => {
            playTone(1200, 0.04, 'square', 0.02);
            setTimeout(() => playTone(1600, 0.03, 'square', 0.015), 30);
        },
        // Gentle whoosh for CTA / navigation
        whoosh: () => {
            playTone(200, 0.15, 'sine', 0.04);
            playTone(400, 0.12, 'sine', 0.03, 10);
            setTimeout(() => playTone(600, 0.1, 'sine', 0.02), 50);
        }
    };

    // Mute toggle button
    const muteBtn = document.createElement('button');
    muteBtn.id = 'sound-toggle';
    muteBtn.innerHTML = '&#128266;'; // speaker icon
    muteBtn.setAttribute('aria-label', 'Toggle sound effects');
    muteBtn.title = 'Toggle sound';
    Object.assign(muteBtn.style, {
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        zIndex: '9999', width: '40px', height: '40px',
        borderRadius: '50%', border: '1px solid rgba(217,119,87,0.2)',
        background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(10px)',
        color: '#D97757', fontSize: '16px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: '0.3s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
    });
    muteBtn.addEventListener('mouseenter', () => { muteBtn.style.transform = 'scale(1.1)'; });
    muteBtn.addEventListener('mouseleave', () => { muteBtn.style.transform = 'scale(1)'; });
    muteBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        muteBtn.innerHTML = soundEnabled ? '&#128266;' : '&#128263;';
        muteBtn.style.opacity = soundEnabled ? '1' : '0.5';
        if (soundEnabled) sound.pop();
    });
    document.body.appendChild(muteBtn);

    /* ── 1. Progress Bar ───────────────────────────────────────── */
    const progressBar = document.getElementById('progress-bar');
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });

    /* ── 2. Navbar ─────────────────────────────────────────────── */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    /* Mobile menu */
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded',
                navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });
    }

    /* ── 3. Active Nav Highlighting ────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const idx = Array.from(sections).indexOf(entry.target);
                navAnchors.forEach(a =>
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id)
                );
                sound.chime(idx);
            }
        });
    }, { rootMargin: '-25% 0px -75% 0px' });

    sections.forEach(s => navObserver.observe(s));

    /* ── 4. Scroll Reveal ──────────────────────────────────────── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger')
        .forEach(el => revealObserver.observe(el));

    /* ── 5. Smooth Scroll ──────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navLinks.classList.remove('open');
                sound.whoosh();
            }
        });
    });

    /* ── 6. Code Copy Buttons ──────────────────────────────────── */
    document.querySelectorAll('.code-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.closest('.code-block').querySelector('code');
            navigator.clipboard.writeText(code.textContent).then(() => {
                btn.textContent = 'Copied!';
                btn.style.color = '#28C840';
                sound.click();
                setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 1500);
            });
        });
    });

    /* ── 7. Hero: Animated SVM Landscape ─────────────────────────*/
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, dpr;
        let mouseX = 0.5, mouseY = 0.5;
        let smoothMX = 0.5, smoothMY = 0.5;
        let time = 0;

        function resizeCanvas() {
            dpr = window.devicePixelRatio || 1;
            w = canvas.offsetWidth;
            h = canvas.offsetHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse tracking for parallax
        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
        });

        // ── Data clusters ──
        const seed = 7;
        function sRand(s) { let x = Math.sin(s + 1) * 43758.5453; return x - Math.floor(x); }

        const clusterA = [], clusterB = [];
        for (let i = 0; i < 28; i++) {
            clusterA.push({
                bx: 0.22 + (sRand(seed + i * 7) - 0.5) * 0.22,
                by: 0.3 + (sRand(seed + i * 7 + 1) - 0.5) * 0.55,
                r: sRand(seed + i * 7 + 2) * 2.5 + 1.5,
                phase: sRand(seed + i * 7 + 3) * Math.PI * 2,
                speed: 0.3 + sRand(seed + i * 7 + 4) * 0.5
            });
            clusterB.push({
                bx: 0.78 + (sRand(seed + i * 7 + 50) - 0.5) * 0.22,
                by: 0.35 + (sRand(seed + i * 7 + 51) - 0.5) * 0.55,
                r: sRand(seed + i * 7 + 52) * 2.5 + 1.5,
                phase: sRand(seed + i * 7 + 53) * Math.PI * 2,
                speed: 0.3 + sRand(seed + i * 7 + 54) * 0.5
            });
        }

        // ── Floating math symbols ──
        const mathSymbols = [
            'K(x,y)', 'w\u00B7x+b=0', '\u03B3', '\u03A3', '\u2225w\u2225\u00B2', '\u03C6(x)',
            'argmin', 'C', '\u2265 1', 'RBF', '\u03B1\u1D62', 'margin'
        ];
        const floaters = [];
        for (let i = 0; i < 14; i++) {
            floaters.push({
                x: sRand(i * 13) * w,
                y: sRand(i * 13 + 1) * h,
                vy: -(0.15 + sRand(i * 13 + 2) * 0.3),
                alpha: 0,
                maxAlpha: 0.18 + sRand(i * 13 + 3) * 0.12,
                text: mathSymbols[i % mathSymbols.length],
                size: 10 + sRand(i * 13 + 4) * 6
            });
        }

        // ── Decision boundary morph ──
        // Kernel cycle: linear → poly → rbf → sigmoid
        const KERNEL_NAMES = ['Linear', 'Polynomial', 'RBF', 'Sigmoid'];
        const MORPH_DUR = 4; // seconds per kernel shape
        const TOTAL_CYCLE = KERNEL_NAMES.length * MORPH_DUR;

        function getBoundaryY(xNorm, kernelBlend) {
            // xNorm is 0..1 along the boundary, returns y offset from center
            const k = kernelBlend % KERNEL_NAMES.length;
            const blend = kernelBlend - Math.floor(kernelBlend);
            const yA = getKernelShape(xNorm, Math.floor(k));
            const yB = getKernelShape(xNorm, (Math.floor(k) + 1) % KERNEL_NAMES.length);
            return yA * (1 - blend) + yB * blend;
        }

        function getKernelShape(xNorm, kernel) {
            const x = xNorm * 2 - 1; // -1 to 1
            switch (kernel) {
                case 0: return 0; // linear
                case 1: return Math.pow(x, 3) * 0.35 - x * 0.1; // polynomial
                case 2: return Math.sin(x * 2.5) * 0.25; // rbf-like wave
                case 3: return Math.tanh(x * 2) * 0.2; // sigmoid
                default: return 0;
            }
        }

        // ── Perspective grid ──
        function drawPerspectiveGrid() {
            const cx = w * 0.5 + (mouseX - 0.5) * 30;
            const horizon = h * 0.15;
            ctx.strokeStyle = 'rgba(217,119,87,0.025)';
            ctx.lineWidth = 0.5;

            // Vertical perspective lines
            for (let i = -6; i <= 6; i++) {
                const topX = cx + i * 40;
                const botX = cx + i * (w * 0.12);
                ctx.beginPath();
                ctx.moveTo(topX, horizon);
                ctx.lineTo(botX, h);
                ctx.stroke();
            }

            // Horizontal lines with perspective spacing
            for (let i = 1; i <= 8; i++) {
                const y = horizon + (h - horizon) * (Math.pow(i / 8, 1.8));
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }

        // ── Main render ──
        function render() {
            time += 0.016;
            // Smooth mouse interpolation
            smoothMX += (mouseX - smoothMX) * 0.08;
            smoothMY += (mouseY - smoothMY) * 0.08;
            ctx.clearRect(0, 0, w, h);

            // Parallax offsets (strong)
            const px = (smoothMX - 0.5) * 60;
            const py = (smoothMY - 0.5) * 40;
            const mxPx = smoothMX * w; // mouse pixel position
            const myPx = smoothMY * h;

            // Background: subtle perspective grid
            drawPerspectiveGrid();

            // ── Decision boundary ──
            const kernelBlend = (time / MORPH_DUR) % KERNEL_NAMES.length;
            const centerX = w * 0.5 + px;

            // Draw colored regions
            const regionRes = 4;
            for (let ry = 0; ry < h; ry += regionRes) {
                const yNorm = ry / h;
                const offset = getBoundaryY(yNorm, kernelBlend) * h * 0.4;
                const bx = centerX + offset;

                // Left region (blue)
                ctx.fillStyle = `rgba(74,127,191,${0.015 + Math.sin(time * 0.5 + yNorm * 3) * 0.005})`;
                ctx.fillRect(0, ry, bx, regionRes);

                // Right region (coral)
                ctx.fillStyle = `rgba(217,119,87,${0.015 + Math.sin(time * 0.5 + yNorm * 3 + 1) * 0.005})`;
                ctx.fillRect(bx, ry, w - bx, regionRes);
            }

            // ── Boundary line with glow ──
            ctx.beginPath();
            for (let ry = 0; ry <= h; ry += 2) {
                const yNorm = ry / h;
                const offset = getBoundaryY(yNorm, kernelBlend) * h * 0.4;
                const bx = centerX + offset;
                if (ry === 0) ctx.moveTo(bx, ry);
                else ctx.lineTo(bx, ry);
            }
            // Thick glow
            ctx.shadowColor = 'rgba(245,240,232,0.4)';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = 'rgba(245,240,232,0.25)';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Sharp line on top
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(245,240,232,0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // ── Kernel label ──
            const currentKernel = KERNEL_NAMES[Math.floor(kernelBlend) % KERNEL_NAMES.length];
            const labelAlpha = 0.3 + Math.sin(time * 2) * 0.1;
            ctx.font = '500 11px "Fira Code", monospace';
            ctx.fillStyle = `rgba(217,119,87,${labelAlpha})`;
            ctx.fillText(`kernel: ${currentKernel.toLowerCase()}`, centerX + 15, h * 0.08);

            // ── Mouse spotlight glow ──
            const spotGrad = ctx.createRadialGradient(mxPx, myPx, 0, mxPx, myPx, 200);
            spotGrad.addColorStop(0, 'rgba(217,119,87,0.06)');
            spotGrad.addColorStop(0.5, 'rgba(217,119,87,0.02)');
            spotGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(mxPx, myPx, 200, 0, Math.PI * 2);
            ctx.fillStyle = spotGrad;
            ctx.fill();

            // ── Data clusters with constellation lines ──
            function drawCluster(cluster, color, glowColor) {
                const pts = cluster.map(p => {
                    const baseX = (p.bx + Math.sin(time * p.speed + p.phase) * 0.008) * w + px * 0.15;
                    const baseY = (p.by + Math.cos(time * p.speed * 0.7 + p.phase) * 0.01) * h + py * 0.15;
                    // React to mouse: push away slightly
                    const dmx = baseX - mxPx;
                    const dmy = baseY - myPx;
                    const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
                    const mouseInfluence = Math.max(0, 1 - mouseDist / 150);
                    const pushX = mouseDist > 5 ? (dmx / mouseDist) * mouseInfluence * 18 : 0;
                    const pushY = mouseDist > 5 ? (dmy / mouseDist) * mouseInfluence * 18 : 0;
                    return {
                        x: baseX + pushX,
                        y: baseY + pushY,
                        r: p.r + Math.sin(time * 1.5 + p.phase) * 0.5 + mouseInfluence * 3,
                        mouseInfluence
                    };
                });

                // Constellation lines
                for (let i = 0; i < pts.length; i++) {
                    for (let j = i + 1; j < pts.length; j++) {
                        const dx = pts[i].x - pts[j].x;
                        const dy = pts[i].y - pts[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 110) {
                            const nearMouse = Math.max(pts[i].mouseInfluence, pts[j].mouseInfluence);
                            const alpha = (1 - dist / 110) * (0.12 + nearMouse * 0.25);
                            ctx.beginPath();
                            ctx.moveTo(pts[i].x, pts[i].y);
                            ctx.lineTo(pts[j].x, pts[j].y);
                            ctx.strokeStyle = color.replace('1)', `${alpha})`);
                            ctx.lineWidth = 0.6 + nearMouse * 1.2;
                            ctx.stroke();
                        }
                    }
                }

                // Draw lines from mouse to nearby points
                pts.forEach(p => {
                    if (p.mouseInfluence > 0.1) {
                        ctx.beginPath();
                        ctx.moveTo(mxPx, myPx);
                        ctx.lineTo(p.x, p.y);
                        ctx.strokeStyle = color.replace('1)', `${p.mouseInfluence * 0.15})`);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });

                // Points with glow
                pts.forEach(p => {
                    const glowMult = 1 + p.mouseInfluence * 2.5;
                    // Outer glow (bigger near mouse)
                    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5 * glowMult);
                    grad.addColorStop(0, glowColor.replace('1)', `${0.08 + p.mouseInfluence * 0.15})`));
                    grad.addColorStop(1, 'transparent');
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * 5 * glowMult, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();

                    // Core point
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();

                    // Bright center (brighter near mouse)
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * (0.4 + p.mouseInfluence * 0.3), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255,${0.5 + p.mouseInfluence * 0.4})`;
                    ctx.fill();
                });
            }

            drawCluster(clusterA, 'rgba(74,127,191,1)', 'rgba(74,127,191,1)');
            drawCluster(clusterB, 'rgba(217,119,87,1)', 'rgba(217,119,87,1)');

            // ── Floating math symbols ──
            floaters.forEach(f => {
                f.y += f.vy;
                // Fade in/out based on position
                if (f.y < h * 0.2) f.alpha *= 0.98;
                else if (f.alpha < f.maxAlpha) f.alpha += 0.004;

                if (f.y < -20) {
                    f.y = h + 20;
                    f.x = Math.random() * w;
                    f.alpha = 0;
                }

                if (f.alpha > 0.005) {
                    ctx.font = `${f.size}px "Fira Code", monospace`;
                    ctx.fillStyle = `rgba(245,240,232,${f.alpha})`;
                    ctx.fillText(f.text, f.x + px * 0.5, f.y + py * 0.3);
                }
            });

            // ── Ambient pulse rings (from center) ──
            const pulseCount = 3;
            for (let i = 0; i < pulseCount; i++) {
                const pulseT = ((time * 0.3 + i / pulseCount) % 1);
                const pulseR = pulseT * Math.max(w, h) * 0.6;
                const pulseAlpha = (1 - pulseT) * 0.03;
                ctx.beginPath();
                ctx.arc(centerX, h * 0.5 + py, pulseR, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(217,119,87,${pulseAlpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            requestAnimationFrame(render);
        }

        resizeCanvas();
        requestAnimationFrame(render);
    }

    /* ── 8. Interactive Gamma Visualization ────────────────────── */
    const gammaSlider = document.getElementById('gamma-slider');
    const gammaValue = document.getElementById('gamma-value');
    const gammaCanvas = document.getElementById('gamma-canvas');

    if (gammaSlider && gammaCanvas) {
        const gCtx = gammaCanvas.getContext('2d');

        function resizeGammaCanvas() {
            gammaCanvas.width = gammaCanvas.offsetWidth;
            gammaCanvas.height = gammaCanvas.offsetHeight;
        }
        resizeGammaCanvas();
        window.addEventListener('resize', resizeGammaCanvas);

        // Generate fixed 2D data points (two moons, well separated)
        const pointsA = [], pointsB = [];
        function gammaRand(s) { let x = Math.sin(s + 1) * 43758.5453; return x - Math.floor(x); }
        for (let i = 0; i < 40; i++) {
            const angle = Math.PI * (i / 40);
            const noiseScale = 0.15;
            pointsA.push({
                x: Math.cos(angle) + (gammaRand(i * 3) - 0.5) * noiseScale,
                y: Math.sin(angle) + (gammaRand(i * 3 + 1) - 0.5) * noiseScale
            });
            pointsB.push({
                x: 1 - Math.cos(angle) + (gammaRand(i * 3 + 100) - 0.5) * noiseScale,
                y: -Math.sin(angle) + 0.3 + (gammaRand(i * 3 + 101) - 0.5) * noiseScale
            });
        }

        function rbfKernel(x1, y1, x2, y2, gamma) {
            const dist = (x1 - x2) ** 2 + (y1 - y2) ** 2;
            return Math.exp(-gamma * dist);
        }

        function drawGammaViz() {
            const gamma = parseFloat(gammaSlider.value);
            gammaValue.textContent = gamma.toFixed(1);
            const cw = gammaCanvas.width;
            const ch = gammaCanvas.height;
            gCtx.clearRect(0, 0, cw, ch);

            // Map data space [-0.5, 2] -> canvas
            const mapX = v => ((v + 0.5) / 2.5) * cw;
            const mapY = v => (1 - (v + 0.8) / 2.5) * ch;

            // Draw decision landscape using pixel blocks
            const step = 6;
            for (let px = 0; px < cw; px += step) {
                for (let py = 0; py < ch; py += step) {
                    const dx = (px / cw) * 2.5 - 0.5;
                    const dy = (1 - py / ch) * 2.5 - 0.8;

                    let scoreA = 0, scoreB = 0;
                    pointsA.forEach(p => { scoreA += rbfKernel(dx, dy, p.x, p.y, gamma); });
                    pointsB.forEach(p => { scoreB += rbfKernel(dx, dy, p.x, p.y, gamma); });

                    if (scoreA > scoreB) {
                        const intensity = Math.min((scoreA - scoreB) / (scoreA + scoreB + 0.01), 1);
                        gCtx.fillStyle = `rgba(74,127,191,${0.08 + intensity * 0.25})`;
                    } else {
                        const intensity = Math.min((scoreB - scoreA) / (scoreA + scoreB + 0.01), 1);
                        gCtx.fillStyle = `rgba(217,119,87,${0.08 + intensity * 0.25})`;
                    }
                    gCtx.fillRect(px, py, step, step);
                }
            }

            // Draw data points
            pointsA.forEach(p => {
                gCtx.beginPath();
                gCtx.arc(mapX(p.x), mapY(p.y), 4, 0, Math.PI * 2);
                gCtx.fillStyle = '#4A7FBF';
                gCtx.fill();
                gCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                gCtx.lineWidth = 1;
                gCtx.stroke();
            });

            pointsB.forEach(p => {
                gCtx.beginPath();
                gCtx.arc(mapX(p.x), mapY(p.y), 4, 0, Math.PI * 2);
                gCtx.fillStyle = '#D97757';
                gCtx.fill();
                gCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                gCtx.lineWidth = 1;
                gCtx.stroke();
            });

            // Label
            gCtx.font = '13px Inter, sans-serif';
            gCtx.fillStyle = 'rgba(245,240,232,0.6)';
            gCtx.fillText(`gamma = ${gamma.toFixed(1)}`, 12, 22);

            // Interpretation text
            let msg = '';
            if (gamma < 0.5) msg = 'Very smooth boundary (underfitting)';
            else if (gamma < 2) msg = 'Balanced boundary';
            else if (gamma < 8) msg = 'Tight boundary';
            else msg = 'Extreme overfitting to individual points';

            gCtx.fillStyle = 'rgba(217,119,87,0.8)';
            gCtx.fillText(msg, 12, 42);
        }

        let lastSliderSound = 0;
        gammaSlider.addEventListener('input', () => {
            drawGammaViz();
            const now = Date.now();
            if (now - lastSliderSound > 150) { sound.pop(); lastSliderSound = now; }
        });
        // Initial draw
        setTimeout(drawGammaViz, 100);
    }

    /* ── 9. Animated Counter ───────────────────────────────────── */
    const counters = document.querySelectorAll('.stat-card .num');
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 0;
                const step = Math.max(1, Math.floor(target / 40));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ── 10. SVM Intro Animation ──────────────────────────────── */
    const svmCanvas = document.getElementById('svm-anim-canvas');
    const svmLabel = document.getElementById('svm-anim-label');

    if (svmCanvas) {
        const sCtx = svmCanvas.getContext('2d');
        let sw, sh;

        function resizeSvmCanvas() {
            sw = svmCanvas.width = svmCanvas.offsetWidth * (window.devicePixelRatio || 1);
            sh = svmCanvas.height = svmCanvas.offsetHeight * (window.devicePixelRatio || 1);
            sCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        }
        resizeSvmCanvas();

        const W = () => svmCanvas.offsetWidth;
        const H = () => svmCanvas.offsetHeight;

        // Generate two linearly separable clusters
        const seed = 42;
        function seededRandom(s) {
            let x = Math.sin(s) * 10000;
            return x - Math.floor(x);
        }

        const classA = [], classB = [];
        for (let i = 0; i < 18; i++) {
            classA.push({
                tx: 0.25 + (seededRandom(seed + i * 3) - 0.5) * 0.28,
                ty: 0.35 + (seededRandom(seed + i * 3 + 1) - 0.5) * 0.5,
                x: -0.1, y: -0.1, scale: 0, alpha: 0,
                isSV: false
            });
            classB.push({
                tx: 0.72 + (seededRandom(seed + i * 3 + 50) - 0.5) * 0.28,
                ty: 0.4 + (seededRandom(seed + i * 3 + 51) - 0.5) * 0.5,
                x: 1.1, y: 1.1, scale: 0, alpha: 0,
                isSV: false
            });
        }

        // Mark some as support vectors (closest to center)
        classA.sort((a, b) => b.tx - a.tx);
        classB.sort((a, b) => a.tx - b.tx);
        classA[0].isSV = true; classA[1].isSV = true; classA[2].isSV = true;
        classB[0].isSV = true; classB[1].isSV = true; classB[2].isSV = true;

        // Animation state
        let animTime = 0;
        let animPhase = 0; // 0=spawn, 1=sweep, 2=margin, 3=highlight, 4=hold
        const PHASE_DUR = [2.5, 2.0, 1.5, 1.5, 4.5]; // seconds per phase
        const TOTAL_DUR = PHASE_DUR.reduce((a, b) => a + b, 0);
        let lastTime = null;
        let sweepAngle = -0.4;
        let marginWidth = 0;
        let svPulse = 0;
        let started = false;

        // Optimal boundary line params
        const optX = 0.49;
        const optAngle = -0.08;

        const labels = [
            'Generating data points...',
            'Searching for optimal hyperplane...',
            'Maximising margin between classes...',
            'Identifying support vectors...',
            'Optimal decision boundary found.'
        ];

        function phaseTime() {
            let t = animTime;
            for (let i = 0; i < PHASE_DUR.length; i++) {
                if (t < PHASE_DUR[i]) return { phase: i, t: t, pct: t / PHASE_DUR[i] };
                t -= PHASE_DUR[i];
            }
            return { phase: PHASE_DUR.length - 1, t: 0, pct: 1 };
        }

        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
        function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

        function drawSvmAnim() {
            const w = W(), h = H();
            sCtx.clearRect(0, 0, w, h);

            const { phase, t, pct } = phaseTime();

            if (svmLabel) svmLabel.textContent = labels[Math.min(phase, labels.length - 1)];

            // --- Draw subtle grid ---
            sCtx.strokeStyle = 'rgba(255,255,255,0.03)';
            sCtx.lineWidth = 1;
            for (let gx = 0; gx < w; gx += 40) {
                sCtx.beginPath(); sCtx.moveTo(gx, 0); sCtx.lineTo(gx, h); sCtx.stroke();
            }
            for (let gy = 0; gy < h; gy += 40) {
                sCtx.beginPath(); sCtx.moveTo(0, gy); sCtx.lineTo(w, gy); sCtx.stroke();
            }

            // --- Phase 0: Spawn points ---
            const allPoints = [...classA, ...classB];
            const totalPoints = allPoints.length;
            allPoints.forEach((p, i) => {
                const isB = i >= classA.length;
                let spawnPct;
                if (phase === 0) {
                    const delay = (i / totalPoints) * 0.8;
                    spawnPct = Math.max(0, Math.min(1, (pct - delay) / (1 - delay)));
                    spawnPct = easeOut(spawnPct);
                } else {
                    spawnPct = 1;
                }

                p.x = isB ? (1.1 - (1.1 - p.tx) * spawnPct) : (-0.1 + (p.tx + 0.1) * spawnPct);
                p.y = isB ? (1.1 - (1.1 - p.ty) * spawnPct) : (-0.1 + (p.ty + 0.1) * spawnPct);
                p.scale = spawnPct;
                p.alpha = spawnPct;
            });

            // --- Phase 1: Sweep hyperplane ---
            if (phase >= 1) {
                const sweepPct = phase === 1 ? easeInOut(pct) : 1;
                sweepAngle = -0.5 + (0.5 + optAngle) * sweepPct;
                const lineX = 0.3 + (optX - 0.3) * sweepPct;

                // Draw sweeping line
                const cx = lineX * w;
                const len = h * 1.5;
                const x1 = cx + Math.cos(Math.PI / 2 + sweepAngle) * len;
                const y1 = h / 2 + Math.sin(Math.PI / 2 + sweepAngle) * len;
                const x2 = cx - Math.cos(Math.PI / 2 + sweepAngle) * len;
                const y2 = h / 2 - Math.sin(Math.PI / 2 + sweepAngle) * len;

                // Glow
                sCtx.shadowColor = 'rgba(245,240,232,0.3)';
                sCtx.shadowBlur = 15;
                sCtx.strokeStyle = phase >= 3 ? 'rgba(245,240,232,0.8)' : `rgba(245,240,232,${0.3 + sweepPct * 0.4})`;
                sCtx.lineWidth = 2;
                sCtx.beginPath(); sCtx.moveTo(x1, y1); sCtx.lineTo(x2, y2); sCtx.stroke();
                sCtx.shadowBlur = 0;

                // --- Phase 2: Margin lines ---
                if (phase >= 2) {
                    const mPct = phase === 2 ? easeOut(pct) : 1;
                    marginWidth = mPct * 0.09 * w;

                    // Margin fill
                    sCtx.save();
                    sCtx.globalAlpha = 0.06 * mPct;
                    sCtx.fillStyle = '#F5F0E8';
                    sCtx.beginPath();
                    const mx1a = (lineX * w - marginWidth) + Math.cos(Math.PI / 2 + sweepAngle) * len;
                    const my1a = h / 2 + Math.sin(Math.PI / 2 + sweepAngle) * len;
                    const mx2a = (lineX * w - marginWidth) - Math.cos(Math.PI / 2 + sweepAngle) * len;
                    const my2a = h / 2 - Math.sin(Math.PI / 2 + sweepAngle) * len;
                    const mx1b = (lineX * w + marginWidth) + Math.cos(Math.PI / 2 + sweepAngle) * len;
                    const my1b = h / 2 + Math.sin(Math.PI / 2 + sweepAngle) * len;
                    const mx2b = (lineX * w + marginWidth) - Math.cos(Math.PI / 2 + sweepAngle) * len;
                    const my2b = h / 2 - Math.sin(Math.PI / 2 + sweepAngle) * len;
                    sCtx.moveTo(mx1a, my1a); sCtx.lineTo(mx2a, my2a);
                    sCtx.lineTo(mx2b, my2b); sCtx.lineTo(mx1b, my1b);
                    sCtx.closePath(); sCtx.fill();
                    sCtx.restore();

                    // Dashed margin lines
                    sCtx.setLineDash([6, 6]);
                    sCtx.strokeStyle = `rgba(217,119,87,${0.4 * mPct})`;
                    sCtx.lineWidth = 1.5;

                    sCtx.beginPath();
                    sCtx.moveTo((lineX * w - marginWidth) + Math.cos(Math.PI / 2 + sweepAngle) * len,
                        h / 2 + Math.sin(Math.PI / 2 + sweepAngle) * len);
                    sCtx.lineTo((lineX * w - marginWidth) - Math.cos(Math.PI / 2 + sweepAngle) * len,
                        h / 2 - Math.sin(Math.PI / 2 + sweepAngle) * len);
                    sCtx.stroke();

                    sCtx.beginPath();
                    sCtx.moveTo((lineX * w + marginWidth) + Math.cos(Math.PI / 2 + sweepAngle) * len,
                        h / 2 + Math.sin(Math.PI / 2 + sweepAngle) * len);
                    sCtx.lineTo((lineX * w + marginWidth) - Math.cos(Math.PI / 2 + sweepAngle) * len,
                        h / 2 - Math.sin(Math.PI / 2 + sweepAngle) * len);
                    sCtx.stroke();
                    sCtx.setLineDash([]);

                    // Margin label
                    if (mPct > 0.5) {
                        sCtx.save();
                        sCtx.globalAlpha = (mPct - 0.5) * 2;
                        sCtx.font = '11px Inter, sans-serif';
                        sCtx.fillStyle = 'rgba(217,119,87,0.7)';
                        const labelY = h * 0.18;
                        sCtx.fillText('margin', lineX * w - 18, labelY);
                        // arrows
                        sCtx.strokeStyle = 'rgba(217,119,87,0.5)';
                        sCtx.lineWidth = 1;
                        sCtx.beginPath();
                        sCtx.moveTo(lineX * w - marginWidth, labelY + 5);
                        sCtx.lineTo(lineX * w + marginWidth, labelY + 5);
                        sCtx.stroke();
                        sCtx.restore();
                    }
                }
            }

            // --- Draw data points ---
            allPoints.forEach((p, i) => {
                const isB = i >= classA.length;
                const px = p.x * w;
                const py = p.y * h;
                const r = 6 * p.scale;

                if (p.alpha <= 0) return;

                // Glow trail on spawn
                if (phase === 0 && p.scale > 0 && p.scale < 0.95) {
                    sCtx.beginPath();
                    sCtx.arc(px, py, r * 3, 0, Math.PI * 2);
                    const grad = sCtx.createRadialGradient(px, py, 0, px, py, r * 3);
                    grad.addColorStop(0, isB ? 'rgba(217,119,87,0.3)' : 'rgba(74,127,191,0.3)');
                    grad.addColorStop(1, 'transparent');
                    sCtx.fillStyle = grad;
                    sCtx.fill();
                }

                // Point
                sCtx.beginPath();
                sCtx.arc(px, py, r, 0, Math.PI * 2);
                sCtx.fillStyle = isB ? '#D97757' : '#4A7FBF';
                sCtx.globalAlpha = p.alpha;
                sCtx.fill();
                sCtx.strokeStyle = 'rgba(255,255,255,0.35)';
                sCtx.lineWidth = 1.2;
                sCtx.stroke();
                sCtx.globalAlpha = 1;

                // Support vector highlight (phase 3+)
                if (p.isSV && phase >= 3) {
                    const svAlpha = phase === 3 ? easeOut(pct) : 1;
                    const pulse = Math.sin(svPulse * 3 + i) * 0.2 + 0.8;

                    // Pulsing rings
                    sCtx.beginPath();
                    sCtx.arc(px, py, r + 5 + pulse * 4, 0, Math.PI * 2);
                    sCtx.strokeStyle = `rgba(232,168,56,${0.6 * svAlpha * pulse})`;
                    sCtx.lineWidth = 2;
                    sCtx.stroke();

                    sCtx.beginPath();
                    sCtx.arc(px, py, r + 10 + pulse * 6, 0, Math.PI * 2);
                    sCtx.strokeStyle = `rgba(232,168,56,${0.2 * svAlpha * pulse})`;
                    sCtx.lineWidth = 1;
                    sCtx.stroke();
                }
            });

            // --- Class labels ---
            if (phase >= 0) {
                const labelAlpha = phase === 0 ? Math.min(1, pct * 2) : 1;
                sCtx.globalAlpha = labelAlpha * 0.5;
                sCtx.font = '600 12px Inter, sans-serif';
                sCtx.fillStyle = '#4A7FBF';
                sCtx.fillText('Class A', w * 0.12, h * 0.1);
                sCtx.fillStyle = '#D97757';
                sCtx.fillText('Class B', w * 0.78, h * 0.1);
                sCtx.globalAlpha = 1;
            }

            // --- Phase 4 label ---
            if (phase >= 3 && pct > 0.5) {
                const fAlpha = phase === 3 ? (pct - 0.5) * 2 : 1;
                sCtx.globalAlpha = fAlpha * 0.7;
                sCtx.font = '600 13px Inter, sans-serif';
                sCtx.fillStyle = '#F5F0E8';
                sCtx.fillText('Decision Boundary', optX * w + marginWidth + 15, h * 0.5);
                sCtx.font = '11px Inter, sans-serif';
                sCtx.fillStyle = 'rgba(232,168,56,0.8)';
                sCtx.fillText('Support Vectors', optX * w + marginWidth + 15, h * 0.5 + 18);
                sCtx.globalAlpha = 1;
            }
        }

        function animLoop(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const dt = (timestamp - lastTime) / 1000;
            lastTime = timestamp;
            animTime += dt;
            svPulse += dt;

            if (animTime > TOTAL_DUR) {
                animTime = 0;
                // Reset points
                classA.forEach(p => { p.x = -0.1; p.y = -0.1; p.scale = 0; p.alpha = 0; });
                classB.forEach(p => { p.x = 1.1; p.y = 1.1; p.scale = 0; p.alpha = 0; });
            }

            drawSvmAnim();
            requestAnimationFrame(animLoop);
        }

        // Start when visible
        const svmAnimObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    resizeSvmCanvas();
                    requestAnimationFrame(animLoop);
                    svmAnimObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        svmAnimObserver.observe(svmCanvas.parentElement);
        window.addEventListener('resize', () => { resizeSvmCanvas(); });
    }

});
