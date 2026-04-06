"use client";

import { ReactNode, RefObject } from "react";

export default function ClaudeMockup({
  typedText,
  showCursor,
  inputRef,
  sendRef,
  sentMessage,
  responseText,
  showResponseCursor,
  children,
}: {
  typedText: string;
  showCursor: boolean;
  inputRef?: RefObject<HTMLDivElement | null>;
  sendRef?: RefObject<HTMLButtonElement | null>;
  sentMessage?: string | null;
  responseText?: string;
  showResponseCursor?: boolean;
  children?: ReactNode;
}) {
  const showChatView = !!sentMessage;

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-claude-border bg-claude-bg">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-claude-sidebar border-b border-claude-border">
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-claude-orange"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"
              fill="currentColor"
              opacity="0.5"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          <span className="font-semibold text-claude-text text-sm">Claude</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 text-xs rounded-md bg-claude-bg border border-claude-border text-claude-text/60">
            New chat
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col min-h-[300px] sm:min-h-[400px] p-6">
        {showChatView ? (
          <div className="flex flex-col gap-4 flex-1">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-claude-sidebar rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] text-sm text-claude-text">
                {sentMessage}
              </div>
            </div>

            {/* Claude response */}
            {responseText !== undefined && (
              <div className="flex justify-start gap-2.5">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-claude-orange/20 flex items-center justify-center mt-0.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-claude-orange"
                  >
                    <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.6" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div className="text-sm text-claude-text leading-relaxed max-w-[80%]">
                  {responseText}
                  {showResponseCursor && (
                    <span className="cursor-blink inline-block w-[2px] h-[14px] bg-claude-orange ml-[1px] align-text-bottom" />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-claude-text/40 text-lg">
              How can I help you today?
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4">
        <div
          ref={inputRef}
          className="flex items-center gap-2 rounded-2xl border border-claude-border bg-claude-input-bg px-4 py-3 shadow-sm"
        >
          <div className="flex-1 text-sm text-claude-text min-h-[20px]">
            {typedText && !showChatView ? (
              <span>
                {typedText}
                {showCursor && (
                  <span className="cursor-blink inline-block w-[2px] h-[14px] bg-claude-text ml-[1px] align-text-bottom" />
                )}
              </span>
            ) : (
              <span className="text-claude-text/30">
                {showChatView ? "Reply to Claude..." : "Reply to Claude..."}
                {showCursor && !showChatView && (
                  <span className="cursor-blink inline-block w-[2px] h-[14px] bg-claude-text ml-[1px] align-text-bottom" />
                )}
              </span>
            )}
          </div>
          <button
            ref={sendRef}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              typedText && !showChatView
                ? "bg-claude-orange text-white"
                : "bg-claude-border/50 text-claude-text/30"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay for children (end card, etc.) */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center bg-claude-bg/95">
          {children}
        </div>
      )}
    </div>
  );
}
