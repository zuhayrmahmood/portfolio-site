"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** A Matter body type, referenced without importing the value at module load. */
type MatterBody = import("matter-js").Body;

/** The name, split into lines. Each character becomes a physics body. */
const LINES = ["Zuhayr", "Mahmood"] as const;
const FULL_NAME = LINES.join(" ");

type Glyph = { char: string; index: number };

// Flatten to per-line glyph arrays while keeping a stable global index
// (used to line up each <span> with its Matter body).
const LINE_GLYPHS: Glyph[][] = (() => {
  const lines: Glyph[][] = [];
  let i = 0;
  for (const line of LINES) {
    const arr: Glyph[] = [];
    for (const char of line) arr.push({ char, index: i++ });
    lines.push(arr);
  }
  return lines;
})();

const TOTAL = LINE_GLYPHS.reduce((n, l) => n + l.length, 0);

/**
 * Touch / coarse-pointer devices get the static name (touch is left to scroll
 * the page), so the physics is desktop-pointer only. Called from client
 * effects only — never during SSR.
 */
function isCoarsePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches
  );
}

export function PhysicsHero() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [layoutTick, setLayoutTick] = useState(0);

  // Re-run the simulation when the container's width changes (breakpoints,
  // window resize). Height-only changes (we pin the height ourselves) are
  // ignored so we don't loop.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduceMotion || isCoarsePointer()) return;
    let lastWidth = el.clientWidth;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (Math.abs(w - lastWidth) < 2) return;
      lastWidth = w;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setLayoutTick((n) => n + 1), 200);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduceMotion]);

  // The physics simulation. Skipped entirely for reduced-motion users, who
  // just see the static (in-flow) name.
  useEffect(() => {
    if (reduceMotion || isCoarsePointer()) return;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // Load matter-js on the client only, and wait for the web font so glyph
    // metrics are final before we measure home positions.
    const ready = Promise.all([
      import("matter-js"),
      document.fonts?.ready ?? Promise.resolve(),
    ]);

    ready.then(([mod]) => {
      if (disposed || !containerRef.current) return;
      const Matter = (mod as { default?: unknown }).default ?? mod;
      cleanup = runSimulation(Matter, containerRef.current, spanRefs.current);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduceMotion, layoutTick]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative w-full cursor-grab select-none py-8 active:cursor-grabbing sm:py-12"
      >
        <h1
          aria-label={FULL_NAME}
          className="font-display text-[clamp(3.25rem,12vw,7.5rem)] leading-[0.9] text-foreground"
        >
          {LINE_GLYPHS.map((glyphs, li) => (
            <span key={li} className="block whitespace-nowrap">
              {glyphs.map((g) => (
                <span
                  key={g.index}
                  ref={(el) => {
                    spanRefs.current[g.index] = el;
                  }}
                  aria-hidden="true"
                  className="inline-block"
                >
                  {g.char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Mouse-only affordance; fades itself out (see .hero-hint) and is
            hidden on touch devices and for reduced-motion users. */}
        {!reduceMotion && (
          <span
            aria-hidden="true"
            className="hero-hint eyebrow pointer-events-none absolute right-1 top-1 text-subtle"
          >
            drag me
          </span>
        )}
      </div>

      {/* A delicate editorial rule the name sits above. */}
      <div className="hero-ground mt-6" aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Simulation — imperative Matter.js setup. Returns a cleanup fn.
 * `Matter` is typed loosely: it's runtime glue, and the module's
 * value-type is awkward across the CJS/ESM interop boundary.
 * ------------------------------------------------------------------ */

type Letter = {
  el: HTMLSpanElement;
  body: MatterBody;
  home: { x: number; y: number };
  w: number;
  h: number;
  scale: number; // eased render scale (1, or GRAB_SCALE while held)
};

// Feel tuning. The home pull is a real Matter Constraint (spring) per glyph —
// the solver is unconditionally stable and identical across engines, unlike a
// hand-applied force whose stiffness sits at the integrator's stability edge
// (that version exploded to NaN in Firefox/Safari). Snappy but well-damped.
const HOME_STIFFNESS = 0.06; // home-spring constraint stiffness
const HOME_DAMPING = 0.14; // home-spring damping (kills overshoot cleanly)
const ANGULAR_RETURN = 0.1; // settle glyphs upright
const REPEL_RADIUS = 140; // px around the cursor
const REPEL_STRENGTH = 0.05; // shove force
const MAX_SPEED = 40; // velocity clamp (safety net)
const GRAB_SCALE = 1.08; // pop the held glyph
// Collision bodies are smaller than the glyph boxes so tightly-kerned letters
// don't push each other off home when idle — they only collide during play.
const BODY_W = 0.82;
const BODY_H = 0.64;
const REST_SHADOW = "0 10px 22px rgba(43, 42, 40, 0.09)";
const GRAB_SHADOW = "0 18px 30px rgba(43, 42, 40, 0.18)";

function runSimulation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Matter: any,
  container: HTMLDivElement,
  spans: (HTMLSpanElement | null)[],
): () => void {
  const {
    Engine,
    Bodies,
    Body,
    Composite,
    Constraint,
    Mouse,
    MouseConstraint,
    Events,
  } = Matter;

  // --- Measure home positions from the current in-flow layout ---
  const containerRect = container.getBoundingClientRect();
  const width = container.clientWidth;
  const height = container.clientHeight;

  const letters: Letter[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const el = spans[i];
    if (!el) continue;
    const r = el.getBoundingClientRect();
    letters.push({
      el,
      body: null as unknown as MatterBody,
      home: {
        x: r.left - containerRect.left + r.width / 2,
        y: r.top - containerRect.top + r.height / 2,
      },
      w: r.width,
      h: r.height,
      scale: 1,
    });
  }
  if (letters.length === 0) return () => {};

  // Pin the height so absolutely-positioned glyphs don't collapse it.
  container.style.height = `${height}px`;

  // --- Engine (no gravity; letters are held by home-springs) ---
  const engine = Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 0;

  const bodyToLetter = new Map<MatterBody, Letter>();
  const homeConstraints: unknown[] = [];

  for (const L of letters) {
    // Start scattered a little above home so the name settles into place on
    // load — an orchestrated "assemble" rather than a hard cut.
    const ox = (Math.random() - 0.5) * 18;
    const oy = (Math.random() - 0.5) * 12 - 16;
    const bw = L.w * BODY_W;
    const bh = L.h * BODY_H;
    const body = Bodies.rectangle(L.home.x + ox, L.home.y + oy, bw, bh, {
      frictionAir: 0.09,
      friction: 0.05,
      restitution: 0.4,
      chamfer: { radius: Math.min(bw, bh) * 0.2 },
    });
    Body.setAngle(body, (Math.random() - 0.5) * 0.22);
    L.body = body;
    bodyToLetter.set(body, L);

    // Anchor the glyph to its spelled-out position with a damped spring.
    homeConstraints.push(
      Constraint.create({
        pointA: { x: L.home.x, y: L.home.y },
        bodyB: body,
        length: 0,
        stiffness: HOME_STIFFNESS,
        damping: HOME_DAMPING,
        render: { visible: false },
      }),
    );

    // Place the glyph at its start immediately to avoid a (0,0) flash.
    L.el.style.position = "absolute";
    L.el.style.left = "0px";
    L.el.style.top = "0px";
    L.el.style.margin = "0";
    L.el.style.willChange = "transform";
    L.el.style.textShadow = REST_SHADOW;
    L.el.style.transform = `translate(${body.position.x - L.w / 2}px, ${
      body.position.y - L.h / 2
    }px) rotate(${body.angle}rad)`;
  }

  // --- Boundary walls so nothing escapes the hero box ---
  const t = 200;
  const wall = (x: number, y: number, w: number, h: number) =>
    Bodies.rectangle(x, y, w, h, { isStatic: true });
  const walls = [
    wall(width / 2, -t / 2, width + 2 * t, t),
    wall(width / 2, height + t / 2, width + 2 * t, t),
    wall(-t / 2, height / 2, t, height + 2 * t),
    wall(width + t / 2, height / 2, t, height + 2 * t),
  ];

  Composite.add(engine.world, [
    ...letters.map((l) => l.body),
    ...walls,
    ...homeConstraints,
  ]);

  // --- Drag & throw (mouse only; touch is left to scroll the page) ---
  const mouse = Mouse.create(container);
  mouse.element.removeEventListener("touchstart", mouse.mousedown);
  mouse.element.removeEventListener("touchmove", mouse.mousemove);
  mouse.element.removeEventListener("touchend", mouse.mouseup);
  mouse.element.removeEventListener("wheel", mouse.mousewheel);
  mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
  mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

  // A grab starts only when pressing on the name (mousedown stays on the
  // container), but move/release are tracked on the window so a fling that
  // ends outside the hero still lets go — otherwise the letter sticks to the
  // cursor forever (Matter binds these to the element by default).
  mouse.element.removeEventListener("mousemove", mouse.mousemove);
  mouse.element.removeEventListener("mouseup", mouse.mouseup);
  window.addEventListener("mousemove", mouse.mousemove);
  window.addEventListener("mouseup", mouse.mouseup);

  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    // Stiff grab so a held glyph tracks the cursor tightly and flings with
    // momentum on release.
    constraint: { stiffness: 0.85, damping: 0.1, render: { visible: false } },
  });
  Composite.add(engine.world, mouseConstraint);

  // Highlight + lift the grabbed glyph.
  Events.on(mouseConstraint, "startdrag", (e: { body?: MatterBody }) => {
    const L = e.body && bodyToLetter.get(e.body);
    if (L) {
      L.el.style.color = "var(--color-accent)";
      L.el.style.textShadow = GRAB_SHADOW;
      L.el.style.zIndex = "1";
    }
  });
  Events.on(mouseConstraint, "enddrag", (e: { body?: MatterBody }) => {
    const L = e.body && bodyToLetter.get(e.body);
    if (L) {
      L.el.style.color = "";
      L.el.style.textShadow = REST_SHADOW;
      L.el.style.zIndex = "";
    }
  });

  // --- Cursor repulsion (mouse pointer only) ---
  const pointer = { x: -9999, y: -9999, active: false };
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const rect = container.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  };
  const onPointerLeave = () => {
    pointer.active = false;
  };
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerleave", onPointerLeave);

  // --- Animation loop ---
  // A FIXED timestep is essential: Matter's integrator scales by the ratio of
  // successive deltas, so feeding it the variable rAF delta makes velocities
  // explode to NaN on the first odd frame — stable in Chromium, but it blows
  // up in Firefox/Safari (whose rAF timing differs). A constant step is what
  // Matter recommends and keeps every engine identical.
  const STEP_MS = 1000 / 60;
  let raf = 0;
  let paused = false;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (paused) return;

    for (const L of letters) {
      const b = L.body;
      if (mouseConstraint.body === b) continue; // the drag owns a held glyph

      // Ease rotation back toward upright (the home constraint only pulls the
      // centre, not the angle).
      Body.setAngularVelocity(b, b.angularVelocity - b.angle * ANGULAR_RETURN);

      // Cursor shove.
      if (pointer.active) {
        const rx = b.position.x - pointer.x;
        const ry = b.position.y - pointer.y;
        const d2 = rx * rx + ry * ry;
        if (d2 > 0.01 && d2 < REPEL_RADIUS * REPEL_RADIUS) {
          const d = Math.sqrt(d2);
          const f = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH * b.mass;
          Body.applyForce(b, b.position, { x: (rx / d) * f, y: (ry / d) * f });
        }
      }
    }

    Engine.update(engine, STEP_MS);

    // Clamp speed, ease grab-scale, and write transforms.
    for (const L of letters) {
      const b = L.body;
      const speed = Math.hypot(b.velocity.x, b.velocity.y);
      if (speed > MAX_SPEED) {
        const s = MAX_SPEED / speed;
        Body.setVelocity(b, { x: b.velocity.x * s, y: b.velocity.y * s });
      }
      const target = mouseConstraint.body === b ? GRAB_SCALE : 1;
      L.scale += (target - L.scale) * 0.2;
      L.el.style.transform = `translate(${b.position.x - L.w / 2}px, ${
        b.position.y - L.h / 2
      }px) rotate(${b.angle}rad) scale(${L.scale})`;
    }
  };
  raf = requestAnimationFrame(frame);

  // --- Pause when hidden or scrolled off-screen ---
  const setPaused = (value: boolean) => {
    paused = value;
  };
  const onVisibility = () => setPaused(document.hidden);
  document.addEventListener("visibilitychange", onVisibility);

  const io = new IntersectionObserver(
    ([entry]) => setPaused(!entry.isIntersecting || document.hidden),
    { threshold: 0 },
  );
  io.observe(container);

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(raf);
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("mousemove", mouse.mousemove);
    window.removeEventListener("mouseup", mouse.mouseup);
    document.removeEventListener("visibilitychange", onVisibility);
    io.disconnect();
    Composite.clear(engine.world, false);
    Engine.clear(engine);
    container.style.height = "";
    for (const L of letters) {
      L.el.style.position = "";
      L.el.style.left = "";
      L.el.style.top = "";
      L.el.style.margin = "";
      L.el.style.transform = "";
      L.el.style.willChange = "";
      L.el.style.textShadow = "";
      L.el.style.color = "";
      L.el.style.zIndex = "";
    }
  };
}
