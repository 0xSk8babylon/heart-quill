import { useEffect, useRef } from "react";

function withAlpha(hex: string, a: number) {
  const c = hex.replace("#", "");
  const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function buildHouse() {
  const v: Array<[number, number]> = [];
  const P = (x: number, y: number) => { v.push([x, y]); return v.length - 1; };
  const bl = P(0.16, 0.84), br = P(0.60, 0.84);
  const tl = P(0.16, 0.50), tr = P(0.60, 0.50);
  const ridge = P(0.38, 0.30);
  const dx = 0.12, dy = -0.07;
  const bl2 = P(0.16 + dx, 0.84 + dy), br2 = P(0.60 + dx, 0.84 + dy);
  const tl2 = P(0.16 + dx, 0.50 + dy), tr2 = P(0.60 + dx, 0.50 + dy);
  const ridge2 = P(0.38 + dx, 0.30 + dy);
  const gbl = P(0.02, 0.84), gbr = P(0.16, 0.84);
  const gtl = P(0.02, 0.64), gtr = P(0.16, 0.64);
  const d1 = P(0.30, 0.84), d2 = P(0.30, 0.66), d3 = P(0.40, 0.66), d4 = P(0.40, 0.84);
  const w1 = P(0.46, 0.62), w2 = P(0.54, 0.62), w3 = P(0.54, 0.72), w4 = P(0.46, 0.72);
  const edges: Array<[number, number]> = [
    [bl, br], [br, tr], [tr, ridge], [ridge, tl], [tl, bl],
    [bl2, br2], [br2, tr2], [tr2, ridge2], [ridge2, tl2], [tl2, bl2],
    [br, br2], [tr, tr2], [ridge, ridge2], [tl, tl2], [bl, bl2],
    [gbl, gbr], [gbr, gtr], [gtr, gtl], [gtl, gbl],
    [d1, d2], [d2, d3], [d3, d4],
    [w1, w2], [w2, w3], [w3, w4], [w4, w1],
  ];
  return { verts: v, edges, pulseEdges: [0, 2, 3, 10, 15, 17] };
}

type Particle = { x: number; y: number; size: number; vx: number; vy: number; life: number; decay: number; sq: boolean };

export function DigitalTwin({ glow, accentWarn }: { glow: string; accentWarn: string; dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const geo = buildHouse();
    const st = { t: 0, particles: [] as Particle[], w: 0, h: 0, dpr: 1 };

    function spawn(): Particle {
      const fromHouse = Math.random() < 0.55;
      let x: number, y: number;
      if (fromHouse) {
        const v = geo.verts[(Math.random() * geo.verts.length) | 0];
        x = v[0] + (Math.random() - 0.2) * 0.18;
        y = v[1] + (Math.random() - 0.5) * 0.12;
      } else {
        x = 0.55 + Math.random() * 0.5;
        y = 0.1 + Math.random() * 0.7;
      }
      return {
        x, y,
        size: 0.6 + Math.random() * 2.2,
        vx: 0.0004 + Math.random() * 0.0011,
        vy: -0.0002 - Math.random() * 0.0006,
        life: Math.random(),
        decay: 0.0009 + Math.random() * 0.0016,
        sq: Math.random() < 0.7,
      };
    }

    function seedParticles() {
      st.particles = [];
      const n = Math.round((st.w * st.h) / 5200);
      for (let i = 0; i < n; i++) st.particles.push(spawn());
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = rect.width; st.h = rect.height;
      canvas.width = Math.max(1, Math.floor(st.w * st.dpr));
      canvas.height = Math.max(1, Math.floor(st.h * st.dpr));
      canvas.style.width = st.w + "px";
      canvas.style.height = st.h + "px";
      seedParticles();
    }

    function project(nx: number, ny: number): [number, number] {
      const boxW = st.w * 0.78, boxH = st.h * 0.82;
      const ox = st.w * 0.10, oy = st.h * 0.06;
      return [ox + nx * boxW, oy + ny * boxH];
    }

    function draw() {
      if (!ctx) return;
      st.t += 1;
      const { w, h, dpr } = st;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const [gx, gy] = project(0.42, 0.96);
      for (let r = 0; r < 4; r++) {
        const phase = (st.t * 0.004 + r * 0.25) % 1;
        const rad = phase * Math.min(w, h) * 0.62;
        ctx.beginPath();
        ctx.ellipse(gx, gy, rad, rad * 0.26, 0, 0, Math.PI * 2);
        ctx.strokeStyle = withAlpha(glow, (1 - phase) * 0.18);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.lineWidth = 1.2;
      for (const [a, b] of geo.edges) {
        const va = geo.verts[a], vb = geo.verts[b];
        const [x1, y1] = project(va[0], va[1]);
        const [x2, y2] = project(vb[0], vb[1]);
        const midx = (va[0] + vb[0]) / 2;
        const fade = Math.max(0.12, 1 - Math.max(0, midx - 0.5) * 1.6);
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, withAlpha(glow, 0.55 * fade));
        grad.addColorStop(1, withAlpha(glow, 0.32 * fade));
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }

      for (let i = 0; i < geo.pulseEdges.length; i++) {
        const e = geo.edges[geo.pulseEdges[i]];
        const va = geo.verts[e[0]], vb = geo.verts[e[1]];
        const p = (st.t * 0.006 + i * 0.33) % 1;
        const nx = va[0] + (vb[0] - va[0]) * p;
        const ny = va[1] + (vb[1] - va[1]) * p;
        const [px, py] = project(nx, ny);
        const col = i % 3 === 0 ? accentWarn : glow;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(col, 0.95);
        ctx.shadowColor = withAlpha(col, 0.9);
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const v of geo.verts) {
        const [px, py] = project(v[0], v[1]);
        const fade = Math.max(0.18, 1 - Math.max(0, v[0] - 0.5) * 1.5);
        ctx.beginPath();
        ctx.arc(px, py, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(glow, 0.9 * fade);
        ctx.fill();
      }

      for (const p of st.particles) {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0 || p.x > 1.08 || p.y < -0.05) Object.assign(p, spawn(), { life: 1 });
        const [px, py] = project(p.x, p.y);
        const a = Math.sin(p.life * Math.PI) * 0.7;
        ctx.fillStyle = withAlpha(glow, a);
        if (p.sq) ctx.fillRect(px, py, p.size, p.size);
        else { ctx.beginPath(); ctx.arc(px, py, p.size * 0.6, 0, Math.PI * 2); ctx.fill(); }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [glow, accentWarn]);

  return <canvas ref={canvasRef} className="twin-canvas" />;
}
