'use client';

import { useState, useRef } from 'react';

interface GhostNarratorProps {
  name: string;
  location: string;
  era: string;
  description?: string;
}

export default function GhostNarrator({ name, location, era, description }: GhostNarratorProps) {
  const [narration, setNarration] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  async function handleNarrate() {
    setIsStreaming(true);
    setNarration('');
    setHasSpoken(true);

    try {
      const res = await fetch('/api/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, era, description }),
      });

      if (!res.ok || !res.body) {
        setNarration('The ghosts are quiet today. Try again later.');
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setNarration(text);
      }
    } catch {
      setNarration('The ghosts are quiet today. Try again later.');
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div ref={containerRef} className="mt-8">
      {!hasSpoken && (
        <button
          onClick={handleNarrate}
          className="group flex items-center gap-2 font-syne text-sm text-coyote/70 hover:text-desert-sunset transition-all duration-300 cursor-pointer"
        >
          <span className="inline-block w-5 h-px bg-coyote/30 group-hover:bg-desert-sunset group-hover:w-8 transition-all duration-300" />
          Let this place speak
        </button>
      )}

      {hasSpoken && (
        <div className="mt-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-desert-sunset/40 via-coyote/20 to-transparent" />
          <div className="pl-6">
            <p className="font-newsreader text-[15px] sm:text-base leading-[1.8] text-dark-earth/60 italic whitespace-pre-line">
              {narration}
              {isStreaming && (
                <span className="inline-block w-[2px] h-[1em] bg-desert-sunset/60 ml-0.5 animate-pulse align-text-bottom" />
              )}
            </p>
            {!isStreaming && narration && (
              <button
                onClick={handleNarrate}
                className="mt-4 font-syne text-xs text-coyote/40 hover:text-coyote/70 transition-colors cursor-pointer"
              >
                Speak again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
