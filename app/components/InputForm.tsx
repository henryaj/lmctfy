"use client";

import { useState, FormEvent } from "react";

export default function InputForm() {
  const [question, setQuestion] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    const link = `${window.location.origin}/?q=${encodeURIComponent(question.trim())}`;
    setGeneratedLink(link);
    setCopied(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = generatedLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-claude-text mb-3">
          Let Me Claude That For You
        </h1>
        <p className="text-claude-text/50 italic mb-10 text-sm sm:text-base">
          For all those people who find it easier to ask you than to ask Claude...
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type a question..."
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl border border-claude-border bg-white text-claude-text placeholder:text-claude-text/30 focus:outline-none focus:ring-2 focus:ring-claude-orange/40 focus:border-claude-orange transition-colors text-sm sm:text-base"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-claude-orange text-white font-medium rounded-xl hover:bg-claude-orange/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
            disabled={!question.trim()}
          >
            Generate Link
          </button>
        </form>

        {generatedLink && (
          <div className="mt-8 fade-in">
            <p className="text-xs text-claude-text/40 mb-2 uppercase tracking-wider">
              Share this link
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-claude-border">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 text-sm text-claude-text bg-transparent focus:outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  copied
                    ? "bg-green-100 text-green-700"
                    : "bg-claude-orange/10 text-claude-orange hover:bg-claude-orange/20"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-claude-text/25 text-xs">
        Made with gentle sarcasm by{" "}
        <a
          href="https://henrystanley.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-claude-text/40 transition-colors"
        >
          Henry Stanley
        </a>
        {" "}&middot;{" "}
        <a
          href="https://github.com/henryaj/lmctfy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-claude-text/40 transition-colors"
        >
          Source
        </a>
      </footer>
    </div>
  );
}
