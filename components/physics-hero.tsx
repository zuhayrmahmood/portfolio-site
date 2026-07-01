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
    if (!el || reduceMotion) return;
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
    if (reduceMotion) return;
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
    <div ref={containerRef} className="relative w-full select-none py-10 sm:py-14">
      <h1
        aria-label={FULL_NAME}
        className="font-serif text-6xl font-medium leading-[0.95] tracking-tight text-foreground sm:text-8xl"
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
};

// Feel tuning — all safe, over-damped defaults.
const HOME_STIFFNESS = 0.0022; // pull back toward the spelled name
const ANGULAR_RETURN = 0.08; // settle glyphs upright
const REPEL_RADIUS = 140; // px around the cursor
const REPEL_STRENGTH = 0.055; // shove force
const MAX_SPEED = 26; // velocity clamp (anti-explosion)

function runSimulation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Matter: any,
  container: HTMLDivElement,
  spans: (HTMLSpanElement | null)[],
): () => void {
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } =
    Matter;

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

  for (const L of letters) {
    // Small random offset so the name "assembles" into place on load.
    const ox = (Math.random() - 0.5) * 10;
    const oy = (Math.random() - 0.5) * 8 - 8;
    const body = Bodies.rectangle(L.home.x + ox, L.home.y + oy, L.w, L.h, {
      frictionAir: 0.14,
      friction: 0.05,
      restitution: 0.35,
      chamfer: { radius: Math.min(L.w, L.h) * 0.18 },
    });
    Body.setAngle(body, (Math.random() - 0.5) * 0.18);
    L.body = body;
    bodyToLetter.set(body, L);

    // Place the glyph at its start immediately to avoid a (0,0) flash.
    L.el.style.position = "absolute";
    L.el.style.left = "0px";
    L.el.style.top = "0px";
    L.el.style.margin = "0";
    L.el.style.willChange = "transform";
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

  Composite.add(engine.world, [...letters.map((l) => l.body), ...walls]);

  // --- Drag & throw (mouse only; touch is left to scroll the page) ---
  const mouse = Mouse.create(container);
  mouse.element.removeEventListener("touchstart", mouse.mousedown);
  mouse.element.removeEventListener("touchmove", mouse.mousemove);
  mouse.element.removeEventListener("touchend", mouse.mouseup);
  mouse.element.removeEventListener("wheel", mouse.mousewheel);
  mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
  mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  });
  Composite.add(engine.world, mouseConstraint);

  // Highlight the grabbed glyph in the accent colour.
  Events.on(mouseConstraint, "startdrag", (e: { body?: MatterBody }) => {
    const L = e.body && bodyToLetter.get(e.body);
    if (L) L.el.style.color = "var(--color-accent)";
  });
  Events.on(mouseConstraint, "enddrag", (e: { body?: MatterBody }) => {
    const L = e.body && bodyToLetter.get(e.body);
    if (L) L.el.style.color = "";
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
  let raf = 0;
  let last = performance.now();
  let paused = false;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (paused) {
      last = now;
      return;
    }
    const delta = Math.min(now - last, 32);
    last = now;

    for (const L of letters) {
      const b = L.body;
      if (mouseConstraint.body === b) continue; // let the drag own it

      // Home-spring (force scaled by mass → uniform feel across glyph sizes).
      Body.applyForce(b, b.position, {
        x: (L.home.x - b.position.x) * HOME_STIFFNESS * b.mass,
        y: (L.home.y - b.position.y) * HOME_STIFFNESS * b.mass,
      });
      // Ease rotation back toward upright.
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

    Engine.update(engine, delta);

    // Clamp speed and write transforms.
    for (const L of letters) {
      const b = L.body;
      const speed = Math.hypot(b.velocity.x, b.velocity.y);
      if (speed > MAX_SPEED) {
        const s = MAX_SPEED / speed;
        Body.setVelocity(b, { x: b.velocity.x * s, y: b.velocity.y * s });
      }
      L.el.style.transform = `translate(${b.position.x - L.w / 2}px, ${
        b.position.y - L.h / 2
      }px) rotate(${b.angle}rad)`;
    }
  };
  raf = requestAnimationFrame(frame);

  // --- Pause when hidden or scrolled off-screen ---
  const setPaused = (value: boolean) => {
    paused = value;
    last = performance.now();
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
      L.el.style.color = "";
    }
  };
}
