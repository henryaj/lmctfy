"use client";

import { useState, useEffect, useRef } from "react";
import ClaudeMockup from "./ClaudeMockup";

type Phase =
  | "idle"
  | "focusing"
  | "typing"
  | "pause-after-type"
  | "sending"
  | "responding"
  | "done";

const SNARKY_RESPONSE =
  "I appreciate you asking! But you know, you could have just typed this into claude.ai yourself. It's right there. In your browser. Waiting for you. I believe in you.";

function getElementCenter(el: HTMLElement | null): { x: number; y: number } | null {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export default function Animation({ question }: { question: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [charIndex, setCharIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showCursor, setShowCursor] = useState(true);
  const [responseWordIndex, setResponseWordIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);

  // Set initial cursor position once mounted
  useEffect(() => {
    setCursorPos({ x: window.innerWidth * 0.3, y: window.innerHeight * 0.2 });
  }, []);

  // Phase transitions
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "idle":
        timer = setTimeout(() => {
          const pos = getElementCenter(inputRef.current);
          if (pos) setCursorPos(pos);
          setPhase("focusing");
        }, 600);
        break;
      case "focusing":
        timer = setTimeout(() => {
          setPhase("typing");
        }, 1000);
        break;
      case "pause-after-type":
        timer = setTimeout(() => {
          const pos = getElementCenter(sendRef.current);
          if (pos) setCursorPos(pos);
          setPhase("sending");
        }, 600);
        break;
      case "sending":
        timer = setTimeout(() => {
          setShowCursor(false);
          setPhase("responding");
        }, 800);
        break;
      case "done": {
        setCountdown(3);
        const tick = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(tick);
              window.location.href = `https://claude.ai/new?q=${encodeURIComponent(question)}`;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(tick);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, question]);

  // Typing effect for user input
  useEffect(() => {
    if (phase !== "typing") return;

    let cancelled = false;

    function typeNext(index: number) {
      if (cancelled) return;
      setCharIndex(index + 1);
      if (index + 1 >= question.length) {
        setTimeout(() => {
          if (!cancelled) setPhase("pause-after-type");
        }, 200);
        return;
      }
      const delay = 40 + Math.random() * 60;
      typingTimer.current = setTimeout(() => typeNext(index + 1), delay);
    }

    const delay = 40 + Math.random() * 60;
    typingTimer.current = setTimeout(() => typeNext(0), delay);

    return () => {
      cancelled = true;
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [phase, question]);

  // Response streaming effect (word by word)
  useEffect(() => {
    if (phase !== "responding") return;

    let cancelled = false;
    const words = SNARKY_RESPONSE.split(" ");

    function streamNext(index: number) {
      if (cancelled) return;
      setResponseWordIndex(index + 1);
      if (index + 1 >= words.length) {
        setTimeout(() => {
          if (!cancelled) setPhase("done");
        }, 800);
        return;
      }
      const delay = 30 + Math.random() * 50;
      responseTimer.current = setTimeout(() => streamNext(index + 1), delay);
    }

    responseTimer.current = setTimeout(() => streamNext(0), 600);

    return () => {
      cancelled = true;
      if (responseTimer.current) clearTimeout(responseTimer.current);
    };
  }, [phase]);

  const typedText = question.slice(0, charIndex);
  const isTypingPhase = phase === "typing" || phase === "focusing";
  const isSent = phase === "responding" || phase === "done";
  const allResponseWords = SNARKY_RESPONSE.split(" ");
  const responseText = isSent
    ? allResponseWords.slice(0, responseWordIndex).join(" ")
    : undefined;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-16 relative">
      {/* Animated mouse cursor */}
      {showCursor && cursorPos && (
        <div
          className="pointer-events-none fixed z-50 transition-all duration-1000 ease-in-out"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="black"
            stroke="white"
            strokeWidth="1"
          >
            <path d="M5 3l14 10-6.5 1.5L9 21z" />
          </svg>
        </div>
      )}

      <div className={`w-full transition-opacity duration-500 ${phase === "done" ? "opacity-0" : "opacity-100"}`}>
        <ClaudeMockup
          typedText={typedText}
          showCursor={isTypingPhase || phase === "pause-after-type"}
          inputRef={inputRef}
          sendRef={sendRef}
          sentMessage={isSent ? question : null}
          responseText={responseText}
          showResponseCursor={phase === "responding" && responseWordIndex < allResponseWords.length}
        />
      </div>

      {/* End card */}
      {phase === "done" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center fade-in px-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-claude-text mb-4">
              Was that so hard?
            </h2>
            <p className="text-claude-text/50 mb-3 text-sm sm:text-base">
              Next time, try asking Claude yourself.
            </p>
            <div className="flex items-center justify-center gap-2 text-claude-text/30 text-xs mb-8">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Redirecting to claude.ai in {countdown}...</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://claude.ai/new?q=${encodeURIComponent(question)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-claude-orange text-white font-medium rounded-xl hover:bg-claude-orange/90 transition-colors text-sm sm:text-base"
              >
                Ask Claude this question
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-white border border-claude-border text-claude-text font-medium rounded-xl hover:bg-claude-sidebar transition-colors text-sm sm:text-base"
              >
                Create your own
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
