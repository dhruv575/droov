import React, { useEffect, useRef, useState } from 'react';

// A decorative worker simulation: teams assemble, exchange packets, finish jobs,
// then travel across the entire surface to a new worksite.
export default function PixelField() {
  const canvasRef = useRef(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 1, height = 1, frame, last = 0, time = 0;
    const agents = Array.from({ length: 180 }, (_, i) => ({
      u: .04 + ((i * .618034) % 1) * .92,
      v: .04 + ((i * .414214) % 1) * .92,
      team: i % 18, slot: Math.floor(i / 18), x: 0, y: 0,
    }));
    const jobs = Array.from({ length: 18 }, (_, i) => ({
      u: .1 + (i % 6) * .16, v: .16 + Math.floor(i / 6) * .33,
      progress: (i * .17) % 1, pulse: 0,
    }));
    const point = job => ({ x: job.u * width, y: job.v * height });
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
      draw(0);
    };
    function draw(dt) {
      time += dt;
      ctx.clearRect(0, 0, width, height);
      const active = width < 600 ? agents.slice(0, 90) : agents;
      const workers = jobs.map(() => 0);
      active.forEach(a => {
        const job = jobs[a.team];
        const angle = a.slot * 2.39996;
        const radius = 16 + Math.sqrt(a.slot) * 10;
        const tx = job.u * width + Math.cos(angle) * radius;
        const ty = job.v * height + Math.sin(angle) * radius;
        const dx = tx - a.u * width, dy = ty - a.v * height;
        const distance = Math.hypot(dx, dy);
        const step = Math.min(distance, dt * (28 + a.slot * 2));
        if (distance > 0) {
          a.u += dx / distance * step / width;
          a.v += dy / distance * step / height;
        }
        a.working = distance < 12;
        if (a.working) workers[a.team]++;
        a.x = a.u * width; a.y = a.v * height;
      });
      ctx.lineWidth = 1;
      active.forEach((a, i) => {
        let links = 0;
        active.slice(i + 1).forEach(b => {
          if (links >= 3) return;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > 64 || dist < 10) return;
          links++;
          ctx.strokeStyle = `rgba(23,23,23,${.14 * (1 - dist / 100)})`;
          ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          const t = (time * .65 + i * .17) % 1;
          ctx.fillStyle = 'rgba(23,23,23,.38)';
          ctx.fillRect(Math.round(a.x + (b.x - a.x) * t), Math.round(a.y + (b.y - a.y) * t), 2, 2);
        });
      });
      ctx.setLineDash([]);
      jobs.forEach((job, i) => {
        job.progress += workers[i] * dt * .018;
        const p = point(job);
        if (job.progress >= 1) {
          job.progress = 0; job.pulse = 1; job.old = p;
          job.u = .08 + ((job.u + .31 + i * .037) % .84);
          job.v = .08 + ((job.v + .27 + i * .023) % .84);
        }
        if (job.pulse > 0) {
          job.pulse = Math.max(0, job.pulse - dt * .65);
          const size = 14 + (1 - job.pulse) * 54;
          ctx.strokeStyle = `rgba(23,23,23,${job.pulse * .3})`;
          ctx.strokeRect(Math.round(job.old.x - size / 2), Math.round(job.old.y - size / 2), size, size);
        }
        ctx.strokeStyle = 'rgba(23,23,23,.24)';
        ctx.strokeRect(Math.round(p.x) - 7.5, Math.round(p.y) - 7.5, 15, 15);
        ctx.fillStyle = 'rgba(23,23,23,.36)';
        for (let n = 0; n < 5; n++) {
          ctx.globalAlpha = n / 5 < job.progress ? 1 : .15;
          ctx.fillRect(Math.round(p.x) - 9 + n * 4, Math.round(p.y) + 13, 3, 2);
        }
        ctx.globalAlpha = 1;
      });
      active.forEach((a, i) => {
        const x = Math.round(a.x), y = Math.round(a.y);
        ctx.fillStyle = `rgba(23,23,23,${a.working ? .48 : .3})`;
        ctx.fillRect(x - 3, y - 3, 6, 6);
        ctx.fillRect(x - 1, y - 6, 2, 2);
        const step = Math.floor(time * 6 + i) % 2;
        ctx.fillRect(x - 4, y + 4, 2, step ? 2 : 3);
        ctx.fillRect(x + 2, y + 4, 2, step ? 3 : 2);
        ctx.fillStyle = '#fff'; ctx.fillRect(x - 2, y - 1, 1, 1); ctx.fillRect(x + 1, y - 1, 1, 1);
      });
    }
    const tick = now => {
      frame = requestAnimationFrame(tick);
      if (now - last < 1000 / 30) return;
      const dt = Math.min((now - last) / 1000, .06); last = now;
      if (!pausedRef.current && !document.hidden && !reduced.matches) draw(dt);
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    resize(); frame = requestAnimationFrame(tick);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <>
    <canvas ref={canvasRef} className="agent-field" aria-hidden="true" />
    <button className="pixel-motion-control" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? 'Resume background motion' : 'Pause background motion'}>
      <span aria-hidden="true">{paused ? '\u25b7' : '\u2161'}</span> {paused ? 'Swarm paused' : 'Pause swarm'}
    </button>
  </>;
}
