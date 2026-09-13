"use client";

import { useEffect, useRef, useState } from "react";

export default function TypingText({
  text,
  speed = 55,
  onComplete,
  cursor = true,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
  cursor?: boolean;
}) {
  const [value, setValue] = useState("");
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    setValue("");
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setValue(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(timer);
        completeRef.current?.();
      }
    }, speed);
    return () => window.clearInterval(timer);
  }, [text, speed]);

  return (

     <span className="font-mono">
    {value}
    {cursor && (
      <span
        aria-hidden="true"
        className="ms-1 inline-block animate-blink text-teal"
      >
        _
      </span>
    )}
  </span>
  
    // <span  className="font-mono">
    //   {value}
    //   {cursor && <span aria-hidden="true" className="ms-1 inline-block animate-blink text-teal">_</span>}
    // </span>
  );
}
