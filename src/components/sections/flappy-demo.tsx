"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, Bot, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";

const WIDTH = 320;
const HEIGHT = 240;
const GRAVITY = 0.42;
const FLAP_VELOCITY = -7.2;
const PIPE_GAP = 92;
const PIPE_WIDTH = 46;
const PIPE_SPEED = 2.1;
const BIRD_X = 64;
const BIRD_R = 10;

type Pipe = { x: number; gapY: number; passed: boolean };

/**
 * A playable recreation of the Flappy Bird environment from the resume project.
 * "Autopilot" here is a simple reactive heuristic (aims the bird at the gap
 * center) — a lightweight stand-in for intuition, not the actual trained
 * NEAT network from the original Python project.
 */
export function FlappyDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"idle" | "manual" | "autopilot">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    birdY: HEIGHT / 2,
    velocity: 0,
    pipes: [] as Pipe[],
    frame: 0,
    score: 0,
    running: false,
  });

  const reset = useCallback(() => {
    stateRef.current = {
      birdY: HEIGHT / 2,
      velocity: 0,
      pipes: [{ x: WIDTH + 40, gapY: HEIGHT / 2, passed: false }],
      frame: 0,
      score: 0,
      running: true,
    };
    setScore(0);
    setGameOver(false);
  }, []);

  const flap = useCallback(() => {
    if (stateRef.current.running) {
      stateRef.current.velocity = FLAP_VELOCITY;
    }
  }, []);

  const start = (m: "manual" | "autopilot") => {
    setMode(m);
    reset();
  };

  useEffect(() => {
    if (mode === "idle") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const loop = () => {
      const s = stateRef.current;
      if (s.running) {
        s.frame++;

        if (mode === "autopilot") {
          const nextPipe = s.pipes.find((p) => p.x + PIPE_WIDTH > BIRD_X) ?? s.pipes[0];
          if (nextPipe && s.birdY > nextPipe.gapY - 6 && s.velocity >= 0) {
            s.velocity = FLAP_VELOCITY;
          }
        }

        s.velocity += GRAVITY;
        s.birdY += s.velocity;

        if (s.frame % 95 === 0) {
          const gapY = 50 + Math.random() * (HEIGHT - 100);
          s.pipes.push({ x: WIDTH + 20, gapY, passed: false });
        }
        s.pipes.forEach((p) => (p.x -= PIPE_SPEED));
        s.pipes = s.pipes.filter((p) => p.x > -PIPE_WIDTH);

        s.pipes.forEach((p) => {
          if (!p.passed && p.x + PIPE_WIDTH < BIRD_X) {
            p.passed = true;
            s.score++;
            setScore(s.score);
          }
          const hitX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_WIDTH;
          const hitY = s.birdY - BIRD_R < p.gapY - PIPE_GAP / 2 || s.birdY + BIRD_R > p.gapY + PIPE_GAP / 2;
          if (hitX && hitY) s.running = false;
        });

        if (s.birdY + BIRD_R > HEIGHT || s.birdY - BIRD_R < 0) {
          s.running = false;
        }

        if (!s.running) {
          setGameOver(true);
          setBest((b) => Math.max(b, s.score));
        }
      }

      // draw
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      grad.addColorStop(0, "#121218");
      grad.addColorStop(1, "#08080c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "#232330";
      s.pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.gapY - PIPE_GAP / 2);
        ctx.fillRect(p.x, p.gapY + PIPE_GAP / 2, PIPE_WIDTH, HEIGHT - (p.gapY + PIPE_GAP / 2));
      });

      ctx.beginPath();
      ctx.arc(BIRD_X, s.birdY, BIRD_R, 0, Math.PI * 2);
      ctx.fillStyle = "#5b6ef5";
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  useEffect(() => {
    if (mode !== "manual") return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) reset();
        else flap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, gameOver, flap, reset]);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-[var(--color-text-faint)]">
          Playable demo
        </span>
        {mode !== "idle" && (
          <span className="font-mono text-xs text-[var(--color-text-muted)]">
            score {score} &middot; best {best}
          </span>
        )}
      </div>

      <div
        className="relative mx-auto overflow-hidden rounded-lg"
        style={{ width: WIDTH, maxWidth: "100%" }}
        onClick={() => {
          if (mode === "manual") {
            if (gameOver) reset();
            else flap();
          }
        }}
      >
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block w-full cursor-pointer touch-none"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        />

        {mode === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-sm">
            <p className="max-w-[220px] text-center text-xs text-[var(--color-text-muted)]">
              Play it yourself, or watch a simple reactive autopilot fly it.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => start("manual")}>
                <Hand size={14} /> Play
              </Button>
              <Button size="sm" variant="outline" onClick={() => start("autopilot")}>
                <Bot size={14} /> Autopilot
              </Button>
            </div>
          </div>
        )}

        {mode !== "idle" && gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-sm">
            <p className="font-display text-lg text-white">Score: {score}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={reset}>
                <RotateCcw size={14} /> Retry
              </Button>
              <Button size="sm" variant="outline" onClick={() => setMode("idle")}>
                <Play size={14} /> Switch mode
              </Button>
            </div>
          </div>
        )}
      </div>

      {mode === "manual" && !gameOver && (
        <p className="mt-3 text-center text-xs text-[var(--color-text-faint)]">
          Tap the canvas or press space to flap
        </p>
      )}
      {mode === "autopilot" && !gameOver && (
        <p className="mt-3 text-center text-xs text-[var(--color-text-faint)]">
          Heuristic autopilot &mdash; aims for the gap center, not the trained NEAT network
        </p>
      )}
    </div>
  );
}
