import React, { useEffect, useRef, useState } from 'react';
import './ProjectVisual.css';

/**
 * Animated cover art for a project card.
 *
 * Every scene depicts what its project actually does, drawn in that project's
 * own design tokens — the palettes here were lifted from each codebase's
 * stylesheet or its live CSS, not invented. Colors arrive as CSS custom
 * properties on the wrapper, so each scene is written once and re-themed by
 * the project it belongs to.
 *
 * Animation is transform/opacity only, and paused until the card is on screen.
 */

const range = (n) => Array.from({ length: n }, (_, i) => i);
const delay = (s) => ({ animationDelay: `${s}s` });

/* ── MTS · broadcast HUD ────────────────────────────────────────────────────
   mts.now is a cyan-on-near-black heads-up display for a live show: a LIVE
   ring, a running waveform, and hairline tick rules. */
const MtsHud = () => (
  <g>
    <path className="pv-hud-rule" d="M12 18 H180 M12 94 H180" />
    {range(20).map((i) => (
      <line key={i} className="pv-hud-tick" x1={16 + i * 8.6} y1="18" x2={16 + i * 8.6} y2="23" />
    ))}
    {range(3).map((i) => (
      <circle key={i} className="pv-hud-ring" cx="34" cy="56" r="12" fill="none" style={delay(i * 0.8)} />
    ))}
    <circle className="pv-hud-core" cx="34" cy="56" r="5" />
    {range(16).map((i) => (
      <rect
        key={i}
        className="pv-hud-wave"
        x={62 + i * 7.4}
        y="48"
        width="3"
        height="16"
        rx="1.5"
        style={delay(i * 0.07)}
      />
    ))}
  </g>
);

/* ── 877UNMPLYD · real-wage map ─────────────────────────────────────────────
   72 cities colored by wage ÷ regional price parity. Warm paper, brand
   purple, zero border radius — the site's own geometry. */
const WageMap = () => (
  <g>
    {range(5).map((row) =>
      range(12).map((col) => (
        <rect
          key={`${row}-${col}`}
          className={`pv-wage-cell ${(row * 12 + col) % 5 === 0 ? 'pv-wage-hot' : ''}`}
          x={12 + col * 14.5}
          y={22 + row * 14.5}
          width="11"
          height="11"
          style={delay(((col * 0.07 + row * 0.11) % 2.2).toFixed(2))}
        />
      ))
    )}
    <rect className="pv-wage-live" x="150" y="94" width="7" height="7" />
    <line className="pv-wage-rule" x1="12" y1="98" x2="140" y2="98" />
  </g>
);

/* ── Uncertainty Labs · posterior with credible band ────────────────────────
   Warm-neutral research-paper palette, no bright color: a density curve
   breathing inside its interval, samples landing underneath. */
const Posterior = () => (
  <g>
    <path className="pv-band" d="M18 84 C60 82 62 34 96 34 C130 34 132 82 174 84 Z" />
    <path className="pv-density" d="M18 84 C60 82 62 42 96 42 C130 42 132 82 174 84" fill="none" />
    <line className="pv-axis" x1="18" y1="84" x2="174" y2="84" />
    <line className="pv-mean" x1="96" y1="34" x2="96" y2="84" />
    {range(7).map((i) => (
      <circle key={i} className="pv-draw" cx={62 + i * 12} cy="90" r="2" style={delay(i * 0.34)} />
    ))}
  </g>
);

/* ── CONDITIONAL · private forecast crossing a threshold ────────────────────
   Matte off-white, near-black type, terracotta used only as a signal —
   exactly the usage rule in the project's style guide. */
const Threshold = () => (
  <g>
    <line className="pv-cd-axis" x1="16" y1="92" x2="178" y2="92" />
    <line className="pv-cd-threshold" x1="16" y1="46" x2="178" y2="46" />
    <path
      className="pv-cd-path"
      d="M16 82 L44 74 L68 78 L92 58 L116 62 L140 40 L178 34"
      fill="none"
    />
    <circle className="pv-cd-cross" cx="140" cy="40" r="4.5" />
    {range(4).map((i) => (
      <rect key={i} className="pv-cd-mono" x={16 + i * 22} y="98" width="14" height="4" style={delay(i * 0.3)} />
    ))}
  </g>
);

/* ── The Spread · YES/NO odds converging ────────────────────────────────────
   Polymarket blue with the site's own positive/negative greens and reds. */
const OddsCross = () => (
  <g>
    <line className="pv-sp-axis" x1="14" y1="56" x2="180" y2="56" strokeDasharray="4 6" />
    <path className="pv-sp-yes" d="M14 86 C56 84 78 40 118 34 T180 24" fill="none" />
    <path className="pv-sp-no" d="M14 26 C56 28 78 72 118 78 T180 88" fill="none" />
    <circle className="pv-sp-head pv-sp-head-yes" r="3.5" cx="14" cy="86" />
    <circle className="pv-sp-head pv-sp-head-no" r="3.5" cx="14" cy="26" />
    {range(5).map((i) => (
      <rect key={i} className="pv-sp-tick" x={22 + i * 34} y="100" width="18" height="3" rx="1.5" style={delay(i * 0.25)} />
    ))}
  </g>
);

/* ── Polygrapher · markets assembling into a newsletter ─────────────────────
   White surface, navy ink, the tool's own blue. Market rows drop into an
   email frame, which is the product loop. */
const Newsletter = () => (
  <g>
    <rect className="pv-pg-frame" x="52" y="14" width="88" height="86" rx="4" />
    <rect className="pv-pg-header" x="52" y="14" width="88" height="14" rx="4" />
    {range(4).map((i) => (
      <rect
        key={i}
        className="pv-pg-row"
        x="60"
        y={36 + i * 15}
        width="72"
        height="9"
        rx="2"
        style={delay(i * 0.45)}
      />
    ))}
    {range(3).map((i) => (
      <circle key={`m${i}`} className="pv-pg-market" cx="24" cy={34 + i * 22} r="4" style={delay(i * 0.45)} />
    ))}
    {range(3).map((i) => (
      <line key={`l${i}`} className="pv-pg-wire" x1="28" y1={34 + i * 22} x2="52" y2={40 + i * 15} />
    ))}
  </g>
);

/* ── Indexr · weighted constituents summing to one index line ───────────────*/
const IndexWeights = () => (
  <g>
    {range(9).map((i) => (
      <rect
        key={i}
        className="pv-ix-bar"
        x={16 + i * 19}
        y="62"
        width="12"
        height="34"
        rx="2"
        style={delay(i * 0.13)}
      />
    ))}
    <path className="pv-ix-line" d="M22 46 L60 38 L98 44 L136 28 L174 32" fill="none" />
    {[22, 60, 98, 136, 174].map((x, i) => (
      <circle key={i} className="pv-ix-dot" cx={x} cy={[46, 38, 44, 28, 32][i]} r="2.5" style={delay(i * 0.18)} />
    ))}
  </g>
);
/* ── SafeChoices · Monte Carlo paths fanning from one starting price ────────*/
const MonteCarlo = () => (
  <g>
    <line className="pv-mc-axis" x1="20" y1="56" x2="180" y2="56" strokeDasharray="3 5" />
    {[
      'M20 56 C70 40 110 30 178 18',
      'M20 56 C70 48 110 42 178 34',
      'M20 56 C70 58 110 62 178 58',
      'M20 56 C70 66 110 76 178 80',
      'M20 56 C70 72 110 88 178 96'
    ].map((d, i) => (
      <path key={i} className={`pv-mc-path ${i === 2 ? 'pv-mc-median' : ''}`} d={d} fill="none" style={delay(i * 0.3)} />
    ))}
    <circle className="pv-mc-start" cx="20" cy="56" r="4" />
  </g>
);
/* ── RushTracker · a roster moving through decision rounds ──────────────────*/
const Roster = () => (
  <g>
    {range(5).map((i) => (
      <g key={i}>
        <rect className="pv-rt-row" x="14" y={18 + i * 17} width="164" height="12" rx="3" />
        <circle className="pv-rt-face" cx="26" cy={24 + i * 17} r="4" />
        <rect className="pv-rt-name" x="38" y={21 + i * 17} width={54 - (i % 3) * 10} height="6" rx="3" />
        <rect
          className={`pv-rt-chip ${i % 3 === 0 ? 'pv-rt-chip-yes' : i % 3 === 1 ? 'pv-rt-chip-maybe' : ''}`}
          x="140"
          y={21 + i * 17}
          width="30"
          height="6"
          rx="3"
          style={delay(i * 0.3)}
        />
      </g>
    ))}
  </g>
);

/* ── Inside the UFO Release · redacted records pinned to a globe ────────────*/
const RedactedGlobe = () => (
  <g>
    <circle className="pv-ufo-globe" cx="62" cy="56" r="34" fill="none" />
    {range(3).map((i) => (
      <ellipse key={i} className="pv-ufo-lat" cx="62" cy="56" rx="34" ry={10 + i * 10} fill="none" style={delay(i * 0.5)} />
    ))}
    {[[48, 40], [76, 50], [58, 72]].map(([cx, cy], i) => (
      <circle key={i} className="pv-ufo-ping" cx={cx} cy={cy} r="3" style={delay(i * 0.8)} />
    ))}
    <rect className="pv-ufo-doc" x="110" y="20" width="68" height="72" rx="2" />
    {range(6).map((i) => (
      <rect
        key={i}
        className={`pv-ufo-text ${i % 3 === 1 ? 'pv-ufo-redact' : ''}`}
        x="118"
        y={30 + i * 11}
        width={i % 3 === 1 ? 44 : 52}
        height="6"
        rx="1"
        style={delay(i * 0.3)}
      />
    ))}
  </g>
);

/* ── Search Every Exhibit · exhibits by type under a semantic scan ──────────
   The four card fills are the document-type colors from evidence.mts.now. */
const ExhibitSearch = () => {
  const kinds = ['#fcd34d', '#fda4af', '#c4b5fd', '#86efac'];
  return (
    <g>
      <rect className="pv-ex-field" x="16" y="14" width="160" height="14" rx="7" />
      <rect className="pv-ex-caret" x="26" y="18" width="2" height="6" />
      {kinds.map((fill, i) => (
        <g key={i}>
          <rect
            className="pv-ex-card"
            x={16 + i * 41}
            y="40"
            width="33"
            height="44"
            rx="3"
            fill={fill}
            style={delay(i * 0.4)}
          />
          <rect className="pv-ex-meta" x={16 + i * 41} y="90" width={22 + (i % 2) * 8} height="5" rx="2.5" />
        </g>
      ))}
      <rect className="pv-ex-scan" x="0" y="36" width="2.5" height="52" />
    </g>
  );
};

/* ── Inside the AI Grey Market · shares through SPV layers, then voided ─────*/
const SpvLayers = () => (
  <g>
    {range(3).map((i) => (
      <rect key={i} className="pv-spv-layer" x="16" y={20 + i * 26} width="160" height="18" rx="3" style={delay(i * 0.4)} />
    ))}
    {range(3).map((i) => (
      <circle key={`s${i}`} className="pv-spv-share" cx="30" cy="29" r="3.5" style={delay(i * 0.7)} />
    ))}
    <rect className="pv-spv-void" x="16" y="20" width="160" height="70" rx="4" fill="none" />
    <line className="pv-spv-strike" x1="16" y1="90" x2="176" y2="20" />
  </g>
);

/* ── How the Smart Money Reads AI · 13F positions rotating each quarter ─────
   Light theme, the drop's own #d62828 accent. */
const Holdings = () => (
  <g>
    {range(6).map((i) => (
      <g key={i}>
        <rect className="pv-fd-label" x="14" y={18 + i * 15} width="26" height="7" rx="2" />
        <rect className="pv-fd-track" x="46" y={18 + i * 15} width="132" height="7" rx="3.5" />
        <rect
          className={`pv-fd-bar ${i === 1 || i === 4 ? 'pv-fd-bar-hot' : ''}`}
          x="46"
          y={18 + i * 15}
          width="132"
          height="7"
          rx="3.5"
          style={{ animationDelay: `${i * 0.25}s`, animationDuration: `${4 + (i % 3) * 0.6}s` }}
        />
      </g>
    ))}
  </g>
);

/* ── Why AI's Water Problem Is Overblown · 500 mL claim vs a 3 mL sip ───────*/
const SipVsBottle = () => (
  <g>
    <rect className="pv-wt-bottle" x="34" y="20" width="34" height="74" rx="6" fill="none" />
    <rect className="pv-wt-bottle-fill" x="37" y="30" width="28" height="61" rx="4" />
    <rect className="pv-wt-glass" x="126" y="62" width="30" height="32" rx="4" fill="none" />
    <rect className="pv-wt-sip" x="129" y="88" width="24" height="3.5" rx="1.75" />
    <line className="pv-wt-arrow" x1="80" y1="58" x2="116" y2="58" />
    <path className="pv-wt-head" d="M116 58 l-7 -4 v8 z" />
    {range(3).map((i) => (
      <circle key={i} className="pv-wt-drop" cx="141" r="2.5" style={delay(i * 1.2)} />
    ))}
  </g>
);

const SCENES = {
  'mts-hud': MtsHud,
  'wage-map': WageMap,
  posterior: Posterior,
  threshold: Threshold,
  'odds-cross': OddsCross,
  newsletter: Newsletter,
  'index-weights': IndexWeights,
  'monte-carlo': MonteCarlo,
  roster: Roster,
  'redacted-globe': RedactedGlobe,
  'exhibit-search': ExhibitSearch,
  'spv-layers': SpvLayers,
  holdings: Holdings,
  'sip-vs-bottle': SipVsBottle
};

const ProjectVisual = ({ visual, label }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // Only animate what the reader can actually see.
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px'
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!visual) return null;

  const Scene = SCENES[visual.scene] || MtsHud;
  const style = {
    '--pv-bg': visual.bg,
    '--pv-ink': visual.ink,
    '--pv-accent': visual.accent,
    '--pv-accent-2': visual.accent2 || visual.accent,
    '--pv-accent-3': visual.accent3 || visual.ink
  };

  return (
    <div
      ref={ref}
      className={`project-visual ${visible ? 'is-visible' : ''}`}
      style={style}
      role="img"
      aria-label={label ? `${label} — animated illustration` : 'Animated illustration'}
    >
      <svg viewBox="0 0 192 112" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Scene />
      </svg>
    </div>
  );
};

export default ProjectVisual;
